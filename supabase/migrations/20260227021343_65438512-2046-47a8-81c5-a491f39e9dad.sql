-- 1. Add structured feedback fields to intake_items (matching PRD/toolkit spec)
ALTER TABLE public.intake_items
  ADD COLUMN IF NOT EXISTS feedback_type TEXT NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS goal_of_share TEXT,
  ADD COLUMN IF NOT EXISTS whats_working TEXT,
  ADD COLUMN IF NOT EXISTS questions_risks TEXT,
  ADD COLUMN IF NOT EXISTS suggestions TEXT,
  ADD COLUMN IF NOT EXISTS decision_needed TEXT,
  ADD COLUMN IF NOT EXISTS submitter_phone TEXT,
  ADD COLUMN IF NOT EXISTS triaged_by TEXT,
  ADD COLUMN IF NOT EXISTS triaged_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS triage_notes TEXT,
  ADD COLUMN IF NOT EXISTS week_id TEXT,
  ADD COLUMN IF NOT EXISTS promoted_register_id UUID REFERENCES public.feedback_register(id);

-- 2. Create sms_conversations table for conversational SMS intake
CREATE TABLE IF NOT EXISTS public.sms_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  current_step TEXT NOT NULL DEFAULT 'awaiting-name',
  partial_data JSONB NOT NULL DEFAULT '{}',
  finalized BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sms_conversations ENABLE ROW LEVEL SECURITY;

-- SMS conversations: edge function uses service role, but allow public read for admin
CREATE POLICY "Anyone can read sms conversations"
  ON public.sms_conversations FOR SELECT USING (true);

CREATE POLICY "Anyone can insert sms conversations"
  ON public.sms_conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update sms conversations"
  ON public.sms_conversations FOR UPDATE USING (true);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at_sms
  BEFORE UPDATE ON public.sms_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();