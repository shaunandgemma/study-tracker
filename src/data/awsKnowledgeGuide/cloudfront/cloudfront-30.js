import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-30',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Access Logs',
  status: 'ready',
  plainEnglish: 'CloudFront Access Logs provide detailed log records for every user request delivered by your CloudFront distribution. CloudFront offers two logging options: Standard Logs (which writes W3C extended log files stored in an Amazon S3 bucket) and Real-time Logs (which delivers log records within seconds to an Amazon Kinesis Data Stream). Access logs contain details like viewer IP address, request timestamp, edge location ID, HTTP status code, URI stem, user agent, and cache result (Hit/Miss).',
  whyItMatters: 'Access logs are essential for security auditing, compliance monitoring, troubleshooting 4xx/5xx errors, calculating cache hit ratios, and analyzing geographic user traffic patterns.',
  workplaceExample: 'A security team uses CloudFront Standard Access Logs delivered to an S3 bucket. They set up AWS Athena to query the logs and detect brute-force login attempts or identify which geographic IPs are generating abnormal 403 Forbidden spikes.',
  examFocus: 'SAA-C03 logging scenarios:\n- Standard Access Logs: Delivered to S3 bucket in W3C format; minimal cost, delivered within minutes/hours. Use for historical analysis with Athena.\n- Real-time Logs: Delivered in seconds to Kinesis Data Streams; customizable fields and sampling rates. Use for real-time security dashboards and SIEM alerting.',
  keyPoints: [
    'Standard Logs deliver W3C format files to an S3 bucket of your choice.',
    'Real-time Logs deliver log records within seconds to Amazon Kinesis Data Streams.',
    'Logs capture viewer IP, HTTP status, request path, referrer, user agent, and cache status.',
    'Athena can be used to run SQL queries directly over standard log files stored in S3.',
    'No extra CloudFront charge for standard logging (only standard S3 storage fees).'
  ],
  commonMistake: 'Forgetting to give CloudFront log delivery permissions on the destination S3 bucket. The destination bucket policy or ACL must grant CloudFront write permissions to deliver log files.',
  example: 'Athena Query over CloudFront Logs in S3:\n`SELECT date, time, x_edge_location, c_ip, cs_method, cs_uri_stem, sc_status FROM cloudfront_logs WHERE sc_status = 503 ORDER BY date DESC LIMIT 100;`',
  sources: [
    { title: 'Configuring and using standard logs (access logs)', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html' }
  ]
});
