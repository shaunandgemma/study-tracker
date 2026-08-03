/**
 * Authoritative AWS SAA-C03 Domain Classification
 *
 * Official AWS Exam Domains:
 * - Domain 1: Design Secure Architectures (30%)
 * - Domain 2: Design Resilient Architectures (26%)
 * - Domain 3: Design High-Performing Architectures (24%)
 * - Domain 4: Design Cost-Optimized Architectures (20%)
 */

export const SAA_C03_DOMAINS = [
  {
    id: 'domain-1',
    code: 'Domain 1',
    title: 'Domain 1 - Design Secure Architectures',
    weight: 30
  },
  {
    id: 'domain-2',
    code: 'Domain 2',
    title: 'Domain 2 - Design Resilient Architectures',
    weight: 26
  },
  {
    id: 'domain-3',
    code: 'Domain 3',
    title: 'Domain 3 - Design High-Performing Architectures',
    weight: 24
  },
  {
    id: 'domain-4',
    code: 'Domain 4',
    title: 'Domain 4 - Design Cost-Optimized Architectures',
    weight: 20
  }
];

/**
 * Fixed 65-question SAA-C03 Full Mock allocation.
 */
export const SAA_C03_FULL_MOCK_ALLOCATION = Object.freeze({
  'domain-1': 19,
  'domain-2': 17,
  'domain-3': 16,
  'domain-4': 13
});

/**
 * Official SAA-C03 Domain Weights for Custom Exam balancing.
 */
export const SAA_C03_DOMAIN_WEIGHTS = Object.freeze({
  'domain-1': 0.30,
  'domain-2': 0.26,
  'domain-3': 0.24,
  'domain-4': 0.20
});

/**
 * Question ID to authoritative SAA-C03 primary domain mapping for all 250 questions
 */
