import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-7',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'AWS Config Managed Rules',
  status: 'ready',
  plainEnglish: 'AWS Config Managed Rules are predefined, customizable compliance rules created and maintained by AWS. These rules represent security best practices (such as verifying that S3 buckets prohibit public read access, EBS volumes are encrypted, IAM root account MFA is enabled, or EC2 instances belong to a VPC). You simply select the managed rule, configure parameters if needed, and AWS Config automatically evaluates your resources against the rule.',
  whyItMatters: 'Managed rules eliminate the need to write custom code or Lambda functions to enforce standard security baselines. Hundreds of out-of-the-box rules cover CIS benchmarks, PCI-DSS, HIPAA, and AWS security best practices.',
  workplaceExample: 'A financial services firm enables the managed rule s3-bucket-public-read-prohibited. When a user accidentally turns off public block access on an S3 bucket, AWS Config immediately flags the bucket as NON_COMPLIANT and notifies the security team via SNS.',
  examFocus: 'SAA-C03 scenarios often test how to audit configuration compliance against AWS best practices automatically. Use Managed Rules for standard checks (S3 encryption, EBS encryption, Security Group port restrictions) rather than writing custom Lambda functions.',
  keyPoints: [
    'Predefined, AWS-managed compliance rules built on AWS security best practices.',
    'Zero coding required; easily enabled via Console, CLI, or CloudFormation.',
    'Covers S3, EC2, IAM, RDS, VPC, KMS, and dozens of other AWS services.',
    'Triggers evaluation on configuration changes or on a scheduled frequency.',
    'Returns compliance status: COMPLIANT, NON_COMPLIANT, or NOT_APPLICABLE.'
  ],
  commonMistake: 'Writing a custom Lambda function to check if S3 buckets are encrypted when the AWS Config Managed Rule s3-bucket-server-side-encryption-enabled already exists for that exact purpose.',
  example: 'Managed Rule Example:\nRule Name: `s3-bucket-public-read-prohibited`\nTrigger: Configuration Change\nEvaluation: Checks whether S3 buckets allow public read access.\nResult: Flags non-compliant buckets automatically.',
  sources: [
    { title: 'Evaluating Resources with AWS Config Rules', url: 'https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_use-managed-rules.html' }
  ]
});
