export default Object.freeze({
  id: 'terraform-unwanted-replacement',
  examId: 'terraform-associate-004',
  order: 2,
  category: 'Terraform planning',
  title: 'Stop an unintended EC2 replacement',
  difficulty: 'Intermediate',
  summary: 'Interpret a plan that unexpectedly proposes replacing a running instance.',
  scenario: 'A routine configuration change should add an Environment tag. The plan also proposes replacing the production training instance, which is not approved.',
  task: 'Find the argument forcing replacement, trace where its new value came from, and restore the intended subnet before applying anything.',
  evidence: [
    {
      id: 'plan',
      title: 'Saved plan summary',
      kind: 'code',
      content: `# aws_instance.web must be replaced
-/+ resource "aws_instance" "web" {
      id        = "i-0123456789abcdef0"
    ~ subnet_id = "subnet-0public111" -> "subnet-0private222" # forces replacement
    ~ tags = {
        + "Environment" = "training"
          "Name"        = "fa-web"
      }
  }

Plan: 1 to add, 0 to change, 1 to destroy.`
    },
    {
      id: 'variables',
      title: 'training.tfvars',
      kind: 'code',
      content: `environment = "training"
web_subnet_id = "subnet-0private222"`
    },
    {
      id: 'change-request',
      title: 'Approved change request',
      kind: 'text',
      content: 'Add Environment = training to the existing fa-web instance. Do not move or replace the instance.'
    }
  ],
  successCriteria: [
    'The learner identifies subnet_id as the replacement trigger.',
    'The unintended variable value is corrected to subnet-0public111.',
    'A new plan shows only the approved in-place tag change.',
    'The original destructive plan is never applied.'
  ],
  hints: [
    'Look for the plan annotation that explicitly says forces replacement.',
    'Compare the approved change with every changed attribute in the plan.',
    'Restore web_subnet_id to subnet-0public111 and create a fresh saved plan.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Which change caused Terraform to propose replacing the instance?',
      options: [
        { id: 'subnet', text: 'web_subnet_id changed to a different subnet.' },
        { id: 'tag', text: 'The Environment tag was added.' },
        { id: 'name', text: 'The Name tag remained fa-web.' },
        { id: 'state', text: 'The state file was locked.' }
      ],
      correctOptionId: 'subnet',
      explanation: 'An EC2 instance cannot be moved between subnets in place, so changing subnet_id requires replacement.'
    },
    {
      id: 'safe-action',
      prompt: 'What is the safest next action?',
      options: [
        { id: 'correct-replan', text: 'Correct the variable and generate a new plan for review.' },
        { id: 'apply', text: 'Apply because Terraform generated the plan successfully.' },
        { id: 'state-rm', text: 'Remove the instance from state.' },
        { id: 'ignore-all', text: 'Ignore every future change to the instance.' }
      ],
      correctOptionId: 'correct-replan',
      explanation: 'Plans are review artefacts. Correct the unintended input and create a new plan rather than applying an unapproved replacement.'
    }
  ],
  solution: {
    rootCause: 'training.tfvars supplied the wrong subnet ID, causing a ForceNew EC2 attribute to change.',
    fix: 'Restore web_subnet_id to subnet-0public111, run terraform plan again, and confirm the plan contains only the approved tag update.',
    prevention: 'Review saved plans for replacements and destructive actions, and protect environment variable files through code review.'
  }
});
