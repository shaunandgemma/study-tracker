import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-8",
  "title": "Keyspaces Auto Scaling",
  "plainEnglish": "Amazon Keyspaces integrates with AWS Application Auto Scaling to automatically adjust the provisioned read and write throughput capacity of your tables in response to live traffic patterns. By specifying a target utilization percentage (typically 70%), Auto Scaling automatically scales your allocated RCUs and WCUs up when demand increases and down when traffic subsides.",
  "whyItMatters": "Manually monitoring and resizing provisioned capacity units around the clock is impractical for modern cloud operations. Auto Scaling combines the cost advantages of Provisioned capacity with the operational hands-off convenience of elastic scaling, protecting your applications from throttling while minimizing unused idle capacity.",
  "workplaceExample": "An online food delivery service experiences predictable lunch (11 AM–2 PM) and dinner (5 PM–9 PM) ordering spikes. They configure Keyspaces Auto Scaling with a minimum of 200 WCUs, a maximum of 5,000 WCUs, and a target utilization of 70%. Auto Scaling ramps up WCUs smoothly before meal times and scales capacity down at night, saving 35% compared to static peak provisioning.",
  "examFocus": "Understand how Keyspaces Auto Scaling operates: It uses Target Tracking scaling policies where you define a target utilization metric (e.g., 70%). You configure Minimum Capacity Units, Maximum Capacity Units, and scale-in/scale-out cooldown periods. It can be applied independently to read capacity and write capacity on any table in Provisioned mode.",
  "keyPoints": [
    "Uses AWS Application Auto Scaling to automatically modify table RCUs and WCUs based on target utilization percentage.",
    "Maintains a target utilization ratio (e.g., 70% of provisioned capacity) to ensure headroom for sudden bursts.",
    "Requires defining Minimum and Maximum capacity limits to enforce floor availability and cap cloud expenditures.",
    "Read capacity and write capacity can have separate, independent auto-scaling policies.",
    "Supports configurable scale-out and scale-in cooldown periods to prevent rapid capacity flapping during metric fluctuations.",
    "Can be configured via the AWS Management Console, AWS CLI, AWS SDKs, or AWS CloudFormation/Terraform templates."
  ],
  "commonMistake": "Setting the target utilization percentage to 100%. If target utilization is set to 100%, there is no buffer for immediate traffic surges while Application Auto Scaling provisions new capacity, leading to temporary request throttling.",
  "example": "Register a scalable target and apply a target tracking scaling policy for write capacity: aws application-autoscaling register-scalable-target --service-namespace cassandra --resource-id keyspace/ecommerce/table/orders --scalable-dimension cassandra:table:WriteCapacityUnits --min-capacity 100 --max-capacity 5000, then apply a target-tracking policy targeting 70% utilization.",
  "sources": [
    {
      "title": "Managing Amazon Keyspaces Capacity Automatically with Auto Scaling",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/autoscaling.html"
    },
    {
      "title": "Configuring Auto Scaling for Provisioned Capacity Tables",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/autoscaling-console.html"
    }
  ]
});
