import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-1',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'Primary Migration Service for Lift-and-Shift Server Rehosting to AWS',
  status: 'ready',
  plainEnglish: 'AWS Application Migration Service (AWS MGN) is the primary AWS service for rehosting (lift-and-shift) physical, virtual, or cloud-based servers directly to Amazon EC2. MGN automatically replicates source server disks at the block level into a low-cost staging area in your AWS target Region, maintaining continuous synchronization until you are ready to test and cut over to production.',
  whyItMatters: 'Manual server migrations require long maintenance outages and complex disk imaging. MGN minimizes business disruption by performing background continuous replication while source servers remain online, drastically reducing cutover windows to minutes.',
  workplaceExample: 'An enterprise migrates 200 legacy Linux and Windows servers from an on-premises VMware data center to AWS. Using AWS MGN, the team installs the AWS Replication Agent on all servers. MGN replicates storage blocks continuously into a target AWS staging subnet while production applications remain live.',
  examFocus: 'SAA-C03 Core Concept for AWS MGN:\n- Primary Service: AWS MGN is the recommended AWS service for server rehosting (lift-and-shift).\n- Rehosting vs Replatforming: Rehosting moves OS, applications, and disk state as-is to EC2 without code refactoring.\n- Staging Architecture: Replicates data continuously into low-cost staging EBS volumes attached to lightweight Replication Servers.\n- Successor Service: Replaces legacy CloudEndure Migration and Server Migration Service (SMS).',
  keyPoints: [
    'Primary AWS service for automated lift-and-shift (rehost) server migrations.',
    'Replicates physical, virtual, or cloud source servers to Amazon EC2.',
    'Uses continuous block-level data replication into a low-cost staging area.',
    'Minimizes cutover downtime to minutes while source servers remain online.',
    'Successor to legacy CloudEndure Migration and AWS Server Migration Service.'
  ],
  commonMistake: 'Expecting AWS MGN to automatically modernize or refactor application code. MGN rehosts operating systems and disk states as-is onto EC2.',
  example: 'Installing AWS MGN Agent on Linux Source Server via CLI:\nwget -O ./aws-replication-installer-init.py https://aws-application-migration-service-us-east-1.s3.us-east-1.amazonaws.com/latest/linux/aws-replication-installer-init.py\npython3 aws-replication-installer-init.py --region us-east-1 --aws-access-key-id <ACCESS_KEY> --aws-secret-access-key <SECRET_KEY>',
  sources: [
    { title: 'What is AWS Application Migration Service?', url: 'https://docs.aws.amazon.com/mgn/latest/ug/what-is-application-migration-service.html' }
  ]
});
