export default Object.freeze({
  id: 'terraform-unsupported-core-version',
  examId: 'terraform-associate-004',
  order: 4,
  category: 'Terraform Setup',
  title: 'Repair an Unsupported Terraform Core Version',
  difficulty: 'Beginner',
  summary: 'Diagnose why Terraform refuses to initialize a configuration with a required_version constraint.',
  scenario: 'A team configuration works on developer laptops but fails immediately in the CI runner before providers are installed. The repository intentionally requires Terraform 1.10.x because that is the tested team standard. The version requirement must remain in place rather than being weakened simply to make CI pass.',
  task: 'Use the supplied Terraform output and configuration to identify the version mismatch, correct the execution environment safely, and verify that Terraform can initialize without changing the approved Core version requirement.',
  evidence: [
    {
      id: 'ci-version',
      title: 'CI Terraform Version',
      kind: 'code',
      content: `$ terraform version
Terraform v1.9.8
on linux_amd64

$ terraform init
Initializing the backend...
╷
│ Error: Unsupported Terraform Core version
│
│   on versions.tf line 2, in terraform:
│    2:   required_version = "~> 1.10.0"
│
│ This configuration does not support Terraform version 1.9.8.
│ To proceed, either choose another supported Terraform version or
│ update this version constraint.
╵`
    },
    {
      id: 'versions-file',
      title: 'versions.tf',
      kind: 'code',
      content: `terraform {
  required_version = "~> 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}`
    },
    {
      id: 'team-standard',
      title: 'Approved Version Standard',
      kind: 'text',
      content: 'The repository is tested with Terraform 1.10.x and the required_version constraint is intentional. CI should use a Terraform 1.10.x release that satisfies ~> 1.10.0. Do not remove the constraint or broaden it to include Terraform 1.9.x.'
    }
  ],
  successCriteria: [
    'The learner identifies Terraform 1.9.8 as incompatible with the required_version constraint.',
    'The CI environment uses a Terraform 1.10.x release that satisfies ~> 1.10.0.',
    'The approved required_version constraint remains unchanged.',
    'A final terraform version and terraform init check completes past the Core version validation.'
  ],
  hints: [
    'Compare the Terraform version printed by the CI runner with the required_version value in versions.tf.',
    'Terraform checks required_version before normal plan or apply operations and stops when the running CLI version does not satisfy the constraint.',
    'Keep the approved constraint and change the CI runner to a Terraform 1.10.x version that satisfies ~> 1.10.0.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does terraform init stop with Unsupported Terraform Core version?',
      options: [
        { id: 'core-mismatch', text: 'The CI runner uses Terraform 1.9.8, which does not satisfy the required_version constraint ~> 1.10.0.' },
        { id: 'provider-missing', text: 'The AWS provider has not yet been downloaded into .terraform.' },
        { id: 'wrong-region', text: 'The AWS provider has no Region configured.' },
        { id: 'lock-missing', text: 'The repository does not contain a dependency lock file.' }
      ],
      correctOptionId: 'core-mismatch',
      explanation: 'The error names Terraform 1.9.8 and the configuration explicitly allows Terraform 1.10.x through ~> 1.10.0, so the running CLI version is outside the supported range.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest correction under the stated team standard?',
      options: [
        { id: 'upgrade-ci', text: 'Configure CI to use a Terraform 1.10.x release that satisfies the existing required_version constraint, then rerun terraform init.' },
        { id: 'remove-constraint', text: 'Delete required_version so any Terraform release can run the configuration.' },
        { id: 'allow-old', text: 'Change required_version to >= 1.9.0 only so the current runner passes.' },
        { id: 'upgrade-provider', text: 'Upgrade the AWS provider without changing the Terraform CLI version.' }
      ],
      correctOptionId: 'upgrade-ci',
      explanation: 'The requirement is intentional and identifies the tested Core release family, so the execution environment should be aligned with it rather than weakening the configuration.'
    }
  ],
  solution: {
    rootCause: 'The CI runner is executing Terraform 1.9.8, but versions.tf requires ~> 1.10.0, which accepts Terraform 1.10.x and rejects 1.9.8.',
    fix: 'Update the CI Terraform installation to an approved 1.10.x release, confirm terraform version reports the supported release, and rerun terraform init without changing required_version.',
    prevention: 'Pin the Terraform CLI version in CI or the team version manager and keep that setting reviewed alongside required_version whenever the project upgrades Terraform Core.'
  }
});
