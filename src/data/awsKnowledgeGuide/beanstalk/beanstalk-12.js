import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-12",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk with Auto Scaling",
  "status": "ready",
  "plainEnglish": "Elastic Beanstalk integrates natively with Amazon EC2 Auto Scaling to automatically maintain application availability and scale compute capacity up or down in response to demand. In a Load-Balanced environment, Beanstalk creates an Auto Scaling group with configurable minimum and maximum instance boundaries, multi-Availability Zone distribution, and scaling triggers based on CloudWatch metrics (such as CPU utilization, network I/O, or application request count).",
  "whyItMatters": "Manual instance scaling is too slow to handle sudden flash traffic and leads to overprovisioning during low-traffic periods. Auto Scaling ensures your application remains responsive under unexpected traffic surges while shrinking the instance count during quiet hours to minimize hosting costs.",
  "workplaceExample": "A ticketing application configures an Auto Scaling group in Elastic Beanstalk with a minimum of 2 instances and a maximum of 30 instances across 3 Availability Zones. When concert tickets go on sale and CPU utilization exceeds 70% across the fleet, Beanstalk adds 4 instances every 3 minutes until traffic stabilizes.",
  "examFocus": "For SAA-C03, know how Auto Scaling works in Elastic Beanstalk: it automatically deploys EC2 instances across multiple Availability Zones for high availability. Scaling triggers can use predefined CloudWatch metrics (CPUUtilization, NetworkIn/Out, RequestCount) or custom CloudWatch metrics. Health checks (EC2 or ELB) determine instance health and automatically terminate/replace unhealthy instances.",
  "keyPoints": [
    "Automatically manages an EC2 Auto Scaling group across multiple Availability Zones.",
    "Configurable capacity bounds: MinSize, MaxSize, and DesiredCapacity.",
    "Scaling triggers evaluate metrics (CPU utilization, Network In/Out, Latency, SQS Depth) to add/remove instances.",
    "Performs automatic instance health checks and automatically replaces failed instances.",
    "Supports both target tracking scaling and step scaling policies."
  ],
  "commonMistake": "Setting the Auto Scaling MinSize and MaxSize to the exact same number (e.g., Min=2, Max=2) and expecting the environment to scale during traffic spikes. Always provide an adequate range between MinSize and MaxSize to allow dynamic scaling.",
  "example": "OptionSettings:\n  - Namespace: aws:autoscaling:asg\n    OptionName: MinSize\n    Value: '2'\n  - Namespace: aws:autoscaling:asg\n    OptionName: MaxSize\n    Value: '10'\n  - Namespace: aws:autoscaling:trigger\n    OptionName: MeasureName\n    Value: CPUUtilization\n  - Namespace: aws:autoscaling:trigger\n    OptionName: UpperThreshold\n    Value: '75'",
  "sources": [
    {
      "title": "Configuring Auto Scaling Groups in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.as.html"
    },
    {
      "title": "Auto Scaling Triggers in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.as.trigger.html"
    }
  ]
});
