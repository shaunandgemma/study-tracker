import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (process.env || {});

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabasePublishableKey) {
  // Silent fallback in test or unconfigured environment
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'test') {
    console.warn('Supabase URL or Publishable Key is missing from environment variables.');
  }
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabasePublishableKey || 'placeholder');
