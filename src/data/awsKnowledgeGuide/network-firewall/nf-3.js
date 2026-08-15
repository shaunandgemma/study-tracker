import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-3",
  "title": "Outbound Domain / FQDN Filtering & Traffic Inspection",
  "plainEnglish": "Outbound Domain and Fully Qualified Domain Name (FQDN) Filtering in AWS Network Firewall allows you to restrict outbound internet traffic from your VPC instances to only approved domain names (an allowlist) or block access to known malicious domains (a denylist). The stateful engine inspects the plaintext Server Name Indication (SNI) extension during TLS handshakes (HTTPS) and the Host header in HTTP requests without requiring decryption proxies.",
  "whyItMatters": "Restricting egress traffic by IP addresses is ineffective because modern cloud SaaS platforms, software repositories, and CDNs use dynamic IP addresses that change constantly. Domain filtering allows security teams to enforce granular egress policies (e.g., allowing access only to `*.github.com` and `pypi.org` while blocking all other internet destinations) to prevent data exfiltration and malware command-and-control communication.",
  "workplaceExample": "A banking data science environment runs EC2 instances in a private subnet. The compliance policy requires that EC2 instances can only connect to approved Python package repositories. The cloud team creates a Domain List stateful rule group with an allowlist containing `.pypi.org` and `.pythonhosted.org`, configuring the policy to drop all other outbound HTTP/HTTPS connections. Attempts to connect to unapproved websites are dropped immediately at the firewall endpoint.",
  "examFocus": "Understand Domain List filtering mechanics: (1) Protocol Inspection: Inspects TLS SNI in HTTPS handshakes (TCP 443) and HTTP Host headers (TCP 80). (2) Domain Syntax: Supports exact FQDNs (e.g., `api.example.com`) and wildcard subdomains by prepending a dot (e.g., `.example.com` matches `example.com` and all subdomains like `auth.example.com`). (3) Action Types: Allowlist (allows listed domains, drops all others) and Denylist (blocks listed domains, allows others).",
  "keyPoints": [
    "Filters outbound HTTP and HTTPS connections based on domain names and FQDNs.",
    "Inspects the TLS Server Name Indication (SNI) extension during the initial TLS handshake.",
    "Inspects the HTTP 'Host' header for unencrypted HTTP traffic.",
    "Supports wildcard subdomain matching using a leading period (e.g., `.amazon.com` covers all subdomains).",
    "Supports Allowlist mode (strict egress control) and Denylist mode (threat blocking).",
    "Does not require customer-managed proxy servers or complex certificate deployment for standard SNI inspection."
  ],
  "commonMistake": "Assuming domain filtering can inspect specific full URL paths (e.g., `example.com/api/v1/download`) without TLS inspection. Standard domain filtering only inspects the TLS SNI or HTTP Host header (the domain name itself); inspecting full HTTPS URL paths requires AWS Network Firewall TLS Inspection with active decryption.",
  "example": "Configure a stateful domain allowlist rule group in JSON: {\"RuleGroupName\": \"ApprovedSaaSDomains\", \"RuleGroup\": {\"RulesSource\": {\"RulesSourceList\": {\"Targets\": [\".github.com\", \".npmjs.org\"], \"TargetTypes\": [\"TLS_SNI\", \"HTTP_HOST\"], \"GeneratedRulesType\": \"ALLOWLIST\"}}}}.",
  "sources": [
    {
      "title": "Stateful Domain Name Filtering in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups-domain-names.html"
    },
    {
      "title": "Domain Filtering Best Practices in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/domain-filtering.html"
    }
  ]
});
