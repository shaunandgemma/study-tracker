import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-10',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Public Virtual Interfaces - Public VIF',
  status: 'ready',
  plainEnglish: 'A Public Virtual Interface (Public VIF) is a network configuration on an AWS Direct Connect link that connects an on-premises network to PUBLIC AWS service endpoints worldwide (such as Amazon S3, DynamoDB, CloudFront, SQS, SNS, and public AWS API endpoints). By using a Public VIF, traffic destined for public AWS services bypasses internet service providers and travels entirely over your dedicated Direct Connect link and the AWS global backbone.',
  whyItMatters: 'Organizations storing petabytes of data in Amazon S3 or processing high-throughput messages in DynamoDB can use a Public VIF to achieve faster, more reliable, and cheaper data transfers compared to uploading over public internet connections.',
  workplaceExample: 'A media company uploads raw video archives directly from their production studio to Amazon S3 buckets. By configuring a Public VIF on their Direct Connect line, BGP advertises AWS public IP ranges to their router, routing all S3 traffic over the dedicated fiber link instead of their corporate internet connection.',
  examFocus: 'SAA-C03 distinction:\n- Private VIF: Connects to PRIVATE VPC CIDRs (EC2, RDS, internal ALB).\n- Public VIF: Connects to PUBLIC AWS services (S3, DynamoDB, CloudFront, SQS) across ALL global AWS regions.\n- Public VIF requires advertising public IPv4 addresses or receiving approval for private ASNs/IPs, and BGP receives over 10,000+ AWS public IP prefixes.',
  keyPoints: [
    'Connects on-premises networks to public AWS service endpoints (S3, DynamoDB, SQS).',
    'Traffic travels over Direct Connect link rather than public ISP networks.',
    'Receives BGP route advertisements for all public AWS IP address ranges globally.',
    'Allows accessing S3 without needing a VPC or VPC Endpoints.',
    'Reduces internet egress charges for heavy S3/DynamoDB workloads.'
  ],
  commonMistake: 'Confusing Public VIF with internet access. A Public VIF connects ONLY to public AWS service IP addresses, not to general internet websites (like Google or Netflix).',
  example: 'Public VIF Setup:\nVLAN: 200\nBGP Peers: Customer Router <-> AWS Public Gateway\nRoute Advertisements Received: ~12,000 AWS public IP prefixes via BGP.\nResult: Traffic to `s3.us-east-1.amazonaws.com` routes over Direct Connect.',
  sources: [
    { title: 'AWS Direct Connect Public Virtual Interfaces', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html' }
  ]
});
