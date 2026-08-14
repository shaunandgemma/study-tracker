import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-6",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "YAML and JSON Templates",
  "status": "ready",
  "plainEnglish": "CloudFormation supports templates written in two data formats: YAML (YAML Ain't Markup Language) and JSON (JavaScript Object Notation). Both formats represent the exact same AWS infrastructure concepts and support identical resource definitions. However, YAML is widely preferred by cloud engineers because it allows human-readable code comments, uses clean indentation instead of complex nested curly braces and brackets, and supports short-form syntax for CloudFormation intrinsic functions (such as !Ref instead of {\"Ref\": \"...\"}).",
  "whyItMatters": "Choosing YAML over JSON dramatically improves template readability and maintainability. Cloud teams can add inline comment lines explaining complex network choices or security settings, reducing onboarding time for new team members.",
  "workplaceExample": "An engineering team converts legacy 2,000-line JSON templates into YAML. The resulting files are 40% shorter, include descriptive inline comments for security auditors, and use short-form helper syntax like !GetAtt and !Sub for better clarity.",
  "examFocus": "On the SAA-C03 exam, recognize that YAML and JSON templates have functional parity in CloudFormation. However, YAML supports inline comments (# comment) and short-form intrinsic function syntax (!Ref, !GetAtt, !Sub), whereas JSON does not support comments or shorthand syntax.",
  "keyPoints": [
    "Both YAML and JSON format specifications are fully supported by AWS CloudFormation.",
    "YAML supports inline code comments (#), making templates easier to document and maintain.",
    "YAML enables shorthand intrinsic function syntax such as !Ref MyResource and !Sub ${MyParam}.",
    "JSON requires strict quotes, trailing comma avoidance, and verbose object structures like {\"Ref\": \"MyResource\"}.",
    "AWS CloudFormation automatically parses both formats identically when validating and creating stacks."
  ],
  "commonMistake": "Trying to use shorthand intrinsic functions like !Ref inside a JSON template, or adding comments (//) to JSON templates, which causes immediate JSON syntax validation errors. Use YAML for human-friendly syntax and comment support.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Demonstrates clean YAML syntax with shorthand functions and comments.\nResources:\n  # Security group for web traffic\n  WebSecurityGroup:\n    Type: AWS::EC2::SecurityGroup\n    Properties:\n      GroupDescription: Allow HTTP inbound\n      SecurityGroupIngress:\n        - IpProtocol: tcp\n          FromPort: 80\n          ToPort: 80\n          CidrIp: 0.0.0.0/0",
  "sources": [
    {
      "title": "AWS CloudFormation Template Formats",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-formats.html"
    },
    {
      "title": "Learn Template Basics - YAML vs JSON",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/gettingstarted.templatebasics.html"
    }
  ]
});
