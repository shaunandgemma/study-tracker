import { createStripePortalSessionHandler } from '../_shared/payments/handlers.mjs';
import { createStripeLiveDependencies } from '../_shared/payments/stripeLiveRuntime.ts';

// Step 010B prepares this fixed live-mode entrypoint locally. It remains
// deployment-disabled and never accepts a browser-selected Customer.
Deno.serve(createStripePortalSessionHandler(createStripeLiveDependencies()));
