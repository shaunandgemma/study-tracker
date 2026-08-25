import { createStripeWebhookHandler } from '../_shared/payments/handlers.mjs';
import { createStripeLiveDependencies } from '../_shared/payments/stripeLiveRuntime.ts';

// Step 010B prepares this signed fixed live-mode endpoint locally. It remains
// deployment-disabled; Stripe signatures are still mandatory at runtime.
Deno.serve(createStripeWebhookHandler(createStripeLiveDependencies()));
