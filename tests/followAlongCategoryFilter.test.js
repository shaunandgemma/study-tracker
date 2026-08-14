import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ALL_FOLLOW_ALONG_CATEGORIES,
  getSortedFollowAlongCategories
} from '../src/features/followAlongs/published/followAlongCategoryFilter.js';

test('Follow Along category filter keeps All first and sorts unique categories', () => {
  const categories = getSortedFollowAlongCategories([
    { category: 'Storage' },
    { category: 'Compute' },
    { category: 'Databases' },
    { category: 'compute' },
    { category: 'Storage' },
    { category: '' },
    {}
  ]);

  assert.equal(categories[0], ALL_FOLLOW_ALONG_CATEGORIES);
  assert.deepEqual(categories, ['All', 'Compute', 'Databases', 'Storage']);
});

test('Follow Along category filter never duplicates its All option', () => {
  assert.deepEqual(
    getSortedFollowAlongCategories([{ category: 'All' }, { category: 'Messaging' }]),
    ['All', 'Messaging']
  );
});
