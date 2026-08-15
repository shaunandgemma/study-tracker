import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-11',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'Shield Advanced with Elastic Load Balancing',
  status: 'ready',
  plainEnglish: 'Shield Advanced with Elastic Load Balancing (ELB) protects Application Load Balancers (ALBs) and Network Load Balancers (NLBs) against complex HTTP/HTTPS floods and TCP/UDP connection attacks. When an ALB is protected by Shield Advanced, it gains automatic Layer 7 DDoS mitigation via AWS WAF and eligibility for DDoS Cost Protection if Auto Scaling instances surge due to attack traffic.',
  whyItMatters: 'Load balancers are the primary entry point for regional web applications. Protecting ALBs with Shield Advanced prevents web server pool crashes while ensuring scaling surge costs incurred during an attack are covered by AWS service credits.',
  workplaceExample: 'A SaaS provider protects their production Application Load Balancer with Shield Advanced. When a Layer 7 HTTP POST flood strikes the ALB, Shield Advanced automatically attaches rate-limiting WAF rules, protecting the backend EC2 target group.',
  examFocus: 'SAA-C03 ALB & NLB Protection Rules:\n- ALB Protection: Protects Application Load Balancers (Layer 7); integrates with AWS WAF for automatic L7 rule creation.\n- NLB Protection: Protects Network Load Balancers via underlying Elastic IP address protection.\n- Protection Groups: Group multiple ALBs (e.g. all regional frontends) for unified metric aggregation and false-positive reduction.',
  keyPoints: [
    'Protects Application Load Balancers (ALB) and Network Load Balancers (NLB) from targeted DDoS attacks.',
    'Provides automatic Layer 7 DDoS mitigation rules deployed directly onto associated AWS WAF web ACLs.',
    'Qualifies backend EC2 target group Auto Scaling surges for DDoS Cost Protection service credits.',
    'Supports Protection Groups to aggregate health metrics across multiple load balancers.',
    'Monitors HTTP request rates, error rates, and backend instance health.'
  ],
  commonMistake: 'Protecting an ALB with Shield Advanced but forgetting to attach an AWS WAF Web ACL to the ALB, preventing automatic Layer 7 rule creation.',
  example: 'Protecting an Application Load Balancer with Shield Advanced via AWS CLI:\naws shield create-protection --name "ALBFrontendProtection" --resource-arn "arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/prod-alb/1234567890abcdef"',
  sources: [
    { title: 'Protecting Elastic Load Balancers with AWS Shield Advanced', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html#ddos-advanced-elb' }
  ]
});
