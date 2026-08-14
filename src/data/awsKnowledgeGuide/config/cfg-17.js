import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-17',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'AWS Config vs CloudTrail',
  status: 'ready',
  plainEnglish: 'AWS Config and AWS CloudTrail are complementary auditing services in AWS, but they record fundamentally different data:\n- AWS CloudTrail records API CALLS and USER ACTIVITY ("WHO made the request, WHEN, from WHICH IP, and WHAT API action was called?").\n- AWS Config records RESOURCE CONFIGURATION STATES and COMPLIANCE ("WHAT does the resource look like NOW, WHAT did it look like in the past, and IS IT COMPLIANT with rules?").',
  whyItMatters: 'Using both services together provides a complete audit trail. If AWS Config detects that an S3 bucket became public at 2:00 PM, you use CloudTrail logs to search for the exact PutBucketAcl API call made at 2:00 PM to identify the IAM user responsible.',
  workplaceExample: 'During a security incident investigation:\n1. AWS Config shows that Security Group sg-123 had SSH port 22 opened to 0.0.0.0/0 at 14:05 UTC.\n2. AWS CloudTrail logs reveal that IAM user admin-john called AuthorizeSecurityGroupIngress from IP 198.51.100.4 at 14:05 UTC.',
  examFocus: 'SAA-C03 comparison questions:\n- Choose CloudTrail when asked to audit API calls, user actions, IAM identity tracking, or API history.\n- Choose AWS Config when asked to track resource inventory, history of configuration changes, compliance against rules, or resource relationship topology.',
  keyPoints: [
    'CloudTrail: Audits API events, user actions, and API call history ("Who & When").',
    'AWS Config: Audits resource state, configuration relationships, and compliance rules ("What & State").',
    'CloudTrail tells you WHO modified a resource; AWS Config tells you WHAT changed in the resource state.',
    'Both services store audit logs in Amazon S3 for long-term retention.',
    'Combining CloudTrail and AWS Config provides complete visibility for security forensics.'
  ],
  commonMistake: 'Looking in CloudTrail to see the current rules configured on a Security Group, or looking in AWS Config to find the IP address of the user who deleted an S3 bucket.',
  example: 'Security Audit Pairing:\nQuestion 1: "What are all the rules on sg-123 over the last 30 days?" -> AWS Config.\nQuestion 2: "Who added port 22 to sg-123 on Tuesday?" -> AWS CloudTrail.',
  sources: [
    { title: 'What is AWS Config?', url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html' }
  ]
});
