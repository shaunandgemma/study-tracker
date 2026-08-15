import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-12",
  "title": "Health Checks",
  "plainEnglish": "A load balancer health check is a repeated test of each registered target. The target group's protocol, port, path, interval, timeout, thresholds, and accepted response codes determine when a target is considered healthy enough to receive traffic.",
  "whyItMatters": "Sending production requests to a failed or unready application creates errors. Health checks remove unhealthy targets from normal routing and return recovered targets after enough successful checks.",
  "workplaceExample": "A web target group checks GET /health on each instance. The endpoint returns success only after the application can reach its database, so a newly started or disconnected instance does not receive customer requests.",
  "examFocus": "Health checks belong to target groups. Know healthy and unhealthy thresholds, interval, timeout, matcher, path, and port. Security groups must allow checks from the load balancer, and a target must be in an enabled Availability Zone and referenced by a listener rule.",
  "keyPoints": [
    "The load balancer checks every registered target using its target group's settings.",
    "ALB health checks use HTTP or HTTPS and send HTTP GET requests.",
    "Consecutive failures beyond the unhealthy threshold remove a target from service.",
    "Consecutive successes beyond the healthy threshold return an unhealthy target to service.",
    "A separate health endpoint should test whether the application is ready to handle real requests.",
    "Target health reason codes help distinguish timeouts, response-code mismatches, registration, and Availability Zone problems."
  ],
  "commonMistake": "Checking only a web server's root page can mark a broken application healthy. Use a lightweight endpoint that reflects critical readiness without depending on slow or destructive operations.",
  "example": "Configure /health on the traffic port, accept HTTP 200, verify the load-balancer security group can reach it, then stop the application and observe the target change from healthy to unhealthy before production rollout.",
  "sources": [
    {
      "title": "Health checks for Application Load Balancer target groups",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html"
    }
  ]
});
