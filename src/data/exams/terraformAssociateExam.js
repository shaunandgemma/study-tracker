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
    }
  ]
});
