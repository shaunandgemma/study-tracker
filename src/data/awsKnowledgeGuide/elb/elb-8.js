import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-8",
  "title": "Classic Load Balancer - Legacy",
  "plainEnglish": "A Classic Load Balancer (CLB) is the previous generation of Elastic Load Balancing. It distributes traffic to registered EC2 instances and supports older HTTP, HTTPS, TCP, and SSL configurations, but AWS recommends migrating to a current-generation load balancer.",
  "whyItMatters": "Existing environments may still contain CLBs, so engineers must understand and maintain them safely. New designs normally gain better routing, target, scaling, and monitoring features from ALB, NLB, or GWLB.",
  "workplaceExample": "A company finds a CLB in front of a long-running EC2 application. The team inventories its listeners, health checks, certificates, and sticky sessions, then plans a tested migration to ALB.",
  "examFocus": "Treat CLB as legacy. For new architectures, select ALB for Layer 7 web routing, NLB for Layer 4 performance and static IP needs, or GWLB for appliances. Recognize CLB mainly in migration or older-architecture questions.",
  "keyPoints": [
    "CLB is the previous generation of Elastic Load Balancing.",
    "AWS recommends migration to a current-generation load balancer.",
    "A CLB listener forwards traffic directly to registered EC2 instances.",
    "CLB health checks prevent traffic from being sent to unhealthy registered instances.",
    "CLB supports HTTP, HTTPS, TCP, and SSL listener scenarios.",
    "Feature behavior differs from ALB and NLB, so migration requires configuration review and testing."
  ],
  "commonMistake": "Choosing CLB for a new workload because it supports both HTTP and TCP ignores AWS guidance and newer capabilities. Match the workload to ALB or NLB unless a documented legacy constraint applies.",
  "example": "Map a legacy CLB's listeners and instance health checks, create equivalent ALB target groups and rules, test through a temporary DNS name, and then perform a controlled DNS migration.",
  "sources": [
    {
      "title": "What is a Classic Load Balancer?",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/introduction.html"
    }
  ]
});