export const QUESTION_DOMAIN_MAP = {
  "q-saa-1": "domain-3",
  "q-saa-2": "domain-3",
  "q-saa-3": "domain-2",
  "q-saa-4": "domain-2",
  "q-saa-5": "domain-4",
  "q-saa-6": "domain-3",
  "q-saa-7": "domain-4",
  "q-saa-8": "domain-2",
  "q-saa-9": "domain-1",
  "q-saa-10": "domain-2",
  "q-saa-11": "domain-3",
  "q-saa-12": "domain-3",
  "q-saa-13": "domain-3",
  "q-saa-14": "domain-2",
  "q-saa-15": "domain-2",
  "q-saa-16": "domain-2",
  "q-saa-17": "domain-2",
  "q-saa-18": "domain-1",
  "q-saa-19": "domain-3",
  "q-saa-20": "domain-4",
  "q-saa-21": "domain-3",
  "q-saa-22": "domain-4",
  "q-saa-23": "domain-4",
  "q-saa-24": "domain-3",
  "q-saa-25": "domain-4",
  "q-saa-26": "domain-4",
  "q-saa-27": "domain-4",
  "q-saa-28": "domain-3",
  "q-saa-29": "domain-3",
  "q-saa-30": "domain-4",
  "q-saa-31": "domain-3",
  "q-saa-32": "domain-2",
  "q-saa-33": "domain-3",
  "q-saa-34": "domain-3",
  "q-saa-35": "domain-3",
  "q-saa-36": "domain-1",
  "q-saa-37": "domain-2",
  "q-saa-38": "domain-3",
  "q-saa-39": "domain-2",
  "q-saa-40": "domain-1",
  "q-saa-41": "domain-3",
  "q-saa-42": "domain-4",
  "q-saa-43": "domain-3",
  "q-saa-44": "domain-4",
  "q-saa-45": "domain-4",
  "q-saa-46": "domain-1",
  "q-saa-47": "domain-1",
  "q-saa-48": "domain-1",
  "q-saa-49": "domain-1",
  "q-saa-50": "domain-1",
  "q-saa-51": "domain-1",
  "q-saa-52": "domain-1",
  "q-saa-53": "domain-1",
  "q-saa-54": "domain-4",
  "q-saa-55": "domain-1",
  "q-saa-56": "domain-4",
  "q-saa-57": "domain-3",
  "q-saa-58": "domain-1",
  "q-saa-59": "domain-2",
  "q-saa-60": "domain-1",
  "q-saa-61": "domain-4",
  "q-saa-62": "domain-1",
  "q-saa-63": "domain-3",
  "q-saa-64": "domain-3",
  "q-saa-65": "domain-2",
  "q-saa-66": "domain-1",
  "q-saa-67": "domain-3",
  "q-saa-68": "domain-1",
  "q-saa-69": "domain-1",
  "q-saa-70": "domain-2",
  "q-saa-71": "domain-1",
  "q-saa-72": "domain-3",
  "q-saa-73": "domain-3",
  "q-saa-74": "domain-1",
  "q-saa-75": "domain-3",
  "q-saa-76": "domain-3",
  "q-saa-77": "domain-2",
  "q-saa-78": "domain-3",
  "q-saa-79": "domain-3",
  "q-saa-80": "domain-2",
  "q-saa-81": "domain-3",
  "q-saa-82": "domain-2",
  "q-saa-83": "domain-2",
  "q-saa-84": "domain-2",
  "q-saa-85": "domain-2",
  "q-saa-86": "domain-2",
  "q-saa-87": "domain-2",
  "q-saa-88": "domain-2",
  "q-saa-89": "domain-3",
  "q-saa-90": "domain-3",
  "q-saa-91": "domain-2",
  "q-saa-92": "domain-2",
  "q-saa-93": "domain-2",
  "q-saa-94": "domain-3",
  "q-saa-95": "domain-3",
  "q-saa-96": "domain-2",
  "q-saa-97": "domain-2",
  "q-saa-98": "domain-2",
  "q-saa-99": "domain-3",
  "q-saa-100": "domain-3",
  "q-saa-101": "domain-2",
  "q-saa-102": "domain-3",
  "q-saa-103": "domain-3",
  "q-saa-104": "domain-3",
  "q-saa-105": "domain-3",
  "q-saa-106": "domain-2",
  "q-saa-107": "domain-2",
  "q-saa-108": "domain-3",
  "q-saa-109": "domain-2",
  "q-saa-110": "domain-3",
  "q-saa-111": "domain-3",
  "q-saa-112": "domain-3",
  "q-saa-113": "domain-3",
  "q-saa-114": "domain-3",
  "q-saa-115": "domain-3",
  "q-saa-116": "domain-2",
  "q-saa-117": "domain-3",
  "q-saa-118": "domain-3",
  "q-saa-119": "domain-3",
  "q-saa-120": "domain-3",
  "q-saa-121": "domain-3",
  "q-saa-122": "domain-3",
  "q-saa-123": "domain-3",
  "q-saa-124": "domain-3",
  "q-saa-125": "domain-3",
  "q-saa-126": "domain-3",
  "q-saa-127": "domain-4",
  "q-saa-128": "domain-4",
  "q-saa-129": "domain-4",
  "q-saa-130": "domain-4",
  "q-saa-131": "domain-2",
  "q-saa-132": "domain-4",
  "q-saa-133": "domain-4",
  "q-saa-134": "domain-4",
  "q-saa-135": "domain-4",
  "q-saa-136": "domain-4",
  "q-saa-137": "domain-3",
  "q-saa-138": "domain-3",
  "q-saa-139": "domain-3",
  "q-saa-140": "domain-2",
  "q-saa-141": "domain-3",
  "q-saa-142": "domain-3",
  "q-saa-143": "domain-1",
  "q-saa-144": "domain-2",
  "q-saa-145": "domain-2",
  "q-saa-146": "domain-3",
  "q-saa-147": "domain-1",
  "q-saa-148": "domain-3",
  "q-saa-149": "domain-1",
  "q-saa-150": "domain-3",
  "q-saa-151": "domain-1",
  "q-saa-152": "domain-1",
  "q-saa-153": "domain-1",
  "q-saa-154": "domain-1",
  "q-saa-155": "domain-1",
  "q-saa-156": "domain-1",
  "q-saa-157": "domain-1",
  "q-saa-158": "domain-1",
  "q-saa-159": "domain-1",
  "q-saa-160": "domain-1",
  "q-saa-161": "domain-1",
  "q-saa-162": "domain-1",
  "q-saa-163": "domain-1",
  "q-saa-164": "domain-1",
  "q-saa-165": "domain-1",
  "q-saa-166": "domain-2",
  "q-saa-167": "domain-2",
  "q-saa-168": "domain-2",
  "q-saa-169": "domain-2",
  "q-saa-170": "domain-2",
  "q-saa-171": "domain-2",
  "q-saa-172": "domain-2",
  "q-saa-173": "domain-2",
  "q-saa-174": "domain-2",
  "q-saa-175": "domain-2",
  "q-saa-176": "domain-2",
  "q-saa-177": "domain-2",
  "q-saa-178": "domain-2",
  "q-saa-179": "domain-2",
  "q-saa-180": "domain-3",
  "q-saa-181": "domain-3",
  "q-saa-182": "domain-3",
  "q-saa-183": "domain-3",
  "q-saa-184": "domain-3",
  "q-saa-185": "domain-3",
  "q-saa-186": "domain-3",
  "q-saa-187": "domain-3",
  "q-saa-188": "domain-3",
  "q-saa-189": "domain-3",
  "q-saa-190": "domain-3",
  "q-saa-191": "domain-4",
  "q-saa-192": "domain-4",
  "q-saa-193": "domain-4",
  "q-saa-194": "domain-4",
  "q-saa-195": "domain-4",
  "q-saa-196": "domain-4",
  "q-saa-197": "domain-4",
  "q-saa-198": "domain-4",
  "q-saa-199": "domain-4",
  "q-saa-200": "domain-4",
  "q-saa-201": "domain-1",
  "q-saa-202": "domain-1",
  "q-saa-203": "domain-1",
  "q-saa-204": "domain-1",
  "q-saa-205": "domain-1",
  "q-saa-206": "domain-1",
  "q-saa-207": "domain-1",
  "q-saa-208": "domain-1",
  "q-saa-209": "domain-1",
  "q-saa-210": "domain-1",
  "q-saa-211": "domain-1",
  "q-saa-212": "domain-1",
  "q-saa-213": "domain-1",
  "q-saa-214": "domain-1",
  "q-saa-215": "domain-1",
  "q-saa-216": "domain-1",
  "q-saa-217": "domain-1",
  "q-saa-218": "domain-2",
  "q-saa-219": "domain-2",
  "q-saa-220": "domain-2",
  "q-saa-221": "domain-2",
  "q-saa-222": "domain-2",
  "q-saa-223": "domain-2",
  "q-saa-224": "domain-2",
  "q-saa-225": "domain-2",
  "q-saa-226": "domain-2",
  "q-saa-227": "domain-2",
  "q-saa-228": "domain-2",
  "q-saa-229": "domain-2",
  "q-saa-230": "domain-3",
  "q-saa-231": "domain-3",
  "q-saa-232": "domain-3",
  "q-saa-233": "domain-3",
  "q-saa-234": "domain-3",
  "q-saa-235": "domain-3",
  "q-saa-236": "domain-3",
  "q-saa-237": "domain-3",
  "q-saa-238": "domain-3",
  "q-saa-239": "domain-3",
  "q-saa-240": "domain-3",
  "q-saa-241": "domain-3",
  "q-saa-242": "domain-4",
  "q-saa-243": "domain-4",
  "q-saa-244": "domain-4",
  "q-saa-245": "domain-4",
  "q-saa-246": "domain-4",
  "q-saa-247": "domain-4",
  "q-saa-248": "domain-4",
  "q-saa-249": "domain-4",
  "q-saa-250": "domain-4",
  "q-saa-251": "domain-4",
  "q-saa-252": "domain-4",
  "q-saa-253": "domain-4",
  "q-saa-254": "domain-4",
  "q-saa-255": "domain-4",
  "q-saa-256": "domain-4",
  "q-saa-257": "domain-4",
  "q-saa-258": "domain-4",
  "q-saa-259": "domain-4",
  "q-saa-260": "domain-4",
  "q-saa-261": "domain-2",
  "q-saa-262": "domain-2",
  "q-saa-263": "domain-3",
  "q-saa-264": "domain-3",
  "q-saa-265": "domain-2",
  "q-saa-266": "domain-3",
  "q-saa-267": "domain-3",
  "q-saa-268": "domain-1",
  "q-saa-269": "domain-3",
  "q-saa-270": "domain-3"
};

