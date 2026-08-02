import json

def main():
    with open('data/saa-c03-question-export.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)

    type_counts = {}
    diff_counts = {}
    topic_counts = {}
    domain_counts = {'domain-1': 0, 'domain-2': 0, 'domain-3': 0, 'domain-4': 0}

    d1_keywords = ['iam', 'kms', 'secret', 'waf', 'shield', 'guardduty', 'inspector', 'macie', 'security-hub', 'network-firewall', 'cognito', 'cloudtrail', 'parameter-store']
    d2_keywords = ['vpc', 'elb', 'asg', 'rds', 'aurora', 'route53', 'sqs', 'sns', 'eventbridge', 'backup', 'vpn', 'transit-gateway']
    d4_keywords = ['organization', 'budget', 'cost-explorer', 'compute-optimizer', 'trusted-advisor', 'ram', 'config', 'control-tower']

    audited_questions = []

    for q in questions:
        qid = q['id']
        qtype = q.get('type', 'single')
        qdiff = q.get('difficulty', 'Medium')
        opts = q.get('options', [])
        ts = q.get('topics') or ([q.get('topic')] if q.get('topic') else ['topic-general'])
        if isinstance(ts, str):
            ts = [ts]
        primary_topic = ts[0] if ts else 'topic-general'
        
        type_counts[qtype] = type_counts.get(qtype, 0) + 1
        diff_counts[qdiff] = diff_counts.get(qdiff, 0) + 1
        topic_counts[primary_topic] = topic_counts.get(primary_topic, 0) + 1
        
        d_assigned = 'domain-3'
        for k in d1_keywords:
            if k in primary_topic:
                d_assigned = 'domain-1'
                break
        if d_assigned == 'domain-3':
            for k in d2_keywords:
                if k in primary_topic:
                    d_assigned = 'domain-2'
                    break
        if d_assigned == 'domain-3':
            for k in d4_keywords:
                if k in primary_topic:
                    d_assigned = 'domain-4'
                    break
        
        domain_counts[d_assigned] += 1
        
        problems = []
        if qdiff == 'associate':
            problems.append('Invalid difficulty label associate')
        if len(q.get('question', '').split()) < 20:
            problems.append('Very short / single requirement scenario')
        if any(len(opt.split()) < 4 for opt in opts):
            problems.append('Unbalanced / brief options')
        if primary_topic == 'topic-s3':
            problems.append('Overrepresented S3 topic')
            
        audited_questions.append({
            'id': qid,
            'type': qtype,
            'difficulty': qdiff,
            'topic': primary_topic,
            'domain': d_assigned,
            'option_count': len(opts),
            'problems': problems
        })

    audit_json = {
        'summary': {
            'total_questions': len(questions),
            'id_range': 'q-saa-1 to q-saa-250',
            'type_counts': type_counts,
            'difficulty_counts': diff_counts,
            'domain_counts': domain_counts,
            'top_topics': sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:15],
            'overrepresented_topics': ['topic-s3 (59 questions, 23.6%)'],
            'underrepresented_topics': ['Transit Gateway', 'Direct Connect', 'PrivateLink', 'Route 53 Routing Policies', 'RDS Proxy', 'Control Tower', 'AWS Backup', 'DataSync', 'DMS', 'MGN', 'Storage Gateway']
        },
        'questions': audited_questions
    }

    with open('data/question-bank-quality-audit-before.json', 'w', encoding='utf-8') as f:
        json.dump(audit_json, f, indent=2)

    lines = []
    lines.append('# SAA-C03 Question Bank Initial Quality Audit Report (Before Upgrade)\n')
    lines.append('This report documents the baseline audit of all 250 questions in the current SAA-C03 practice question bank (`data/saa-c03-question-export.json`).\n')
    lines.append('---\n')
    lines.append('## 1. Executive Summary & Bank Metrics\n')
    lines.append(f'- **Total Questions**: {len(questions)}')
    lines.append(f'- **ID Range**: q-saa-1 to q-saa-250')
    lines.append('- **Question Types**:')
    lines.append(f'  - `single`: {type_counts.get("single", 0)}')
    lines.append(f'  - `multiple`: {type_counts.get("multiple", 0)}')
    lines.append('- **Difficulty Distribution**:')
    lines.append(f'  - `associate` (INVALID): {diff_counts.get("associate", 0)}')
    lines.append(f'  - `Easy`: {diff_counts.get("Easy", 0)}')
    lines.append(f'  - `Medium`: {diff_counts.get("Medium", 0)}')
    lines.append(f'  - `Hard`: {diff_counts.get("Hard", 0)}')
    lines.append('- **Domain Distribution (Estimated)**:')
    lines.append(f'  - Domain 1 (Design Secure Architectures): {domain_counts.get("domain-1", 0)}')
    lines.append(f'  - Domain 2 (Design Resilient Architectures): {domain_counts.get("domain-2", 0)}')
    lines.append(f'  - Domain 3 (Design High-Performing Architectures): {domain_counts.get("domain-3", 0)}')
    lines.append(f'  - Domain 4 (Design Cost-Optimized Architectures): {domain_counts.get("domain-4", 0)}')
    lines.append('\n---\n')
    lines.append('## 2. Top 15 Topic Frequencies\n')
    lines.append('| Topic ID | Question Count | Percentage | Status |')
    lines.append('|---|---|---|---|')

    for topic, count in sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:15]:
        pct = (count / len(questions)) * 100
        status = 'OVERREPRESENTED' if count > 25 else 'Normal'
        lines.append(f'| `{topic}` | {count} | {pct:.1f}% | {status} |')

    lines.append('\n---\n')
    lines.append('## 3. Ten Quality Failure Categories Identified\n')
    lines.append('### 1. Technically Incorrect or Ambiguous Questions')
    lines.append('- `q-saa-13`: Outdated EBS gp3 IOPS limits claimed (gp3 supports up to 80,000 IOPS and 2,000 MiB/s).')
    lines.append('- `q-saa-41`: Ambiguous caching strategy phrasing failing to specify Redis vs Memcached multi-AZ requirements.')
    lines.append('- `q-saa-46`: Incorrect SCP distractor claiming SCPs grant permissions.')
    lines.append('- `q-saa-70`: VPC Flow Log explanation missing explicit S3 destination log syntax.')
    lines.append('- `q-saa-172`: Ambiguous hybrid networking Direct Connect vs VPN gateway fallback wording.')
    lines.append('- `q-saa-174`: Overly simplified multi-Region database failover RPO/RTO claims.')
    lines.append('- `q-saa-199`: Misleading SQS FIFO deduplication scope explanation.\n')

    lines.append('### 2. Service-Identification Only Questions')
    lines.append('- Questions in `q-saa-1` through `q-saa-100` asking simple "Which AWS service..." without testing multi-constraint architectural trade-offs.\n')

    lines.append('### 3. Single-Requirement Questions')
    lines.append('- Over 40 questions in the early batch contain only one constraint (e.g. "Must store data durably"). Real SAA-C03 questions require balancing 2 or more constraints.\n')

    lines.append('### 4. Obviously Incorrect Distractors')
    lines.append('- Distractors presenting non-existent AWS services, unrealistic configuration combinations, or option text with extreme length imbalance.\n')

    lines.append('### 5. Keyword Reveal Questions')
    lines.append('- Questions where a single keyword in the prompt immediately reveals the correct answer choice without evaluating the full scenario.\n')

    lines.append('### 6. Repeated or Near-Duplicate Scenarios')
    lines.append('- `topic-s3` accounts for 59 questions (23.6% of the bank), creating repetitive scenarios regarding S3 Lifecycle, Versioning, and Object Lock.\n')

    lines.append('### 7. Weak Explanations')
    lines.append('- Many explanations fail to provide structured rationales explaining why each incorrect distractor is wrong, missing Exam Triggers, Exam Traps, and Memory Hooks.\n')

    lines.append('### 8. Invalid Difficulty Labels')
    lines.append('- **80 questions** are currently labeled with `"associate"`, which is an invalid difficulty string. All questions must be strictly rated as `"Easy"`, `"Medium"`, or `"Hard"`.\n')

    lines.append('### 9. Overrepresented Topics')
    lines.append('- `topic-s3`: 59 questions (23.6% of entire bank).\n')

    lines.append('### 10. Underrepresented SAA-C03 Topics')
    lines.append('- Transit Gateway, Direct Connect, PrivateLink, Route 53 Routing Policies, RDS Proxy, AWS Organizations & SCPs, AWS Control Tower, AWS Backup, DataSync, DMS, MGN, and Storage Gateway.\n')

    lines.append('---\n')
    lines.append('## 4. Initial Audit Conclusion\n')
    lines.append('A targeted upgrade is required for Stage 2 (the 6 named weak questions) and Stages 3 & 4 (45 early questions between `q-saa-1` and `q-saa-150`), along with schema normalization and difficulty re-rating across all 250 questions.')

    with open('data/question-bank-quality-audit-before.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print('Successfully generated data/question-bank-quality-audit-before.json and data/question-bank-quality-audit-before.md!')

if __name__ == '__main__':
    main()
