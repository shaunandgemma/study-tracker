import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-26",
  "title": "ELB Certificates with AWS Certificate Manager",
  "plainEnglish": "AWS Certificate Manager (ACM) can issue or import the X.509 server certificates used by secure ALB HTTPS and NLB TLS listeners. The certificate proves the endpoint's identity and supplies the public key used to establish an encrypted connection.",
  "whyItMatters": "ACM integrates directly with Elastic Load Balancing and can automatically renew eligible ACM-issued certificates that remain in use, reducing certificate-expiry incidents and manual private-key handling.",
  "workplaceExample": "A team validates api.example.com in ACM, attaches the issued certificate to an ALB HTTPS listener, and uses Server Name Indication (SNI) to add another certificate for admin.example.com on the same listener.",
  "examFocus": "A secure listener needs a certificate whose domain matches the application DNS name. ACM certificates for regional load balancers must be in the same Region as the load balancer. Distinguish ACM-managed renewal from imported certificates, which the owner must renew and replace.",
  "keyPoints": [
    "ALB HTTPS and NLB TLS listeners require at least one server certificate.",
    "AWS recommends ACM for creating and deploying load-balancer certificates.",
    "The certificate domain or Subject Alternative Name must match the client-facing DNS name.",
    "A listener has one default certificate and can have a certificate list for multiple domains.",
    "SNI lets a load balancer select a matching certificate for capable clients.",
    "Eligible ACM-issued certificates deployed on a load balancer can be renewed automatically; imported certificates require owner-managed renewal."
  ],
  "commonMistake": "Requesting a certificate in the wrong Region or for a name that does not match the application's DNS record prevents correct listener use or browser validation. Check Region and names before deployment.",
  "example": "Request and DNS-validate an ACM certificate for api.example.com in the ALB's Region, attach it as the HTTPS listener's default certificate, and test its hostname and renewal status.",
  "sources": [
    {
      "title": "SSL certificates for an Application Load Balancer",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/https-listener-certificates.html"
    },
    {
      "title": "ACM integrated services",
      "url": "https://docs.aws.amazon.com/acm/latest/userguide/acm-services.html"
    }
  ]
});
