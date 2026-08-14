import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-15",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Resource Dependencies",
  "status": "ready",
  "plainEnglish": "Resource dependencies determine the order in which CloudFormation provisions, updates, or deletes resources within a stack. In most cases, CloudFormation automatically infers dependencies by analyzing intrinsic function references (like !Ref or !GetAtt) between resources and creates independent resources concurrently in parallel. However, when one resource relies on another being fully active but does not explicitly reference it via an intrinsic function, you use the DependsOn attribute to explicitly enforce creation ordering.",
  "whyItMatters": "Correct dependency management prevents stack creation failures. If an application server attempts to connect to an Internet Gateway before the Gateway is fully attached to the VPC, network setup fails. Proper explicit or implicit dependencies guarantee resources are initialized in strict, stable sequence.",
  "workplaceExample": "An EC2 instance in a public subnet requires an Internet Gateway to be attached to the VPC before the instance runs its initialization script. The template author adds DependsOn: VPCGatewayAttachment to the EC2 instance resource block, ensuring AWS waits for the gateway attachment to complete.",
  "examFocus": "For SAA-C03, compare automatically inferred dependencies with explicit DependsOn dependencies. CloudFormation automatically builds a dependency graph whenever you use !Ref or !GetAtt. Use DependsOn only when no direct reference exists between two resources (e.g., ensuring an Elastic IP allocation waits for a VPC Internet Gateway attachment).",
  "keyPoints": [
    "CloudFormation constructs a dependency graph to determine resource creation and deletion ordering.",
    "Dependencies are automatically inferred whenever !Ref or !GetAtt links two resources together.",
    "DependsOn explicitly defines a dependency when no property reference exists between resources.",
    "Resources with no mutual dependencies are created concurrently in parallel to speed up deployment.",
    "Stack deletion proceeds in reverse dependency order to tear down dependent resources safely first."
  ],
  "commonMistake": "Adding redundant DependsOn attributes to resources that already use !Ref or !GetAtt to reference each other. CloudFormation already handles these dependencies automatically, so adding extra DependsOn directives creates unnecessary visual clutter in template code.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nResources:\n  MyVPC:\n    Type: AWS::EC2::VPC\n    Properties:\n      CidrBlock: 10.0.0.0/16\n  InternetGateway:\n    Type: AWS::EC2::InternetGateway\n  VPCGatewayAttachment:\n    Type: AWS::EC2::VPCGatewayAttachment\n    Properties:\n      VpcId: !Ref MyVPC\n      InternetGatewayId: !Ref InternetGateway\n  ServerEIP:\n    Type: AWS::EC2::EIP\n    DependsOn: VPCGatewayAttachment\n    Properties:\n      Domain: vpc",
  "sources": [
    {
      "title": "DependsOn Attribute",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html"
    },
    {
      "title": "Resource Dependency Order in CloudFormation",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/ourtemplates-dependencies.html"
    }
  ]
});