/**
 * Topic ID to SAA-C03 Domain ID Mapping
 */
export const TOPIC_DOMAIN_MAP = {
  'topic-iam': 'domain-1',
  'topic-iam-identity-center': 'domain-1',
  'topic-kms': 'domain-1',
  'topic-secrets-manager': 'domain-1',
  'topic-waf': 'domain-1',
  'topic-shield': 'domain-1',
  'topic-guardduty': 'domain-1',
  'topic-inspector': 'domain-1',
  'topic-macie': 'domain-1',
  'topic-security-hub': 'domain-1',
  'topic-network-firewall': 'domain-1',
  'topic-cognito': 'domain-1',
  'topic-cloudtrail': 'domain-1',
  'topic-ssm-parameter-store': 'domain-1',
  'topic-lake-formation': 'domain-1',
  'topic-vpc': 'domain-2',
  'topic-elb': 'domain-2',
  'topic-ec2-asg': 'domain-2',
  'topic-rds': 'domain-2',
  'topic-aurora': 'domain-2',
  'topic-route53': 'domain-2',
  'topic-sqs': 'domain-2',
  'topic-sns': 'domain-2',
  'topic-eventbridge': 'domain-2',
  'topic-aws-backup': 'domain-2',
  'topic-vpn': 'domain-2',
  'topic-transit-gateway': 'domain-2',
  'topic-cloudformation': 'domain-2',
  'topic-mq': 'domain-2',
  'topic-ec2': 'domain-3',
  'topic-s3': 'domain-3',
  'topic-ebs': 'domain-3',
  'topic-efs': 'domain-3',
  'topic-fsx': 'domain-3',
  'topic-dynamodb': 'domain-3',
  'topic-elasticache': 'domain-3',
  'topic-cloudfront': 'domain-3',
  'topic-global-accelerator': 'domain-3',
  'topic-api-gateway': 'domain-3',
  'topic-lambda': 'domain-3',
  'topic-ecs': 'domain-3',
  'topic-eks': 'domain-3',
  'topic-fargate': 'domain-3',
  'topic-ecr': 'domain-3',
  'topic-redshift': 'domain-3',
  'topic-athena': 'domain-3',
  'topic-glue': 'domain-3',
  'topic-kinesis': 'domain-3',
  'topic-msk': 'domain-3',
  'topic-opensearch': 'domain-3',
  'topic-datasync': 'domain-3',
  'topic-storage-gateway': 'domain-3',
  'topic-snow-family': 'domain-3',
  'topic-dms': 'domain-3',
  'topic-mgn': 'domain-3',
  'topic-direct-connect': 'domain-3',
  'topic-privatelink': 'domain-3',
  'topic-step-functions': 'domain-3',
  'topic-ssm': 'domain-3',
  'topic-documentdb': 'domain-3',
  'topic-emr': 'domain-3',
  'topic-neptune': 'domain-3',
  'topic-quicksight': 'domain-3',
  'topic-transfer-family': 'domain-3',
  'topic-organizations': 'domain-4',
  'topic-budgets': 'domain-4',
  'topic-cost-explorer': 'domain-4',
  'topic-compute-optimizer': 'domain-4',
  'topic-trusted-advisor': 'domain-4',
  'topic-ram': 'domain-4',
  'topic-config': 'domain-4',
  'topic-control-tower': 'domain-4',
  'topic-cloudwatch': 'domain-4',
};

