export default Object.freeze({
  id: 'terraform-hcp-workspace-vcs-failure',
  examId: 'terraform-associate-004',
  order: 30,
  category: 'HCP Terraform',
  title: 'Repair an HCP Terraform Workspace or VCS Configuration Failure',
  difficulty: 'Intermediate',
  summary: 'Diagnose an HCP Terraform VCS workspace configured with the wrong Terraform working directory.',
  scenario: 'An HCP Terraform workspace is connected to the correct Git repository and main branch. New commits trigger runs, but every run fails before terraform init because HCP Terraform cannot find the configured working directory. The repository is a monorepo and the training configuration is stored below the repository root.',
  task: 'Use the workspace VCS settings, repository layout, and failed run evidence to identify the incorrect working directory, correct the workspace setting, and verify a new VCS-triggered run executes from the intended Terraform configuration.',
  evidence: [
    {
      id: 'workspace-settings',
      title: 'HCP Terraform VCS Settings',
      kind: 'code',
      content: `Workspace: fa-hcp-network-training
VCS repository: training-org/infrastructure
VCS branch: main
Automatic run triggering: Enabled
Terraform working directory: terraform/training`
    },
    {
      id: 'repository-layout',
      title: 'Repository Layout on main',
      kind: 'code',
      content: `infrastructure/
├── README.md
├── modules/
│   └── vpc/
│       ├── main.tf
│       └── variables.tf
└── environments/
    └── training/
        ├── main.tf
        ├── variables.tf
        └── versions.tf

Correct Terraform working directory:
environments/training`
    },
    {
      id: 'run-error',
      title: 'HCP Terraform Run',
      kind: 'code',
      content: `Configuration version:
Commit: a1b2c3d
Branch: main
Status: Errored

Run setup:
Changing working directory to "terraform/training"

Error:
The configured Terraform working directory "terraform/training"
does not exist in this configuration version.

Observed VCS behaviour:
- Pushes to main create new runs.
- The expected commit a1b2c3d is present in the run.
- Failure occurs before terraform init.

Approved boundary:
Keep the existing repository and main branch connection.
Correct only the workspace path required for this incident.`
    }
  ],
  successCriteria: [
    'The learner identifies terraform/training as an invalid HCP Terraform working directory for the connected repository.',
    'The workspace working directory is changed to environments/training.',
    'The existing VCS repository, main branch, and automatic run connection remain unchanged.',
    'A final VCS-triggered run uses environments/training and proceeds to Terraform initialization instead of failing on the missing directory.'
  ],
  hints: [
    'The correct commit and branch already reach HCP Terraform, so compare the configured working directory with the repository tree.',
    'HCP Terraform changes into the configured working directory before running Terraform and reports an error if that relative directory does not exist.',
    'Change the workspace Terraform working directory from terraform/training to environments/training and trigger a new run from the connected main branch.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does every HCP Terraform run fail before terraform init?',
      options: [
        { id: 'wrong-working-directory', text: 'The workspace is configured to execute in terraform/training, but the Terraform configuration actually lives in environments/training.' },
        { id: 'wrong-branch', text: 'The workspace is following the wrong VCS branch and therefore never receives commits from main.' },
        { id: 'vcs-disconnected', text: 'The workspace has no VCS repository connection.' },
        { id: 'trigger-disabled', text: 'Automatic run triggering is disabled, so the run cannot start.' }
      ],
      correctOptionId: 'wrong-working-directory',
      explanation: 'The run contains the expected main-branch commit and starts automatically, but setup fails specifically because the configured terraform/training directory is absent from that configuration version.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the smallest effective correction?',
      options: [
        { id: 'fix-working-directory', text: 'Set the workspace Terraform working directory to environments/training and verify a new main-branch run starts Terraform from that directory.' },
        { id: 'change-repository', text: 'Disconnect the correct repository and connect a different repository instead.' },
        { id: 'change-branch', text: 'Change the VCS branch away from main even though the expected commits already arrive.' },
        { id: 'move-files', text: 'Move the Terraform files to the incorrect terraform/training path solely to match the broken workspace setting.' }
      ],
      correctOptionId: 'fix-working-directory',
      explanation: 'The VCS source, branch, and triggers already work; only the relative execution path is inconsistent with the repository layout.'
    }
  ],
  solution: {
    rootCause: 'The HCP Terraform workspace is configured with Terraform working directory terraform/training, but the connected main-branch configuration stores the root module at environments/training, so run setup cannot change into the configured path.',
    fix: 'Update the workspace Terraform working directory to environments/training, keep the current VCS repository and main branch settings, and verify a new VCS-triggered run proceeds into terraform init from the correct directory.',
    prevention: 'Treat HCP Terraform working-directory and VCS settings as part of the repository contract, review them when monorepo paths change, and verify a test VCS run after moving root configurations.'
  }
});
