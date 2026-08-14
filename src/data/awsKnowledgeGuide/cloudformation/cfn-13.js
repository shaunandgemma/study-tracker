import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-13",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Conditions",
  "status": "ready",
  "plainEnglish": "The Conditions section allows you to control whether specific AWS resources are created or whether certain resource properties are assigned based on input parameters or evaluated statement logic. You define condition statements using logical intrinsic functions such as Fn::Equals, Fn::And, Fn::Or, and Fn::Not. During stack deployment, CloudFormation evaluates these statements; if a condition evaluates to true, the associated resource is created; if false, the resource is skipped entirely.",
  "whyItMatters": "Conditions allow a single template to accommodate different environment requirements cleanly. For example, you can automatically provision a multi-AZ standby database in production while skipping the costly standby instance in development environments, saving cloud spend without maintaining duplicate templates.",
  "workplaceExample": "An enterprise cloud architect writes a unified database template. A condition CreateProdResources checks if Parameter Environment == 'prod'. When deploying in dev, CloudFormation skips creating the CloudWatch Alarm and Read Replica resources, but deploys them automatically in production.",
  "examFocus": "For SAA-C03, understand that Conditions enable conditional resource creation and conditional property assignment based on parameters. Know the key condition functions (Fn::Equals, Fn::And, Fn::Or, Fn::Not, Fn::If). Recognize that conditional resources are defined by attaching a Condition: ConditionName key inside the resource definition block.",
  "keyPoints": [
    "Conditions control whether resources or properties are created based on evaluated logical statements.",
    "Defined in the Conditions section using functions like Fn::Equals, Fn::And, Fn::Or, and Fn::Not.",
    "Attached to resources using the Condition: ConditionName attribute within resource blocks.",
    "Uses Fn::If inside resource properties to select between two values dynamically based on a condition result.",
    "Reduces template proliferation by letting one master template adapt to dev, test, and prod needs safely."
  ],
  "commonMistake": "Trying to use standard programming if/else statements inside template code instead of native CloudFormation condition syntax (Fn::Equals and Fn::If), resulting in syntax parsing errors. Always use CloudFormation's built-in condition functions.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nParameters:\n  EnvType:\n    Type: String\n    Default: dev\n    AllowedValues: [dev, prod]\nConditions:\n  IsProd: !Equals [!Ref EnvType, 'prod']\nResources:\n  ProdAlertTopic:\n    Type: AWS::SNS::Topic\n    Condition: IsProd\n    Properties:\n      TopicName: HighPriorityProductionAlerts",
  "sources": [
    {
      "title": "Conditions Section Structure",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html"
    },
    {
      "title": "Condition Functions Reference",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html"
    }
  ]
});
