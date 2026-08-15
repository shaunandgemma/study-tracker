import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-31",
  "title": "Load Balancer Integration with Auto Scaling",
  "plainEnglish": "An Amazon EC2 Auto Scaling group can be attached to an ELB target group. Auto Scaling registers newly launched instances and deregisters terminated instances, while the load balancer sends traffic only to registered healthy capacity.",
  "whyItMatters": "The combination adjusts application capacity while keeping one stable client endpoint. Health checks and deregistration help remove failed or scaling-in instances without manual target registration.",
  "workplaceExample": "A web Auto Scaling group spans three Availability Zones and attaches to an ALB target group. A target-tracking policy adds instances as request load rises, and new instances receive traffic after passing health checks.",
  "examFocus": "For ALB, NLB, or GWLB integration, attach the target group to the Auto Scaling group, not the listener directly. ELB health checks can be included in Auto Scaling health evaluation, and target-tracking policies can use supported load-balancer metrics.",
  "keyPoints": [
    "Auto Scaling automatically registers launched instances with attached target groups.",
    "Auto Scaling automatically deregisters instances that are terminated.",
    "The load balancer distributes traffic only to targets that satisfy its health checks.",
    "The Auto Scaling group and target group must use compatible networking and target settings.",
    "Enabling ELB health checks lets Auto Scaling consider load-balancer-reported health.",
    "Deregistration delay and instance lifecycle timing should allow in-flight work to finish during scale-in."
  ],
  "commonMistake": "Attaching a target group but leaving the application blocked by security groups or failing health checks produces running instances that receive no traffic. Validate readiness end to end.",
  "example": "Attach an ALB target group to a multi-zone Auto Scaling group, enable ELB health checks with a suitable grace period, and use an ALB request-count-per-target policy to scale tested capacity.",
  "sources": [
    {
      "title": "Attach an Elastic Load Balancing load balancer to an Auto Scaling group",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html"
    }
  ]
});
