import json
import re
from collections import Counter

with open('data/SAA-C03-question-bank-upgraded-250.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Stem patterns audit
stem_endings = Counter()
generic_expl_phrases = Counter()

expl_phrase_patterns = [
    r'satisfies all requirements',
    r'does not meet the requirements',
    r'most operationally efficient',
    r'less suitable',
    r'not the best option',
    r'exam trigger',
    r'exam trap',
    r'memory hook'
]

for q in questions:
    stem = q['question'].strip()
    # Extract last sentence or ending clause
    sentences = re.split(r'[.?!]\s+', stem)
    if sentences:
        last_sentence = sentences[-1]
        stem_endings[last_sentence] += 1
    
    expl = q['explanation'].lower()
    for p in expl_phrase_patterns:
        if re.search(p, expl):
            generic_expl_phrases[p] += 1

print("--- Top Stem Endings ---")
for ending, count in stem_endings.most_common(10):
    print(f"{count}x: '{ending}'")

print("\n--- Generic Explanation Phrases ---")
for phrase, count in generic_expl_phrases.items():
    print(f"{count}x: '{phrase}'")

# Distractor length variance check
low_distractor_detail = []
for q in questions:
    opts = q['options']
    lens = [len(o) for o in opts]
    min_l = min(lens)
    max_l = max(lens)
    if max_l - min_l > 80:
        low_distractor_detail.append((q['id'], min_l, max_l))

print(f"\nQuestions with high distractor length variance (range > 80 chars): {len(low_distractor_detail)}")
