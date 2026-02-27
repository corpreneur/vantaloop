import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    const sb = createClient(supabaseUrl, supabaseKey);

    // Fetch all register items
    const { data: items, error } = await sb
      .from("feedback_register")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({
          summary: "No feedback items in the register yet.",
          newConcepts: [],
          decisionsThisWeek: [],
          openItems: [],
          staleItems: [],
          weekOf: new Date().toISOString().split("T")[0],
          generatedAt: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build a prompt from the data
    const itemSummaries = items.map((i: any) => {
      return `- "${i.title}" (${i.column_id}, ${i.priority}, epic: ${i.epic_id || "none"}): Goal: ${i.goal_of_share || "N/A"}. Decision needed: ${i.decision_needed || "N/A"}. Decision: ${i.decision || "pending"}. Updated: ${i.updated_at}`;
    });

    const prompt = `You are a design operations analyst. Analyze these feedback register items and generate a weekly digest.

Items:
${itemSummaries.join("\n")}

Today's date: ${new Date().toISOString().split("T")[0]}

Generate a JSON response with these fields:
- summary: A 2-3 sentence executive summary of the week's design feedback activity
- newConcepts: Array of strings describing new concepts added (items in "new-concept" column)
- decisionsThisWeek: Array of strings describing decisions made (items in "decision-made" column with a decision)
- openItems: Array of strings describing open items awaiting action
- staleItems: Array of strings describing items that haven't moved in 5+ days

Return ONLY valid JSON, no markdown.`;

    if (!lovableKey) {
      // Return a static digest if no AI key
      return new Response(
        JSON.stringify({
          summary: `This week the register contains ${items.length} items across various stages.`,
          newConcepts: items
            .filter((i: any) => i.column_id === "new-concept")
            .map((i: any) => `${i.title} (${i.priority})`),
          decisionsThisWeek: items
            .filter((i: any) => i.column_id === "decision-made" && i.decision)
            .map((i: any) => `${i.title}: ${i.decision}`),
          openItems: items
            .filter(
              (i: any) =>
                i.column_id !== "decision-made" &&
                i.column_id !== "archived"
            )
            .map((i: any) => `${i.title} -- ${i.decision_needed || "pending"}`),
          staleItems: [],
          weekOf: new Date().toISOString().split("T")[0],
          generatedAt: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Lovable AI
    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a design operations analyst. Return only valid JSON." },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI error:", aiResp.status, errText);
      // Fallback to non-AI digest
      return new Response(
        JSON.stringify({
          summary: `This week the register contains ${items.length} items. AI summary unavailable.`,
          newConcepts: items
            .filter((i: any) => i.column_id === "new-concept")
            .map((i: any) => `${i.title} (${i.priority})`),
          decisionsThisWeek: items
            .filter((i: any) => i.decision)
            .map((i: any) => `${i.title}: ${i.decision}`),
          openItems: items
            .filter((i: any) => !i.decision && i.column_id !== "archived")
            .map((i: any) => `${i.title} -- ${i.decision_needed || "pending"}`),
          staleItems: [],
          weekOf: new Date().toISOString().split("T")[0],
          generatedAt: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResp.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";

    // Parse AI response (strip markdown fences if present)
    let digest;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      digest = JSON.parse(cleaned);
    } catch {
      digest = {
        summary: content,
        newConcepts: [],
        decisionsThisWeek: [],
        openItems: [],
        staleItems: [],
      };
    }

    return new Response(
      JSON.stringify({
        ...digest,
        weekOf: new Date().toISOString().split("T")[0],
        generatedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("weekly-digest error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
