import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-14",
  "title": "Failover Routing Policy",
  "plainEnglish": "Failover Routing Policy in Amazon Route 53 is an active-passive disaster recovery (DR) routing method used to automatically route traffic to a Primary resource when it is healthy, and fail over to a Secondary (standby or static maintenance) resource whenever the Primary resource fails its associated Route 53 health check.",
  "whyItMatters": "Unplanned regional cloud outages or application crashes can cause catastrophic business disruption. Failover routing automates disaster recovery: when the primary application fleet goes down, Route 53 redirects incoming user traffic to a warm standby region, a pilot-light disaster recovery environment, or a static maintenance page hosted on Amazon S3 within seconds.",
  "workplaceExample": "An enterprise banking application deploys an active-passive DR architecture: The Primary record points to an active Application Load Balancer in `us-east-1` with a Route 53 Health Check attached. The Secondary record points to a warm standby ALB in `us-west-2`. When an unexpected data center failure in `us-east-1` triggers the primary health check to fail, Route 53 automatically switches DNS answers to the `us-west-2` secondary ALB.",
  "examFocus": "Understand Failover routing requirements: (1) Record Pair: Exactly two records with the same name and type: one designated as `Failover=PRIMARY`, one as `Failover=SECONDARY`. (2) Health Checks: Primary record MUST have an associated Route 53 Health Check (or `EvaluateTargetHealth=true` on Alias). (3) Secondary Health Check: Optional, but recommended if secondary is an active standby. (4) Caching & RTO: Failover speed depends on record TTL (set low TTL, e.g., 60 seconds, for fast DR failover).",
  "keyPoints": [
    "Used for active-passive disaster recovery and high-availability backup routing.",
    "Composed of exactly two records: one Primary record and one Secondary record.",
    "Route 53 returns the Primary record as long as its associated health check remains healthy.",
    "Automatically redirects DNS queries to the Secondary record when the Primary fails its health check.",
    "Secondary endpoint can be a warm standby region, a pilot light cluster, or a static S3 website maintenance page.",
    "Failover does not drop or move existing open TCP connections; it affects only new DNS query resolutions."
  ],
  "commonMistake": "Setting a high TTL (e.g., 86400 seconds / 24 hours) on Failover DNS records. Intermediate recursive resolvers will cache the Primary IP for 24 hours, preventing clients from receiving the Secondary failover IP during an outage.",
  "example": "Configure a Failover Primary record for `app.example.com` in JSON: {\"Changes\": [{\"Action\": \"CREATE\", \"ResourceRecordSet\": {\"Name\": \"app.example.com\", \"Type\": \"A\", \"SetIdentifier\": \"Primary-Fleet\", \"Failover\": \"PRIMARY\", \"TTL\": 60, \"ResourceRecords\": [{\"Value\": \"198.51.100.50\"}], \"HealthCheckId\": \"hc-12345678\"}}]}.",
  "sources": [
    {
      "title": "Failover Routing Policy in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-failover.html"
    },
    {
      "title": "Configuring DNS Failover in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html"
    }
  ]
});
