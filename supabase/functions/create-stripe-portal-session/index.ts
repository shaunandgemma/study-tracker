import { createStripePortalSessionHandler } from '../_shared/payments/handlers.mjs';
import { createStripeSandboxDependencies } from '../_shared/payments/stripeSandboxRuntime.ts';

// Step 008J deploys this authenticated Stripe sandbox billing-portal entrypoint.
// It cannot select a browser-supplied customer or grant an entitlement.
Deno.serve(createStripePortalSessionHandler(createStripeSandboxDependencies()));
