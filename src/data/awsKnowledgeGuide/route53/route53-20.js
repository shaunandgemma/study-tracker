import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-20",
  "title": "Route 53 Domain Registration",
  "plainEnglish": "Route 53 Domain Registration allows you to register, renew, and manage top-level domain names (such as `.com`, `.org`, `.net`, and geographic ccTLDs) directly within AWS. Route 53 acts as an ICANN-accredited domain registrar, allowing you to purchase new domains, transfer domains in from third-party registrars (like GoDaddy or Namecheap), enable automatic renewal, and configure privacy protection to mask your personal WHOIS contact information.",
  "whyItMatters": "Consolidating domain registration with DNS hosting inside AWS streamlines cloud operations, billing, and automation. When you register a domain with Route 53, AWS automatically creates a public hosted zone with matching authoritative name servers, eliminating manual name server configuration and reducing the risk of accidental domain expiration.",
  "workplaceExample": "A startup purchases `mycloudstartup.com` directly through the Amazon Route 53 console. Route 53 registers the domain, applies free WHOIS Privacy Protection to conceal the founders' personal contact details, enables automatic annual renewal, and automatically provisions a public hosted zone in Route 53 with 4 pre-configured authoritative name servers.",
  "examFocus": "Understand Domain Registration vs DNS Hosting: (1) Separate Services: Registering a domain (Registrar) and managing DNS records (Hosted Zones) are independent functions. You can register a domain in Route 53 and host DNS elsewhere, or register with a third party and host DNS in Route 53. (2) Privacy Protection: Route 53 provides free WHOIS privacy protection for supported TLDs. (3) Transfer Lock: Automatically enabled to prevent unauthorized domain transfers.",
  "keyPoints": [
    "ICANN-accredited registrar service for purchasing, renewing, and transferring domain names.",
    "Supports hundreds of generic (gTLDs) and country-code (ccTLDs) top-level domains.",
    "Provides free WHOIS Privacy Protection on all supported top-level domains.",
    "Automatically creates a matching Public Hosted Zone when a new domain is registered.",
    "Domain registration is completely separate from DNS record hosting.",
    "Supports domain transfer locks and automated annual renewal to prevent domain loss."
  ],
  "commonMistake": "Assuming that registering a domain with a third-party registrar prevents using Route 53 for DNS hosting. You can host DNS records in a Route 53 Public Hosted Zone for ANY domain registered at any registrar simply by updating the registrar's Name Server (NS) records to Route 53's 4 name servers.",
  "example": "Register a new domain with auto-renewal and privacy protection via the AWS CLI: aws route53domains register-domain --domain-name examplecorp.com --duration-in-years 1 --auto-renew --admin-contact file://contact.json --registrant-contact file://contact.json --tech-contact file://contact.json --privacy-protect-admin-contact --privacy-protect-registrant-contact.",
  "sources": [
    {
      "title": "Registering Domain Names Using Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/registrar.html"
    },
    {
      "title": "Registering a New Domain in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html"
    }
  ]
});
