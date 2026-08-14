import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-20",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Rollback on Failure",
  "status": "ready",
  "plainEnglish": "Rollback on failure is an automatic safety mechanism in AWS CloudFormation that protects your AWS account from partial or corrupted infrastructure deployments. If any single resource fails to create or update during a stack operation—due to a syntax error, insufficient IAM permissions, invalid parameter value, or quota limit—CloudFormation immediately stops deployment and automatically rolls back all changes, deleting newly created resources or restoring modified resources to their previous stable state.",
  "whyItMatters": "Partial deployments leave infrastructure in an unstable, unpredictable state where dependencies are broken and security rules may be half-configured. Automatic rollback guarantees an 'all-or-nothing' atomic deployment model: your stack is either 100% operational or cleanly restored to its previous working state.",
  "workplaceExample": "An automated stack deployment creates a Security Group, an IAM Role, and an EC2 instance. The EC2 instance fails to launch because the specified AMI ID does not exist. CloudFormation immediately triggers ROLLBACK_IN_PROGRESS, terminates the partial instance, and cleanly deletes the new IAM Role and Security Group.",
  "examFocus": "For SAA-C03, understand stack failure statuses: ROLLBACK_COMPLETE indicates a failed stack creation that cleaned up all newly created resources. UPDATE_ROLLBACK_COMPLETE indicates a failed update that restored previous stable resource configurations. Disable Rollback (--disable-rollback or --on-failure DO_NOTHING) is useful during development debugging to keep partially created resources running for investigation.",
  "keyPoints": [
    "Rollback automatically reverts changes if any resource provisioning step fails during stack deployment.",
    "Ensures atomic deployments: either all template resources succeed or the stack reverts cleanly.",
    "ROLLBACK_COMPLETE indicates a failed stack creation that was cleaned up back to zero resources.",
    "UPDATE_ROLLBACK_COMPLETE indicates a failed update that restored previous stable resource states.",
    "Rolling back preserves data integrity and prevents lingering orphaned resources in your AWS account."
  ],
  "commonMistake": "Frantically manually deleting individual resources during a stack failure rollback, which interrupts CloudFormation's internal cleanup process and leaves the stack stuck in DELETE_FAILED status. Allow CloudFormation to finish its automated rollback sequence completely before taking troubleshooting steps.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Template configured with robust resource properties to ensure smooth stack creation.\nResources:\n  ApplicationQueue:\n    Type: AWS::SQS::Queue\n    Properties:\n      QueueName: production-events-queue\n      MessageRetentionPeriod: 1209600",
  "sources": [
    {
      "title": "AWS CloudFormation Stack Failure and Rollback Options",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html"
    },
    {
      "title": "Troubleshooting AWS CloudFormation Stack Failures",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/troubleshooting.html"
    }
  ]
});
