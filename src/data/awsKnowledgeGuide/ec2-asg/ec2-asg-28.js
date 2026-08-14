import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-28",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Mixed Instances Policies",
  "status": "ready",
  "plainEnglish": "A Mixed Instances Policy in Amazon EC2 Auto Scaling allows a single Auto Scaling Group to launch a diverse combination of EC2 instance types (such as mixing `c5.large`, `c5a.large`, and `c6i.large`), different CPU architectures (such as x86 Intel/AMD and ARM Graviton), and multiple purchase options (blending On-Demand and Spot Instances) within the same group.",
  "whyItMatters": "Relying on a single instance type and size exposes your application to Spot interruptions and regional capacity shortages in specific AZs. A Mixed Instances Policy dramatically enhances availability and cost efficiency by pulling capacity from multiple diverse hardware pools simultaneously while optimizing Spot savings.",
  "workplaceExample": "A big data ETL fleet configures a Mixed Instances Policy with a base of 4 On-Demand `m5.large` instances for baseline processing, and scales out with 70% Spot instances across a pool of `m5.large`, `m5a.large`, and `m6i.large` instances, cutting operational compute costs by 65% with zero capacity shortages.",
  "examFocus": "For SAA-C03, know the parameters of a Mixed Instances Policy: (1) `OnDemandBaseCapacity` (fixed number of baseline On-Demand instances launched first), (2) `OnDemandPercentageAboveBaseCapacity` (percentage of additional scaling capacity fulfilled by On-Demand vs Spot), (3) `SpotAllocationStrategy` (`price-capacity-optimized` or `capacity-optimized`), and (4) Multiple instance type overrides.",
  "keyPoints": [
    "Launches multiple instance types and architectures within a single Auto Scaling Group.",
    "Blends On-Demand and Spot instances dynamically for cost optimization and reliability.",
    "`OnDemandBaseCapacity`: Guarantees a minimum number of stable On-Demand instances.",
    "`OnDemandPercentageAboveBaseCapacity`: Controls On-Demand vs Spot split above the base.",
    "Diversifies Spot capacity pools across multiple instance families to minimize interruptions."
  ],
  "commonMistake": "Specifying only a single instance type in a Spot-heavy ASG. If AWS runs out of capacity for that specific instance size in that AZ, the ASG will fail to scale out. Always provide 3 to 5 alternative instance types in the Mixed Instances Policy.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: ASG with Mixed Instances Policy.\nResources:\n  MixedASG:\n    Type: AWS::AutoScaling::AutoScalingGroup\n    Properties:\n      MinSize: '2'\n      MaxSize: '20'\n      DesiredCapacity: '5'\n      MixedInstancesPolicy:\n        InstancesDistribution:\n          OnDemandBaseCapacity: 2\n          OnDemandPercentageAboveBaseCapacity: 30\n          SpotAllocationStrategy: price-capacity-optimized\n        LaunchTemplate:\n          LaunchTemplateSpecification:\n            LaunchTemplateId: !Ref AppTemplate\n            Version: !GetAtt AppTemplate.LatestVersionNumber\n          Overrides:\n            - InstanceType: c5.large\n            - InstanceType: c5a.large\n            - InstanceType: c6i.large",
  "sources": [
    {
      "title": "Auto Scaling Groups with Multiple Instance Types and Purchase Options",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html"
    },
    {
      "title": "Allocation Strategies for Spot and On-Demand Instances",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html#spot-allocation-strategy"
    }
  ]
});
