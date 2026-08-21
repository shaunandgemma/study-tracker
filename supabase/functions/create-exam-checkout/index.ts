import { createExamCheckoutHandler } from '../_shared/payments/handlers.mjs';
import { createStripeSandboxDependencies } from '../_shared/payments/stripeSandboxRuntime.ts';

// Step 008I deployed this authenticated Stripe sandbox Checkout entrypoint.
// Step 008J adds the separately approved authenticated billing portal.
Deno.serve(createExamCheckoutHandler(createStripeSandboxDependencies()));
