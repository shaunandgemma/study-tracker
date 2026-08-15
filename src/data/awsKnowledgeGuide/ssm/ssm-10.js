import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-10",
  "title": "Inventory",
  "plainEnglish": "AWS Systems Manager Inventory is an automated metadata collection feature that continuously gathers detailed operating system, application, and system configuration metadata from all your managed nodes. Inventory collects information on installed software applications, package versions, OS details, CPU/memory hardware specs, network configurations (IPs, MAC addresses), Windows services, Windows registry entries, and custom inventory files, storing the data centrally in AWS.",
  "whyItMatters": "Software asset management and software license compliance require knowing the exact software packages and versions installed on every server. Systems Manager Inventory provides a centralized, automated software catalog without installing heavy third-party asset management tools. When paired with Resource Data Sync to Amazon S3, you can query fleet-wide software inventory using standard SQL in Amazon Athena.",
  "workplaceExample": "A corporate software auditor asks for a list of all servers running vulnerable versions of Apache Log4j across 1,000 EC2 instances. The cloud architect sets up Systems Manager Inventory on a 12-hour collection schedule and enables Resource Data Sync to an S3 bucket. Using Amazon Athena, the architect executes: `SELECT instance_id, name, version FROM inventory_applications WHERE name LIKE '%log4j%'`, generating an audit report across all 1,000 instances in 4 seconds.",
  "examFocus": "Understand Systems Manager Inventory capabilities and Resource Data Sync: (1) Collected Data Types: Applications, AWS components, Network configs, Operating systems, Services, Windows Updates, Windows Registry, and Custom Inventory files. (2) Collection Mechanism: Executed by SSM Agent via an automated State Manager association (`AWS-GatherSoftwareInventory`). (3) Resource Data Sync: Aggregates inventory data from multiple AWS accounts and multiple AWS Regions into a single central Amazon S3 bucket for SQL querying via Amazon Athena.",
  "keyPoints": [
    "Collects operating system, software application, and configuration metadata from managed nodes.",
    "Tracks installed software packages, versions, network settings, and running OS services.",
    "Enabled via an automated State Manager association running `AWS-GatherSoftwareInventory`.",
    "Supports custom inventory collection via JSON/YAML files placed on the managed node.",
    "Uses Resource Data Sync to aggregate multi-account and multi-region metadata into Amazon S3.",
    "Enables interactive SQL analysis and compliance querying using Amazon Athena and Amazon QuickSight."
  ],
  "commonMistake": "Writing custom bash scripts on every instance to dump installed packages to S3 when Systems Manager Inventory with Resource Data Sync handles automated metadata collection and Athena SQL indexing out-of-the-box.",
  "example": "Set up automated Inventory collection across all managed instances on a 24-hour schedule using the AWS CLI: aws ssm create-association --name 'AWS-GatherSoftwareInventory' --targets 'Key=InstanceIds,Values=*' --schedule-expression 'rate(1 day)'.",
  "sources": [
    {
      "title": "AWS Systems Manager Inventory User Guide",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-inventory.html"
    },
    {
      "title": "Configuring Resource Data Sync for Inventory Data",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-inventory-resource-data-sync.html"
    }
  ]
});
