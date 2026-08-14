import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-26',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'IMDSv2',
  status: 'ready',
  plainEnglish: 'IMDSv2 (Instance Metadata Service Version 2) is an enhanced, session-oriented version of the Instance Metadata Service. While IMDSv1 allowed fetching metadata using simple, unauthenticated HTTP GET requests, IMDSv2 requires requesting a session token first via an HTTP PUT request with a custom header (`X-aws-ec2-metadata-token-ttl-seconds`). This token is then used in subsequent GET requests to retrieve metadata, protecting instances against Server-Side Request Forgery (SSRF) vulnerabilities.',
  whyItMatters: 'Web applications with SSRF vulnerabilities allow attackers to trick a web server into making HTTP requests. Under IMDSv1, an attacker could steal temporary IAM credentials from `169.254.169.254`. IMDSv2 neutralizes SSRF attacks because web proxies and WAFs block HTTP PUT requests with custom headers.',
  workplaceExample: 'A security engineer mandates IMDSv2 across all corporate EC2 instances using AWS Config rule `ec2-imdsv2-check` and sets `HttpTokens=required`. An attacker attempting an SSRF exploit on a web application is unable to retrieve IAM credentials because the exploit cannot issue the required PUT request for a session token.',
  examFocus: 'SAA-C03 security rule:\n- IMDSv2 requires 2 steps:\n  1. `PUT http://169.254.169.254/latest/api/token` with header `X-aws-ec2-metadata-token-ttl-seconds: 21600` to get a Token.\n  2. `GET http://169.254.169.254/latest/meta-data/` with header `X-aws-ec2-metadata-token: <TOKEN>`.\n- Enforce IMDSv2 by setting `HttpTokens: required` on EC2 launch templates.',
  keyPoints: [
    'Session-oriented defense-in-depth security enhancement for IMDS.',
    'Requires an HTTP PUT request to generate a temporary session token.',
    'Protects against Server-Side Request Forgery (SSRF) data exfiltration attacks.',
    'AWS security best practice: disable IMDSv1 and mandate IMDSv2 (`HttpTokens=required`).',
    'Supported by all modern AWS SDKs and AWS CLI tools.'
  ],
  commonMistake: 'Believing IMDSv1 is secure because `169.254.169.254` is a private IP. Open SSRF vulnerabilities in web applications allow external attackers to read IMDSv1 metadata remotely unless IMDSv2 is enforced.',
  example: 'IMDSv2 Shell Commands:\n`TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")`\n`curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id`',
  sources: [
    { title: 'Configure the instance metadata service', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html' }
  ]
});
