import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-21",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Deletion Policies",
  "status": "ready",
  "plainEnglish": "A DeletionPolicy is a resource attribute in CloudFormation that controls what happens to a specific physical AWS resource when the containing stack is deleted or when the resource is removed from the template during an update. By default, CloudFormation deletes physical resources when a stack is deleted. Attaching DeletionPolicy: Retain preserves the resource in your AWS account, while DeletionPolicy: Snapshot creates a final backup snapshot (for supported resources like RDS, ElastiCache, and EBS) before deleting the resource itself.",
  "whyItMatters": "Accidentally deleting a CloudFormation stack should not mean permanently losing critical enterprise databases or historical S3 log archives. Deletion policies protect vital persistent data resources from irreversible destruction during accidental or routine stack tear-downs.",
  "workplaceExample": "A database administrator configures DeletionPolicy: Snapshot on a production Amazon RDS database instance in a CloudFormation template. When an engineer deletes the dev/test stack, CloudFormation takes a final RDS DB snapshot before destroying the database engine, guaranteeing zero data loss.",
  "examFocus": "For SAA-C03, compare DeletionPolicy options: Delete (default, destroys resource with stack), Retain (preserves resource as unmanaged standalone resource in AWS), Snapshot (creates automated backup before deletion on supported databases/volumes). Also understand UpdateReplacePolicy, which controls resource retention when a stack update forces resource replacement.",
  "keyPoints": [
    "DeletionPolicy controls resource retention when a stack is deleted or a resource is removed.",
    "Retain keeps the physical resource intact in AWS after the stack is deleted.",
    "Snapshot creates a final automated snapshot before deleting supported database and volume resources.",
    "UpdateReplacePolicy applies the same retention rules when an update forces a resource replacement.",
    "S3 buckets containing objects require DeletionPolicy: Retain or must be emptied before stack deletion can succeed."
  ],
  "commonMistake": "Assuming that deleting a stack will preserve S3 buckets or RDS databases by default. Without an explicit DeletionPolicy: Retain or DeletionPolicy: Snapshot, CloudFormation deletes the resources and all contained data permanently. Always configure deletion policies on persistent data stores.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Template protecting persistent database and storage resources with deletion policies.\nResources:\n  ProductionDatabase:\n    Type: AWS::RDS::DBInstance\n    DeletionPolicy: Snapshot\n    UpdateReplacePolicy: Snapshot\n    Properties:\n      DBInstanceIdentifier: prod-db-instance\n      DBInstanceClass: db.t3.micro\n      Engine: postgres\n      AllocatedStorage: 20\n      MasterUsername: dbadmin\n      MasterUserPassword: MustBePassedSecurelyViaParameter",
  "sources": [
    {
      "title": "DeletionPolicy Attribute",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html"
    },
    {
      "title": "UpdateReplacePolicy Attribute",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatereplacepolicy.html"
    }
  ]
});