/**
 * Returns the single authoritative primary domain ID used for Full Mock
 * selection. If not explicitly mapped by question ID in QUESTION_DOMAIN_MAP,
 * falls back to resolving via topic ID mappings in TOPIC_DOMAIN_MAP.
 */
export function getPrimaryDomainIdForQuestion(q) {
  if (!q?.id) return null;
  if (QUESTION_DOMAIN_MAP[q.id]) {
    return QUESTION_DOMAIN_MAP[q.id];
  }
  if (q.topicId && TOPIC_DOMAIN_MAP[q.topicId]) {
    return TOPIC_DOMAIN_MAP[q.topicId];
  }
  if (Array.isArray(q.topics) && q.topics.length > 0) {
    for (const t of q.topics) {
      if (TOPIC_DOMAIN_MAP[t]) {
        return TOPIC_DOMAIN_MAP[t];
      }
    }
  }
  return null;
}

/**
 * Returns the domain object for results and diagnostics.
 */
export function getDomainForQuestion(q) {
  if (!q) return SAA_C03_DOMAINS[0];
  
  let domainId = getPrimaryDomainIdForQuestion(q);
  
  if (!domainId && q.topicId) {
    domainId = TOPIC_DOMAIN_MAP[q.topicId];
  }
  
  if (!domainId && Array.isArray(q.topics) && q.topics.length > 0) {
    for (const t of q.topics) {
      if (TOPIC_DOMAIN_MAP[t]) {
        domainId = TOPIC_DOMAIN_MAP[t];
        break;
      }
    }
  }
  
  return SAA_C03_DOMAINS.find(d => d.id === domainId) || SAA_C03_DOMAINS[0];
}
