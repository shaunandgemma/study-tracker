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
      id: 'tf004-iac', code: 'Objective 1', title: 'Infrastructure as Code with Terraform', weight: 10,
      description: 'Understand infrastructure as code and why Terraform supports service-independent workflows.',
      items: [
        { id: 'tf004-1a', text: 'Explain what infrastructure as code is' },
        { id: 'tf004-1b', text: 'Describe the advantages of infrastructure-as-code patterns' },
        { id: 'tf004-1c', text: 'Explain multi-cloud, hybrid-cloud, and service-agnostic Terraform workflows' }
      ]
    },
    {
      id: 'tf004-fundamentals', code: 'Objective 2', title: 'Terraform Fundamentals', weight: 12,
      description: 'Understand providers, provider versions, multiple-provider configuration, and state.',
      items: [
        { id: 'tf004-2a', text: 'Install and version Terraform providers' },
        { id: 'tf004-2b', text: 'Describe how Terraform uses providers' },
        { id: 'tf004-2c', text: 'Write Terraform configuration using multiple providers' },
        { id: 'tf004-2d', text: 'Explain how Terraform uses and manages state' }
      ]
    },
    {
      id: 'tf004-workflow', code: 'Objective 3', title: 'Core Terraform Workflow', weight: 18,
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
      id: 'tf004-configuration', code: 'Objective 4', title: 'Terraform Configuration', weight: 22,
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
      id: 'tf004-modules', code: 'Objective 5', title: 'Terraform Modules', weight: 12,
      description: 'Source, configure, compose, and version Terraform modules.',
      items: [
        { id: 'tf004-5a', text: 'Explain how Terraform sources modules' },
        { id: 'tf004-5b', text: 'Describe variable scope within modules' },
        { id: 'tf004-5c', text: 'Use modules in Terraform configuration' },
        { id: 'tf004-5d', text: 'Manage module versions' }
      ]
    },
    {
      id: 'tf004-state', code: 'Objective 6', title: 'Terraform State Management', weight: 12,
      description: 'Understand local and remote state, locking, drift, and safe state refactoring.',
      items: [
        { id: 'tf004-6a', text: 'Describe the local backend' },
        { id: 'tf004-6b', text: 'Describe Terraform state locking' },
        { id: 'tf004-6c', text: 'Configure remote state using the backend block' },
        { id: 'tf004-6d', text: 'Manage resource drift and Terraform state' }
      ]
    },
    {
      id: 'tf004-maintenance', code: 'Objective 7', title: 'Maintain Infrastructure with Terraform', weight: 7,
      description: 'Bring existing resources under management and inspect or troubleshoot Terraform state.',
      items: [
        { id: 'tf004-7a', text: 'Import existing infrastructure into a Terraform workspace' },
        { id: 'tf004-7b', text: 'Use the Terraform CLI to inspect state' },
        { id: 'tf004-7c', text: 'Describe when and how to use verbose Terraform logging' }
      ]
    },
    {
      id: 'tf004-hcp', code: 'Objective 8', title: 'HCP Terraform', weight: 7,
      description: 'Understand HCP Terraform workflows, collaboration, governance, projects, and integrations.',
      items: [
        { id: 'tf004-8a', text: 'Use HCP Terraform to create infrastructure' },
        { id: 'tf004-8b', text: 'Describe HCP Terraform collaboration and governance features' },
        { id: 'tf004-8c', text: 'Organize and use HCP Terraform workspaces and projects' },
        { id: 'tf004-8d', text: 'Configure and use HCP Terraform integration' }
      ]
    }
  ]
});
