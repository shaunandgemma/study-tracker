import json
import re
from collections import Counter, defaultdict

# Load question bank
with open('data/SAA-C03-question-bank-upgraded-250.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Total questions loaded: {len(questions)}")

# Question breakdown by type
type_counts = Counter(q['type'] for q in questions)
multiple_two = sum(1 for q in questions if q['type'] == 'multiple' and len(q.get('correctAnswers', []) or []) == 2)
multiple_three = sum(1 for q in questions if q['type'] == 'multiple' and len(q.get('correctAnswers', []) or []) == 3)
single_count = type_counts['single']

print(f"Single answer: {single_count}")
print(f"Multiple answer: {type_counts['multiple']} (Select TWO: {multiple_two}, Select THREE: {multiple_three})")

# Load domain mapping if possible
domain_map = {}
try:
    with open('src/data/saaC03DomainMapping.js', 'r', encoding='utf-8') as f:
        content = f.read()
        matches = re.findall(r'"(q-saa-\d+)":\s*"(domain-\d+)"', content)
        domain_map = dict(matches)
except Exception as e:
    print(f"Domain map load warning: {e}")

domain_counts = Counter(domain_map.values())
print("Domain counts:", dict(domain_counts))

# -------------------------------------------------------------
# 1. Answer length analysis & signalling
# -------------------------------------------------------------
correct_lengths = []
distractor_lengths = []
length_bias_questions = [] # Correct option is >= 1.4x average distractor length

for q in questions:
    opts = q['options']
    if q['type'] == 'single':
        c_idx = q['correctAnswer']
        c_len = len(opts[c_idx])
        d_lens = [len(opts[i]) for i in range(len(opts)) if i != c_idx]
    else:
        c_indices = set(q['correctAnswers'])
        c_len = sum(len(opts[i]) for i in c_indices) / len(c_indices)
        d_lens = [len(opts[i]) for i in range(len(opts)) if i not in c_indices]
    
    avg_d_len = sum(d_lens) / len(d_lens) if d_lens else 1
    correct_lengths.append(c_len)
    distractor_lengths.append(avg_d_len)

    if c_len > 1.4 * avg_d_len and c_len > 80:
        length_bias_questions.append((q['id'], c_len, round(avg_d_len, 1)))

avg_c_len = sum(correct_lengths) / len(correct_lengths)
avg_d_len = sum(distractor_lengths) / len(distractor_lengths)

print(f"Average correct option length: {avg_c_len:.1f} chars")
print(f"Average distractor option length: {avg_d_len:.1f} chars")
print(f"Correct answer length ratio: {avg_c_len / avg_d_len:.2f}")
print(f"Questions with significant length bias (correct option > 1.4x distractors): {len(length_bias_questions)}")

# -------------------------------------------------------------
# 2. Service Recognition & Keyword Trigger Analysis
# -------------------------------------------------------------
keyword_triggers = [
    (r'\b(ddos|distributed denial of service)\b', 'Shield', r'\bshield\b'),
    (r'\b(relational database|sql database|mysql|postgresql)\b', 'RDS', r'\b(rds|aurora)\b'),
    (r'\b(cache|caching|redis|memcached)\b', 'ElastiCache', r'\belasticache\b'),
    (r'\b(dns|domain name|health check failover)\b', 'Route 53', r'\broute\s*53\b'),
    (r'\b(object storage|unstructured data|buckets?)\b', 'S3', r'\bs3\b'),
    (r'\b(file share|smb|nfs|shared file system)\b', 'EFS / FSx', r'\b(efs|fsx)\b'),
    (r'\b(docker|containers?|microservices?)\b', 'ECS / EKS / Fargate', r'\b(ecs|eks|fargate)\b'),
    (r'\b(decouple|asynchronous order processing|queue)\b', 'SQS', r'\bsqs\b'),
    (r'\b(search engine|full-text search|log search)\b', 'OpenSearch', r'\bopensearch\b'),
    (r'\b(secrets|rotate credentials|db password)\b', 'Secrets Manager', r'\bsecrets manager\b'),
]

keyword_recognition_qids = []
for q in questions:
    stem = q['question'].lower()
    c_text = ""
    if q['type'] == 'single':
        c_text = q['options'][q['correctAnswer']].lower()
    else:
        c_text = " ".join([q['options'][i].lower() for i in q['correctAnswers']])
    
    matches = 0
    matched_kw = []
    for stem_pattern, service_name, ans_pattern in keyword_triggers:
        if re.search(stem_pattern, stem) and re.search(ans_pattern, c_text):
            d_texts = []
            if q['type'] == 'single':
                d_texts = [q['options'][i].lower() for i in range(len(q['options'])) if i != q['correctAnswer']]
            else:
                d_texts = [q['options'][i].lower() for i in range(len(q['options'])) if i not in q['correctAnswers']]
            
            d_lacks_service = all(not re.search(ans_pattern, dt) for dt in d_texts)
            if d_lacks_service:
                matches += 1
                matched_kw.append(service_name)
    
    if matches > 0:
        keyword_recognition_qids.append((q['id'], matched_kw))

print(f"Questions identified as single-keyword service-recognition: {len(keyword_recognition_qids)}")

# -------------------------------------------------------------
# 3. Service frequency & multi-service depth
# -------------------------------------------------------------
aws_services = [
    'EC2', 'S3', 'VPC', 'RDS', 'Aurora', 'DynamoDB', 'Lambda', 'ECS', 'EKS', 'Fargate',
    'SQS', 'SNS', 'EventBridge', 'Step Functions', 'CloudFront', 'Route 53', 'ELB', 'ALB', 'NLB',
    'WAF', 'Shield', 'KMS', 'IAM', 'Organizations', 'Control Tower', 'CloudWatch', 'CloudTrail',
    'Config', 'Secrets Manager', 'Parameter Store', 'GuardDuty', 'Inspector', 'Macie', 'Security Hub',
    'Network Firewall', 'Transit Gateway', 'VPC Peering', 'Direct Connect', 'VPN', 'PrivateLink',
    'DataSync', 'Storage Gateway', 'Snowball', 'DMS', 'MGN', 'Kinesis', 'Firehose', 'Athena',
    'Glue', 'EMR', 'Redshift', 'ElastiCache', 'Cognito', 'Auto Scaling', 'Backup', 'FSx', 'EFS', 'EBS'
]

service_counts = Counter()
depth_counts = Counter()
depth_qids = defaultdict(list)

for q in questions:
    full_text = q['question'] + " " + " ".join(q['options']) + " " + q['explanation']
    found_services = set()
    for svc in aws_services:
        pattern = r'\b' + re.escape(svc) + r'\b'
        if re.search(pattern, full_text, re.IGNORECASE):
            found_services.add(svc)
            service_counts[svc] += 1
    
    sol_text = q['question'] + " "
    if q['type'] == 'single':
        sol_text += q['options'][q['correctAnswer']]
    else:
        sol_text += " ".join([q['options'][i] for i in q['correctAnswers']])
    
    sol_services = set()
    for svc in aws_services:
        pattern = r'\b' + re.escape(svc) + r'\b'
        if re.search(pattern, sol_text, re.IGNORECASE):
            sol_services.add(svc)
    
    num_svc = len(sol_services)
    if num_svc <= 1:
        depth_counts['1 service'] += 1
        depth_qids['1 service'].append(q['id'])
    elif num_svc == 2:
        depth_counts['2 services'] += 1
        depth_qids['2 services'].append(q['id'])
    else:
        depth_counts['3+ services'] += 1
        depth_qids['3+ services'].append(q['id'])

print("Service depth breakdown (solution services):", dict(depth_counts))
print("Top 15 AWS Services mentioned:", service_counts.most_common(15))

# -------------------------------------------------------------
# 4. Scenario Repetition & Family Grouping
# -------------------------------------------------------------
scenario_patterns = {
    "S3 Lifecycle / Storage Class Selection": r'lifecycle|storage class|glacier|intelligent-tiering|archive',
    "S3 Security / Encryption / Bucket Policies / OAC": r's3 bucket policy|kms|sse-kms|sse-s3|oac|origin access control|public access',
    "VPC Peering vs Transit Gateway vs PrivateLink": r'vpc peering|transit gateway|privatelink|vpc endpoint',
    "WAF Protection / Blocking / Rate-Based": r'waf|rate-based|web application firewall|sql injection|xss',
    "Organizations & SCP Governance": r'organizations|scp|service control policy|management account',
    "EC2 Auto Scaling & Load Balancing (ALB/NLB)": r'auto scaling|alb|nlb|load balancer|target group',
    "ECS / EKS Container Deployment & Fargate": r'ecs|eks|fargate|task definition|container',
    "Aurora Failover / Replicas / Global Database": r'aurora|aurora global database|aurora replica|multi-az db cluster',
    "RDS Multi-AZ vs Read Replicas vs RDS Proxy": r'rds proxy|multi-az|read replica|database failover',
    "Database Caching (ElastiCache / DAX)": r'elasticache|redis|memcached|dax|dynamodb accelerator',
    "Decoupling with SQS / SNS / EventBridge": r'sqs|sns|eventbridge|decouple|message queue|fan-out',
    "Hybrid Connectivity (Direct Connect / VPN)": r'direct connect|site-to-site vpn|dx gateway',
    "Disaster Recovery (Pilot Light / Warm Standby / Active-Active)": r'pilot light|warm standby|active-active|rto|rpo',
    "Data Migration (DMS / MGN / DataSync / Snowball)": r'dms|mgn|datasync|snowball|migration service',
    "Secrets Management & Parameter Store": r'secrets manager|parameter store|rotate credentials',
    "Monitoring & Compliance (CloudWatch / CloudTrail / Config / GuardDuty)": r'cloudwatch|cloudtrail|aws config|guardduty|inspector|security hub'
}

scenario_families = defaultdict(list)
for q in questions:
    text = (q['question'] + " " + q['explanation']).lower()
    for fam_name, pattern in scenario_patterns.items():
        if re.search(pattern, text):
            scenario_families[fam_name].append(q['id'])

print("\n--- Scenario Families Audit ---")
for fam_name, qids in sorted(scenario_families.items(), key=lambda x: len(x[1]), reverse=True):
    print(f"{fam_name}: {len(qids)} questions ({', '.join(qids[:5])}{'...' if len(qids)>5 else ''})")

audit_report = {
    "totalQuestions": len(questions),
    "singleCount": single_count,
    "multipleCount": type_counts['multiple'],
    "selectTwoCount": multiple_two,
    "selectThreeCount": multiple_three,
    "domainCounts": dict(domain_counts),
    "averageCorrectOptionLength": round(avg_c_len, 1),
    "averageDistractorLength": round(avg_d_len, 1),
    "lengthRatio": round(avg_c_len / avg_d_len, 2),
    "lengthBiasQuestionCount": len(length_bias_questions),
    "lengthBiasQuestions": length_bias_questions,
    "serviceRecognitionQuestionCount": len(keyword_recognition_qids),
    "serviceRecognitionQuestions": [(qid, kw) for qid, kw in keyword_recognition_qids],
    "serviceDepth": dict(depth_counts),
    "serviceDepthQids": {k: v for k, v in depth_qids.items()},
    "scenarioFamilies": {k: v for k, v in scenario_families.items()},
    "topServices": service_counts.most_common(20)
}

import os
os.makedirs('migration_work', exist_ok=True)
with open('migration_work/saa-c03-phase1-audit-report.json', 'w', encoding='utf-8') as f:
    json.dump(audit_report, f, indent=2)

print("\nAudit report saved to migration_work/saa-c03-phase1-audit-report.json")
