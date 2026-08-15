import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-24',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Storage Gateway EC2 Deployment',
  status: 'ready',
  plainEnglish: 'Storage Gateway can be deployed as an Amazon EC2 instance running within an AWS Region. This is useful for cloud-based workloads that need gateway functionality—for example, presenting an iSCSI volume to an EC2 application server, providing a VTL interface to cloud-hosted backup software, or serving as a test and development gateway without on-premises hardware.',
  whyItMatters: 'Not all gateway use cases involve on-premises sites. Deploying a gateway on EC2 enables cloud-to-cloud workflows such as migrating Volume Gateway snapshots to usable volumes, testing gateway configurations, or running backup software in AWS that expects iSCSI or VTL targets.',
  workplaceExample: 'A company migrating from on-premises to AWS deploys a Volume Gateway on EC2. They restore their on-premises Volume Gateway EBS snapshots to new cached volumes on the EC2 gateway, then attach them to application servers running in the same VPC.',
  examFocus: 'SAA-C03 EC2 Gateway Deployment:\n- AMI-Based: AWS provides a Storage Gateway AMI in the AWS Marketplace for launching EC2 gateway instances.\n- EBS Cache Disks: Use EBS volumes (gp3, io2) as cache and upload-buffer disks.\n- Use Cases: Cloud-hosted backup targets, gateway testing, snapshot migration, and DR failover.\n- Networking: EC2 gateway communicates with S3 and other AWS services over the AWS network.',
  keyPoints: [
    'Deploys Storage Gateway as an EC2 instance using an AWS-provided AMI.',
    'Uses EBS volumes for cache and upload-buffer storage.',
    'Useful for cloud-based backup targets, migration testing, and DR failover.',
    'Can present iSCSI volumes or VTL targets to other EC2 application servers.',
    'Eliminates the need for on-premises hardware when the workload runs in AWS.'
  ],
  commonMistake: 'Deploying an EC2 gateway with insufficient EBS volume IOPS for cache disks, causing poor storage performance for applications connected via iSCSI.',
  example: 'EC2 Gateway Deployment Flow:\n1. Launch the Storage Gateway AMI from the AWS Marketplace.\n2. Attach EBS gp3 volumes for cache and upload buffer.\n3. Activate the gateway through the Storage Gateway console.\n4. Configure volumes, file shares, or VTL as needed.\n5. Connect application servers in the same VPC via iSCSI or NFS.',
  sources: [
    { title: 'Deploying a Storage Gateway on Amazon EC2', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/ec2-gateway-common.html' }
  ]
});
