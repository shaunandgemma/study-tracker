import { createStripeWebhookHandler } from '../_shared/payments/handlers.mjs';
import { createStripeSandboxDependencies } from '../_shared/payments/stripeSandboxRuntime.ts';

// Step 008H deployed this signed Stripe sandbox webhook. Steps 008I and 008J
// separately approved the JWT-protected Checkout and billing-portal functions.
Deno.serve(createStripeWebhookHandler(createStripeSandboxDependencies()));
