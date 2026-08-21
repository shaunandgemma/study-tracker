import Stripe from 'npm:stripe@22.5.0';
import { createClient } from 'npm:@supabase/supabase-js@2.110.8';

import {
  createServerPaymentDependencies,
  validateSandboxRuntimeSettings
} from './serverAdapters.mjs';

function requiredEnvironment(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Missing payment runtime setting: ${name}`);
  return value;
}

function paymentSettings() {
  const siteOrigin = requiredEnvironment('PAYMENT_SITE_ORIGIN').replace(/\/$/, '');
  const allowedOrigins = requiredEnvironment('PAYMENT_ALLOWED_ORIGINS')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  return validateSandboxRuntimeSettings({
    allowedOrigins,
    livemode: false,
    siteOrigin,
    stripeSecretKey: requiredEnvironment('STRIPE_SECRET_KEY'),
    webhookSecret: requiredEnvironment('STRIPE_WEBHOOK_SECRET')
  });
}

export function createStripeSandboxDependencies() {
  const settings = paymentSettings();
  const supabaseUrl = requiredEnvironment('SUPABASE_URL');
  const publishableKey = Deno.env.get('SUPABASE_PUBLISHABLE_KEY')?.trim()
    || Deno.env.get('SUPABASE_ANON_KEY')?.trim();
  const serviceRoleKey = requiredEnvironment('SUPABASE_SERVICE_ROLE_KEY');
  if (!publishableKey) throw new Error('Missing payment runtime setting: SUPABASE_PUBLISHABLE_KEY');

  const authClientFactory = () => createClient(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const stripe = new Stripe(settings.stripeSecretKey);

  return createServerPaymentDependencies({ authClientFactory, serviceClient, settings, stripe });
}
