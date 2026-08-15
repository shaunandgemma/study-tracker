import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-15",
  "title": "Geolocation Routing Policy",
  "plainEnglish": "Geolocation Routing Policy in Amazon Route 53 routes user DNS queries based on the geographic location where the DNS query originates (mapped by Continent, Country, or US State). Route 53 inspects the client's IP address (or the recursive resolver's EDNS0 subnet) to return location-specific DNS answers tailored to the user's region.",
  "whyItMatters": "Geolocation routing is vital for localization (directing French users to a French-language website), regulatory compliance (restricting data access to specific geographic jurisdictions like GDPR compliance in Europe), and content licensing restrictions (geofencing streaming media rights).",
  "workplaceExample": "A global media streaming platform configures Geolocation records for `video.streamflix.com`: (1) Queries originating from Europe (`Continent=EU`) are routed to Frankfurt ALBs with localized EU content libraries, (2) Queries from the United States (`Country=US`) are routed to Virginia ALBs, and (3) All other unmapped locations match a Default Geolocation record (`GeoLocation=*`) pointing to a global distribution.",
  "examFocus": "Understand Geolocation routing hierarchy and rules: (1) Hierarchy: State (most specific) -> Country -> Continent -> Default (least specific). (2) Overlap Resolution: If a query matches both a Country record and a Continent record, Route 53 selects the more specific Country record. (3) Mandatory Default Record: Always create a Default Geolocation record to handle IP addresses that do not map to any configured continent or country.",
  "keyPoints": [
    "Routes DNS queries based on the geographic origin of the user's recursive DNS resolver IP.",
    "Supports granular geographic boundaries: Continent, Country, and US State levels.",
    "Follows strict geographic specificity hierarchy: State > Country > Continent > Default record.",
    "A Default Geolocation record should always be configured to catch unmapped or ambiguous IP addresses.",
    "Ideal for content localization, language personalization, legal compliance, and digital licensing.",
    "Can be combined with Route 53 Health Checks to fail over within or outside the geographic zone."
  ],
  "commonMistake": "Failing to create a Default Geolocation record. If a DNS query originates from an IP address in a country not explicitly configured in your hosted zone, Route 53 will return `NXDOMAIN` (No Such Domain) unless a default record exists.",
  "example": "Configure a Geolocation record targeting the European continent in JSON: {\"Changes\": [{\"Action\": \"CREATE\", \"ResourceRecordSet\": {\"Name\": \"portal.example.com\", \"Type\": \"A\", \"SetIdentifier\": \"EU-Users\", \"GeoLocation\": {\"ContinentCode\": \"EU\"}, \"TTL\": 300, \"ResourceRecords\": [{\"Value\": \"198.51.100.30\"}]}}]}.",
  "sources": [
    {
      "title": "Geolocation Routing Policy in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-geo.html"
    },
    {
      "title": "Choosing a Routing Policy in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"
    }
  ]
});
