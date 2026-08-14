import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-22',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 AMIs',
  status: 'ready',
  plainEnglish: 'An Amazon Machine Image (AMI) is a pre-configured template used to launch EC2 instances. An AMI contains the operating system (e.g. Amazon Linux, Ubuntu, Windows), application server, pre-installed software, block device mapping configuration, and launch permissions. Every EC2 instance launched in AWS requires an AMI as its blueprint.',
  whyItMatters: 'AMIs allow instant deployment of standardized, pre-configured server blueprints across hundreds of EC2 instances. Using golden AMIs eliminates manual server setup and speeds up auto-scaling times.',
  workplaceExample: 'A DevOps team builds a custom golden AMI containing Amazon Linux 2023, security agents, Node.js, and web application code. When launching new web servers in an Auto Scaling group, new instances boot fully configured in under 45 seconds using this AMI.',
  examFocus: 'SAA-C03 AMI details:\n- AMIs are REGION-SPECIFIC. To use an AMI in another region, you must COPY the AMI to that region.\n- AMIs are built from EBS snapshots or backing instance store templates.\n- EC2 Image Builder automates the creation, testing, and deployment of customized AMIs.',
  keyPoints: [
    'Pre-packaged template containing OS, application software, and configuration.',
    'Region-specific resource (must copy AMI to use in a different AWS region).',
    'Created from running EC2 instances or EBS root volume snapshots.',
    'Automate AMI creation using EC2 Image Builder.',
    'Instances launched from an AMI inherit its root volume configuration and pre-installed packages.'
  ],
  commonMistake: 'Trying to launch an EC2 instance in `us-west-2` using an AMI ID (`ami-12345678`) created in `us-east-1`. AMI IDs are specific to a single region.',
  example: 'Copying an AMI to another region:\n`aws ec2 copy-image --source-image-id ami-0123456789abcdef0 --source-region us-east-1 --region us-west-2 --name "Golden-App-Image-v1"`',
  sources: [
    { title: 'Amazon Machine Images (AMI)', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html' }
  ]
});
