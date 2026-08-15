import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-12",
  "title": "Amazon EC2-Compatible Compute on Snowball Edge",
  "plainEnglish": "Amazon EC2-Compatible Compute on Snowball Edge allows you to run virtual machines locally on your physical Snowball Edge device using standard Amazon EC2 instance workflows. When creating a Snowball job in the AWS Console, you select Amazon Machine Images (AMIs) from your AWS account to be pre-loaded onto the device. Once the device arrives on-premises, you can launch, stop, attach block storage volumes to, and manage EC2 instances locally using standard AWS CLI commands or AWS OpsHub.",
  "whyItMatters": "Engineering teams do not want to rewrite their application code, learn proprietary hypervisors, or build specialized software stacks just to run software on edge hardware. EC2-compatible compute on Snowball Edge provides complete API and tool consistency with the AWS cloud, allowing teams to develop and test their applications in the cloud and deploy them directly to edge appliances without modifications.",
  "workplaceExample": "A drone inspection service builds a computer vision pipeline on Ubuntu EC2 instances in AWS. When testing oil pipelines in remote deserts, the team selects their production AMI during Snowball Edge job creation. In the field, they connect their laptops to the Snowball Edge, launch an `sbe-c.2xlarge` EC2 instance via AWS OpsHub, and run their inspection pipeline locally, analyzing drone footage with identical scripts used in the cloud.",
  "examFocus": "Understand how EC2 instances operate on Snowball Edge: (1) AMI Preparation: AMIs must be created in AWS and specified during Snowball Edge job ordering to be pre-installed on the device. (2) Instance Types: Specific Snowball instance types include `sbe-c` (compute optimized) and `sbe-g` (GPU accelerated). (3) Management: Managed locally using AWS OpsHub or standard AWS CLI/SDK commands by pointing `--endpoint-url` to the Snowball's local IP address and port 8008. (4) Block Storage: Instances attach to local EBS-compatible block storage volumes on the device.",
  "keyPoints": [
    "Runs Amazon EC2 virtual machines locally on physical Snowball Edge hardware.",
    "AMIs are created in AWS and selected during Snowball Edge job creation for pre-loading.",
    "Provides dedicated Snowball instance types (`sbe-c` compute, `sbe-g` GPU-accelerated).",
    "Managed using familiar AWS CLI commands with a local `--endpoint-url` or AWS OpsHub GUI.",
    "Integrates with local EBS-compatible block storage volumes for persistent filesystem disks.",
    "Ensures total software and developer tooling consistency between AWS cloud and the tactical edge."
  ],
  "commonMistake": "Attempting to create or import new AMIs directly onto a Snowball Edge after it has already arrived on-premises. AMIs must be selected and packaged into the device image during the initial job creation in the AWS cloud console.",
  "example": "Launch an EC2 instance locally on a Snowball Edge using standard AWS CLI syntax: aws ec2 run-instances --image-id sbi-12345678abcdef --instance-type sbe-c.xlarge --key-name local-snow-key --endpoint-url http://192.168.1.50:8008.",
  "sources": [
    {
      "title": "Using Amazon EC2 Compute Instances on AWS Snowball Edge",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/ec2-instances.html"
    },
    {
      "title": "Launching and Managing EC2 Instances with AWS OpsHub",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/launching-ec2-instances.html"
    }
  ]
});
