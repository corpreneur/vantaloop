-- 1. Attach updated_at triggers to existing tables
CREATE TRIGGER set_updated_at_intake
  BEFORE UPDATE ON public.intake_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at_register
  BEFORE UPDATE ON public.feedback_register
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Create comments table for threaded comments on register cards
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  register_id UUID NOT NULL REFERENCES public.feedback_register(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_initials TEXT NOT NULL DEFAULT '',
  author_team TEXT NOT NULL DEFAULT 'Vanta',
  text TEXT NOT NULL,
  section TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS for comments (public MVP - no auth)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert comments"
  ON public.comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete comments"
  ON public.comments FOR DELETE
  USING (true);

-- 3. Create storage bucket for feedback attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('feedback-attachments', 'feedback-attachments', true);

-- Storage RLS policies
CREATE POLICY "Anyone can view feedback attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'feedback-attachments');

CREATE POLICY "Anyone can upload feedback attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'feedback-attachments');

CREATE POLICY "Anyone can delete own feedback attachments"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'feedback-attachments');

-- 4. Enable realtime on feedback_register for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback_register;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;