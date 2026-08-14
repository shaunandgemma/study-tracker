import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-29",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "On-Demand and Spot Instances in ASGs",
  "status": "ready",
  "plainEnglish": "On-Demand and Spot Instances in Amazon EC2 Auto Scaling allows you to combine the reliability of full-price On-Demand instances with the massive cost discounts of Amazon EC2 Spot Instances (up to 90% off standard rates) within a single Auto Scaling Group. You configure an On-Demand base capacity to ensure guaranteed baseline availability for your core workload, and satisfy all remaining burst capacity with low-cost Spot instances.",
  "whyItMatters": "Running 100% On-Demand instances for large stateless workloads is unnecessarily expensive. Running 100% Spot instances risks total service interruption if AWS reclaims Spot capacity during regional shortages. Blending On-Demand and Spot instances strikes the optimal balance between high availability and aggressive cost savings.",
  "workplaceExample": "A SaaS analytics platform runs 20 EC2 instances. The ASG is configured with `OnDemandBaseCapacity: 4` and `OnDemandPercentageAboveBaseCapacity: 20`. The 4 baseline On-Demand instances guarantee the service never drops below minimum operational capacity, while the remaining 16 instances run on Spot instances, saving the company $3,500 every month.",
  "examFocus": "For SAA-C03, remember the architectural best practice for cost optimization: (1) Use On-Demand for baseline core capacity (or use Savings Plans/Reserved Instances for the base). (2) Use Spot Instances for spiky, stateless, or fault-tolerant scaling capacity above the base. (3) Mixed Instances Policy in the ASG manages this distribution automatically.",
  "keyPoints": [
    "Combines predictable On-Demand reliability with up to 90% Spot cost savings.",
    "On-Demand Base Capacity ensures critical baseline instances are never interrupted.",
    "Remaining scaling capacity is fulfilled by Spot instances across diversified pools.",
    "Automatically replaces interrupted Spot instances from available alternative pools.",
    "Managed seamlessly through ASG Mixed Instances Policies and Launch Templates."
  ],
  "commonMistake": "Using Spot instances for stateful singleton databases that cannot handle a 2-minute interruption notice. Spot instances should only be used for stateless web tiers, container workers, batch processing, and fault-tolerant distributed clusters.",
  "example": "# Configure ASG instance distribution with 4 On-Demand base and 80% Spot above base:\naws autoscaling update-auto-scaling-group \\\n  --auto-scaling-group-name WebApp-ASG \\\n  --mixed-instances-policy '{\"InstancesDistribution\":{\"OnDemandBaseCapacity\":4,\"OnDemandPercentageAboveBaseCapacity\":20,\"SpotAllocationStrategy\":\"price-capacity-optimized\"}}'",
  "sources": [
    {
      "title": "Using Spot Instances in Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html"
    },
    {
      "title": "Best Practices for EC2 Spot Instances in Auto Scaling",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html"
    }
  ]
});
