import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-8",
  "title": "DNS Record Types - A, AAAA, CNAME, MX, TXT and NS",
  "plainEnglish": "DNS Record Types in Amazon Route 53 are the standard data formats used to map human-readable domain names to computer-routable network destinations, mail servers, and domain ownership verifications. Key record types include A (maps hostname to IPv4), AAAA (maps hostname to IPv6), CNAME (aliases one domain to another domain), MX (routes email to mail exchangers), TXT (stores text for SPF/DKIM verification), and NS (delegates domain authority to name servers).",
  "whyItMatters": "Every internet service relies on specific DNS record types to function properly. Configuring the wrong record type (such as placing a standard CNAME record at the zone apex, which violates RFC standards, or misconfiguring MX records) results in website outages, email delivery failure, or domain verification rejections.",
  "workplaceExample": "A company launches a new web platform and configures records in their Route 53 hosted zone: (1) `A` record for `api.example.com` -> `203.0.113.10`, (2) `AAAA` record for IPv6 clients -> `2001:db8::1`, (3) `CNAME` record for `blog.example.com` -> `myblog.wordpress.com`, (4) `MX` record with priority 10 -> `mail.example.com`, (5) `TXT` record containing SPF `v=spf1 include:_spf.google.com ~all`, and (6) `NS` records defining the 4 authoritative name servers.",
  "examFocus": "Know the core DNS record types tested on AWS exams: (1) A Record: Maps name to IPv4 address (e.g., `192.0.2.1`). (2) AAAA Record: Maps name to IPv6 address. (3) CNAME Record: Canonical Name; points a hostname to another hostname (CANNOT be used at the zone apex `example.com`). (4) MX Record: Mail Exchanger with priority numbers (e.g., `10 mail.example.com`). (5) TXT Record: Holds arbitrary text used for SPF, DKIM, and domain ownership verification. (6) NS Record: Identifies the authoritative Name Servers for the zone.",
  "keyPoints": [
    "A Record: Maps a domain or subdomain to one or more IPv4 addresses.",
    "AAAA Record: Maps a domain or subdomain to one or more IPv6 addresses.",
    "CNAME Record: Aliases one domain name to another domain name (prohibited at the zone apex).",
    "MX Record: Directs inbound email traffic to mail server hostnames with integer priority rankings.",
    "TXT Record: Stores readable text for email authentication (SPF, DKIM, DMARC) and SSL certificate validation.",
    "NS Record: Specifies the authoritative name servers that answer queries for the hosted zone."
  ],
  "commonMistake": "Attempting to create a standard CNAME record for the root zone apex (e.g., `example.com`). DNS RFC standards forbid CNAME records at the zone apex; you must use an A record or a Route 53 Alias record instead.",
  "example": "Create an A record mapping `app.example.com` to an IPv4 address with a 300-second TTL in JSON: {\"Changes\": [{\"Action\": \"CREATE\", \"ResourceRecordSet\": {\"Name\": \"app.example.com\", \"Type\": \"A\", \"TTL\": 300, \"ResourceRecords\": [{\"Value\": \"198.51.100.25\"}]}}]}.",
  "sources": [
    {
      "title": "Supported DNS Resource Record Types in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html"
    },
    {
      "title": "Working with Resource Record Sets in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/rrsets-working-with.html"
    }
  ]
});
