export default Object.freeze({
  id: 'terraform-provider-authentication-failure',
  examId: 'terraform-associate-004',
  order: 8,
  category: 'Terraform Providers',
  title: 'Recover from a Provider Authentication Failure',
  difficulty: 'Intermediate',
  summary: 'Diagnose why the AWS provider cannot authenticate with the intended CLI profile.',
  scenario: 'A Terraform project is configured to use the AWS CLI profile fa-terraform-training. The configuration worked previously, but terraform plan now fails before reading any AWS resources. The machine also has a different default AWS profile that must not be used for this project.',
  task: 'Use the provider configuration, AWS CLI output, and Terraform error to identify the authentication problem, restore the intended credential source safely, and verify Terraform is using the correct AWS identity.',
  evidence: [
    {
      id: 'provider-config',
      title: 'AWS Provider Configuration',
      kind: 'code',
      content: `provider "aws" {
  region  = "eu-west-2"
  profile = "fa-terraform-training"
}`
    },
    {
      id: 'terraform-error',
      title: 'terraform plan Error',
      kind: 'code',
      content: `$ terraform plan

Planning failed. Terraform encountered an error while generating this plan.

╷
│ Error: configuring Terraform AWS Provider: no valid credential sources for Terraform AWS Provider found.
│
│ Error: failed to refresh cached credentials,
│ shared profile fa-terraform-training
╵`
    },
    {
      id: 'cli-profile-check',
      title: 'AWS CLI Credential Check',
      kind: 'code',
      content: `$ aws sts get-caller-identity --profile fa-terraform-training

The config profile (fa-terraform-training) could not be found

$ aws sts get-caller-identity --profile default
{
  "UserId": "AIDATRAININGDEFAULT",
  "Account": "999999999999",
  "Arn": "arn:aws:iam::999999999999:user/unrelated-default-user"
}

Approved project identity:
Account: 123456789012
Profile name: fa-terraform-training

Do not remove the profile setting from the provider and do not fall back to the default profile.`
    }
  ],
  successCriteria: [
    'The learner identifies that the configured fa-terraform-training AWS CLI profile is missing or unavailable.',
    'The intended fa-terraform-training profile is restored with valid credentials for account 123456789012.',
    'Terraform continues to reference the named profile rather than silently using the unrelated default profile.',
    'A final aws sts get-caller-identity and terraform plan confirm the intended identity is being used.'
  ],
  hints: [
    'The provider error names the credential source it tried to use, so compare that profile name with the AWS CLI profile check.',
    'The AWS provider can use a named shared-credentials profile, but that profile must exist and contain valid usable credentials.',
    'Restore or reconfigure the fa-terraform-training profile, verify it with aws sts get-caller-identity --profile fa-terraform-training, then rerun Terraform.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What is causing the AWS provider authentication failure?',
      options: [
        { id: 'missing-profile', text: 'The provider is configured for fa-terraform-training, but that shared AWS CLI profile does not exist on the machine.' },
        { id: 'wrong-region', text: 'The eu-west-2 Region prevents the AWS provider from loading credentials.' },
        { id: 'default-required', text: 'Terraform can authenticate only through the AWS default profile.' },
        { id: 'provider-version', text: 'The AWS provider version is incompatible with STS GetCallerIdentity.' }
      ],
      correctOptionId: 'missing-profile',
      explanation: 'Terraform reports failure refreshing the configured shared profile, and the AWS CLI independently confirms that fa-terraform-training cannot be found.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'restore-profile', text: 'Restore the fa-terraform-training profile with valid credentials for account 123456789012, verify it with STS, and rerun terraform plan.' },
        { id: 'remove-profile', text: 'Delete profile = "fa-terraform-training" so Terraform automatically uses the unrelated default profile.' },
        { id: 'hardcode-keys', text: 'Paste AWS access keys directly into the provider block.' },
        { id: 'admin-default', text: 'Grant AdministratorAccess to the unrelated default profile and use it instead.' }
      ],
      correctOptionId: 'restore-profile',
      explanation: 'The project explicitly requires the named profile, so restoring and verifying that credential source fixes the authentication problem without exposing credentials or using the wrong account.'
    }
  ],
  solution: {
    rootCause: 'The AWS provider is explicitly configured to use the fa-terraform-training shared profile, but that profile is missing on the machine, so Terraform cannot obtain AWS credentials.',
    fix: 'Restore or configure the fa-terraform-training AWS CLI profile with valid credentials for account 123456789012, verify it using aws sts get-caller-identity --profile fa-terraform-training, and rerun terraform plan while keeping the provider profile setting intact.',
    prevention: 'Document required profile names, validate the expected AWS identity before Terraform operations, and use secure credential provisioning that recreates named profiles consistently on new workstations and CI runners.'
  }
});
