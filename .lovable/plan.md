

## Plan: AI-Powered Comment Summaries, Smarter Digest, and Audio/Video Transcript Upload

Three features, built on the Lovable AI gateway via edge functions.

---

### 1. AI Comment Summaries (Card Detail Panel)

**Edge function**: `supabase/functions/summarize-comments/index.ts`
- Accepts `{ comments: { author, text, section }[] }` 
- Calls Lovable AI (`google/gemini-3-flash-preview`) with a prompt to produce a 2-3 sentence summary of the discussion thread: key themes, disagreements, and action items
- Returns `{ summary: string }`

**UI changes** in `src/components/CardDetail.tsx`:
- Add a "Summarize" button (sparkles icon) next to the Comments section header
- When clicked, calls the edge function with the card's comments
- Displays the AI summary in a styled card above the comment thread (accent border, Bot icon)
- Loading spinner while generating

**Config**: Add `[functions.summarize-comments]` with `verify_jwt = false` to `supabase/config.toml`

---

### 2. Smarter Weekly Digest Generation

**Update** `supabase/functions/weekly-digest/index.ts`:
- Change model from `google/gemini-2.5-flash` to `google/gemini-3-flash-preview`
- Enrich the prompt to include comment data (fetch from `comments` table joined by `register_id`)
- Add richer output structure: key themes, sentiment analysis, recommended next actions
- Add a `teamDynamics` field summarizing cross-team collaboration patterns

**UI changes** in `src/components/WeeklyDigest.tsx`:
- Add new sections for themes, sentiment, and recommended actions below the existing AI summary card
- Show team dynamics insight card

---

### 3. Audio/Video Upload with AI Transcription

**Edge function**: `supabase/functions/transcribe-media/index.ts`
- Accepts `{ fileUrl: string }` (URL from storage bucket)
- Downloads the file, sends to Lovable AI's Whisper endpoint (`v1/audio/transcriptions`) for transcription
- Then sends the transcript to Lovable AI (`google/gemini-3-flash-preview`) to extract structured feedback: summary, key points, action items, questions raised
- Returns `{ transcript: string, summary: string, keyPoints: string[], actionItems: string[] }`

**UI changes** in `src/components/WeeklyDigest.tsx`:
- Replace the simulated podcast player with a real upload area (drag-and-drop or file picker for audio/video)
- Upload file to `feedback-attachments` storage bucket
- Call `transcribe-media` edge function with the stored file URL
- Display transcript with AI-extracted insights below the player
- Show loading state during upload and transcription

**Config**: Add `[functions.transcribe-media]` with `verify_jwt = false` to `supabase/config.toml`

---

### Technical Details

- All three edge functions use `LOVABLE_API_KEY` (already provisioned) and the Lovable AI gateway
- Transcription uses the forge API's Whisper endpoint (already available via `server/_core/voiceTranscription.ts` pattern) but reimplemented as an edge function for direct client access
- No new database tables needed; comments and register data already exist
- Storage bucket `feedback-attachments` already exists and is public
- `supabase/config.toml` needs three new function entries
- All changes synced to both `src/` and `client/src/`

