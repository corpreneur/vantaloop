
-- Function to list all users with their roles (admin only, security definer)
CREATE OR REPLACE FUNCTION public.list_users_with_roles()
RETURNS TABLE (
  user_id uuid,
  email text,
  full_name text,
  avatar_url text,
  role app_role,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    au.id AS user_id,
    au.email::text,
    COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', '')::text AS full_name,
    COALESCE(au.raw_user_meta_data->>'avatar_url', '')::text AS avatar_url,
    COALESCE(ur.role, 'viewer'::app_role) AS role,
    au.created_at
  FROM auth.users au
  LEFT JOIN public.user_roles ur ON ur.user_id = au.id
  WHERE public.has_role(auth.uid(), 'admin'::app_role)
  ORDER BY au.created_at DESC
$$;

-- Function to update a user's role (admin only, security definer)
CREATE OR REPLACE FUNCTION public.set_user_role(_target_user_id uuid, _new_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_target_user_id, _new_role)
  ON CONFLICT (user_id, role) DO UPDATE SET role = _new_role;
END;
$$;
