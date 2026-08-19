export default Object.freeze({
  id: 'terraform-provider-version-constraint-conflict',
  examId: 'terraform-associate-004',
  order: 5,
  category: 'Terraform Providers',
  title: 'Resolve a Provider Version Constraint Conflict',
  difficulty: 'Intermediate',
  summary: 'Diagnose incompatible AWS provider requirements between a root module and a child module.',
  scenario: 'A root configuration was recently updated to use a newer internal networking module. terraform init now fails while selecting the AWS provider. The networking module is approved and requires AWS provider 6.x features, while the root module still carries an older 5.x-only constraint from the previous module version.',
  task: 'Use the provider requirements from both modules and the initialization error to identify the incompatible constraints, align them safely, and verify that Terraform can select one AWS provider version satisfying the whole configuration.',
  evidence: [
    {
      id: 'init-error',
      title: 'terraform init Output',
      kind: 'code',
      content: `$ terraform init
Initializing modules...
Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.0, >= 6.0.0"...

╷
│ Error: Failed to query available provider packages
│
│ Could not retrieve the list of available versions for provider
│ hashicorp/aws: no available releases match the given constraints
│ ~> 5.0, >= 6.0.0
╵`
    },
    {
      id: 'root-provider-requirement',
      title: 'Root Module versions.tf',
      kind: 'code',
      content: `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

module "network" {
  source = "./modules/network"
}`
    },
    {
      id: 'child-provider-requirement',
      title: 'Network Module versions.tf',
      kind: 'code',
      content: `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0.0"
    }
  }
}

Approved migration note:
- The current root configuration has been reviewed for AWS provider 6.x.
- The network module requires provider 6.0.0 or newer.
- The project standard for this release is AWS provider >= 6.0.0, < 7.0.0.`
    }
  ],
  successCriteria: [
    'The learner identifies that no AWS provider version can satisfy both ~> 5.0 and >= 6.0.0.',
    'The root provider constraint is aligned to the approved >= 6.0.0, < 7.0.0 range.',
    'The child module requirement remains satisfied rather than being removed or bypassed.',
    'A final terraform init selects one AWS provider 6.x version satisfying all configured constraints.'
  ],
  hints: [
    'Read the combined version constraints in the terraform init error and compare them with the root and child required_providers blocks.',
    'Terraform combines provider requirements from the modules in a configuration and must choose one provider version that satisfies all of them.',
    'The approved release requires provider 6.x, so replace the stale root ~> 5.0 constraint with the approved >= 6.0.0, < 7.0.0 range and reinitialize.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why can Terraform not select an AWS provider version?',
      options: [
        { id: 'incompatible-ranges', text: 'The root module requires AWS provider 5.x while the child module requires 6.0.0 or newer, leaving no version that satisfies both.' },
        { id: 'missing-provider-block', text: 'The configuration has no provider "aws" block with a Region.' },
        { id: 'wrong-source', text: 'The child module uses a different provider source address from the root module.' },
        { id: 'terraform-core', text: 'Terraform Core itself must be downgraded before provider selection can occur.' }
      ],
      correctOptionId: 'incompatible-ranges',
      explanation: 'The initialization error combines ~> 5.0 and >= 6.0.0, which cannot overlap because one requires the 5.x family while the other begins at 6.0.0.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest correction given the approved migration note?',
      options: [
        { id: 'align-root-six', text: 'Change the root AWS provider constraint to >= 6.0.0, < 7.0.0 and rerun terraform init so one compatible 6.x version is selected.' },
        { id: 'remove-child', text: 'Delete the child module required_providers block so its compatibility requirement is ignored.' },
        { id: 'remove-all-versions', text: 'Remove all provider version constraints and always install the newest release.' },
        { id: 'force-five', text: 'Keep ~> 5.0 and force the child module to run with provider 5.x despite its declared minimum.' }
      ],
      correctOptionId: 'align-root-six',
      explanation: 'The project has already approved provider 6.x and the child module requires it, so updating the stale root constraint creates a valid shared range without discarding compatibility protections.'
    }
  ],
  solution: {
    rootCause: 'The root module restricts hashicorp/aws to the 5.x family with ~> 5.0, while the current child network module requires >= 6.0.0. Terraform cannot choose one provider release that satisfies both constraints.',
    fix: 'Update the root AWS provider constraint to >= 6.0.0, < 7.0.0, keep the child requirement, rerun terraform init, and verify that Terraform selects an AWS provider 6.x release satisfying all modules.',
    prevention: 'Review root and child required_providers constraints together before module upgrades and let shared modules declare their minimum supported provider version while the root module controls the project-wide upper bound.'
  }
});
