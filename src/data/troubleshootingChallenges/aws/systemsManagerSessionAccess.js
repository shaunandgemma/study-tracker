export default Object.freeze({
  id: 'aws-ssm-session-manager-access',
  examId: 'aws-saa-c03',
  order: 8,
  category: 'Systems Manager',
  title: 'Restore Systems Manager Session Manager Access',
  difficulty: 'Intermediate',
  summary: 'Diagnose why a private EC2 instance cannot become available in Session Manager.',
  scenario: 'A private Amazon EC2 instance named fa-training-app-01 was recently rebuilt in subnet-0private123. Administrators are expected to manage it only through AWS Systems Manager Session Manager, with no public IP address and no inbound SSH rule. The instance is running, but it does not appear as an available managed node and Session Manager cannot start a session.',
  task: 'Use the supplied evidence to identify the cause of the Session Manager failure, choose the smallest safe correction, and verify that the instance becomes manageable without adding a public IP address, opening SSH, or broadening permissions unnecessarily.',
  evidence: [
    {
      id: 'instance-profile',
      title: 'EC2 Instance Details',
      kind: 'code',
      content: `Instance ID: i-0training123
Name: fa-training-app-01
State: running
Subnet: subnet-0private123
Public IPv4 address: None
IAM instance profile: None
Security group outbound: All traffic allowed
SSM Agent status from console screenshot before rebuild: Installed and enabled`
    },
    {
      id: 'network-path',
      title: 'Private Subnet Connectivity',
      kind: 'code',
      content: `Route table: rtb-0private123
10.40.0.0/16 -> local
0.0.0.0/0 -> nat-0training123

NAT gateway state: Available
NAT gateway subnet: subnet-0public123

VPC DNS support: enabled
VPC DNS hostnames: enabled`
    },
    {
      id: 'approved-boundary',
      title: 'Approved Access Boundary',
      kind: 'text',
      content: 'The instance must remain private. Do not assign a public IP address, do not add inbound SSH access, and do not attach AdministratorAccess. The approved EC2 role for managed nodes is fa-training-ssm-role, which has the AWS managed policy AmazonSSMManagedInstanceCore attached.'
    }
  ],
  successCriteria: [
    'The learner identifies why the instance is not registering as a Systems Manager managed node.',
    'The instance is associated with the approved fa-training-ssm-role instance profile.',
    'The instance remains private with no public IP address and no inbound SSH rule.',
    'A final verification shows the instance online in Systems Manager and a Session Manager session can start.'
  ],
  hints: [
    'Compare the EC2 instance details with the approved access boundary and look for something Systems Manager needs before it can act on the instance.',
    'The SSM Agent must be able to call Systems Manager APIs using AWS credentials supplied to the instance through an IAM role.',
    'The network path is already present, so focus on attaching the approved Systems Manager instance profile rather than changing routes or security-group ingress.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What is the root cause of the Session Manager failure?',
      options: [
        { id: 'missing-profile', text: 'The EC2 instance has no IAM instance profile, so the SSM Agent has no role credentials to register with Systems Manager.' },
        { id: 'missing-public-ip', text: 'The instance needs a public IPv4 address before Session Manager can connect.' },
        { id: 'missing-ssh', text: 'The security group must allow inbound TCP port 22 from the internet.' },
        { id: 'dns-disabled', text: 'VPC DNS support is disabled, preventing the instance from resolving Systems Manager endpoints.' }
      ],
      correctOptionId: 'missing-profile',
      explanation: 'The evidence shows working outbound connectivity and DNS, but the instance has no IAM instance profile even though the approved SSM role already exists.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'attach-approved-role', text: 'Attach the fa-training-ssm-role instance profile and verify the node becomes Online in Systems Manager before starting a session.' },
        { id: 'attach-admin', text: 'Attach AdministratorAccess to the instance so every Systems Manager API is allowed.' },
        { id: 'add-public-ip', text: 'Assign a public IP address and retry Session Manager.' },
        { id: 'open-ssh', text: 'Allow inbound SSH from 0.0.0.0/0 as a fallback management path.' }
      ],
      correctOptionId: 'attach-approved-role',
      explanation: 'The approved role already contains the managed-node permissions required by the SSM Agent, so attaching that instance profile fixes the missing credential source without weakening the network boundary.'
    }
  ],
  solution: {
    rootCause: 'The rebuilt EC2 instance was launched without the required IAM instance profile, leaving the SSM Agent without credentials to register and communicate with Systems Manager.',
    fix: 'Attach the existing fa-training-ssm-role instance profile to i-0training123, wait for the managed node to report Online in Systems Manager, and then start a Session Manager session to verify access.',
    prevention: 'Require the approved Systems Manager instance profile in the launch template or provisioning workflow and add a post-build check that every private management instance appears Online in Systems Manager.'
  }
});
