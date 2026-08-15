import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-9",
  "title": "Load Balancer Listeners",
  "plainEnglish": "A listener is the load balancer process that accepts client connections on a configured protocol and port. Its default action, and for an ALB any additional rules, decide what happens to matching traffic.",
  "whyItMatters": "A load balancer cannot receive traffic without a listener. Listener configuration defines the public entry point, encryption behavior, and first routing decision, so an incorrect port, protocol, certificate, or rule can make healthy targets unreachable.",
  "workplaceExample": "An ALB has a port 80 HTTP listener that redirects clients to HTTPS and a port 443 HTTPS listener that forwards requests to the application target group after terminating TLS.",
  "examFocus": "Separate listener settings from target-group settings. The listener handles client-side protocol and port; the target group controls target-side protocol, port, health checks, and registered targets. ALB listeners use ordered rules plus a default rule.",
  "keyPoints": [
    "Every load balancer needs at least one listener to accept traffic.",
    "A listener is defined by a protocol and port.",
    "Each listener has a default action that handles traffic not matched elsewhere.",
    "ALB listener rules contain priorities, conditions, and actions.",
    "An HTTPS or TLS listener needs at least one server certificate.",
    "Security groups and network paths must allow both client-to-load-balancer and load-balancer-to-target traffic."
  ],
  "commonMistake": "Opening port 443 in a security group without creating a port 443 listener does not make HTTPS work. The listener, certificate, routing action, and target connectivity must all be configured.",
  "example": "Add an ALB HTTP listener that redirects to HTTPS:443, then add an HTTPS listener with an ACM certificate and a default forward action to the web target group.",
  "sources": [
    {
      "title": "Listeners for Application Load Balancers",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html"
    }
  ]
});
