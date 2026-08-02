# SAA-C03 Repaired Batches Merge Report

## Summary

- Total original questions: 150
- Total repaired questions merged: 80
- Total unchanged questions: 70
- Corrected output: `data/saa-c03-question-export-corrected.json`

## Repaired IDs by Batch

### repaired-batch-01.json (10)

`q-saa-108`, `q-saa-120`, `q-saa-135`, `q-saa-146`, `q-saa-148`, `q-saa-149`, `q-saa-105`, `q-saa-52`, `q-saa-58`, `q-saa-82`

### repaired-batch-02.json (10)

`q-saa-85`, `q-saa-86`, `q-saa-137`, `q-saa-140`, `q-saa-143`, `q-saa-150`, `q-saa-99`, `q-saa-134`, `q-saa-2`, `q-saa-69`

### repaired-batch-03.json (10)

`q-saa-71`, `q-saa-78`, `q-saa-98`, `q-saa-104`, `q-saa-109`, `q-saa-110`, `q-saa-111`, `q-saa-121`, `q-saa-128`, `q-saa-145`

### repaired-batch-04.json (10)

`q-saa-5`, `q-saa-12`, `q-saa-17`, `q-saa-46`, `q-saa-59`, `q-saa-63`, `q-saa-65`, `q-saa-67`, `q-saa-73`, `q-saa-77`

### repaired-batch-05.json (10)

`q-saa-80`, `q-saa-83`, `q-saa-95`, `q-saa-97`, `q-saa-100`, `q-saa-102`, `q-saa-107`, `q-saa-114`, `q-saa-122`, `q-saa-131`

### repaired-batch-06.json (10)

`q-saa-132`, `q-saa-133`, `q-saa-136`, `q-saa-142`, `q-saa-4`, `q-saa-10`, `q-saa-36`, `q-saa-41`, `q-saa-48`, `q-saa-54`

### repaired-batch-07.json (10)

`q-saa-84`, `q-saa-116`, `q-saa-13`, `q-saa-22`, `q-saa-60`, `q-saa-87`, `q-saa-113`, `q-saa-127`, `q-saa-138`, `q-saa-1`

### repaired-batch-08.json (10)

`q-saa-19`, `q-saa-20`, `q-saa-27`, `q-saa-30`, `q-saa-70`, `q-saa-76`, `q-saa-106`, `q-saa-39`, `q-saa-79`, `q-saa-125`

## Validation Results

- Original question count: PASS (150)
- Corrected question count: PASS (150)
- Unique repaired question count: PASS (80)
- Duplicate original ID check: PASS (none)
- Duplicate repaired ID check across batches: PASS (none)
- Duplicate corrected ID check: PASS (none)
- Missing repaired ID check against original: PASS (none)
- Every original ID remains present: PASS
- Original question ordering preserved: PASS
- Question schema validation: PASS
- Correct-answer index range validation: PASS
- Single-answer cardinality validation: PASS
- Multiple-answer uniqueness and range validation: PASS
- Non-empty option validation: PASS
- Corrected JSON parse and round-trip validation: PASS
- Changed-object comparison: PASS (exactly 80 approved question objects changed)
- Unchanged-object comparison: PASS (70 question objects unchanged)
- Original file unchanged: PASS (SHA-256 before and after: `87abc8feec39c1de0c5405458b8fb5fa9c24c31aef964e9c3a2f528441b6f0c1`)
- Supabase updated: NO

## Merge Confirmation

The corrected bank was created by replacing original objects only when their IDs appeared in the eight approved repaired batches. The original order was retained, and comparison against the original confirmed that only the 80 approved repaired question objects changed.
