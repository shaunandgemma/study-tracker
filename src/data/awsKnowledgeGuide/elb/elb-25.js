import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-25",
  "title": "TLS Termination",
  "plainEnglish": "Transport Layer Security (TLS) termination means the load balancer completes the encrypted client connection, presents a server certificate, and decrypts the traffic before applying routing or forwarding it to a target.",
  "whyItMatters": "Termination centralizes certificate handling and removes encryption work from application servers. Teams can still configure HTTPS or TLS again on the target side when back-end encryption is required.",
  "workplaceExample": "An ALB accepts HTTPS on port 443 using an ACM certificate, decrypts requests, applies path rules, and forwards HTTP to private web targets whose security group accepts traffic only from the ALB.",
  "examFocus": "An ALB HTTPS listener and NLB TLS listener terminate TLS. A certificate and security policy are required. For pass-through encryption to targets, use an NLB TCP listener instead of a terminating TLS listener.",
  "keyPoints": [
    "TLS termination creates separate client-to-load-balancer and load-balancer-to-target connections.",
    "The secure listener needs at least one server certificate.",
    "The listener security policy controls supported TLS protocols and ciphers.",
    "ALB can inspect HTTP content only after terminating client HTTPS.",
    "Back-end traffic can be unencrypted or encrypted according to the target-group protocol.",
    "NLB TCP on port 443 can pass encrypted bytes through without terminating TLS."
  ],
  "commonMistake": "Assuming HTTPS to the load balancer automatically means encryption to the targets is incorrect. Configure an HTTPS target group separately if compliance requires encryption on both connection legs.",
  "example": "Create an ALB HTTPS listener with an ACM certificate and current security policy, forward to an HTTPS target group, and confirm target certificates and security-group rules support the back-end connection.",
  "sources": [
    {
      "title": "Create an HTTPS listener for an Application Load Balancer",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html"
    },
    {
      "title": "Listeners for Network Load Balancers",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html"
    }
  ]
});
