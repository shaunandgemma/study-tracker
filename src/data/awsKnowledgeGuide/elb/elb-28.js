import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-28",
  "title": "Load Balancer Security Groups",
  "plainEnglish": "A security group is a stateful virtual firewall for supported load balancers and their targets. Load-balancer rules control allowed client and outbound target traffic; target rules should permit the application and health-check ports from the load balancer.",
  "whyItMatters": "Separating load-balancer and target security groups lets clients reach only the front door while preventing direct access to application instances.",
  "workplaceExample": "An internet-facing ALB security group accepts HTTPS from the internet. Its targets accept port 8080 and the health-check port only when the source is the ALB security group.",
  "examFocus": "For ALB, allow inbound listener traffic and outbound application plus health-check traffic. Reference the load-balancer security group in target ingress rules. NLB now supports security groups, but one must be associated at creation if security groups are to be used later.",
  "keyPoints": [
    "Security groups are stateful, so response traffic is automatically allowed for established flows.",
    "The load-balancer group needs inbound rules for intended listener ports and client sources.",
    "Outbound rules must allow the target application and health-check ports.",
    "Target groups should allow inbound traffic from the load-balancer security group rather than broad internet ranges.",
    "A Network Load Balancer created without a security group cannot have one associated later.",
    "NLB health checks are subject to outbound, but not inbound, NLB security-group rules."
  ],
  "commonMistake": "Opening only the listener port while blocking the health-check port makes targets unhealthy. Verify both the client-facing path and load-balancer-to-target path.",
  "example": "Attach a security group allowing public HTTPS to an ALB, allow outbound TCP 8080 to the target group, and configure target ingress on 8080 with the ALB security group as source.",
  "sources": [
    {
      "title": "Security groups for Application Load Balancers",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-update-security-groups.html"
    },
    {
      "title": "Security groups for Network Load Balancers",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-security-groups.html"
    }
  ]
});
