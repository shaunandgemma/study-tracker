import { createExamCheckoutHandler } from '../_shared/payments/handlers.mjs';
import { createStripeLiveDependencies } from '../_shared/payments/stripeLiveRuntime.ts';

// Step 010B prepares this fixed live-mode entrypoint locally. It remains
// deployment-disabled and cannot run until a separately approved live rollout.
Deno.serve(createExamCheckoutHandler(createStripeLiveDependencies()));
