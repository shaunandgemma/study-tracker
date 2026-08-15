import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-22',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'Service-Linked Roles',
  status: 'ready',
  plainEnglish: 'A Service-Linked Role is a predefined, specialized IAM role linked directly to an AWS service (such as Elastic Load Balancing, Auto Scaling, or AWS GuardDuty). Service-linked roles are created automatically by AWS when you configure a service. AWS manages their trust policies and permissions policies, which are pre-defined to include all the permissions that the service needs to call other AWS services on your behalf.',
  whyItMatters: 'Before Service-Linked Roles, users had to manually research, construct, and attach complex IAM roles whenever enabling an AWS service like Auto Scaling or ELB. Service-Linked Roles eliminate setup errors by providing turnkey, service-managed permissions.',
  workplaceExample: 'When an administrator creates their first Auto Scaling Group, AWS automatically provisions the Service-Linked Role `AWSServiceRoleForAutoScaling`. AWS manages the role permissions, allowing Auto Scaling to launch and terminate EC2 instances seamlessly.',
  examFocus: 'SAA-C03 Service-Linked Role Characteristics:\n- Linked to specific AWS services (role path format: `AWSServiceRoleFor<ServiceName>`).\n- Predefined by AWS: You cannot modify permissions policies attached to a Service-Linked Role.\n- Creation: Created automatically when setting up the service, or created manually via CLI (`aws iam create-service-linked-role`).\n- Deletion: Can only be deleted if no active service resources are using it.',
  keyPoints: [
    'Predefined IAM role linked directly to a specific AWS service.',
    'Permissions policies are managed by AWS and cannot be edited by users.',
    'Automatically created when initializing supported AWS services.',
    'Role path naming follows `AWSServiceRoleFor<Service>` convention.',
    'Protected from accidental deletion while active resources depend on it.'
  ],
  commonMistake: 'Attempting to edit or detach permissions policies on a Service-Linked Role. Users cannot modify the predefined permissions of a Service-Linked Role.',
  example: 'Creating a Service-Linked Role via AWS CLI:\naws iam create-service-linked-role --aws-service-name autoscaling.amazonaws.com',
  sources: [
    { title: 'Using service-linked roles', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_using.html' }
  ]
});
