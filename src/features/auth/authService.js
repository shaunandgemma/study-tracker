import { supabase } from '../../lib/supabase.js';

const errorMessage = (error, fallback) => error?.message || fallback;

export const createAuthService = (client = supabase) => ({
  async getCurrentUser() {
    try {
      const { data, error } = await client.auth.getUser();
      if (error) return { success: false, user: null, error: errorMessage(error, 'Unable to load the current user.') };
      return { success: true, user: data?.user || null };
    } catch (error) {
      return { success: false, user: null, error: errorMessage(error, 'Unable to load the current user.') };
    }
  },

  subscribeToAuthChanges(onChange) {
    const { data } = client.auth.onAuthStateChange((event, session) => {
      onChange(session?.user || null, event);
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  },

  async signInWithEmail(email, password) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return { success: false, error: errorMessage(error, 'Failed to sign in.') };
      return { success: true, user: data?.user || null };
    } catch (error) {
      return { success: false, error: errorMessage(error, 'Failed to sign in.') };
    }
  },

  async signUpWithEmail(email, password) {
    try {
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) return { success: false, error: errorMessage(error, 'Failed to create account.') };

      return {
        success: true,
        user: data?.user || null,
        message: data?.session
          ? 'Account created and signed in successfully!'
          : 'Account created! Please check your email inbox to confirm registration.',
      };
    } catch (error) {
      return { success: false, error: errorMessage(error, 'Failed to create account.') };
    }
  },

  async signOut() {
    try {
      const { error } = await client.auth.signOut();
      if (error) return { success: false, error: errorMessage(error, 'Failed to sign out.') };
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error, 'Failed to sign out.') };
    }
  },
});

export const authService = createAuthService();
