export const TERRAFORM_ASSOCIATE_QUESTIONS = Object.freeze([
  {
    id: 'q-tf004-1', topicId: 'tf004-iac', difficulty: 'Easy', type: 'single',
    question: 'A team currently creates development environments by following a shared checklist. What is the strongest reason to replace that process with Terraform configuration stored in version control?',
    options: [
      'It guarantees that cloud providers never change their service APIs',
      'It makes infrastructure changes repeatable, reviewable, and auditable',
      'It removes the need to authenticate to infrastructure providers',
      'It prevents anyone from changing infrastructure outside Terraform'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'Version-controlled Terraform configuration gives the team a repeatable definition of the intended infrastructure and a reviewable history of changes. It does not prevent drift, remove authentication, or control provider APIs.'
  },
  {
    id: 'q-tf004-2', topicId: 'tf004-iac', difficulty: 'Medium', type: 'single',
    question: 'One Terraform configuration manages resources in AWS and an external monitoring service. How can Terraform use one workflow for both services?',
    options: [
      'It translates both services into the same native cloud template format',
      'It stores each service object in a separate Terraform executable',
      'It uses a provider plugin that implements each service API',
      'It mirrors all service APIs into the Terraform state file'
    ],
    correctAnswer: 2, correctAnswers: null,
    explanation: 'Providers are plugins that let Terraform communicate with cloud, SaaS, and other service APIs. The workflow stays consistent while each provider implements the operations needed for its own service.'
  },
  {
    id: 'q-tf004-3', topicId: 'tf004-fundamentals', difficulty: 'Easy', type: 'single',
    question: 'A learner has cloned a valid Terraform configuration into a new empty working directory. Which command should they run before creating a plan?',
    options: ['terraform validate', 'terraform providers lock', 'terraform init', 'terraform refresh'],
    correctAnswer: 2, correctAnswers: null,
    explanation: 'terraform init prepares the working directory, initializes the configured backend, and installs required providers and modules. Validation and planning normally follow initialization.'
  },
  {
    id: 'q-tf004-4', topicId: 'tf004-fundamentals', difficulty: 'Medium', type: 'single',
    question: 'Why should a team commit the .terraform.lock.hcl dependency lock file to version control?',
    options: [
      'It stores the credentials used by every configured provider',
      'It records selected provider versions and package checksums',
      'It replaces all provider constraints in required_providers',
      'It contains the latest remote objects recorded in state'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'The dependency lock file records selected provider versions and checksums so later initialization can make consistent provider selections and verify downloaded packages. It does not store credentials or infrastructure state.'
  },
  {
    id: 'q-tf004-5', topicId: 'tf004-workflow', difficulty: 'Easy', type: 'single',
    question: 'A change has been written and validated. Which command shows the proposed actions without changing the managed infrastructure?',
    options: ['terraform apply', 'terraform plan', 'terraform state show', 'terraform output'],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'terraform plan compares configuration, prior state, and refreshed remote object information to propose an execution plan. It does not apply the proposed infrastructure changes.'
  },
  {
    id: 'q-tf004-6', topicId: 'tf004-workflow', difficulty: 'Medium', type: 'single',
    question: 'A team reviews a plan saved as tfplan. What is the main benefit of running terraform apply tfplan instead of terraform apply with no plan file?',
    options: [
      'Terraform applies the exact saved plan that the team reviewed',
      'Terraform upgrades all providers before applying the changes',
      'Terraform bypasses provider authentication for that operation',
      'Terraform disables state refresh and locking for that operation'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Supplying a saved plan tells Terraform to apply that reviewed plan rather than generating a new speculative plan. Provider authentication and normal safety behavior are still required.'
  },
  {
    id: 'q-tf004-7', topicId: 'tf004-configuration', difficulty: 'Easy', type: 'single',
    question: 'A network already exists and Terraform only needs to read its attributes for use by another resource. Which block type is most appropriate?',
    options: ['A resource block', 'A moved block', 'A data block', 'An output block'],
    correctAnswer: 2, correctAnswers: null,
    explanation: 'A data block reads information from an existing object without declaring that object as managed by the current configuration. A resource block is used when Terraform should manage the object lifecycle.'
  },
  {
    id: 'q-tf004-8', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
    question: 'When should an author normally add an explicit depends_on relationship?',
    options: [
      'Whenever two resources use the same provider configuration',
      'When a required dependency is not visible in value references',
      'Whenever a resource has more than one configuration argument',
      'When a variable value is supplied from a tfvars file'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'Terraform infers dependencies from references in expressions. depends_on is appropriate for a real behavioral dependency that Terraform cannot infer from those references.'
  },
  {
    id: 'q-tf004-9', topicId: 'tf004-modules', difficulty: 'Easy', type: 'single',
    question: 'How does a root module normally pass an environment name into a child module?',
    options: [
      'By assigning a value to a declared child-module input',
      'By writing the value directly into the child state file',
      'By adding the value to the provider dependency lock file',
      'By exporting the value from a saved execution plan'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'The child module declares an input variable and the calling module assigns its value in the module block. Module inputs form the supported interface between the caller and child.'
  },
  {
    id: 'q-tf004-10', topicId: 'tf004-modules', difficulty: 'Medium', type: 'single',
    question: 'A team wants a publicly discoverable module with published versions and documentation. Which source is designed for this use?',
    options: [
      'A local Terraform state file',
      'A saved Terraform plan file',
      'The Terraform dependency lock file',
      'The public Terraform Registry'
    ],
    correctAnswer: 3, correctAnswers: null,
    explanation: 'The public Terraform Registry provides discoverable and versioned modules with documentation. Local state, plan files, and provider lock files are not module distribution services.'
  },
  {
    id: 'q-tf004-11', topicId: 'tf004-state', difficulty: 'Easy', type: 'single',
    question: 'What essential relationship does Terraform state record?',
    options: [
      'Provider binaries mapped to their download locations',
      'Resource addresses mapped to real infrastructure objects',
      'Variable names mapped to environment variable files',
      'Module sources mapped to version-control branches'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'State maps Terraform resource instances and their addresses to real remote objects, while also retaining metadata needed to plan and manage those objects.'
  },
  {
    id: 'q-tf004-12', topicId: 'tf004-state', difficulty: 'Medium', type: 'single',
    question: 'Two engineers start operations against the same remote state at nearly the same time. Which backend capability reduces the risk of both operations writing state concurrently?',
    options: ['State locking', 'Provider aliasing', 'Output sensitivity', 'Module versioning'],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'State locking prevents supported operations from acquiring the same state for modification at the same time. The selected backend must support the relevant locking mechanism.'
  },
  {
    id: 'q-tf004-13', topicId: 'tf004-maintenance', difficulty: 'Easy', type: 'single',
    question: 'What is the immediate result of successfully importing an existing object to a Terraform resource address?',
    options: [
      'Terraform recreates the object using its default arguments',
      'Terraform associates the existing object with the chosen address',
      'Terraform generates a complete production-ready module automatically',
      'Terraform moves the object into the account used by the provider'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'Import binds an existing remote object to a selected Terraform resource address. The practitioner must still provide and review configuration that represents the desired managed object.'
  },
  {
    id: 'q-tf004-14', topicId: 'tf004-maintenance', difficulty: 'Medium', type: 'single',
    question: 'A Terraform command fails without enough diagnostic detail. Which environment variable controls Terraform core log verbosity?',
    options: ['TF_INPUT', 'TF_DATA_DIR', 'TF_LOG', 'TF_VAR_name'],
    correctAnswer: 2, correctAnswers: null,
    explanation: 'TF_LOG sets the Terraform core logging level, such as DEBUG or TRACE. Logs can contain sensitive information, so they should be enabled temporarily and handled carefully.'
  },
  {
    id: 'q-tf004-15', topicId: 'tf004-hcp', difficulty: 'Easy', type: 'single',
    question: 'Which collection of information is normally associated with an HCP Terraform workspace?',
    options: [
      'Provider source code, plugin releases, and Registry ownership',
      'Configuration connection, variables, state, and run history',
      'Cloud root credentials, billing data, and support tickets',
      'Only a local plan file and the current CLI process'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'An HCP Terraform workspace organizes the configuration source or workflow, variables, state, and run history used to manage a particular collection of infrastructure.'
  },
  {
    id: 'q-tf004-16', topicId: 'tf004-hcp', difficulty: 'Medium', type: 'single',
    question: 'An organization must evaluate infrastructure changes against governance rules before an apply. Which HCP Terraform capability addresses this requirement?',
    options: ['Provider aliasing', 'Policy enforcement', 'Local state storage', 'Configuration formatting'],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'HCP Terraform policy enforcement evaluates runs against organizational policies at defined enforcement levels. Provider aliases, local state, and formatting do not provide governance decisions.'
  },
  {
    id: 'q-tf004-17', topicId: 'tf004-fundamentals', difficulty: 'Medium', type: 'single',
    question: 'A resource must use the alternate AWS provider configuration declared with alias = "west". Which resource meta-argument selects it?',
    options: ['providers = aws.west', 'region = aws.west', 'provider = aws.west', 'source = aws.west'],
    correctAnswer: 2, correctAnswers: null,
    explanation: 'A resource selects an alternate provider configuration with the provider meta-argument and the local provider reference, such as provider = aws.west.'
  },
  {
    id: 'q-tf004-18', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
    question: 'What does sensitive = true on a Terraform variable guarantee?',
    options: [
      'The value is encrypted automatically in every possible backend',
      'The value is omitted permanently from all state snapshots',
      'The value is redacted from normal Terraform CLI presentation',
      'The provider is prevented from receiving the variable value'
    ],
    correctAnswer: 2, correctAnswers: null,
    explanation: 'The sensitive flag redacts the value from normal CLI and UI presentation. It does not guarantee encryption or omission from state, so state and access to it must still be protected.'
  },
  {
    id: 'q-tf004-19', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
    question: 'A resource replacement must minimize interruption when the remote API permits both objects to exist briefly. Which lifecycle setting is intended for this behavior?',
    options: ['prevent_destroy', 'ignore_changes', 'create_before_destroy', 'replace_triggered_by'],
    correctAnswer: 2, correctAnswers: null,
    explanation: 'create_before_destroy requests creation of the replacement before deletion of the prior object. Provider and naming constraints can still prevent both objects from existing simultaneously.'
  },
  {
    id: 'q-tf004-20', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'multiple',
    question: 'Which two features can stop an operation when a custom condition is not satisfied? Select two.',
    options: [
      'A variable validation block',
      'A resource precondition block',
      'A dependency lock file checksum',
      'A local backend path setting',
      'A provider configuration alias'
    ],
    correctAnswer: null, correctAnswers: [0, 1],
    explanation: 'Variable validation rejects unsuitable input values, and a precondition prevents an operation when its required assumption is false. Lock checksums, backend paths, and aliases serve different purposes.'
  },
  {
    id: 'q-tf004-21', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
    question: 'Why is for_each often safer than count for instances identified by stable names?',
    options: [
      'It identifies instances by keys instead of changing list positions',
      'It prevents every instance from ever being replaced by Terraform',
      'It automatically stores each instance in a separate state file',
      'It lets one resource use providers from unrelated source addresses'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'for_each uses map keys or set members in instance addresses. Stable keys can avoid the address shifting that may occur when count indexes an ordered list whose members change.'
  },
  {
    id: 'q-tf004-22', topicId: 'tf004-modules', difficulty: 'Medium', type: 'single',
    question: 'Where is a version constraint specified for a module sourced from a Terraform Registry?',
    options: ['In the backend block', 'In the module block', 'In the provider block', 'In the output block'],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'A Registry module call can use the version argument inside its module block. The version argument is not supported for every module source type.'
  },
  {
    id: 'q-tf004-23', topicId: 'tf004-state', difficulty: 'Medium', type: 'single',
    question: 'A team changes from the local backend to a configured remote backend and wants Terraform to copy the existing state. Which command is appropriate?',
    options: ['terraform state push -force', 'terraform init -migrate-state', 'terraform plan -refresh-only', 'terraform apply -replace-state'],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'terraform init -migrate-state reinitializes the working directory for the changed backend configuration and prompts to migrate existing state to the new backend.'
  },
  {
    id: 'q-tf004-24', topicId: 'tf004-state', difficulty: 'Medium', type: 'single',
    question: 'An administrator changed a tag directly in the cloud console. The team wants to review updating state to match that remote change without modifying the remote object. Which plan mode should they use?',
    options: ['A destroy plan', 'A targeted plan', 'A refresh-only plan', 'A saved replacement plan'],
    correctAnswer: 2, correctAnswers: null,
    explanation: 'Refresh-only mode proposes updates to Terraform state and root outputs so they match changes already made to remote objects, without proposing corrective changes to those objects.'
  },
  {
    id: 'q-tf004-25', topicId: 'tf004-state', difficulty: 'Hard', type: 'single',
    question: 'A resource block is moved into a child module, but the real object must remain unchanged. Which configuration construct records the address change?',
    options: ['A check block', 'A moved block', 'A dynamic block', 'A terraform_data block'],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'A moved block maps the old resource address to the new address. Terraform can then preserve the existing object while recording the refactor in configuration.'
  },
  {
    id: 'q-tf004-26', topicId: 'tf004-maintenance', difficulty: 'Medium', type: 'multiple',
    question: 'Which two statements describe a safe import workflow? Select two.',
    options: [
      'Choose the destination resource address deliberately',
      'Assume import creates a complete production configuration',
      'Create and review configuration for the imported object',
      'Expect import to move the object between cloud accounts',
      'Delete the object remotely before running the import'
    ],
    correctAnswer: null, correctAnswers: [0, 2],
    explanation: 'The practitioner selects the Terraform address and supplies configuration that should manage the existing object. Import does not relocate or recreate the object, and generated configuration still requires review.'
  },
  {
    id: 'q-tf004-27', topicId: 'tf004-maintenance', difficulty: 'Easy', type: 'multiple',
    question: 'Which two commands inspect Terraform state without changing resource addresses or removing records? Select two.',
    options: ['terraform state list', 'terraform state show', 'terraform state mv', 'terraform state rm', 'terraform state push'],
    correctAnswer: null, correctAnswers: [0, 1],
    explanation: 'terraform state list displays tracked addresses and terraform state show displays attributes for a selected address. The mv, rm, and push operations can change state data.'
  },
  {
    id: 'q-tf004-28', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'single',
    question: 'What distinguishes an ephemeral value from a value that is only marked sensitive?',
    options: [
      'An ephemeral value is always stored in a separate encrypted state file',
      'An ephemeral value is omitted from Terraform plan and state artifacts',
      'An ephemeral value can be referenced from every configuration context',
      'An ephemeral value removes the need to protect provider log output'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'Terraform omits ephemeral values from plan and state artifacts and restricts where they can be used. A sensitive value is normally redacted from display but can still be persisted in state.'
  },
  {
    id: 'q-tf004-29', topicId: 'tf004-hcp', difficulty: 'Medium', type: 'single',
    question: 'What can a VCS-connected HCP Terraform workspace do when a relevant approved commit is pushed?',
    options: [
      'Queue a run based on the workspace VCS configuration',
      'Apply changes while permanently skipping the plan stage',
      'Overwrite the repository with the current remote state',
      'Run every workspace in the organization unconditionally'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'A VCS-connected workspace can detect relevant repository changes and queue runs according to its configuration. The normal run and approval controls still apply.'
  },
  {
    id: 'q-tf004-30', topicId: 'tf004-hcp', difficulty: 'Hard', type: 'multiple',
    question: 'Which two HCP Terraform features directly support controlled team workflows? Select two.',
    options: [
      'Team-based workspace permissions',
      'Removal of all historical state versions',
      'Policy enforcement during run workflows',
      'Credentials committed inside configuration files',
      'Automatic bypass of mandatory run approvals'
    ],
    correctAnswer: null, correctAnswers: [0, 2],
    explanation: 'Team permissions control access to workspaces and actions, while policy enforcement evaluates proposed changes against organizational rules. The other choices weaken rather than support controlled collaboration.'
  },
  {
    id: 'q-tf004-31', topicId: 'tf004-iac', difficulty: 'Medium', type: 'single',
    question: 'A cloud object was changed manually after the last Terraform apply. What best describes Terraform\'s desired-state approach during the next plan?',
    options: [
      'Terraform ignores the object because it already exists remotely',
      'Terraform compares configuration, state, and refreshed remote data',
      'Terraform immediately changes the object before showing a plan',
      'Terraform rewrites configuration to match every manual change'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'Terraform creates a plan by reconciling the desired configuration with prior state and refreshed information about remote objects. It then proposes actions; it does not silently rewrite configuration or apply during planning.'
  },
  {
    id: 'q-tf004-32', topicId: 'tf004-fundamentals', difficulty: 'Medium', type: 'multiple',
    question: 'Which two entries belong in a required_providers declaration for a provider requirement? Select two.',
    options: [
      'The provider source address',
      'The provider authentication token',
      'An acceptable version constraint',
      'The current remote resource IDs',
      'The backend state-lock identifier'
    ],
    correctAnswer: null, correctAnswers: [0, 2],
    explanation: 'required_providers declares where a provider comes from and which versions are acceptable. Authentication belongs in provider configuration or secure external mechanisms, not in provider requirements.'
  },
  {
    id: 'q-tf004-33', topicId: 'tf004-fundamentals', difficulty: 'Hard', type: 'single',
    question: 'A child module expects an alternate AWS configuration named aws.replica. How should the caller pass its own aws.west configuration to that child?',
    options: [
      'Set provider = aws.replica inside every child resource from the caller',
      'Set providers = { aws.replica = aws.west } in the module block',
      'Set aliases = { aws.west = aws.replica } in required_providers',
      'Set source = aws.west in the child module output block'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'The module call uses its providers map to associate the child module provider name with a provider configuration in the caller. The child must declare any configuration aliases it expects.'
  },
  {
    id: 'q-tf004-34', topicId: 'tf004-workflow', difficulty: 'Medium', type: 'single',
    question: 'The configuration permits a newer provider version, but the dependency lock file retains an older selection. Which command asks Terraform to reconsider allowed provider selections?',
    options: ['terraform init -upgrade', 'terraform validate -upgrade', 'terraform plan -replace', 'terraform providers mirror'],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'terraform init -upgrade ignores the existing provider selections when choosing among versions allowed by the configured constraints, then updates the lock file as needed.'
  },
  {
    id: 'q-tf004-35', topicId: 'tf004-workflow', difficulty: 'Medium', type: 'multiple',
    question: 'Which two statements correctly distinguish terraform fmt and terraform validate? Select two.',
    options: [
      'terraform fmt rewrites configuration into canonical style',
      'terraform fmt confirms provider credentials can create resources',
      'terraform validate checks configuration syntax and internal consistency',
      'terraform validate applies safe formatting changes automatically',
      'terraform validate confirms that a saved plan is still current'
    ],
    correctAnswer: null, correctAnswers: [0, 2],
    explanation: 'terraform fmt applies Terraform language style conventions. terraform validate checks whether a configuration is syntactically valid and internally consistent, but does not validate remote credentials or apply formatting.'
  },
  {
    id: 'q-tf004-36', topicId: 'tf004-workflow', difficulty: 'Hard', type: 'single',
    question: 'A saved plan was created, but another successful apply changed the same workspace state before the saved plan was used. What should the team expect?',
    options: [
      'Terraform should reject the stale plan rather than apply it blindly',
      'Terraform should merge both plans without recalculating dependencies',
      'Terraform should delete the newer state and restore the saved state',
      'Terraform should apply only resource creates from the older plan'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'A saved plan is tied to the state and configuration context from which it was created. If the state has changed, Terraform detects that the plan is stale and requires a new plan.'
  },
  {
    id: 'q-tf004-37', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
    question: 'A data source reads an image ID that is then assigned to a managed instance resource. What dependency behavior results from that reference?',
    options: [
      'Terraform infers that the data source must be read before planning the instance value',
      'Terraform creates and later destroys the image represented by the data source',
      'Terraform requires depends_on because data sources never create dependencies',
      'Terraform copies the complete data source object into the instance state address'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'The reference creates an implicit dependency in Terraform\'s graph. The data source reads information; it does not cause the referenced remote object to become managed by the resource lifecycle.'
  },
  {
    id: 'q-tf004-38', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'single',
    question: 'A variable has a default, a value in terraform.tfvars, and a value supplied with -var on the command line. Which value is used for that CLI-driven run?',
    options: [
      'The declared default because configuration has highest precedence',
      'The terraform.tfvars value because it is loaded automatically',
      'The command-line -var value because it has higher precedence',
      'Terraform stops because the variable has more than one value source'
    ],
    correctAnswer: 2, correctAnswers: null,
    explanation: 'For the Terraform CLI variable-loading order, command-line -var and -var-file assignments take precedence over automatically loaded tfvars values and declared defaults.'
  },
  {
    id: 'q-tf004-39', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
    question: 'A module needs a named collection whose values each contain a CIDR string and a Boolean public flag. Which type constraint best represents this input?',
    options: [
      'list(string)',
      'map(object({ cidr = string, public = bool }))',
      'tuple([string, bool])',
      'set(map(string))'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'A map provides stable names as keys, while each object enforces the cidr string and public Boolean attributes. The other types do not model a named collection of consistently shaped records.'
  },
  {
    id: 'q-tf004-40', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'single',
    question: 'Which expression returns only enabled service names from var.services, where each map value has an enabled Boolean attribute?',
    options: [
      '[for name, service in var.services : name if service.enabled]',
      '[for name in var.services : service.enabled => name]',
      'for_each(var.services, service.enabled, name)',
      'filter(var.services[*].name, enabled = true)'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'A for expression can transform each map element to its name and use an if clause to filter out values whose enabled attribute is false.'
  },
  {
    id: 'q-tf004-41', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'single',
    question: 'A resource must be created only when an input assumption is valid. Which custom condition is the closest fit?',
    options: [
      'A postcondition that is evaluated only after every future run',
      'A precondition attached to the resource lifecycle',
      'A check block that automatically changes the invalid input',
      'A variable output that replaces the resource dependency'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'A resource precondition checks an assumption before Terraform performs the associated resource operation and can stop the operation with a useful error message.'
  },
  {
    id: 'q-tf004-42', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'multiple',
    question: 'Which two statements about supported write-only resource arguments are correct? Select two.',
    options: [
      'Their configured values are not persisted in plan or state files',
      'Every resource argument becomes write-only when marked sensitive',
      'Provider support determines whether an argument is write-only',
      'They can be read later with terraform state show',
      'They remove the need to secure provider and Terraform logs'
    ],
    correctAnswer: null, correctAnswers: [0, 2],
    explanation: 'A provider schema defines supported write-only arguments, and Terraform does not persist their values in plan or state artifacts. They are different from sensitive values and do not make logging automatically safe.'
  },
  {
    id: 'q-tf004-43', topicId: 'tf004-modules', difficulty: 'Medium', type: 'single',
    question: 'A root module needs the subnet ID created inside a child module. What should form the child module interface for this value?',
    options: [
      'A child output referenced as module.network.subnet_id',
      'A direct reference to the child resource local address',
      'A backend block copied from the child into the caller',
      'A provider lock entry exported by the child module'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'The child module declares an output and the caller reads it through the module object. A caller cannot directly address a resource inside the child module as if it were in the same scope.'
  },
  {
    id: 'q-tf004-44', topicId: 'tf004-modules', difficulty: 'Hard', type: 'single',
    question: 'A module block uses a local path source and also sets version = "~> 2.0". What is the problem?',
    options: [
      'Local modules cannot declare input variables or output values',
      'The version argument applies to Registry module sources, not local paths',
      'Local modules must be downloaded with terraform providers mirror',
      'The version constraint must be moved into the provider configuration'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'The module version argument is supported for Registry module sources. A local-path module uses the files at that path and is not selected through a Registry version constraint.'
  },
  {
    id: 'q-tf004-45', topicId: 'tf004-state', difficulty: 'Medium', type: 'multiple',
    question: 'Which two characteristics describe the default local backend? Select two.',
    options: [
      'It stores state on the local filesystem by default',
      'It automatically provides shared remote collaboration',
      'It performs Terraform operations on the local machine',
      'It automatically encrypts state with HCP Terraform keys',
      'It requires a cloud object-storage bucket for every workspace'
    ],
    correctAnswer: null, correctAnswers: [0, 2],
    explanation: 'The local backend stores state locally and executes operations locally. It does not by itself provide remote shared state, hosted encryption, or an object-storage requirement.'
  },
  {
    id: 'q-tf004-46', topicId: 'tf004-state', difficulty: 'Hard', type: 'single',
    question: 'Why can a backend block not use normal input-variable references for all of its settings?',
    options: [
      'Backend initialization occurs before normal expression evaluation is available',
      'Backends can only store state for configurations without any variables',
      'Backend settings are copied from the provider dependency lock file',
      'Terraform evaluates backend settings only after resources are applied'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Terraform must initialize the backend before it can perform the normal evaluation and planning workflow. Backend configuration therefore has restrictions and can also receive partial settings during initialization.'
  },
  {
    id: 'q-tf004-47', topicId: 'tf004-state', difficulty: 'Hard', type: 'single',
    question: 'A team wants Terraform to stop managing an object without destroying the remote object, and wants the decision recorded in configuration. Which construct should they consider?',
    options: ['A removed block', 'A dynamic block', 'A check block', 'A terraform block'],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'A removed block can record that a resource is intentionally removed from Terraform management and, when configured not to destroy, preserve the remote object while removing it from state.'
  },
  {
    id: 'q-tf004-48', topicId: 'tf004-maintenance', difficulty: 'Hard', type: 'single',
    question: 'What advantage does an import block provide compared with relying only on a one-time terraform import CLI command?',
    options: [
      'It records the import request in reviewable configuration',
      'It guarantees that generated configuration needs no review',
      'It moves the imported object into the provider account',
      'It prevents Terraform from refreshing the imported object'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'An import block makes the intended import part of configuration, so it can be planned and reviewed with the rest of the change. Any generated or authored resource configuration still requires careful review.'
  },
  {
    id: 'q-tf004-49', topicId: 'tf004-hcp', difficulty: 'Medium', type: 'multiple',
    question: 'Which two statements correctly describe HCP Terraform projects and variable sets? Select two.',
    options: [
      'Projects can group related workspaces for organization and access control',
      'Variable sets can provide reusable variables to selected workspaces or projects',
      'Projects replace provider plugins with built-in cloud API clients',
      'Variable sets are committed automatically to every linked repository',
      'Projects force all workspaces to share one Terraform state file'
    ],
    correctAnswer: null, correctAnswers: [0, 1],
    explanation: 'Projects organize related workspaces and can support project-level permissions. Variable sets let teams reuse common variable definitions across selected scopes without forcing workspaces to share state.'
  },
  {
    id: 'q-tf004-50', topicId: 'tf004-hcp', difficulty: 'Hard', type: 'multiple',
    question: 'Which two HCP Terraform features reduce manual coordination between connected workspaces and cloud credentials? Select two.',
    options: [
      'Run triggers that queue downstream workspace runs',
      'Dynamic provider credentials issued for a run',
      'A shared plaintext credentials file committed to VCS',
      'One state file reused by every project workspace',
      'Automatic approval of every policy failure'
    ],
    correctAnswer: null, correctAnswers: [0, 1],
    explanation: 'Run triggers coordinate dependent workspace runs, while dynamic provider credentials can issue short-lived credentials for an HCP Terraform run. The other options weaken isolation or governance.'
  }
]);
