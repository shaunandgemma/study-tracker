import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-19',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'WAF Logging',
  status: 'ready',
  plainEnglish: 'AWS WAF Logging captures comprehensive metadata about every HTTP and HTTPS web request evaluated by your Web ACL. Each log record contains rich inspection details: exact timestamp, client source IP address, country of origin, HTTP request method, URI path, query arguments, all request headers, the specific WAF rule that matched, the action taken (Allow, Block, Count, CAPTCHA, or Challenge), and rule labels. You can stream these logs in real time to three supported destinations: an Amazon CloudWatch Logs log group, an Amazon S3 bucket, or an Amazon Kinesis Data Firehose delivery stream.',
  whyItMatters: 'Security auditing, forensic threat investigation, compliance reporting (e.g., PCI DSS, SOC 2), and false-positive troubleshooting all require detailed visibility into web traffic. Without logging, security analysts cannot see the exact headers or query strings that triggered a block or investigate advanced multi-stage cyber attacks. WAF logging also enables log filtering and field redaction to protect sensitive user passwords and credit card numbers.',
  workplaceExample: 'A security operations center (SOC) enables AWS WAF logging on all production Web ACLs, directing log streams to Amazon Kinesis Data Firehose which partitions and delivers compressed parquet files into an Amazon S3 security data lake. Security engineers use Amazon Athena to run SQL queries across millions of web requests, discovering a distributed credential-stuffing attack targeting `/login` and identifying 300 compromised IP addresses within minutes.',
  examFocus: 'SAA-C03 core points: (1) Supported Destinations: Amazon CloudWatch Logs, Amazon S3, and Amazon Kinesis Data Firehose. (2) Destination Naming Requirements: CloudWatch Logs log groups must begin with `aws-waf-logs-`; S3 buckets must begin with `aws-waf-logs-`; Kinesis Data Firehose streams must begin with `aws-waf-logs-`. (3) Log Filtering: Can filter logs to record ONLY matching or non-matching requests (e.g., log only `BLOCK` actions to save storage costs). (4) Redacted Fields: Obfuscate sensitive request data (e.g., Authorization headers, cookies, query strings) before writing to logs.',
  keyPoints: [
    'Captures detailed Layer 7 request metadata: IP, URI, headers, matching rule, action taken, and labels.',
    'Streams logs to three supported destinations: Amazon CloudWatch Logs, Amazon S3, or Amazon Kinesis Data Firehose.',
    'Log destination resource names must strictly begin with the prefix `aws-waf-logs-`.',
    'Supports granular Log Filtering to write only specific actions (e.g., save only `BLOCK` actions to reduce cost).',
    'Provides Field Redaction to mask sensitive headers (e.g., `Authorization`), query strings, or cookie values.',
    'Enables interactive forensic analysis and automated threat hunting using Amazon Athena and OpenSearch.'
  ],
  commonMistake: 'Creating an Amazon S3 bucket or CloudWatch Logs log group without the mandatory `aws-waf-logs-` prefix (e.g., naming it `my-waf-audit-logs`). AWS WAF strictly enforces that destination resource names must begin with `aws-waf-logs-`, otherwise configuration will fail.',
  example: 'Configure full WAF logging to an Amazon S3 bucket with header redaction for the Authorization header: aws wafv2 put-logging-configuration --logging-configuration ResourceArn=arn:aws:wafv2:us-east-1:123456789012:regional/webacl/ProductionACL/id,LogDestinationConfigs=arn:aws:s3:::aws-waf-logs-production-security,RedactedFields=[{SingleHeader:{Name:"authorization"}}] --region us-east-1.',
  sources: [
    {
      title: 'Logging Web ACL Traffic Information in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/logging.html'
    },
    {
      title: 'Managing Logging Destinations and Redacted Fields in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/logging-destinations.html'
    }
  ]
});
