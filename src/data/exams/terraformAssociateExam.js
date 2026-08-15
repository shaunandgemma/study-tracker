export const TERRAFORM_ASSOCIATE_EXAM = Object.freeze({
  id: 'terraform-associate-004',
  code: 'Terraform 004',
  title: 'HashiCorp Certified: Terraform Associate (004)',
  description: 'Build foundational Terraform knowledge across infrastructure as code, configuration, workflows, modules, state, maintenance, and HCP Terraform.',
  audience: 'Cloud engineers preparing for the current Terraform Associate (004) certification exam.',
  benefits: [
    'Track every published Terraform Associate (004) objective.',
    'Practise questions across all eight objective groups.',
    'Open Terraform Follow Alongs assigned to this certification.',
    'Use the quick study guides in the Knowledge Guides.'
  ],
  passingScore: 70,
  timeLimitMinutes: 60,
  questionSource: 'supabase',
  badgeColor: 'from-violet-500 to-purple-700',
  followAlongExamIds: ['terraform-associate-004'],
  officialExamUrl: 'https://developer.hashicorp.com/certifications/infrastructure-automation',
  officialObjectivesUrl: 'https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004',
  topics: [
    {
      id: 'tf004-iac',
      code: 'Objective 1',
      title: 'Infrastructure as Code with Terraform',
      weight: 10,
      description: 'Understand infrastructure as code and why Terraform supports service-independent workflows.',
      items: [
        { id: 'tf004-1a', text: 'Explain what infrastructure as code is' },
        { id: 'tf004-1b', text: 'Describe the advantages of infrastructure-as-code patterns' },
        { id: 'tf004-1c', text: 'Explain multi-cloud, hybrid-cloud, and service-agnostic Terraform workflows' }
      ]
    },
    {
      id: 'tf004-fundamentals',
      code: 'Objective 2',
      title: 'Terraform Fundamentals',
      weight: 12,
      description: 'Understand providers, provider versions, multiple-provider configuration, and state.',
      items: [
        { id: 'tf004-2a', text: 'Install and version Terraform providers' },
        { id: 'tf004-2b', text: 'Describe how Terraform uses providers' },
        { id: 'tf004-2c', text: 'Write Terraform configuration using multiple providers' },
        { id: 'tf004-2d', text: 'Explain how Terraform uses and manages state' }
      ]
    },
    {
      id: 'tf004-workflow',
      code: 'Objective 3',
      title: 'Core Terraform Workflow',
      weight: 18,
      description: 'Use the main Terraform CLI workflow safely from initialization through destruction.',
      items: [
        { id: 'tf004-3a', text: 'Describe the core Terraform workflow' },
        { id: 'tf004-3b', text: 'Initialize a Terraform working directory' },
        { id: 'tf004-3c', text: 'Validate a Terraform configuration' },
        { id: 'tf004-3d', text: 'Generate and review a Terraform execution plan' },
        { id: 'tf004-3e', text: 'Apply changes to infrastructure with Terraform' },
        { id: 'tf004-3f', text: 'Destroy Terraform-managed infrastructure' },
        { id: 'tf004-3g', text: 'Apply formatting and style adjustments to configuration' }
      ]
    },
    {
      id: 'tf004-configuration',
      code: 'Objective 4',
      title: 'Terraform Configuration',
      weight: 22,
      description: 'Write connected, reusable, validated, and security-conscious Terraform configuration.',
      items: [
        { id: 'tf004-4a', text: 'Use and differentiate resource and data blocks' },
        { id: 'tf004-4b', text: 'Refer to resource attributes and create cross-resource references' },
        { id: 'tf004-4c', text: 'Use input variables and outputs' },
        { id: 'tf004-4d', text: 'Understand and use complex types' },
        { id: 'tf004-4e', text: 'Write dynamic configuration using expressions and functions' },
        { id: 'tf004-4f', text: 'Define resource dependencies in configuration' },
        { id: 'tf004-4g', text: 'Validate configuration using custom conditions' },
        { id: 'tf004-4h', text: 'Apply sensitive-data and secrets-management best practices' }
      ]
    },
    {
      id: 'tf004-modules',
      code: 'Objective 5',
      title: 'Terraform Modules',
      weight: 12,
      description: 'Source, configure, compose, and version Terraform modules.',
      items: [
        { id: 'tf004-5a', text: 'Explain how Terraform sources modules' },
        { id: 'tf004-5b', text: 'Describe variable scope within modules' },
        { id: 'tf004-5c', text: 'Use modules in Terraform configuration' },
        { id: 'tf004-5d', text: 'Manage module versions' }
      ]
    },
    {
      id: 'tf004-state',
      code: 'Objective 6',
      title: 'Terraform State Management',
      weight: 12,
      description: 'Understand local and remote state, locking, drift, and safe state refactoring.',
      items: [
        { id: 'tf004-6a', text: 'Describe the local backend' },
        { id: 'tf004-6b', text: 'Describe Terraform state locking' },
        { id: 'tf004-6c', text: 'Configure remote state using the backend block' },
        { id: 'tf004-6d', text: 'Manage resource drift and Terraform state' }
      ]
    },
    {
      id: 'tf004-maintenance',
      code: 'Objective 7',
      title: 'Maintain Infrastructure with Terraform',
      weight: 7,
      description: 'Bring existing resources under management and inspect or troubleshoot Terraform state.',
      items: [
        { id: 'tf004-7a', text: 'Import existing infrastructure into a Terraform workspace' },
        { id: 'tf004-7b', text: 'Use the Terraform CLI to inspect state' },
        { id: 'tf004-7c', text: 'Describe when and how to use verbose Terraform logging' }
      ]
    },
    {
      id: 'tf004-hcp',
      code: 'Objective 8',
      title: 'HCP Terraform',
      weight: 7,
      description: 'Understand HCP Terraform workflows, collaboration, governance, projects, and integrations.',
      items: [
        { id: 'tf004-8a', text: 'Use HCP Terraform to create infrastructure' },
        { id: 'tf004-8b', text: 'Describe HCP Terraform collaboration and governance features' },
        { id: 'tf004-8c', text: 'Organize and use HCP Terraform workspaces and projects' },
        { id: 'tf004-8d', text: 'Configure and use HCP Terraform integration' }
      ]
    }
  ],
  questions: [
    {
      id: 'q-tf004-1', topicId: 'tf004-iac', difficulty: 'Easy', type: 'single',
      question: 'What is the main benefit of describing infrastructure in Terraform configuration?',
      options: ['Changes become repeatable and reviewable', 'Every cloud uses the same API', 'State is never required', 'Infrastructure cannot drift'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'Configuration provides a repeatable, version-controlled description that teams can review before applying.'
    },
    {
      id: 'q-tf004-2', topicId: 'tf004-iac', difficulty: 'Medium', type: 'single',
      question: 'How does Terraform support multi-cloud workflows?',
      options: ['It uses providers for different service APIs', 'It converts every API into AWS CloudFormation', 'It requires one state file per resource', 'It removes provider authentication'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'Terraform providers connect the Terraform workflow to different cloud, SaaS, and infrastructure APIs.'
    },
    {
      id: 'q-tf004-3', topicId: 'tf004-fundamentals', difficulty: 'Easy', type: 'single',
      question: 'Which command installs the providers required by a Terraform configuration?',
      options: ['terraform init', 'terraform validate', 'terraform show', 'terraform output'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'terraform init initializes the working directory and installs the required provider plugins.'
    },
    {
      id: 'q-tf004-4', topicId: 'tf004-fundamentals', difficulty: 'Medium', type: 'single',
      question: 'What is the purpose of the Terraform dependency lock file?',
      options: ['Record selected provider versions and checksums', 'Store cloud credentials', 'Replace the state file', 'Define output values'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'The lock file records provider selections and checksums so future initialization is consistent.'
    },
    {
      id: 'q-tf004-5', topicId: 'tf004-workflow', difficulty: 'Easy', type: 'single',
      question: 'Which command previews proposed infrastructure changes without applying them?',
      options: ['terraform plan', 'terraform apply', 'terraform destroy', 'terraform fmt'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'terraform plan compares configuration and current state to produce a proposed execution plan.'
    },
    {
      id: 'q-tf004-6', topicId: 'tf004-workflow', difficulty: 'Medium', type: 'single',
      question: 'Why should a saved plan be supplied to terraform apply?',
      options: ['It applies the exact reviewed plan', 'It upgrades every provider', 'It disables state locking', 'It skips authentication'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'Applying a saved plan helps ensure Terraform performs the same actions that were reviewed.'
    },
    {
      id: 'q-tf004-7', topicId: 'tf004-configuration', difficulty: 'Easy', type: 'single',
      question: 'Which block manages an infrastructure object?',
      options: ['resource', 'output', 'terraform', 'locals'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'A resource block declares an infrastructure object that Terraform can manage.'
    },
    {
      id: 'q-tf004-8', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
      question: 'When is an explicit depends_on normally needed?',
      options: ['When a dependency cannot be inferred from references', 'For every resource', 'Only for outputs', 'Whenever a variable has a default'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'Terraform infers most dependencies from expressions; depends_on is for otherwise hidden dependencies.'
    },
    {
      id: 'q-tf004-9', topicId: 'tf004-modules', difficulty: 'Easy', type: 'single',
      question: 'How does a child module receive values from its caller?',
      options: ['Through input variables', 'Through provider checksums', 'Through state locking', 'Through CLI aliases'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'The calling module supplies values to the child module’s declared input variables.'
    },
    {
      id: 'q-tf004-10', topicId: 'tf004-modules', difficulty: 'Medium', type: 'single',
      question: 'Where can Terraform obtain reusable public modules?',
      options: ['The Terraform Registry', 'Only the local state file', 'The provider lock file', 'A plan file'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'The Terraform Registry is a standard source for discoverable, reusable modules.'
    },
    {
      id: 'q-tf004-11', topicId: 'tf004-state', difficulty: 'Easy', type: 'single',
      question: 'Why is Terraform state important?',
      options: ['It maps configuration to managed real-world objects', 'It stores provider binaries', 'It formats HCL', 'It replaces configuration'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'State records the relationship between configuration addresses and managed infrastructure objects.'
    },
    {
      id: 'q-tf004-12', topicId: 'tf004-state', difficulty: 'Medium', type: 'single',
      question: 'What problem does state locking help prevent?',
      options: ['Concurrent state modification', 'Provider installation', 'Variable validation', 'Module downloads'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'Locking prevents multiple operations from changing the same state at the same time.'
    },
    {
      id: 'q-tf004-13', topicId: 'tf004-maintenance', difficulty: 'Easy', type: 'single',
      question: 'What does importing an existing resource do?',
      options: ['Associates it with a Terraform resource address', 'Deletes and recreates it', 'Copies it into a module', 'Automatically writes every configuration argument'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'Import associates an existing object with a resource address; configuration still needs to match the desired management state.'
    },
    {
      id: 'q-tf004-14', topicId: 'tf004-maintenance', difficulty: 'Medium', type: 'single',
      question: 'Which environment variable enables detailed Terraform logging?',
      options: ['TF_LOG', 'TF_STATE', 'TF_OUTPUT', 'TF_LOCK'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'TF_LOG controls Terraform’s detailed logging level for troubleshooting.'
    },
    {
      id: 'q-tf004-15', topicId: 'tf004-hcp', difficulty: 'Easy', type: 'single',
      question: 'What does an HCP Terraform workspace commonly contain?',
      options: ['Configuration, variables, state, and run history', 'Only a provider binary', 'Only a local plan file', 'A cloud root password'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'An HCP Terraform workspace organizes configuration connections, variables, state, and runs.'
    },
    {
      id: 'q-tf004-16', topicId: 'tf004-hcp', difficulty: 'Medium', type: 'single',
      question: 'Which HCP Terraform capability can evaluate rules before infrastructure changes are applied?',
      options: ['Policy enforcement', 'terraform fmt', 'Local backend storage', 'Provider aliasing'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'Policy enforcement adds governance checks to HCP Terraform run workflows.'
    },
    {
      id: 'q-tf004-17', topicId: 'tf004-fundamentals', difficulty: 'Medium', type: 'single',
      question: 'A configuration uses two AWS provider configurations with different regions. How should a resource select the aliased provider named west?',
      options: ['provider = aws.west', 'provider = west.aws', 'region = aws.west', 'providers = [aws.west]'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'A resource selects an alternate provider configuration with the provider meta-argument and its local provider alias, such as provider = aws.west.'
    },
    {
      id: 'q-tf004-18', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
      question: 'What does marking a Terraform variable as sensitive do?',
      options: ['Redacts its value from normal CLI output but does not guarantee exclusion from state', 'Encrypts the value in every state backend', 'Prevents providers from receiving the value', 'Deletes the value immediately after terraform apply'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'The sensitive flag limits normal display of a value. Sensitive values can still be stored in state, so the state must be protected.'
    },
    {
      id: 'q-tf004-19', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
      question: 'What is the purpose of the create_before_destroy lifecycle rule?',
      options: ['Create a replacement before destroying the existing object when possible', 'Prevent Terraform from ever replacing the object', 'Skip dependency graph construction', 'Create every resource twice for availability'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'create_before_destroy reverses the normal replacement order when the remote API and naming constraints permit it, reducing disruption during replacement.'
    },
    {
      id: 'q-tf004-20', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'multiple',
      question: 'Which two Terraform features can validate assumptions using custom conditions? Select two.',
      options: ['A variable validation block', 'The dependency lock file', 'A resource precondition', 'The local backend'],
      correctAnswer: null, correctAnswers: [0, 2],
      explanation: 'Variable validation checks supplied input values, while resource preconditions check assumptions before Terraform performs the associated operation.'
    },
    {
      id: 'q-tf004-21', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
      question: 'Why is for_each often preferred over count when managing objects identified by meaningful names?',
      options: ['Its instance addresses use stable map keys or set members', 'It automatically creates a child module', 'It disables resource replacement', 'It stores no information in state'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'for_each identifies instances by keys, which can avoid the index shifting that may occur when count is used with a changing ordered list.'
    },
    {
      id: 'q-tf004-22', topicId: 'tf004-modules', difficulty: 'Medium', type: 'single',
      question: 'Where is the version argument normally used to constrain a registry module?',
      options: ['Inside the module block', 'Inside the provider block', 'Inside the output block', 'Inside the backend block'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'A module block can include a version constraint when its source supports versioning, such as a module from a registry.'
    },
    {
      id: 'q-tf004-23', topicId: 'tf004-state', difficulty: 'Medium', type: 'single',
      question: 'After changing a configuration from local state to a remote backend, which command initializes the new backend and can migrate the existing state?',
      options: ['terraform init -migrate-state', 'terraform state list -remote', 'terraform apply -refresh-only', 'terraform fmt -recursive'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'terraform init -migrate-state reinitializes the backend and confirms migration of existing state to the newly configured backend.'
    },
    {
      id: 'q-tf004-24', topicId: 'tf004-state', difficulty: 'Medium', type: 'single',
      question: 'What is the purpose of a refresh-only plan?',
      options: ['Review updates needed to reconcile Terraform state with changes already made remotely', 'Recreate every object recorded in state', 'Download newer provider versions', 'Remove all resources missing from configuration'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'Refresh-only mode lets you review and record remote changes in state without proposing changes to the remote infrastructure.'
    },
    {
      id: 'q-tf004-25', topicId: 'tf004-state', difficulty: 'Hard', type: 'single',
      question: 'A resource block is moved into a child module without changing the real infrastructure. What should record the address change in configuration?',
      options: ['A moved block', 'A check block', 'A provider alias', 'A backend block'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'A moved block tells Terraform that an existing object has a new resource address, allowing the refactor without treating it as an unrelated destroy-and-create operation.'
    },
    {
      id: 'q-tf004-26', topicId: 'tf004-maintenance', difficulty: 'Medium', type: 'multiple',
      question: 'Which two statements about importing existing infrastructure are correct? Select two.',
      options: ['The destination resource address must be chosen deliberately', 'Import always produces a complete production-ready configuration', 'The configuration must describe the object Terraform will manage', 'Import automatically moves the object to a new cloud account'],
      correctAnswer: null, correctAnswers: [0, 2],
      explanation: 'Import associates an existing object with a selected Terraform address. Configuration is still required and must be reviewed so it represents the desired management state.'
    },
    {
      id: 'q-tf004-27', topicId: 'tf004-maintenance', difficulty: 'Easy', type: 'multiple',
      question: 'Which two Terraform CLI commands inspect state without changing resource addresses? Select two.',
      options: ['terraform state list', 'terraform state show', 'terraform state mv', 'terraform state rm'],
      correctAnswer: null, correctAnswers: [0, 1],
      explanation: 'state list displays the resource addresses in state and state show displays attributes for one state address. state mv and state rm modify Terraform state records.'
    },
    {
      id: 'q-tf004-28', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'single',
      question: 'What is a key property of an ephemeral value in supported Terraform configuration?',
      options: ['Terraform omits it from state and plan files', 'Terraform automatically stores it in a local values file', 'It can only contain a number', 'It replaces the need for provider authentication'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'Ephemeral values are intended for temporary data and are omitted from state and plan files, reducing persistence of short-lived sensitive information.'
    },
    {
      id: 'q-tf004-29', topicId: 'tf004-hcp', difficulty: 'Medium', type: 'single',
      question: 'What commonly happens when an HCP Terraform workspace is connected to a version control repository and an approved change is committed?',
      options: ['The workspace can automatically queue a run for the changed configuration', 'The local backend overwrites the HCP Terraform state', 'Terraform bypasses the plan stage', 'Every workspace in the organization is destroyed'],
      correctAnswer: 0, correctAnswers: null,
      explanation: 'A VCS-connected workspace can detect relevant commits and queue Terraform runs according to the workspace configuration and approval workflow.'
    },
    {
      id: 'q-tf004-30', topicId: 'tf004-hcp', difficulty: 'Hard', type: 'multiple',
      question: 'Which two HCP Terraform capabilities support controlled team workflows? Select two.',
      options: ['Policy enforcement', 'Disabling state history', 'Team-based workspace permissions', 'Storing every credential in configuration files'],
      correctAnswer: null, correctAnswers: [0, 2],
      explanation: 'Policy enforcement can evaluate changes against organizational rules, while team permissions control who can view, plan, apply, or administer workspaces.'
    }
  ]
});
