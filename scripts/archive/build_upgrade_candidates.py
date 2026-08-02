import json

def main():
    with open('data/saa-c03-question-export.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)

    # Filter to early questions q-saa-1 to q-saa-150
    early_questions = [q for q in questions if int(q['id'].split('-')[-1]) <= 150]

    # Rebalancing topics to recommend
    underrepresented_topics = [
        ('topic-transit-gateway', 'Domain 2'),
        ('topic-direct-connect', 'Domain 3'),
        ('topic-privatelink', 'Domain 3'),
        ('topic-route53', 'Domain 2'),
        ('topic-rds-proxy', 'Domain 2'),
        ('topic-ecs', 'Domain 3'),
        ('topic-fargate', 'Domain 3'),
        ('topic-eks', 'Domain 3'),
        ('topic-auto-scaling', 'Domain 2'),
        ('topic-organizations', 'Domain 4'),
        ('topic-scp', 'Domain 1'),
        ('topic-control-tower', 'Domain 4'),
        ('topic-config', 'Domain 4'),
        ('topic-cloudtrail', 'Domain 1'),
        ('topic-aws-backup', 'Domain 2'),
        ('topic-disaster-recovery', 'Domain 2'),
        ('topic-datasync', 'Domain 3'),
        ('topic-dms', 'Domain 3'),
        ('topic-mgn', 'Domain 3'),
        ('topic-storage-gateway', 'Domain 3')
    ]

    candidates = []
    
    # Priority list of early questions needing quality upgrade
    for q in early_questions:
        qid = q['id']
        num = int(qid.split('-')[-1])
        diff = q.get('difficulty', 'Medium')
        ts = q.get('topics') or ([q.get('topic')] if q.get('topic') else ['topic-general'])
        if isinstance(ts, str):
            ts = [ts]
        current_topic = ts[0] if ts else 'topic-general'
        
        problems = []
        if diff == 'associate':
            problems.append('Invalid difficulty label "associate"')
        if current_topic == 'topic-s3':
            problems.append('Excessive S3 topic concentration')
        if len(q.get('question', '').split()) < 25:
            problems.append('Single-requirement / overly simple scenario')
        if len(q.get('explanation', '').split()) < 25:
            problems.append('Shallow explanation lacking distractor failure analysis')
        
        # Select if it has 1 or more quality problems
        if len(problems) > 0:
            rec_topic = underrepresented_topics[num % len(underrepresented_topics)][0]
            rec_diff = 'Hard' if num % 3 == 0 else ('Medium' if num % 2 == 0 else 'Easy')
            prio = 1 if len(problems) >= 2 or num in [41, 58, 70] else 2
            
            candidates.append({
                'id': qid,
                'current_topic': current_topic,
                'current_difficulty': diff,
                'quality_problems': problems,
                'recommended_replacement_topic': rec_topic,
                'recommended_difficulty': rec_diff,
                'priority': prio
            })

    # Sort candidates by priority (1 first) then by ID number
    candidates.sort(key=lambda c: (c['priority'], int(c['id'].split('-')[-1])))
    
    # Select top 45 candidates
    selected_candidates = candidates[:45]

    with open('data/early-question-upgrade-candidates.json', 'w', encoding='utf-8') as f:
        json.dump(selected_candidates, f, indent=2)

    # Generate Markdown Report
    lines = []
    lines.append('# Early Question Upgrade Candidate Selection Report\n')
    lines.append('This report lists the 45 recommended candidate questions selected from `q-saa-1` through `q-saa-150` for quality upgrading and rebalancing.\n')
    lines.append('---\n')
    lines.append('## Candidate List (Top 45 Ranked by Priority)\n')
    lines.append('| ID | Current Topic | Current Difficulty | Quality Problems | Recommended Replacement Topic | Recommended Difficulty | Priority |')
    lines.append('|---|---|---|---|---|---|---|')

    for c in selected_candidates:
        probs = ', '.join(c['quality_problems'])
        lines.append(f"| `{c['id']}` | `{c['current_topic']}` | `{c['current_difficulty']}` | {probs} | `{c['recommended_replacement_topic']}` | `{c['recommended_difficulty']}` | Priority {c['priority']} |")

    with open('data/early-question-upgrade-candidates.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print(f'Successfully generated data/early-question-upgrade-candidates.json and .md ({len(selected_candidates)} candidates).')

if __name__ == '__main__':
    main()
