import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-5",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "CloudFormation Templates",
  "status": "ready",
  "plainEnglish": "A CloudFormation template is a formatted text file (written in YAML or JSON) that serves as the blueprint for your AWS infrastructure. The template lists the AWS resources you want to create along with their configuration properties. It can also include optional sections for input parameters, output values, configuration mappings, conditional logic, and metadata. When submitted to AWS, CloudFormation reads the blueprint and builds the specified infrastructure automatically.",
  "whyItMatters": "Templates turn architecture diagrams into executable blueprints. Because templates are plain text files, they can be checked into Git repository branches, peer-reviewed via pull requests, and tested in pipeline environments before touching production.",
  "workplaceExample": "An enterprise devops team stores a core network template (vpc-network.yaml) in a Git repository. Whenever a netops engineer wants to add a new subnet CIDR block, they edit the template file and submit a pull request for review before deploying the updated template.",
  "examFocus": "For SAA-C03, know that Resources is the only mandatory top-level section in a CloudFormation template. All other sections (such as Parameters, Outputs, Mappings, Conditions, Description, and AWSTemplateFormatVersion) are optional.",
  "keyPoints": [
    "A template is a text file written in YAML or JSON that describes your desired AWS infrastructure state.",
    "Resources is the only required section in any CloudFormation template.",
    "AWSTemplateFormatVersion specifies the template syntax version (currently 2010-09-09).",
    "Templates can be stored locally or uploaded to an Amazon S3 bucket for deployment.",
    "Templates can define up to 500 resources per template by default, or be modularised using nested stacks."
  ],
  "commonMistake": "Assuming that top-level sections like Parameters or Outputs are required. Omitting Resources will cause template validation to fail immediately because AWS has nothing to provision. Always include at least one resource block in the Resources section.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Minimal valid template with the mandatory Resources section.\nResources:\n  NotificationTopic:\n    Type: AWS::SNS::Topic\n    Properties:\n      DisplayName: InfrastructureAlerts",
  "sources": [
    {
      "title": "Template Anatomy",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html"
    },
    {
      "title": "Working with AWS CloudFormation Templates",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-guide.html"
    }
  ]
});
