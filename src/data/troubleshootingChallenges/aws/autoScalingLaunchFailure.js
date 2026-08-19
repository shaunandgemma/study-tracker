export default Object.freeze({
  id: 'aws-auto-scaling-launch-failure',
  examId: 'aws-saa-c03',
  order: 9,
  category: 'Auto Scaling',
  title: 'Recover an Auto Scaling Group That Cannot Launch Instances',
  difficulty: 'Intermediate',
  summary: 'Diagnose why an Auto Scaling group cannot replace a failed instance.',
  scenario: 'The fa-training-web-asg Auto Scaling group should maintain two healthy web instances across two private subnets. One instance was terminated during maintenance, but the group remains below desired capacity because every replacement launch attempt fails. The group must be repaired without switching to public subnets or removing its instance role.',
  task: 'Use the launch and activity evidence to identify the failed dependency, make the smallest safe correction, and verify that the Auto Scaling group returns to desired capacity using the approved launch template.',
  evidence: [
    {
      id: 'asg-activity',
      title: 'Auto Scaling Activity History',
      kind: 'code',
      content: `Auto Scaling group: fa-training-web-asg
Min size: 2
Desired capacity: 2
Max size: 4
Current instances: 1

Activity:
Launching a new EC2 instance.
Status: Failed
Cause: In response to a difference between desired and actual capacity, a new instance was started.
Error: The image id '[ami-0oldtraining123]' does not exist`
    },
    {
      id: 'launch-template',
      title: 'Launch Template Version 7',
      kind: 'code',
      content: `Launch template: fa-training-web-lt
Default version: 7
AMI ID: ami-0oldtraining123
Instance type: t3.micro
IAM instance profile: fa-training-web-role
Security group: sg-0trainingweb123
User data: configured`
    },
    {
      id: 'approved-image',
      title: 'Approved Build Information',
      kind: 'text',
      content: 'The old training AMI was deregistered after patching. The currently approved replacement AMI is ami-0newtraining456. The subnets have available IP capacity, the t3.micro instance type is permitted, and fa-training-web-role must remain attached.'
    }
  ],
  successCriteria: [
    'The learner identifies the invalid AMI reference as the launch failure.',
    'A new launch-template version uses the approved AMI ami-0newtraining456 while preserving the approved instance role and security group.',
    'The Auto Scaling group uses the corrected launch-template version without moving instances to public subnets.',
    'A final verification shows two healthy instances and the Auto Scaling group at desired capacity.'
  ],
  hints: [
    'Start with the Auto Scaling activity history because it records the reason EC2 rejected the launch request.',
    'An Auto Scaling group can be correctly configured while its launch template still references a dependency that no longer exists.',
    'Create a corrected launch-template version with the currently approved AMI, then make sure the Auto Scaling group uses that version.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why can the Auto Scaling group not launch replacement instances?',
      options: [
        { id: 'invalid-ami', text: 'The launch template references a deregistered AMI that no longer exists.' },
        { id: 'subnet-capacity', text: 'Both private subnets have run out of available IP addresses.' },
        { id: 'instance-profile', text: 'The launch template is missing its required IAM instance profile.' },
        { id: 'instance-type', text: 'The t3.micro instance type is not allowed for this workload.' }
      ],
      correctOptionId: 'invalid-ami',
      explanation: 'The activity history explicitly reports that ami-0oldtraining123 does not exist, while the other launch-template dependencies are shown as valid.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective remediation?',
      options: [
        { id: 'new-template-version', text: 'Create a new launch-template version using ami-0newtraining456, preserve the approved settings, and point the Auto Scaling group at that version.' },
        { id: 'public-subnets', text: 'Move the Auto Scaling group into public subnets so EC2 can find the AMI.' },
        { id: 'remove-role', text: 'Remove the instance profile to simplify the launch request.' },
        { id: 'manual-instance', text: 'Launch one standalone EC2 instance manually and stop using the Auto Scaling group.' }
      ],
      correctOptionId: 'new-template-version',
      explanation: 'Updating only the invalid AMI reference preserves the approved design and allows the Auto Scaling group to resume normal replacement launches.'
    }
  ],
  solution: {
    rootCause: 'The Auto Scaling group uses launch-template version 7, which references deregistered AMI ami-0oldtraining123, so every replacement launch is rejected before an instance can start.',
    fix: 'Create a new launch-template version that replaces the invalid AMI with approved AMI ami-0newtraining456, keep the existing role, security group, instance type and user data, update the Auto Scaling group to use the corrected version, and verify it returns to two healthy instances.',
    prevention: 'Before deregistering an AMI, identify launch templates that reference it and update dependent Auto Scaling groups through a controlled image-version rollout.'
  }
});
