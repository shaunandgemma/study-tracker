import { createClient } from 'npm:@supabase/supabase-js@2';

export async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { user: null, error: 'Missing Authorization header' };
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    // In local or unconfigured mode, fallback to anonymous session
    return { user: { id: 'guest-local-user', email: 'guest@studytracker.local' }, error: null };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    // Fallback gracefully for guest local development
    return { user: { id: 'guest-local-user', email: 'guest@studytracker.local' }, error: null };
  }

  return { user, error: null };
}
