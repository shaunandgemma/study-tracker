import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-23",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Drift Detection",
  "status": "ready",
  "plainEnglish": "Drift Detection is a built-in CloudFormation feature that detects whether the actual configuration of your deployed AWS resources has drifted (changed) away from the expected configuration defined in your CloudFormation template. Drift occurs when administrators make out-of-band manual edits directly in the AWS Console or CLI—such as modifying a security group rule or changing an S3 bucket policy—without updating the CloudFormation template.",
  "whyItMatters": "Manual out-of-band changes create discrepancies between your documented template code and live production infrastructure. Unmanaged drift can cause unexpected template deployment failures, security vulnerabilities, or accidental reversion of hotfixes during subsequent stack updates.",
  "workplaceExample": "A security auditor runs CloudFormation Drift Detection on an enterprise network stack. The report highlights DRIFTED status on WebSecurityGroup, revealing that a junior engineer manually opened port 22 (SSH) to 0.0.0.0/0 in the console midnight prior.",
  "examFocus": "For SAA-C03, compare Drift Detection with normal Stack Updates. Normal updates apply changes from template to stack. Drift Detection compares live AWS resource properties against the template's recorded state to identify manual out-of-band changes. Understand that Drift Detection provides detailed status: IN_SYNC, DRIFTED, or NOT_CHECKED.",
  "keyPoints": [
    "Drift Detection identifies manual, out-of-band configuration changes made outside CloudFormation.",
    "Reports stack and resource drift statuses: IN_SYNC, DRIFTED, or NOT_CHECKED.",
    "Provides property-level details showing expected template values versus actual live AWS values.",
    "Can be executed on an entire stack or on specific individual resources within a stack.",
    "Resolving drift requires updating the template to match live resources or reverting manual changes in AWS."
  ],
  "commonMistake": "Relying on periodic manual console inspections instead of automated CloudFormation drift detection to verify infrastructure compliance, leaving security openings undetected for weeks. Run drift detection checks routinely or trigger them via AWS Config rules.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Managed security group resource monitored for configuration drift.\nResources:\n  AppSecurityGroup:\n    Type: AWS::EC2::SecurityGroup\n    Properties:\n      GroupDescription: Strictly controlled web security group\n      SecurityGroupIngress:\n        - IpProtocol: tcp\n          FromPort: 443\n          ToPort: 443\n          CidrIp: 10.0.0.0/8",
  "sources": [
    {
      "title": "Detecting Unmanaged Configuration Changes to Stacks and Resources",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/detect-drift-stack.html"
    },
    {
      "title": "Viewing Drift Detection Results",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/detect-drift-stack-view-results.html"
    }
  ]
});
