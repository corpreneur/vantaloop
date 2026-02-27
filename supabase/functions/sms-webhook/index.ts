import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// SMS conversation steps
const STEPS = [
  "awaiting-name",
  "awaiting-subject",
  "awaiting-type",
  "awaiting-goal",
  "awaiting-working",
  "awaiting-risks",
  "awaiting-suggestions",
  "awaiting-decision",
  "complete",
] as const;

const TYPE_MAP: Record<string, string> = {
  "1": "concept-direction",
  "2": "information-architecture",
  "3": "interaction-pattern",
  "4": "visual-design",
  "5": "copy-content",
  "6": "general",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // Parse Twilio webhook (form-encoded) or JSON
    let phone: string;
    let body: string;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      phone = formData.get("From") as string;
      body = (formData.get("Body") as string)?.trim() ?? "";
    } else {
      const json = await req.json();
      phone = json.From;
      body = (json.Body ?? "").trim();
    }

    if (!phone) {
      return new Response(
        '<Response><Message>Error: missing phone number.</Message></Response>',
        { headers: { ...corsHeaders, "Content-Type": "text/xml" } }
      );
    }

    // Find active conversation
    const { data: convRows } = await sb
      .from("sms_conversations")
      .select("*")
      .eq("phone_number", phone)
      .eq("finalized", false)
      .order("created_at", { ascending: false })
      .limit(1);

    let conv = convRows?.[0];
    let partial: Record<string, string> = {};

    if (!conv) {
      // Create new conversation
      const { data: newConv } = await sb
        .from("sms_conversations")
        .insert({ phone_number: phone, current_step: "awaiting-name", partial_data: {} })
        .select()
        .single();
      conv = newConv;
      partial = {};
    } else {
      partial = (conv.partial_data as Record<string, string>) ?? {};
    }

    let responseText = "";
    let nextStep = conv.current_step;

    switch (conv.current_step) {
      case "awaiting-name":
        partial.submitterName = body;
        nextStep = "awaiting-subject";
        responseText = "Thanks! What is the subject of your feedback?";
        break;

      case "awaiting-subject":
        partial.subject = body;
        nextStep = "awaiting-type";
        responseText =
          "Got it. What type? Reply with a number:\n1. Concept Direction\n2. Information Architecture\n3. Interaction Pattern\n4. Visual Design\n5. Copy/Content\n6. General";
        break;

      case "awaiting-type":
        partial.feedbackType = TYPE_MAP[body] ?? "general";
        nextStep = "awaiting-goal";
        responseText = "What is the goal of this share? (What decision do you need?)";
        break;

      case "awaiting-goal":
        partial.goalOfShare = body;
        nextStep = "awaiting-working";
        responseText = "What is working well? (Or reply SKIP)";
        break;

      case "awaiting-working":
        if (body.toUpperCase() !== "SKIP") partial.whatsWorking = body;
        nextStep = "awaiting-risks";
        responseText = "Any questions or risks? (Or reply SKIP)";
        break;

      case "awaiting-risks":
        if (body.toUpperCase() !== "SKIP") partial.questionsRisks = body;
        nextStep = "awaiting-suggestions";
        responseText = "Any suggestions? (Or reply SKIP)";
        break;

      case "awaiting-suggestions":
        if (body.toUpperCase() !== "SKIP") partial.suggestions = body;
        nextStep = "awaiting-decision";
        responseText = "What decision is needed today? (Or reply SKIP)";
        break;

      case "awaiting-decision":
        if (body.toUpperCase() !== "SKIP") partial.decisionNeeded = body;
        nextStep = "complete";

        // Create the intake item
        await sb.from("intake_items").insert({
          title: partial.subject ?? "SMS Feedback",
          submitter_name: partial.submitterName ?? "Unknown",
          submitter_contact: phone,
          source: "sms",
          status: "new",
          feedback_type: partial.feedbackType ?? "general",
          goal_of_share: partial.goalOfShare ?? null,
          whats_working: partial.whatsWorking ?? null,
          questions_risks: partial.questionsRisks ?? null,
          suggestions: partial.suggestions ?? null,
          decision_needed: partial.decisionNeeded ?? null,
          submitter_phone: phone,
        });

        // Finalize conversation
        await sb
          .from("sms_conversations")
          .update({ finalized: true, current_step: "complete", partial_data: partial })
          .eq("id", conv.id);

        responseText = "Feedback submitted. Thank you! Text again anytime to start a new submission.";
        break;

      default:
        responseText = "Welcome to VantaLoop feedback. Reply with your name to start.";
        nextStep = "awaiting-name";
    }

    // Update conversation state (unless complete)
    if (nextStep !== "complete") {
      await sb
        .from("sms_conversations")
        .update({ current_step: nextStep, partial_data: partial })
        .eq("id", conv.id);
    }

    // Return TwiML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${responseText}</Message></Response>`;

    return new Response(twiml, {
      headers: { ...corsHeaders, "Content-Type": "text/xml" },
    });
  } catch (e) {
    console.error("sms-webhook error:", e);
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>Sorry, something went wrong. Please try again.</Message></Response>`;
    return new Response(errorTwiml, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "text/xml" },
    });
  }
});
