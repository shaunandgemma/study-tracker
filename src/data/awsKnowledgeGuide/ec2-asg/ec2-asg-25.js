import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-25",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Lifecycle Hooks",
  "status": "ready",
  "plainEnglish": "Amazon EC2 Auto Scaling Lifecycle Hooks allow you to pause the instance launch or termination process so you can perform custom actions before an instance is put into service or permanently terminated. (1) Scale-out hook (`autoscaling:EC2_INSTANCE_LAUNCHING`): pauses the instance in the `Pending:Wait` state so you can install custom packages, pull configuration files, or run integration tests before the instance is registered with the load balancer. (2) Scale-in hook (`autoscaling:EC2_INSTANCE_TERMINATING`): pauses the instance in the `Terminating:Wait` state so you can extract log files, flush transaction buffers, or drain background jobs before the instance is terminated.",
  "whyItMatters": "Without lifecycle hooks, an instance being scaled out receives production user traffic before custom bootstrap tasks finish, or an instance being scaled in is abruptly terminated while still holding unsynced logs or executing active batch jobs. Lifecycle hooks ensure clean, zero-data-loss automation.",
  "workplaceExample": "A log analytics pipeline attaches a terminating lifecycle hook to its worker ASG. When an instance is selected for scale-in termination, the hook pauses termination for up to 15 minutes, triggering an AWS Lambda function via Amazon EventBridge that runs an SSM command on the instance to compress and upload `/var/log/app.log` to an S3 bucket before signaling the ASG to proceed with termination.",
  "examFocus": "For SAA-C03, remember the lifecycle hook mechanics: (1) Launching hook pauses instance in `Pending:Wait` (instance not registered with ELB until hook completes). (2) Terminating hook pauses instance in `Terminating:Wait` (instance deregistered from ELB, giving you time to extract logs or finish processing). (3) You must call `complete-lifecycle-action` with `CONTINUE` or `ABANDON` (or let the timeout expire) to resume the ASG lifecycle.",
  "keyPoints": [
    "Pauses instance launch or termination to execute custom scripts or operational workflows.",
    "Launch hook: holds instance in `Pending:Wait` before registering with load balancer.",
    "Terminate hook: holds instance in `Terminating:Wait` before terminating to extract logs or finish work.",
    "Integrates with Amazon EventBridge, Amazon SNS, or Amazon SQS to trigger AWS Lambda functions.",
    "Resumes lifecycle via `complete-lifecycle-action` with `CONTINUE` or `ABANDON` (or timeout default action)."
  ],
  "commonMistake": "Forgetting to send `complete-lifecycle-action` after custom bootstrap tasks finish. The instance will remain paused in the wait state until the lifecycle timeout (default 3600 seconds) expires before entering service.",
  "example": "# Create a terminating lifecycle hook with a 300-second timeout:\naws autoscaling put-lifecycle-hook \\\n  --lifecycle-hook-name LogBackupHook \\\n  --auto-scaling-group-name Production-Web-ASG \\\n  --lifecycle-transition autoscaling:EC2_INSTANCE_TERMINATING \\\n  --heartbeat-timeout 300 \\\n  --default-result CONTINUE",
  "sources": [
    {
      "title": "Amazon EC2 Auto Scaling Lifecycle Hooks",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-lifecycle-hooks.html"
    },
    {
      "title": "Completing a Lifecycle Action in Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/completing-lifecycle-actions.html"
    }
  ]
});
