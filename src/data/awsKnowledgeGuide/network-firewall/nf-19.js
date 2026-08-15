import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-19",
  "title": "Network Firewall vs AWS WAF",
  "plainEnglish": "AWS Network Firewall and AWS WAF (Web Application Firewall) are both security services designed to inspect and filter network traffic, but they operate at different layers of the cloud architecture. AWS WAF is a specialized Layer 7 Web Application Firewall attached directly to application ingress resources (Application Load Balancers, Amazon CloudFront, Amazon API Gateway, AWS AppSync, and Amazon Cognito) to block web application exploits like SQL injection, Cross-Site Scripting (XSS), and bot attacks. AWS Network Firewall is an inline VPC network firewall that inspects all IP protocols (TCP, UDP, ICMP, DNS) at the VPC boundary.",
  "whyItMatters": "Deploying the wrong tool for the job leaves critical security blind spots. AWS WAF only understands HTTP and HTTPS web traffic terminating at specific AWS application endpoints. Non-HTTP traffic (such as database connections, FTP, DNS, SMTP, or non-web TCP/UDP protocols) and outbound egress traffic bypassing load balancers cannot be protected by AWS WAF; they require AWS Network Firewall.",
  "workplaceExample": "An enterprise web application deploys both services: AWS WAF is attached to an external Application Load Balancer to inspect HTTP/HTTPS POST and GET requests for SQL injection, Cross-Site Scripting, and credential stuffing attacks. Concurrently, AWS Network Firewall is deployed at the VPC boundary to inspect all outbound egress traffic from backend EC2 instances, ensuring instances cannot communicate with botnet command-and-control servers or exfiltrate data over non-HTTP protocols.",
  "examFocus": "Compare AWS Network Firewall vs AWS WAF for certification exams: (1) Scope & Attachment: AWS WAF attaches to CloudFront, ALB, API Gateway, AppSync, Cognito; Network Firewall attaches to VPC Route Tables. (2) Protocol Support: AWS WAF = HTTP and HTTPS only; Network Firewall = All IP protocols (TCP, UDP, ICMP, DNS, FTP, etc.). (3) Traffic Direction: AWS WAF = Inbound web application traffic; Network Firewall = Inbound (Ingress), Outbound (Egress), and Inter-VPC (East-West). (4) Inspection: WAF focuses on OWASP Top 10 web exploits and bot management; Network Firewall focuses on IDS/IPS Suricata threat signatures and FQDN egress filtering.",
  "keyPoints": [
    "AWS WAF operates at Layer 7 attached to ALB, CloudFront, API Gateway, and AppSync.",
    "AWS Network Firewall operates at Layers 3–7 attached to VPC route tables.",
    "AWS WAF is designed exclusively for HTTP/HTTPS web application protection (OWASP Top 10, SQLi, XSS, rate-limiting).",
    "AWS Network Firewall inspects all IP protocols (TCP, UDP, ICMP, DNS, SSH, FTP, custom protocols).",
    "Network Firewall provides bidirectional inspection (Ingress, Egress, and East-West VPC-to-VPC).",
    "Best practice is layered defense: AWS WAF at application entry points, Network Firewall at the VPC perimeter."
  ],
  "commonMistake": "Attempting to use AWS WAF to inspect or block non-HTTP network protocols (such as raw TCP database connections, DNS queries, or outbound SSH). AWS WAF only operates on HTTP/HTTPS requests terminating at supported web entry points; all general network protocol inspection requires AWS Network Firewall.",
  "example": "Use AWS WAF on an Application Load Balancer to block SQL injection attempts in HTTP request parameters; use AWS Network Firewall in VPC route tables to inspect backend database servers and prevent outbound malware beaconing over custom TCP ports.",
  "sources": [
    {
      "title": "What is AWS WAF?",
      "url": "https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html"
    },
    {
      "title": "AWS Network Firewall Overview and Features",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html"
    }
  ]
});
