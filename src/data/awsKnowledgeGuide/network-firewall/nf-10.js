import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-10",
  "title": "Domain List Filtering",
  "plainEnglish": "Domain List Filtering is a specialized stateful rule group type in AWS Network Firewall that inspects and filters outbound HTTP and HTTPS traffic based on target domain names and Fully Qualified Domain Names (FQDNs). The firewall inspects unencrypted TLS Server Name Indication (SNI) extensions during HTTPS handshakes and HTTP Host headers, matching them against your configured domain allowlists or denylists without requiring SSL/TLS decryption certificates.",
  "whyItMatters": "Hardcoding IP addresses in firewall rules to restrict internet access is impractical because cloud services and SaaS APIs utilize dynamic, constantly shifting IP addresses. Domain list filtering allows organizations to enforce zero-trust egress security, permitting outbound connections strictly to approved vendor domains while blocking all unauthorized internet destinations.",
  "workplaceExample": "A financial data-processing application in a private VPC must communicate with an external credit bureau API (`api.creditbureau.com`) and AWS S3 endpoints. The security architect configures a Domain List rule group with an allowlist containing `api.creditbureau.com` and `.amazonaws.com`. Any attempt by malware or compromised workloads to connect to unauthorized external servers is blocked at the firewall endpoint and logged to CloudWatch.",
  "examFocus": "Understand domain list configuration specifics: (1) Target Types: `TLS_SNI` (port 443 HTTPS) and `HTTP_HOST` (port 80 HTTP). (2) Matching Syntax: Exact domain match (e.g., `example.com`) or wildcard subdomain matching by prefixing a dot (e.g., `.example.com` matches `example.com`, `api.example.com`, `auth.example.com`). (3) Generated Rules Types: `ALLOWLIST` (allows listed domains, drops all others) vs `DENYLIST` (blocks listed domains, allows others).",
  "keyPoints": [
    "Stateful rule group specialized for filtering outbound HTTP (Host header) and HTTPS (TLS SNI).",
    "Does not require TLS decryption keys or custom client certificate deployment for standard SNI inspection.",
    "Supports exact domain names and wildcard subdomains using leading dot notation (e.g., `.github.com`).",
    "ALLOWLIST mode permits listed domains and blocks all other outbound web traffic.",
    "DENYLIST mode blocks listed malicious domains while allowing all other web traffic.",
    "Can be paired with Suricata rule groups in the same firewall policy for layered egress defense."
  ],
  "commonMistake": "Omitting the leading period when intending to match subdomains (e.g., writing `example.com` instead of `.example.com`). Without the leading period, the rule matches only the apex domain `example.com` and fails to match subdomains like `api.example.com`.",
  "example": "Configure a stateful domain list allowlist rule group via the AWS CLI: aws network-firewall create-rule-group --rule-group-name EgressAllowlist --type STATEFUL --capacity 100 --rule-group '{\"RulesSource\":{\"RulesSourceList\":{\"Targets\":[\".aws.amazon.com\",\".github.com\"],\"TargetTypes\":[\"TLS_SNI\",\"HTTP_HOST\"],\"GeneratedRulesType\":\"ALLOWLIST\"}}}'.",
  "sources": [
    {
      "title": "Stateful Domain Name Filtering in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups-domain-names.html"
    },
    {
      "title": "Filtering Domains in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/domain-filtering.html"
    }
  ]
});
