import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'xray-2',
  topicId: 'topic-xray',
  topicTitle: 'AWS X-Ray',
  objectiveCode: 'Observability',
  title: 'X-Ray Sampling Rules & Trace Maps',
  status: 'ready',
  plainEnglish: 'X-Ray Sampling Rules and Trace Maps provide intelligent data management and visual analysis for distributed applications. Sampling Rules control how many incoming requests are recorded as traces, ensuring you capture sufficient representative data for troubleshooting without overwhelming downstream networks or incurring high tracing costs. Trace Maps and Service Maps automatically generate visual dependency graphs of your services, displaying health status, average latencies, fault rates (5xx errors), error rates (4xx client errors), and throttling percentages for every interconnected component.',
  whyItMatters: 'High-throughput production applications handle tens of thousands of requests per second. Tracing 100% of these requests would generate massive data volume and unnecessary expenses. Sampling rules let you dynamically adjust sampling rates (for instance, sampling 100% of checkout errors while sampling only 1% of read requests) without redeploying code. Service and Trace Maps allow operations teams to visually pinpoint failing upstream or downstream dependencies in seconds during an incident.',
  workplaceExample: 'A travel booking platform processes 50,000 search queries per minute. The lead architect configures an X-Ray sampling rule with a reservoir of 50 requests per second and a 2% fixed rate for search endpoints, but creates a dedicated rule that samples 100% of requests to the `/checkout` payment endpoint. In the X-Ray Service Map, the payment microservice glows red, and clicking the node highlights a high 429 throttling rate from a third-party currency conversion API.',
  examFocus: 'SAA-C03 X-Ray Sampling, Analytics & Service Map Decision-Making:\n- Default Sampling Rule: By default, the X-Ray SDK records the first 1 request per second (the reservoir) and 5% of any additional requests per host.\n- Sampling Rule Components:\n  * Reservoir: Fixed target number of requests to trace every second (guarantees at least 1 sample per second).\n  * Fixed Rate: Percentage of additional requests above the reservoir to sample.\n  * Matching Criteria: HTTP method, URL path, host name, service name, service type, and priority.\n- Dynamic Centralized Configuration: Sampling rules can be modified centrally in the AWS X-Ray / CloudWatch console without modifying application code or restarting services.\n- Service Map Visual Colors & Indicators:\n  * Green = Healthy / Successful (2xx).\n  * Red = Faults / Server-side errors (5xx).\n  * Yellow = Errors / Client-side issues (4xx).\n  * Purple = Throttling (429 / HTTP status indicating rate limits).\n- Filter Expressions: Query traces using expressions such as `annotation.userId = "user_992"`, `error = true`, `fault = true`, or `responsetime > 2` to isolate problematic requests rapidly.',
  keyPoints: [
    'Sampling Rules optimize tracing volume and cost by capturing representative transaction samples.',
    'Default rule samples 1 request per second (reservoir) and 5% of additional requests per second.',
    'Custom rules match on service name, HTTP method, URL path, or priority and can be updated without redeployment.',
    'Service Maps generate automated, visual dependency graphs depicting inter-service relationships and health metrics.',
    'Node status colors indicate health: Green (2xx), Red (5xx faults), Yellow (4xx errors), and Purple (throttling).',
    'Filter Expressions allow precise searching across trace annotations, response times, HTTP statuses, and error flags.'
  ],
  commonMistake: 'Assuming you must redeploy your application to change X-Ray sampling rates. Centralized sampling rules defined in the AWS X-Ray console or AWS CLI take effect dynamically across all instrumented SDK instances without application code changes or restarts.',
  example: 'Creating a Centralized Custom Sampling Rule via AWS CLI:\naws xray create-sampling-rule --sampling-rule \'{\n  "RuleName": "CheckoutServiceRule",\n  "Priority": 10,\n  "Host": "*",\n  "HTTPMethod": "POST",\n  "URLPath": "/api/v1/checkout/*",\n  "ReservoirSize": 20,\n  "FixedRate": 0.50,\n  "ServiceName": "checkout-service",\n  "ServiceType": "*",\n  "ResourceARN": "*",\n  "Version": 1\n}\'\n\nFilter Expression Example in CloudWatch Traces:\n`service("checkout-service") AND (fault = true OR responsetime > 3.0)`',
  sources: [
    { title: 'Configuring sampling rules in AWS X-Ray', url: 'https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html' },
    { title: 'Using the AWS X-Ray service map and trace search', url: 'https://docs.aws.amazon.com/xray/latest/devguide/xray-console.html' }
  ]
});
