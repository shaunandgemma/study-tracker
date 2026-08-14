import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-32',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront vs AWS Global Accelerator',
  status: 'ready',
  plainEnglish: 'Amazon CloudFront and AWS Global Accelerator are both networking services that utilize AWS edge locations and the AWS global network backbone to improve performance, but they operate differently:\n- CloudFront operates at Layer 7 (HTTP/HTTPS) and focuses on CONTENT CACHING, web acceleration, static/dynamic web traffic, and edge compute.\n- AWS Global Accelerator operates at Layer 3/4 (IP level) and provides STABLE STATIC IP ADDRESSES (Anycast IPs) that route TCP/UDP traffic across the AWS global backbone directly to regional endpoints (ALBs, NLBs, EC2, Elastic IPs) WITHOUT edge caching.',
  whyItMatters: 'Global Accelerator is essential for non-HTTP protocols (VoIP, gaming UDP, IoT, MQTT, raw TCP) or applications that require fixed, static IP addresses for client firewall allowlisting while still benefiting from AWS network routing acceleration.',
  workplaceExample: 'A multiplayer gaming platform routes UDP game state traffic to EC2 instances in multiple regions using AWS Global Accelerator for low-latency gaming connection with 2 static Anycast IPs. The same company uses CloudFront to serve its HTTP game launcher website and patch downloads with edge caching.',
  examFocus: 'SAA-C03 distinction table:\n- HTTP/HTTPS content, caching required, S3 origin, edge functions, WAF -> CloudFront.\n- Non-HTTP (UDP, TCP, VoIP, Gaming), static IP addresses required for firewall allowlisting, fast regional failover for NLB/EC2 -> AWS Global Accelerator.\n- Global Accelerator provides 2 static Anycast IP addresses that act as single fixed entry points globally.',
  keyPoints: [
    'CloudFront: Layer 7 (HTTP/HTTPS), edge caching, web content delivery.',
    'AWS Global Accelerator: Layer 3/4 (IP/TCP/UDP), NO edge caching, provides 2 static Anycast IPs.',
    'Global Accelerator accelerates non-HTTP protocols like gaming (UDP), VoIP, and IoT.',
    'Global Accelerator provides instant failover (<30 seconds) between AWS regions.',
    'CloudFront uses domain names (d123.cloudfront.net); Global Accelerator uses static IP addresses.'
  ],
  commonMistake: 'Choosing CloudFront for non-HTTP traffic like UDP gaming or custom TCP applications. CloudFront only supports HTTP/HTTPS/WebSocket protocols; AWS Global Accelerator supports all TCP and UDP traffic.',
  example: 'Architecture Choice:\nWeb Application (HTTP/HTTPS with Caching) -> CloudFront (`d123.cloudfront.net`)\nVoIP / Gaming Server (UDP / TCP with Static IPs) -> AWS Global Accelerator (`1.2.3.4`, `5.6.7.8`)',
  sources: [
    { title: 'What is Amazon CloudFront?', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html' }
  ]
});
