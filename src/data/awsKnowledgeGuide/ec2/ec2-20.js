import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-20',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Spot Interruption',
  status: 'ready',
  plainEnglish: 'An EC2 Spot Interruption occurs when AWS reclaims a Spot Instance because spare capacity is needed for On-Demand users or the Spot price exceeds your max price. AWS provides a 2-minute warning notification before terminating, stopping, or hibernating the Spot Instance. Your applications can capture this warning to clean up, flush state to S3/DynamoDB, and safely shut down.',
  whyItMatters: 'Handling Spot interruptions gracefully is essential when using Spot Instances for production batch processing or web microservices. Proper handling prevents data corruption and ensures workload continuity.',
  workplaceExample: 'A batch processing job listens for Spot Interruption events using Amazon EventBridge. When AWS emits a 2-minute interruption warning for an instance, a script saves the current calculation checkpoint to S3 and deregisters the node from the worker pool.',
  examFocus: 'SAA-C03 Spot Interruption Handling:\n- 2-Minute Warning: Delivered via EC2 Instance Metadata (`http://169.254.169.254/latest/meta-data/spot/instance-action`) and Amazon EventBridge.\n- Interruption Behaviors: Terminate (default), Stop (for EBS-backed), or Hibernate (preserves RAM state to disk).\n- Graceful handling: Use Auto Scaling groups with EC2 Auto Scaling Instance Refresh or Spot Placement Score to minimize interruptions.',
  keyPoints: [
    'AWS issues a 2-minute notice prior to reclaiming a Spot Instance.',
    'Notification accessible via Instance Metadata Service (IMDS) and EventBridge.',
    'Configurable interruption behaviors: Terminate, Stop, or Hibernate.',
    'Spot Instance Rebalance Recommendation provides early warning before full 2-min alert.',
    'Design applications to save state to S3/DynamoDB upon receiving interruption warning.'
  ],
  commonMistake: 'Ignoring the 2-minute interruption warning and allowing jobs to terminate abruptly, leading to lost calculation progress.',
  example: 'IMDS Check for Interruption Warning (Curl):\n`curl -s http://169.254.169.254/latest/meta-data/spot/instance-action`\nResult: `{"action": "terminate", "time": "2026-08-14T22:30:00Z"}`',
  sources: [
    { title: 'Spot Instance Interruptions', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html' }
  ]
});
