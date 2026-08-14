import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-14",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Intrinsic Functions",
  "status": "ready",
  "plainEnglish": "Intrinsic functions are built-in helper functions provided by AWS CloudFormation to assign values to resource properties that are not known until runtime (stack execution time). These functions allow you to reference other resources, retrieve resource attributes, concatenate strings, perform conditional logic, and parse JSON strings dynamically while CloudFormation creates your infrastructure.",
  "whyItMatters": "Infrastructure is highly interconnected. An EC2 security group needs the VPC ID, an EC2 instance needs the Security Group ID, and an IAM policy needs the S3 Bucket ARN. Intrinsic functions eliminate hardcoded identifiers by dynamically passing generated runtime values between resources during deployment.",
  "workplaceExample": "An application deployment template creates an S3 bucket and an EC2 instance. Using !GetAtt ApplicationBucket.Arn, the template dynamically injects the newly generated S3 bucket ARN directly into the IAM role policy attached to the EC2 instance.",
  "examFocus": "For SAA-C03, memorize key intrinsic functions and their exact use cases: !Ref returns physical ID or parameter value; !GetAtt retrieves specific attributes of a resource (e.g., ARNs, IPs); !Sub substitutes variables into strings; !Join concatenates values; !ImportValue imports cross-stack exports; !Base64 encodes strings for EC2 UserData scripts.",
  "keyPoints": [
    "Intrinsic functions resolve dynamic values at runtime that cannot be hardcoded in advance.",
    "!Ref returns a parameter's value or a resource's physical ID (e.g., VPC ID or Subnet ID).",
    "!GetAtt retrieves resource-specific attributes like ARNs, DNS names, and private IP addresses.",
    "!Sub simplifies string formatting by substituting parameters and resource attributes into text.",
    "!Base64 converts text strings to Base64 format, required for EC2 instance UserData bootstrap scripts."
  ],
  "commonMistake": "Confusing !Ref and !GetAtt. Calling !Ref on an S3 bucket returns the bucket name, whereas calling !GetAtt MyBucket.Arn returns its full Amazon Resource Name (ARN). Always check AWS documentation to confirm what !Ref returns for a specific resource type.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nParameters:\n  ProjectName:\n    Type: String\n    Default: finance\nResources:\n  DataBucket:\n    Type: AWS::S3::Bucket\n    Properties:\n      BucketName: !Sub '${ProjectName}-data-storage-${AWS::AccountId}'",
  "sources": [
    {
      "title": "Intrinsic Function Reference",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html"
    },
    {
      "title": "Fn::Sub Function Reference",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-sub.html"
    }
  ]
});
