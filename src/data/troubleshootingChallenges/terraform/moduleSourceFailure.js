export default Object.freeze({
  id: 'terraform-module-source-failure',
  examId: 'terraform-associate-004',
  order: 19,
  category: 'Terraform Modules',
  title: 'Repair a Module Source Failure',
  difficulty: 'Beginner',
  summary: 'Diagnose a child module source path that points to a directory that does not exist.',
  scenario: 'A Terraform root module was reorganized so its reusable network module now lives under modules/network. A new branch still points the module block at the old folder name, causing terraform init to fail before planning begins. The module should continue to be loaded from the local repository rather than replaced with a remote module.',
  task: 'Use the module block, repository layout, and initialization error to identify the incorrect source path, correct the local module source, and verify Terraform can initialize the child module.',
  evidence: [
    {
      id: 'module-call',
      title: 'main.tf',
      kind: 'code',
      content: `module "network" {
  source = "./modules/networking"

  vpc_cidr = "10.100.0.0/16"
}`
    },
    {
      id: 'repository-layout',
      title: 'Repository Layout',
      kind: 'code',
      content: `.
├── main.tf
├── versions.tf
└── modules
    └── network
        ├── main.tf
        ├── variables.tf
        └── outputs.tf

Approved module location:
./modules/network

Old removed location:
./modules/networking`
    },
    {
      id: 'init-error',
      title: 'terraform init Output',
      kind: 'code',
      content: `$ terraform init
Initializing the backend...
Initializing modules...

╷
│ Error: Unreadable module directory
│
│ Unable to evaluate directory symlink:
│ lstat modules/networking: no such file or directory
╵

╷
│ Error: Failed to read module directory
│
│ Module directory could not be read for module "network".
╵`
    }
  ],
  successCriteria: [
    'The learner identifies ./modules/networking as a stale local module source path.',
    'The module source is corrected to ./modules/network.',
    'The existing local module is reused rather than duplicated or replaced with an unrelated remote module.',
    'A final terraform init completes module initialization without the unreadable-directory error.'
  ],
  hints: [
    'Compare the source argument in the module block with the directory names shown in the repository layout.',
    'A relative module source beginning with ./ tells Terraform to load configuration from that local directory.',
    'Change source from ./modules/networking to ./modules/network and rerun terraform init.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why can Terraform not initialize module.network?',
      options: [
        { id: 'wrong-local-path', text: 'The module source points to ./modules/networking, but the actual child module directory is ./modules/network.' },
        { id: 'missing-version', text: 'Every local module must include a version argument.' },
        { id: 'provider-auth', text: 'AWS credentials are required before Terraform can read a local directory.' },
        { id: 'module-state', text: 'The child module must already exist in Terraform state before terraform init can load it.' }
      ],
      correctOptionId: 'wrong-local-path',
      explanation: 'The error names modules/networking as missing, and the repository evidence shows the reusable module exists at modules/network.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the correct repair?',
      options: [
        { id: 'fix-source', text: 'Change source to ./modules/network and rerun terraform init.' },
        { id: 'add-version', text: 'Keep the bad path and add version = "1.0.0" to the local module block.' },
        { id: 'duplicate-folder', text: 'Copy the network module into a second networking directory just to satisfy the stale path.' },
        { id: 'remote-random', text: 'Replace the approved local module with an unrelated public Registry module.' }
      ],
      correctOptionId: 'fix-source',
      explanation: 'The intended child module already exists locally, so correcting the source path is the smallest change and preserves the approved module implementation.'
    }
  ],
  solution: {
    rootCause: 'The module block still uses the removed local path ./modules/networking, while the actual reusable network module now lives at ./modules/network.',
    fix: 'Change module.network source to ./modules/network, rerun terraform init, and verify Terraform initializes the local child module successfully.',
    prevention: 'Update module source references in the same change that moves module directories and run terraform init in CI so stale local paths are detected immediately.'
  }
});
