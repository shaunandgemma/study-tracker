import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-11',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'EC2 Launch Templates',
  status: 'ready',
  plainEnglish: 'An EC2 Launch Template in AWS MGN is a standard Amazon EC2 configuration blueprint used by MGN to instantiate target virtual machines. It defines essential EC2 parameters—such as target Instance Type (e.g. `m6i.xlarge`), Subnet ID, Security Groups, IAM Instance Profile, Private IP Assignment, Storage Volume Types (`gp3`/`io2`), and Resource Tags.',
  whyItMatters: 'Using native EC2 Launch Templates provides full access to advanced EC2 capabilities (such as Placement Groups, Nitro Enclaves, and EBS IOPS settings) while ensuring target server configurations match enterprise cloud architecture standards.',
  workplaceExample: 'A cloud architect configures an EC2 Launch Template for a production web server: target subnet `subnet-prod-az1`, security group `sg-web-prod`, instance type `c6i.2xlarge`, IAM role `WebInstanceProfile`, and tag `Environment=Production`.',
  examFocus: 'SAA-C03 Launch Template Configuration in MGN:\n- Editable in EC2 or MGN Console: MGN creates a default EC2 Launch Template for each source server that can be customized.\n- Network & Placement: Defines target Subnet, Security Groups, Elastic IPs, or static private IP addresses.\n- Storage Configuration: Override default EBS volume types (convert legacy `gp2` to `gp3` or provisioned IOPS `io2`).\n- Versioning: Supports EC2 Launch Template versioning to roll back configuration changes if testing fails.',
  keyPoints: [
    'Standard EC2 blueprint controlling target instance parameters during test/cutover.',
    'Defines EC2 Instance Type, Subnet ID, Security Groups, and IAM Roles.',
    'Controls EBS volume types (`gp3`/`io2`), encryption keys, and provisioned IOPS.',
    'Supports static private IP assignment and resource tagging.',
    'Utilizes EC2 Launch Template versioning for safe rollback of launch settings.'
  ],
  commonMistake: 'Selecting an obsolete EC2 instance type (such as `m3.medium`) in the Launch Template that is not supported in the target AWS Region or Availability Zone.',
  example: 'Modifying MGN EC2 Launch Template via AWS CLI:\naws ec2 create-launch-template-version --launch-template-id lt-0123456789abcdef0 --launch-template-data \'{"InstanceType":"m6i.xlarge","SecurityGroupIds":["sg-0123456789abcdef0"]}\'',
  sources: [
    { title: 'EC2 launch templates in AWS MGN', url: 'https://docs.aws.amazon.com/mgn/latest/ug/ec2-launch-templates.html' }
  ]
});
