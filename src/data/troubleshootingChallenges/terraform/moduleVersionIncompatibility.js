export default Object.freeze({
  id: 'terraform-module-version-incompatibility',
  examId: 'terraform-associate-004',
  order: 20,
  category: 'Terraform Modules',
  title: 'Resolve a Module Version Incompatibility',
  difficulty: 'Intermediate',
  summary: 'Diagnose a Registry module constraint that selects a release requiring a newer Terraform Core version.',
  scenario: 'A Terraform 1.10.x project uses a Registry network module. A recent module-version edit causes initialization to select the 2.x release family, but that release family requires Terraform Core 1.11 or newer. The team is not yet approved to upgrade Terraform Core and must stay on the latest compatible 1.x module release.',
  task: 'Use the root version requirement, module constraint, and release compatibility evidence to identify the incompatible selection, constrain the module to the approved compatible release family, and verify initialization succeeds without changing Terraform Core.',
  evidence: [
    {
      id: 'root-configuration',
      title: 'Root versions.tf and Module Call',
      kind: 'code',
      content: `terraform {
  required_version = "~> 1.10.0"
}

module "network" {
  source  = "training-org/network/aws"
  version = "~> 2.0"

  vpc_cidr = "10.110.0.0/16"
}`
    },
    {
      id: 'compatibility',
      title: 'Registry Release Compatibility',
      kind: 'code',
      content: `Available module releases:

1.8.3  -> required Terraform >= 1.8.0
1.8.4  -> required Terraform >= 1.8.0
2.0.0  -> required Terraform >= 1.11.0
2.1.0  -> required Terraform >= 1.11.0

Approved project choice:
Terraform Core: 1.10.x
Module release family: 1.8.x
Preferred compatible constraint: ~> 1.8.0`
    },
    {
      id: 'init-error',
      title: 'Initialization Failure',
      kind: 'code',
      content: `$ terraform init
Initializing modules...
Downloading training-org/network/aws 2.1.0 for network...

╷
│ Error: Unsupported Terraform Core version
│
│ Module module.network does not support Terraform version 1.10.5.
│ The selected module release requires Terraform >= 1.11.0.
╵

Approved boundary:
Do not upgrade Terraform Core in this incident.
Do not remove module version constraints entirely.`
    }
  ],
  successCriteria: [
    'The learner identifies that version = ~> 2.0 selects a module release requiring Terraform Core 1.11 or newer.',
    'The module constraint is changed to the approved ~> 1.8.0 compatible release family.',
    'The root required_version remains ~> 1.10.0 and module versioning remains constrained.',
    'A final terraform init installs a compatible 1.8.x module release and completes successfully.'
  ],
  hints: [
    'Compare the selected module release requirement with the root project Terraform Core version.',
    'Registry module version constraints control which module release Terraform installs, and each module release can declare its own required Terraform Core version.',
    'Keep Terraform Core on 1.10.x and change the module constraint from ~> 2.0 to the approved ~> 1.8.0 range, then rerun terraform init.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does the selected network module fail in this project?',
      options: [
        { id: 'module-needs-newer-core', text: 'The ~> 2.0 constraint selects a 2.x module release that requires Terraform Core >= 1.11.0, while the project uses Terraform 1.10.x.' },
        { id: 'registry-no-versions', text: 'Registry modules do not support version constraints.' },
        { id: 'core-too-new', text: 'Terraform 1.10.x is newer than the maximum version supported by module 2.x.' },
        { id: 'provider-region', text: 'The AWS provider Region determines which module version can be installed.' }
      ],
      correctOptionId: 'module-needs-newer-core',
      explanation: 'The compatibility evidence shows all 2.x releases require Terraform 1.11 or newer, but the approved root constraint keeps the project on Terraform 1.10.x.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest correction under the approved project boundary?',
      options: [
        { id: 'pin-compatible-family', text: 'Change the module version constraint to ~> 1.8.0 and rerun terraform init so Terraform selects a compatible 1.8.x release.' },
        { id: 'remove-version', text: 'Delete the version argument and always accept the newest module release.' },
        { id: 'upgrade-core', text: 'Upgrade Terraform Core to 1.11 even though that change is not approved.' },
        { id: 'ignore-required-version', text: 'Remove required_version declarations from both the root and child module.' }
      ],
      correctOptionId: 'pin-compatible-family',
      explanation: 'The 1.8.x module family supports the approved Terraform Core version, and retaining a version constraint prevents unexpected incompatible upgrades.'
    }
  ],
  solution: {
    rootCause: 'The module constraint ~> 2.0 causes Terraform to select a 2.x network module release, but all 2.x releases require Terraform Core >= 1.11.0 while the project is intentionally restricted to Terraform 1.10.x.',
    fix: 'Change the module version constraint to ~> 1.8.0, rerun terraform init, and verify Terraform installs a compatible 1.8.x release while the root required_version remains unchanged.',
    prevention: 'Review module release requirements before widening version constraints and test module upgrades against the project Terraform Core version in CI before merging them.'
  }
});
