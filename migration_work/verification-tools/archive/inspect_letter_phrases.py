import json
import re

bank = json.load(open('data/SAA-C03-question-bank-upgraded-250.json', 'r', encoding='utf-8'))

pattern = re.compile(r'\b(?:Option|Answer|Choice|Options|Answers)\s+[A-D](?:\s*(?:and|or|,)\s*[A-D])*\b|^\s*[A-D]\.\s+', re.M | re.I)

found_phrases = {}
affected = []

for q in bank:
    exp = q.get('explanation', '')
    matches = pattern.findall(exp)
    if matches:
        affected.append(q['id'])
        for m in matches:
            m_clean = m.strip()
            found_phrases[m_clean] = found_phrases.get(m_clean, 0) + 1

print(f"Total Affected Questions: {len(affected)}")
print("\nMost Frequent Letter Phrases Found:")
for k, v in sorted(found_phrases.items(), key=lambda x: x[1], reverse=True)[:35]:
    print(f"  '{k}': {v}")
