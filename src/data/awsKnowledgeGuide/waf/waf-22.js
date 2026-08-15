import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-22',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'WAF Layer 7 Protection',
  status: 'ready',
  plainEnglish: 'Layer 7 Protection in AWS WAF refers specifically to inspecting, filtering, and enforcing security policies at the Application Layer of the Open Systems Interconnection (OSI) model. While lower-level networking controls (like VPC Security Groups and Network ACLs) only evaluate packet headers for IP addresses and TCP/UDP port numbers, AWS WAF terminates and reassembles HTTP and HTTPS requests to examine their actual semantic meaning—such as request methods, URL paths, query parameters, cookie tokens, JSON/XML bodies, content encoding, and application headers.',
  whyItMatters: 'Modern web application exploits and bot attacks operate completely over legitimate Layer 4 TCP connections (e.g., standard port 443 with valid TLS handshakes). To a Security Group or Network ACL, a SQL injection payload or a credential-stuffing request looks like normal, authorized HTTPS traffic. Layer 7 inspection is mandatory to recognize malicious patterns inside the HTTP payload, stop business logic abuse, and protect web services from application-level degradation.',
  workplaceExample: 'An API gateway exposes a public endpoint `/v1/orders`. All traffic arrives over port 443, so Security Groups pass 100% of the packets. AWS WAF evaluates the Layer 7 contents of incoming requests: it enforces that the `Content-Type` header must be `application/json`, verifies that the request body does not exceed 16 KB, checks that the body JSON does not contain SQL injection fragments, and challenges requests with unusual client header fingerprints using silent JavaScript verification.',
  examFocus: 'SAA-C03 core points: (1) OSI Layer Distinction: Security Groups / Network ACLs = Layer 3/4 (IP address, protocol, port number); AWS Network Firewall = Layer 3–7 stateful packet stream inspection; AWS WAF = Layer 7 HTTP/HTTPS request semantic inspection. (2) Deep Payload Inspection: Ability to inspect specific JSON fields, multipart form bodies, cookies, and individual headers. (3) Request Modification: Can insert custom request headers into allowed traffic or customize block responses with specific HTTP status codes (e.g., 403, 404, 429) and custom error payloads.',
  keyPoints: [
    'Inspects application-layer (HTTP/HTTPS) web request semantics at Layer 7 of the OSI model.',
    'Examines HTTP request methods, URI paths, query strings, headers, cookies, and JSON/XML bodies.',
    'Stops attacks that operate over valid TCP/TLS connections (e.g., SQLi, XSS, CSRF, credential stuffing).',
    'Complements Layer 3/4 controls (Security Groups, NACLs) to form multi-layered defense-in-depth.',
    'Provides advanced payload inspection: JSON path matching, body size constraints, and header validation.',
    'Can insert custom HTTP headers on allowed traffic and return custom status codes on blocked traffic.'
  ],
  commonMistake: 'Believing that configuring strict Security Group rules (e.g., only allowing ports 80 and 443) provides application security. Security groups only ensure that traffic arrives on ports 80/443; they do not inspect what is inside the HTTP packet. AWS WAF is required for Layer 7 application payload inspection.',
  example: 'Configure a Layer 7 rule that rejects any POST request whose body size exceeds 8 KB on the search endpoint: {"Name": "EnforceSearchBodySizeLimit", "Priority": 5, "Statement": {"AndStatement": {"Statements": [{"ByteMatchStatement": {"SearchString": "/search", "FieldToMatch": {"UriPath": {}}, "TextTransformations": [{"Priority": 0, "Type": "LOWERCASE"}], "PositionalConstraint": "EXACTLY"}}, {"SizeConstraintStatement": {"FieldToMatch": {"Body": {}}, "ComparisonOperator": "GT", "Size": 8192, "TextTransformations": [{"Priority": 0, "Type": "NONE"}]}}]}}, "Action": {"Block": {}}, "VisibilityConfig": {"SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "EnforceSearchBodyLimit"}}.',
  sources: [
    {
      title: 'How AWS WAF Works at Layer 7',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works.html'
    },
    {
      title: 'Protecting Web Applications with AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html'
    }
  ]
});
