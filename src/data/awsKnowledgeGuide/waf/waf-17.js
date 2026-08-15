import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-17',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'WAF on Application Load Balancer',
  status: 'ready',
  plainEnglish: 'Deploying AWS WAF on an Application Load Balancer (ALB) associates a Regional Web ACL directly with the load balancer in a specific AWS Region. The ALB evaluates incoming HTTP and HTTPS requests against the Web ACL before routing traffic to backend target groups (such as Amazon EC2 instances, Amazon ECS container tasks, or AWS Lambda functions). If WAF blocks a request, the ALB immediately returns an HTTP 403 Forbidden response without consuming backend compute capacity or database resources.',
  whyItMatters: 'Not all web applications or microservices use Amazon CloudFront; internal corporate applications, regional web APIs, and private administrative portals often face users directly through an internet-facing or internal ALB. Associating WAF directly with the ALB provides dedicated Layer 7 security inspection within the VPC boundary.',
  workplaceExample: 'A human resources SaaS provider hosts an internal payroll application behind an internet-facing Application Load Balancer in `eu-central-1`. The security team creates a regional Web ACL in Frankfurt and associates it with the ALB. The Web ACL blocks traffic from non-EU IP addresses, enforces rate-limiting on login forms, and blocks SQL injection payloads before the ALB routes traffic to the backend ECS Fargate container tasks.',
  examFocus: 'SAA-C03 core points: (1) Scope Requirement: Web ACLs attached to an ALB MUST be created with the Regional scope (`REGIONAL`) in the same AWS Region where the ALB is deployed. (2) Supported ALB Types: WAF integrates natively with Application Load Balancers (it does NOT integrate with Network Load Balancers or Gateway Load Balancers). (3) Direct Association: One Web ACL can be associated with multiple ALBs in the same region, but each ALB can only have one Web ACL attached at a time.',
  keyPoints: [
    'Attaches a Regional Web ACL directly to an Application Load Balancer (ALB).',
    'Inspects and filters HTTP/HTTPS requests before the ALB routes them to backend target groups.',
    'Protects backend Amazon EC2 instances, ECS containers, EKS pods, and Lambda targets.',
    'Requires the Web ACL to be created in the same AWS Region as the Application Load Balancer.',
    'AWS WAF supports Application Load Balancers only (not Network Load Balancers or Gateway Load Balancers).',
    'A single Regional Web ACL can be associated with multiple ALBs across the same AWS Region.'
  ],
  commonMistake: 'Attempting to attach AWS WAF directly to a Network Load Balancer (NLB). NLBs operate at Layer 4 (TCP/UDP) and do not support direct WAF integration. If you need Layer 7 WAF inspection, you must use an Application Load Balancer (ALB) or place CloudFront in front of the NLB.',
  example: 'Associate a regional Web ACL with an Application Load Balancer in the current region: aws wafv2 associate-web-acl --web-acl-arn arn:aws:wafv2:eu-west-1:123456789012:regional/webacl/Regional-App-Protection/98765432-abcd --resource-arn arn:aws:elasticloadbalancing:eu-west-1:123456789012:loadbalancer/app/production-alb/1234567890abcdef --region eu-west-1.',
  sources: [
    {
      title: 'Associating a Web ACL with an Application Load Balancer',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-associating-aws-resource.html'
    },
    {
      title: 'Application Load Balancer Security with AWS WAF',
      url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#listener-rules'
    }
  ]
});
