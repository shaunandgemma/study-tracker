export default Object.freeze({
  id: 'terraform-provider-api-logging-failure',
  examId: 'terraform-associate-004',
  order: 29,
  category: 'Terraform Diagnostics',
  title: 'Diagnose a Provider API Failure with Terraform Logs',
  difficulty: 'Advanced',
  summary: 'Use TF_LOG and TF_LOG_PATH to identify the AWS API permission behind a failing Terraform read.',
  scenario: 'terraform plan repeatedly retries while reading subnet information and eventually fails. The visible error does not make the missing AWS action obvious enough for the team to correct its least-privilege role confidently. Debug logging is approved for this incident, but the generated log must be treated as sensitive diagnostic data.',
  task: 'Use the supplied normal error and Terraform debug log to identify the provider API call that is being denied, choose the narrowest permission correction, and verify a new plan succeeds after logging is disabled.',
  evidence: [
    {
      id: 'normal-error',
      title: 'Normal terraform plan Failure',
      kind: 'code',
      content: `$ terraform plan

data.aws_subnets.private: Reading...

╷
│ Error: reading EC2 Subnets
│
│   with data.aws_subnets.private,
│   on data.tf line 1, in data "aws_subnets" "private":
│    1: data "aws_subnets" "private" {
│
│ operation error EC2: DescribeSubnets,
│ exceeded maximum number of attempts
╵`
    },
    {
      id: 'logging-command',
      title: 'Approved Diagnostic Run',
      kind: 'code',
      content: `PowerShell:
$env:TF_LOG = "TRACE"
$env:TF_LOG_PATH = ".\\terraform-debug.log"
terraform plan

Diagnostic handling:
- Store terraform-debug.log only in the local training workspace.
- Do not commit or publish the log.
- Remove or unset TF_LOG and TF_LOG_PATH after troubleshooting.
- Do not include credentials or secrets in challenge evidence.`
    },
    {
      id: 'debug-log',
      title: 'Relevant terraform-debug.log Extract',
      kind: 'code',
      content: `2026-08-19T12:41:03.200Z [TRACE] provider.terraform-provider-aws:
aws-sdk-go-v2 request:
service=EC2 operation=DescribeSubnets region=eu-west-2

2026-08-19T12:41:03.411Z [DEBUG] provider.terraform-provider-aws:
HTTP Response StatusCode=403

2026-08-19T12:41:03.412Z [ERROR] provider.terraform-provider-aws:
api error UnauthorizedOperation:
You are not authorized to perform this operation.

Verified execution-role policy includes:
ec2:DescribeVpcs
ec2:DescribeRouteTables

Missing action:
ec2:DescribeSubnets

Approved boundary:
Add only the read permission required for the configured subnet data source.
Do not grant ec2:* or AdministratorAccess.`
    }
  ],
  successCriteria: [
    'The learner uses the debug evidence to identify EC2 DescribeSubnets as the API operation receiving HTTP 403 UnauthorizedOperation.',
    'The execution role receives only ec2:DescribeSubnets in addition to its existing required read permissions.',
    'TF_LOG and TF_LOG_PATH are disabled after diagnosis and the diagnostic file is handled as potentially sensitive data.',
    'A final terraform plan reads data.aws_subnets.private successfully without the provider API failure.'
  ],
  hints: [
    'The useful evidence is the provider log line that identifies the AWS service, operation, HTTP status, and API error.',
    'TF_LOG enables detailed Terraform diagnostics, and TF_LOG_PATH persists them to a file only when logging is enabled; provider logs can reveal the underlying API request that failed.',
    'The log shows EC2 DescribeSubnets returning 403 UnauthorizedOperation, so add only ec2:DescribeSubnets to the execution role and then disable debug logging before retesting.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What is the real provider/API failure shown by the Terraform debug log?',
      options: [
        { id: 'describe-subnets-denied', text: 'The AWS identity is denied ec2:DescribeSubnets, producing HTTP 403 UnauthorizedOperation when the data source reads subnets.' },
        { id: 'wrong-region', text: 'The provider is sending DescribeSubnets to us-east-1 instead of eu-west-2.' },
        { id: 'state-lock', text: 'A state lock is preventing the AWS provider from calling EC2.' },
        { id: 'terraform-format', text: 'The subnet data source fails because the Terraform file is not canonically formatted.' }
      ],
      correctOptionId: 'describe-subnets-denied',
      explanation: 'The persisted provider log explicitly identifies service EC2, operation DescribeSubnets, HTTP status 403, and UnauthorizedOperation.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction after diagnosing the log?',
      options: [
        { id: 'add-describe-subnets', text: 'Add ec2:DescribeSubnets to the execution role, disable TF_LOG and TF_LOG_PATH, and rerun terraform plan.' },
        { id: 'ec2-star', text: 'Grant ec2:* so all future provider reads succeed.' },
        { id: 'admin-access', text: 'Attach AdministratorAccess to eliminate all permission failures.' },
        { id: 'keep-trace', text: 'Leave TRACE logging permanently enabled and commit terraform-debug.log for future troubleshooting.' }
      ],
      correctOptionId: 'add-describe-subnets',
      explanation: 'The log proves one specific missing read action, so adding that action resolves the API failure without broadening the role or retaining sensitive verbose logs.'
    }
  ],
  solution: {
    rootCause: 'Terraform provider logging shows that data.aws_subnets.private calls the EC2 DescribeSubnets API and receives HTTP 403 UnauthorizedOperation because the execution role lacks ec2:DescribeSubnets.',
    fix: 'Add the least-privilege ec2:DescribeSubnets read action to the execution role, unset TF_LOG and TF_LOG_PATH after diagnosis, protect or remove the debug file, and rerun terraform plan to verify the subnet data source succeeds.',
    prevention: 'Build least-privilege provider roles from the APIs required by configured resources and data sources, and use temporary TF_LOG plus TF_LOG_PATH diagnostics when provider failures need deeper API-level evidence.'
  }
});
