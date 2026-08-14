import tf0041a from './objective-1/tf004-1a.js';
import tf0041b from './objective-1/tf004-1b.js';
import tf0041c from './objective-1/tf004-1c.js';
import tf0042a from './objective-2/tf004-2a.js';
import tf0042b from './objective-2/tf004-2b.js';
import tf0042c from './objective-2/tf004-2c.js';
import tf0042d from './objective-2/tf004-2d.js';
import tf0043a from './objective-3/tf004-3a.js';
import tf0043b from './objective-3/tf004-3b.js';
import tf0043c from './objective-3/tf004-3c.js';
import tf0043d from './objective-3/tf004-3d.js';
import tf0043e from './objective-3/tf004-3e.js';
import tf0043f from './objective-3/tf004-3f.js';
import tf0043g from './objective-3/tf004-3g.js';
import tf0044a from './objective-4/tf004-4a.js';
import tf0044b from './objective-4/tf004-4b.js';
import tf0044c from './objective-4/tf004-4c.js';
import tf0044d from './objective-4/tf004-4d.js';
import tf0044e from './objective-4/tf004-4e.js';
import tf0044f from './objective-4/tf004-4f.js';
import tf0044g from './objective-4/tf004-4g.js';
import tf0044h from './objective-4/tf004-4h.js';
import tf0045a from './objective-5/tf004-5a.js';
import tf0045b from './objective-5/tf004-5b.js';
import tf0045c from './objective-5/tf004-5c.js';
import tf0045d from './objective-5/tf004-5d.js';
import tf0046a from './objective-6/tf004-6a.js';
import tf0046b from './objective-6/tf004-6b.js';
import tf0046c from './objective-6/tf004-6c.js';
import tf0046d from './objective-6/tf004-6d.js';
import tf0047a from './objective-7/tf004-7a.js';
import tf0047b from './objective-7/tf004-7b.js';
import tf0047c from './objective-7/tf004-7c.js';
import tf0048a from './objective-8/tf004-8a.js';
import tf0048b from './objective-8/tf004-8b.js';
import tf0048c from './objective-8/tf004-8c.js';
import tf0048d from './objective-8/tf004-8d.js';

export const TERRAFORM_KNOWLEDGE_GUIDE_ORDER = Object.freeze([
  'tf004-1a',
  'tf004-1b',
  'tf004-1c',
  'tf004-2a',
  'tf004-2b',
  'tf004-2c',
  'tf004-2d',
  'tf004-3a',
  'tf004-3b',
  'tf004-3c',
  'tf004-3d',
  'tf004-3e',
  'tf004-3f',
  'tf004-3g',
  'tf004-4a',
  'tf004-4b',
  'tf004-4c',
  'tf004-4d',
  'tf004-4e',
  'tf004-4f',
  'tf004-4g',
  'tf004-4h',
  'tf004-5a',
  'tf004-5b',
  'tf004-5c',
  'tf004-5d',
  'tf004-6a',
  'tf004-6b',
  'tf004-6c',
  'tf004-6d',
  'tf004-7a',
  'tf004-7b',
  'tf004-7c',
  'tf004-8a',
  'tf004-8b',
  'tf004-8c',
  'tf004-8d'
]);

export const TERRAFORM_KNOWLEDGE_GUIDES = Object.freeze({
  'tf004-1a': tf0041a,
  'tf004-1b': tf0041b,
  'tf004-1c': tf0041c,
  'tf004-2a': tf0042a,
  'tf004-2b': tf0042b,
  'tf004-2c': tf0042c,
  'tf004-2d': tf0042d,
  'tf004-3a': tf0043a,
  'tf004-3b': tf0043b,
  'tf004-3c': tf0043c,
  'tf004-3d': tf0043d,
  'tf004-3e': tf0043e,
  'tf004-3f': tf0043f,
  'tf004-3g': tf0043g,
  'tf004-4a': tf0044a,
  'tf004-4b': tf0044b,
  'tf004-4c': tf0044c,
  'tf004-4d': tf0044d,
  'tf004-4e': tf0044e,
  'tf004-4f': tf0044f,
  'tf004-4g': tf0044g,
  'tf004-4h': tf0044h,
  'tf004-5a': tf0045a,
  'tf004-5b': tf0045b,
  'tf004-5c': tf0045c,
  'tf004-5d': tf0045d,
  'tf004-6a': tf0046a,
  'tf004-6b': tf0046b,
  'tf004-6c': tf0046c,
  'tf004-6d': tf0046d,
  'tf004-7a': tf0047a,
  'tf004-7b': tf0047b,
  'tf004-7c': tf0047c,
  'tf004-8a': tf0048a,
  'tf004-8b': tf0048b,
  'tf004-8c': tf0048c,
  'tf004-8d': tf0048d
});

export function getTerraformKnowledgeGuide(itemId) {
  return TERRAFORM_KNOWLEDGE_GUIDES[itemId] || null;
}

export function hasTerraformKnowledgeGuide(itemId) {
  return Boolean(getTerraformKnowledgeGuide(itemId));
}

