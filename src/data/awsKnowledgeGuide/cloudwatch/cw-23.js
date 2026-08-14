import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-23',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'CloudWatch with Auto Scaling',
  status: 'ready',
  plainEnglish: 'Amazon EC2 Auto Scaling uses CloudWatch metrics and alarms to adjust an Auto Scaling group’s capacity. Target tracking works like a thermostat: you choose an appropriate utilization metric and target, and Auto Scaling creates and manages the necessary alarms. Step scaling uses CloudWatch alarm breaches and changes capacity by different amounts according to how far the metric crosses defined steps. Simple scaling uses one adjustment and a cooldown.',
  whyItMatters: 'Metric-driven scaling helps maintain performance as demand changes while avoiding permanently provisioned peak capacity. A workload-sensitive signal can add capacity before queues or latency become unacceptable and remove it conservatively when demand falls.',
  workplaceExample: 'A web group uses target tracking to keep average CPU near a chosen target. A worker group instead uses a custom backlog-per-instance metric because CPU does not represent how much queued work each instance must process.',
  examFocus: 'AWS recommends target tracking for most EC2 Auto Scaling cases; it manages its own alarms, so do not manually edit or delete them. Use step scaling when the scenario requires explicit different adjustments for small and large breaches. Choose a metric that changes proportionally with load and inversely with added capacity. Missing metric data can put alarms into INSUFFICIENT_DATA and prevent scaling, so sparse custom metrics require careful design.',
  keyPoints: [
    'Dynamic scaling connects CloudWatch telemetry to Auto Scaling capacity changes.',
    'Target tracking maintains a chosen metric near a target value.',
    'Auto Scaling creates and manages target-tracking alarms.',
    'Step scaling varies the adjustment according to breach size.',
    'The scaling metric should represent load per unit of capacity.'
  ],
  commonMistake: 'Scaling on a total value that rises when instances are added can cause unstable behavior. Prefer an average utilization or per-capacity workload metric, confirm it reports frequently enough, and account for instance warmup before judging new capacity.',
  example: 'For a CPU-based target-tracking policy, choose the Auto Scaling group’s average CPU metric and a target appropriate to the workload’s tested headroom. Verify Auto Scaling created its alarms, generate safe test load, and confirm scaling activity and subsequent metric movement; do not edit the managed alarms.',
  sources: [
    { title: 'Dynamic scaling for Amazon EC2 Auto Scaling', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html' },
    { title: 'Target tracking scaling policies', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html' },
    { title: 'Step and simple scaling policies', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html' }
  ]
});
