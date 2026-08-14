import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-10",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Mappings",
  "status": "ready",
  "plainEnglish": "Mappings are static lookup tables hardcoded directly inside your CloudFormation template. They organize keys and values into two levels of nesting (a top-level key and a second-level key). Mappings are used to look up environment-specific or Region-specific configuration values—such as selecting the correct Amazon Machine Image (AMI) ID for us-east-1 versus eu-west-1—using the !FindInMap intrinsic function without requiring user input during stack creation.",
  "whyItMatters": "Mappings eliminate manual user input errors for predictable, region-dependent or environment-dependent values. Instead of asking a user to type in an AMI ID or database port during deployment, the template automatically resolves the exact correct value based on the current AWS Region.",
  "workplaceExample": "An automated CI/CD pipeline deploys a multi-region workload. The CloudFormation template uses a RegionMap mapping that pairs AWS Regions (us-east-1, eu-west-1, ap-southeast-1) with their corresponding golden AMI IDs. When deployed in Frankfurt (eu-central-1), !FindInMap automatically retrieves the Frankfurt AMI ID.",
  "examFocus": "On the SAA-C03 exam, compare Parameters and Mappings. Use Parameters when values must be supplied by the deployer or change per stack run. Use Mappings when values are fixed, static reference tables (such as region-to-AMI lookups or environment-to-instance-size tables) that should be embedded in the template and evaluated automatically using !FindInMap.",
  "keyPoints": [
    "Mappings define a static two-level lookup table within the template structure.",
    "Values are retrieved using the !FindInMap [ MapName, TopLevelKey, SecondLevelKey ] intrinsic function.",
    "Mappings are ideal for Region-to-AMI mappings, environment tier sizing, and architecture defaults.",
    "Unlike Parameters, Mappings do not prompt the user for input during stack deployment.",
    "Top-level keys in Mappings can be dynamically resolved using pseudo parameters like !Ref AWS::Region."
  ],
  "commonMistake": "Using Parameters to ask users to manually input Region-specific AMI IDs, leading to deployment failures when users enter incorrect IDs or IDs from a different region. Use a Mappings table with !FindInMap and AWS::Region for reliable multi-region template lookups.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Uses Mappings to resolve region-specific AMI IDs automatically.\nMappings:\n  RegionMap:\n    us-east-1:\n      AMI: ami-0c55b159cbfafe1f0\n    eu-west-1:\n      AMI: ami-0084a47fc9882393a\nResources:\n  EC2Instance:\n    Type: AWS::EC2::Instance\n    Properties:\n      InstanceType: t3.micro\n      ImageId: !FindInMap [ RegionMap, !Ref 'AWS::Region', AMI ]",
  "sources": [
    {
      "title": "Mappings Section Structure",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/mappings-section-structure.html"
    },
    {
      "title": "!FindInMap Intrinsic Function",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-findinmap.html"
    }
  ]
});
