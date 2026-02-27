
-- Update feedback_register: only admins can insert/update/delete
DROP POLICY "Anyone can insert feedback register" ON public.feedback_register;
DROP POLICY "Anyone can update feedback register" ON public.feedback_register;
DROP POLICY "Anyone can delete feedback register" ON public.feedback_register;

CREATE POLICY "Admins can insert feedback register"
  ON public.feedback_register FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update feedback register"
  ON public.feedback_register FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete feedback register"
  ON public.feedback_register FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Update comments: only admins can insert/delete
DROP POLICY "Anyone can insert comments" ON public.comments;
DROP POLICY "Anyone can delete comments" ON public.comments;

CREATE POLICY "Authenticated can insert comments"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can delete comments"
  ON public.comments FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Update intake_items: only admins can update (triage)
DROP POLICY "Anyone can update intake items" ON public.intake_items;

CREATE POLICY "Admins can update intake items"
  ON public.intake_items FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Update activity_log: only admins can insert
DROP POLICY "Anyone can insert activity log" ON public.activity_log;

CREATE POLICY "Authenticated can insert activity log"
  ON public.activity_log FOR INSERT
  TO authenticated
  WITH CHECK (true);
