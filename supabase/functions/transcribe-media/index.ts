import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { fileUrl } = await req.json();
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableKey) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!fileUrl) {
      return new Response(
        JSON.stringify({ error: "fileUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Download the file
    const fileResp = await fetch(fileUrl);
    if (!fileResp.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to download file" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fileBlob = await fileResp.blob();

    // Transcribe using Whisper via Lovable AI
    const formData = new FormData();
    formData.append("file", fileBlob, "upload.mp3");
    formData.append("model", "whisper-1");

    const transcribeResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
        },
        body: formData,
      }
    );

    if (!transcribeResp.ok) {
      const errText = await transcribeResp.text();
      console.error("Transcription error:", transcribeResp.status, errText);
      if (transcribeResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (transcribeResp.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Transcription failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const transcribeData = await transcribeResp.json();
    const transcript = transcribeData.text || "";

    // Extract insights using Gemini
    const analysisPrompt = `Analyze this transcript from a design feedback meeting or review session. Extract structured insights.

Transcript:
${transcript}

Return ONLY valid JSON with these fields:
- summary: 2-3 sentence executive summary
- keyPoints: array of 3-5 key discussion points (strings)
- actionItems: array of specific action items mentioned (strings)
- questionsRaised: array of open questions raised (strings)`;

    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are a design operations analyst. Return only valid JSON." },
            { role: "user", content: analysisPrompt },
          ],
        }),
      }
    );

    if (!aiResp.ok) {
      // Fallback: return transcript only
      return new Response(
        JSON.stringify({ transcript, summary: "AI analysis unavailable.", keyPoints: [], actionItems: [], questionsRaised: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResp.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";

    let insights;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      insights = JSON.parse(cleaned);
    } catch {
      insights = { summary: content, keyPoints: [], actionItems: [], questionsRaised: [] };
    }

    return new Response(
      JSON.stringify({ transcript, ...insights }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("transcribe-media error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
