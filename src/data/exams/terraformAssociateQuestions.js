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
  },
  {
    id: 'q-tf004-51', objectiveId: 'tf004-1a', topicId: 'tf004-iac', difficulty: 'Easy', type: 'single',
    question: 'Which statement best describes infrastructure as code in a Terraform workflow?',
    options: [
      'Infrastructure is defined in machine-readable configuration and managed through repeatable operations',
      'Infrastructure is created manually and Terraform records screenshots of the completed environment',
      'Infrastructure is stored entirely inside provider plugins rather than in configuration files',
      'Infrastructure is changed through tickets while Terraform monitors the approval queue'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Infrastructure as code represents desired infrastructure in machine-readable files that can be reviewed, versioned, and used in repeatable workflows. It does not mean recording or automating a manual ticket process.'
  },
  {
    id: 'q-tf004-52', objectiveId: 'tf004-1b', topicId: 'tf004-iac', difficulty: 'Medium', type: 'multiple',
    question: 'Which two outcomes are direct advantages of an infrastructure-as-code workflow? Select two.',
    options: [
      'Changes can be reviewed through version-control history',
      'Identical configuration always produces identical provider-generated IDs',
      'Environments can be created through a repeatable process',
      'Remote users are prevented from making manual changes',
      'Provider API outages no longer affect infrastructure changes'
    ],
    correctAnswer: null, correctAnswers: [0, 2],
    explanation: 'Version control makes configuration changes auditable and reviewable, while reusable configuration supports repeatable environment creation. IaC cannot guarantee generated IDs, eliminate API outages, or technically prevent all manual changes.'
  },
  {
    id: 'q-tf004-53', objectiveId: 'tf004-1c', topicId: 'tf004-iac', difficulty: 'Medium', type: 'single',
    question: 'A company manages on-premises virtualization, a public cloud, and a SaaS monitoring platform. What allows one Terraform workflow to cover this hybrid environment?',
    options: [
      'A single state file converts every platform into the same service API',
      'Separate providers expose each platform through Terraform resources and data sources',
      'The local backend copies all on-premises objects into the public cloud',
      'Terraform modules remove the need for platform-specific authentication'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'Terraform uses platform-specific providers behind a consistent configuration and workflow model. Each provider still communicates with its own API and requires appropriate authentication.'
  },
  {
    id: 'q-tf004-54', objectiveId: 'tf004-2a', topicId: 'tf004-fundamentals', difficulty: 'Hard', type: 'single',
    question: 'A root module permits AWS provider versions >= 5.0 and < 6.0, while a child module requires >= 5.30. Which versions can Terraform select?',
    options: [
      'Any version from 5.0 upward because root constraints override child constraints',
      'A version from 5.30 up to, but not including, 6.0',
      'Exactly version 5.30 because the child module is more specific',
      'No version because different modules cannot constrain one provider'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'Terraform selects one provider version compatible with every module requirement. The intersection is version 5.30 or newer but still below 6.0; the lock file can then record the selected version.'
  },
  {
    id: 'q-tf004-55', objectiveId: 'tf004-2b', topicId: 'tf004-fundamentals', difficulty: 'Medium', type: 'single',
    question: 'What information does a Terraform provider schema supply to Terraform Core?',
    options: [
      'Supported resource and data-source types with their arguments and attributes',
      'The complete desired configuration for every resource in the workspace',
      'The team permissions used to approve runs in HCP Terraform',
      'The version-control history used to calculate infrastructure drift'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'A provider plugin exposes schemas and implements operations for its resource and data-source types. Terraform Core uses that information to validate configuration and coordinate planning and applying.'
  },
  {
    id: 'q-tf004-56', objectiveId: 'tf004-2c', topicId: 'tf004-fundamentals', difficulty: 'Hard', type: 'multiple',
    question: 'A root module configures default aws and aliased aws.dr providers. Which two statements are correct? Select two.',
    options: [
      'A resource can select aws.dr with its provider meta-argument',
      'Every child module automatically inherits all aliased configurations',
      'A module call can explicitly map a child provider name to aws.dr',
      'The alias changes the provider source address to a new provider',
      'Each alias requires a separate provider version in the lock file'
    ],
    correctAnswer: null, correctAnswers: [0, 2],
    explanation: 'Resources can select an alias with provider = aws.dr, and callers can pass configurations through a module providers map. Aliases are configurations of the same provider and are not all inherited automatically.'
  },
  {
    id: 'q-tf004-57', objectiveId: 'tf004-2d', topicId: 'tf004-fundamentals', difficulty: 'Medium', type: 'single',
    question: 'Why does Terraform normally refresh information about managed objects before proposing changes?',
    options: [
      'To update the dependency lock file with newer provider checksums',
      'To compare recorded state with current remote object information',
      'To rewrite all variable values from the provider configuration',
      'To import every remote object that matches a resource type'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'Refreshing lets Terraform compare prior state and current remote values before calculating the plan. It does not discover and import unrelated objects or update provider dependencies.'
  },
  {
    id: 'q-tf004-58', objectiveId: 'tf004-3a', topicId: 'tf004-workflow', difficulty: 'Easy', type: 'single',
    question: 'Which sequence most closely follows the core Terraform workflow for a new configuration?',
    options: [
      'Write, initialize, plan, review, and apply',
      'Apply, initialize, write, review, and destroy',
      'Initialize, destroy, import, format, and apply',
      'Write, apply, initialize, refresh, and review'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'The core workflow is to write configuration, initialize the working directory, generate and review a plan, and then apply the approved changes. Validation and formatting support this workflow.'
  },
  {
    id: 'q-tf004-59', objectiveId: 'tf004-3b', topicId: 'tf004-workflow', difficulty: 'Medium', type: 'single',
    question: 'A backend configuration changed, and the team wants to accept the new configuration without copying state from the previously configured backend. Which initialization option fits?',
    options: ['terraform init -upgrade', 'terraform init -reconfigure', 'terraform init -migrate-state', 'terraform init -get=false'],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'terraform init -reconfigure disregards the previously saved backend configuration and initializes using the new settings without performing state migration. Migration is a distinct, deliberate operation.'
  },
  {
    id: 'q-tf004-60', objectiveId: 'tf004-3c', topicId: 'tf004-workflow', difficulty: 'Medium', type: 'multiple',
    question: 'Which two statements about terraform validate are correct? Select two.',
    options: [
      'It checks configuration syntax and internal consistency',
      'It verifies that cloud credentials can create every resource',
      'It can be run without contacting configured remote services',
      'It changes remote objects to match the configuration',
      'It replaces the need to review an execution plan'
    ],
    correctAnswer: null, correctAnswers: [0, 2],
    explanation: 'terraform validate checks syntax and internal consistency and does not validate remote APIs or credentials. An initialized directory may be needed for providers and modules, but validation itself does not plan or apply infrastructure.'
  },
  {
    id: 'q-tf004-61', objectiveId: 'tf004-3d', topicId: 'tf004-workflow', difficulty: 'Hard', type: 'single',
    question: 'In automation, terraform plan -detailed-exitcode returns exit code 2. What does that result mean?',
    options: [
      'The plan failed because configuration could not be parsed',
      'The plan succeeded and proposed at least one change',
      'The plan succeeded and found no infrastructure changes',
      'The plan was applied and state was updated successfully'
    ],
    correctAnswer: 1, correctAnswers: null,
    explanation: 'With -detailed-exitcode, 0 means success with an empty diff, 1 means an error, and 2 means success with proposed changes. The command still only creates a plan.'
  },
  {
    id: 'q-tf004-62', objectiveId: 'tf004-3e', topicId: 'tf004-workflow', difficulty: 'Medium', type: 'single',
    question: 'What happens when terraform apply is run without supplying a previously saved plan?',
    options: [
      'Terraform creates a new plan and normally asks for approval before applying it',
      'Terraform applies the most recent plan found anywhere in the working directory',
      'Terraform skips planning and sends configuration directly to each provider',
      'Terraform applies only output changes and leaves resources unchanged'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Without a saved plan file, terraform apply creates a fresh execution plan and normally asks the user to approve it. A saved plan is required when the exact earlier plan must be applied.'
  },
  {
    id: 'q-tf004-63', objectiveId: 'tf004-3f', topicId: 'tf004-workflow', difficulty: 'Medium', type: 'single',
    question: 'How does terraform destroy determine which managed objects to propose for deletion?',
    options: [
      'It proposes destroy actions for objects represented by the current configuration and state',
      'It lists every object accessible through the configured provider credentials',
      'It deletes provider plugins and assumes remote objects are deleted separately',
      'It removes only objects created during the immediately preceding apply'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'terraform destroy is a convenience form of planning and applying a destroy operation for managed objects in the current configuration and state. It does not enumerate every accessible account resource.'
  },
  {
    id: 'q-tf004-64', objectiveId: 'tf004-3g', topicId: 'tf004-workflow', difficulty: 'Easy', type: 'single',
    question: 'What is the effect of running terraform fmt -recursive in a configuration directory?',
    options: [
      'It formats Terraform files in the directory and its subdirectories',
      'It validates remote provider credentials in every child module',
      'It generates and saves one plan for each configuration file',
      'It upgrades modules and providers to their newest versions'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'terraform fmt rewrites Terraform configuration into canonical style, and -recursive includes subdirectories. Formatting does not validate credentials, produce plans, or upgrade dependencies.'
  },
  {
    id: 'q-tf004-65', objectiveId: 'tf004-4a', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
    question: 'A configuration reads the current AWS account identity and creates a storage bucket. Which pairing uses the appropriate block types?',
    options: [
      'Use a data block for the account identity and a resource block for the bucket',
      'Use a resource block for the account identity and a data block for the bucket',
      'Use output blocks for both because neither value belongs in configuration',
      'Use import blocks for both so Terraform can discover their schemas'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'A data source reads existing information such as the current caller identity, while a resource block declares an object whose lifecycle Terraform should manage.'
  },
  {
    id: 'q-tf004-66', objectiveId: 'tf004-4b', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
    question: 'A subnet argument references aws_vpc.main.id. What additional behavior does Terraform derive from that reference?',
    options: [
      'An implicit dependency that places the VPC before the subnet',
      'A provider alias that moves the subnet into another region',
      'A lifecycle rule that prevents the VPC from being replaced',
      'A state lock that applies only to those two resources'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'The attribute reference both supplies the VPC ID and creates an implicit graph dependency. Terraform can therefore order the VPC operation before the dependent subnet operation.'
  },
  {
    id: 'q-tf004-67', objectiveId: 'tf004-4c', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'multiple',
    question: 'Which two statements about root-module output values are correct? Select two.',
    options: [
      'They can expose selected values after an apply',
      'They automatically become input variables in every child module',
      'Sensitive outputs are redacted in normal CLI output',
      'They are never recorded in Terraform state',
      'They can only refer to literal string values'
    ],
    correctAnswer: null, correctAnswers: [0, 2],
    explanation: 'Root outputs expose selected values and can be marked sensitive to redact normal display. Output values are stored in state, can use expressions of many types, and do not automatically become child inputs.'
  },
  {
    id: 'q-tf004-68', objectiveId: 'tf004-4d', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
    question: 'A variable must contain exactly three values in a fixed order: a string name, a number port, and a Boolean enabled flag. Which type best describes it?',
    options: [
      'tuple([string, number, bool])',
      'list(string)',
      'map(any)',
      'set(object({ value = string }))'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'A tuple can require a fixed number of elements with a distinct type at each position. Lists and sets contain elements of a common type, while the proposed map has no fixed positional structure.'
  },
  {
    id: 'q-tf004-69', objectiveId: 'tf004-4e', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'single',
    question: 'Which expression safely selects var.custom_name when it is not null and otherwise uses the string "default-name"?',
    options: [
      'var.custom_name != null ? var.custom_name : "default-name"',
      'if var.custom_name then var.custom_name else "default-name"',
      'select(var.custom_name, null, "default-name")',
      'var.custom_name || "default-name"'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Terraform conditional expressions use condition ? true_value : false_value. Both result expressions must have compatible types so Terraform can determine the expression type.'
  },
  {
    id: 'q-tf004-70', objectiveId: 'tf004-4f', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'single',
    question: 'A service must be restarted after a policy resource changes, but none of the service arguments reference that policy. How can the hidden ordering requirement be declared?',
    options: [
      'Add the policy resource to the service depends_on list',
      'Add the policy ID to the provider dependency lock file',
      'Move both resources into separate CLI workspaces',
      'Mark the service output as sensitive and ephemeral'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'depends_on declares a real dependency that Terraform cannot infer from value references. It should be used carefully because it can make plans more conservative than necessary.'
  },
  {
    id: 'q-tf004-71', objectiveId: 'tf004-4g', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'single',
    question: 'A team wants to test a deployed endpoint after apply but receive a warning rather than block the operation when the endpoint check fails. Which feature is designed for this?',
    options: [
      'A resource precondition',
      'An input-variable validation',
      'A check block assertion',
      'A provider version constraint'
    ],
    correctAnswer: 2, correctAnswers: null,
    explanation: 'A check block validates infrastructure outside the normal resource lifecycle and reports a warning when its assertion fails. Preconditions and variable validation can block the associated operation.'
  },
  {
    id: 'q-tf004-72', objectiveId: 'tf004-4h', topicId: 'tf004-configuration', difficulty: 'Medium', type: 'multiple',
    question: 'Which two practices reduce the risk of exposing secrets in Terraform workflows? Select two.',
    options: [
      'Use short-lived credentials from a trusted secrets system where possible',
      'Commit plaintext tfvars files so every runner uses identical values',
      'Protect state storage with encryption and restricted access',
      'Print sensitive outputs after every apply for audit purposes',
      'Enable TRACE logging permanently in shared automation'
    ],
    correctAnswer: null, correctAnswers: [0, 2],
    explanation: 'Short-lived credentials and protected state reduce secret exposure and persistence. Plaintext files, displayed outputs, and verbose logs can expose secrets and should not be treated as secure distribution methods.'
  },
  {
    id: 'q-tf004-73', objectiveId: 'tf004-4f', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'single',
    question: 'A platform automatically changes one resource tag after creation, and Terraform should not propose updating only that tag on later plans. Which lifecycle setting is appropriate?',
    options: [
      'ignore_changes for the specific tag attribute path',
      'create_before_destroy for the complete resource',
      'prevent_destroy for the provider configuration',
      'replace_triggered_by for every tag in the account'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'ignore_changes can tell Terraform to disregard selected remote attribute changes during update planning. Terraform still considers the configured value when initially creating the object.'
  },
  {
    id: 'q-tf004-74', objectiveId: 'tf004-4e', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'single',
    question: 'What is the primary purpose of a dynamic block inside a resource?',
    options: [
      'Generate repeated nested blocks from a collection or expression',
      'Choose provider versions dynamically during terraform apply',
      'Create new resource types that the provider does not implement',
      'Read arbitrary remote objects without declaring a data source'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'A dynamic block generates repeated nested configuration blocks using collection data. It cannot generate top-level resource blocks or create provider capabilities that do not exist.'
  },
  {
    id: 'q-tf004-75', objectiveId: 'tf004-4d', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'single',
    question: 'A module input uses object({ name = string, description = optional(string, "managed") }). What happens when a caller omits description?',
    options: [
      'Terraform supplies the default string "managed" for that attribute',
      'Terraform rejects the object because every object attribute is required',
      'Terraform removes the complete object from the module call',
      'Terraform converts the description attribute into an empty list'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'The optional type modifier makes the attribute optional and the second argument supplies its default. The remaining name attribute is still required and must be a string.'
  },
  {
    id: 'q-tf004-76', objectiveId: 'tf004-4h', topicId: 'tf004-configuration', difficulty: 'Hard', type: 'single',
    question: 'A Vault data source returns a secret and a normal resource argument consumes it. What should the team assume unless supported ephemeral and write-only features prevent persistence?',
    options: [
      'The secret may be recorded in Terraform state and state access must be protected',
      'Vault guarantees the value cannot appear in state under any circumstances',
      'Terraform replaces the secret with its Vault path before writing state',
      'The provider lock file encrypts the value with the Vault provider checksum'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Reading a secret from Vault does not automatically keep it out of state when a managed resource stores that value. Teams must understand provider behavior and protect state or use supported non-persistent mechanisms.'
  },
  {
    id: 'q-tf004-77', objectiveId: 'tf004-5a', topicId: 'tf004-modules', difficulty: 'Medium', type: 'single',
    question: 'A module source is git::https://example.com/network.git?ref=v2.1.0. What does the ref parameter select?',
    options: [
      'The Git revision Terraform should retrieve for the module source',
      'The provider configuration alias used by module resources',
      'The Terraform CLI workspace that will hold module state',
      'The output value returned after the module has been applied'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'For a Git module source, ref selects a branch, tag, or commit understood by Git. This is separate from the Registry module version argument and provider configuration.'
  },
  {
    id: 'q-tf004-78', objectiveId: 'tf004-5b', topicId: 'tf004-modules', difficulty: 'Medium', type: 'single',
    question: 'Can a root module directly reference aws_subnet.private.id when that resource is declared inside a child module named network?',
    options: [
      'No; the child must expose the value through an output referenced from module.network',
      'Yes; every resource address is automatically global across all module scopes',
      'Yes; but only after copying the child state file into the root directory',
      'No; child-module resource attributes can never be used outside that module'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Resource names are scoped to their module. The child exposes selected values through outputs, which the caller reads through expressions such as module.network.subnet_id.'
  },
  {
    id: 'q-tf004-79', objectiveId: 'tf004-5c', topicId: 'tf004-modules', difficulty: 'Medium', type: 'multiple',
    question: 'Which two arguments are part of a normal child module call? Select two.',
    options: [
      'A source identifying where Terraform obtains the module',
      'Values assigned to input variables declared by the child',
      'A state file copied from the child module repository',
      'A new Terraform executable compiled for the child module',
      'Remote resource IDs for every object the child might create'
    ],
    correctAnswer: null, correctAnswers: [0, 1],
    explanation: 'A module block declares its source and assigns values to the child module input interface. Terraform manages module resources in the calling configuration state; callers do not copy a separate child state file.'
  },
  {
    id: 'q-tf004-80', objectiveId: 'tf004-5d', topicId: 'tf004-modules', difficulty: 'Hard', type: 'single',
    question: 'A Registry module constraint is ~> 3.2.1. Which module version is compatible with that constraint?',
    options: ['3.2.9', '3.3.0', '4.0.0', '3.1.8'],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'The pessimistic constraint ~> 3.2.1 permits newer patch releases within 3.2 but not 3.3.0 or later. It also does not permit an older 3.1 release.'
  },
  {
    id: 'q-tf004-81', objectiveId: 'tf004-5c', topicId: 'tf004-modules', difficulty: 'Hard', type: 'single',
    question: 'A reusable child module requires the AWS provider. Where should the AWS region normally be configured?',
    options: [
      'In a provider configuration in the root module and inherited or passed to the child',
      'In a provider block inside every reusable child module that uses AWS',
      'In the child module dependency lock file as a provider checksum field',
      'In a child output so the provider reads it after resources are created'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Provider configurations belong in the root module and can be inherited or explicitly passed. Each child still declares provider requirements, but reusable children should not own provider configurations.'
  },
  {
    id: 'q-tf004-82', objectiveId: 'tf004-5b', topicId: 'tf004-modules', difficulty: 'Medium', type: 'single',
    question: 'Two sibling child modules need to share a VPC ID. What is the clearest module-composition pattern?',
    options: [
      'Pass one module\'s VPC ID output into the other module\'s input',
      'Let both modules manage the same VPC resource address independently',
      'Copy the VPC state entry into both child module directories',
      'Place the VPC ID in the provider dependency lock file'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Module composition uses explicit outputs and inputs to connect modules. One real object should not be independently managed at multiple Terraform addresses.'
  },
  {
    id: 'q-tf004-83', objectiveId: 'tf004-6a', topicId: 'tf004-state', difficulty: 'Easy', type: 'single',
    question: 'With no backend block configured, where does the default local backend normally store state?',
    options: [
      'In terraform.tfstate in the working directory',
      'In .terraform.lock.hcl beside the provider checksums',
      'In the public Terraform Registry for the selected module',
      'In a provider-specific object selected during terraform plan'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'The default local backend normally stores workspace state in a local terraform.tfstate file. That is separate from the dependency lock file and provider or Registry services.'
  },
  {
    id: 'q-tf004-84', objectiveId: 'tf004-6b', topicId: 'tf004-state', difficulty: 'Medium', type: 'single',
    question: 'A backend reports that the state is locked by another active operation. What is the safest first response?',
    options: [
      'Confirm whether the other operation is still running before taking further action',
      'Delete the state file so Terraform creates an unlocked replacement',
      'Run force-unlock immediately without checking the lock owner',
      'Change the resource names so the current operation uses a different lock'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'A lock normally indicates another state-changing operation. The team should first identify and allow the active operation to finish; forcing a lock can permit concurrent writes and state corruption.'
  },
  {
    id: 'q-tf004-85', objectiveId: 'tf004-6c', topicId: 'tf004-state', difficulty: 'Medium', type: 'multiple',
    question: 'Which two benefits can a suitable remote backend provide to a team? Select two.',
    options: [
      'A shared location for Terraform state',
      'State locking when the selected backend supports it',
      'Automatic creation of every resource in configuration',
      'Provider authentication without any credentials',
      'Guaranteed prevention of all manual infrastructure changes'
    ],
    correctAnswer: null, correctAnswers: [0, 1],
    explanation: 'A remote backend can centralize state and may provide locking, depending on backend capabilities. It does not create resources by itself, replace provider authentication, or prevent drift.'
  },
  {
    id: 'q-tf004-86', objectiveId: 'tf004-6d', topicId: 'tf004-state', difficulty: 'Hard', type: 'single',
    question: 'A remote object was deleted manually, but its resource remains in configuration and state. What will a normal Terraform plan generally propose?',
    options: [
      'Create a replacement object so reality matches the configuration',
      'Remove the resource block automatically from configuration',
      'Ignore the missing object because it remains recorded in state',
      'Import an unrelated object of the same provider resource type'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'After refresh detects that the managed object is missing, Terraform normally plans to create it again because the resource remains in desired configuration.'
  },
  {
    id: 'q-tf004-87', objectiveId: 'tf004-6d', topicId: 'tf004-state', difficulty: 'Hard', type: 'single',
    question: 'When is a moved block normally preferable to running terraform state mv as a one-time local command?',
    options: [
      'When the address refactor should be recorded and repeatable for other copies of the configuration',
      'When Terraform must delete the real object before assigning its new address',
      'When the provider version must be upgraded without changing the lock file',
      'When remote state should be converted permanently into local state'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'A moved block documents the address transition in version-controlled configuration, allowing other users and automation to apply the same refactor safely.'
  },
  {
    id: 'q-tf004-88', objectiveId: 'tf004-6a', topicId: 'tf004-state', difficulty: 'Medium', type: 'single',
    question: 'What does creating a new Terraform CLI workspace with a backend normally provide?',
    options: [
      'A separate state instance for the same configuration',
      'A separate copy of every Terraform configuration file',
      'A new HCP Terraform organization and project',
      'A new provider plugin version for each resource type'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'CLI workspaces allow multiple state instances for one configuration in a supporting backend. They are distinct from HCP Terraform workspaces and do not duplicate the configuration files.'
  },
  {
    id: 'q-tf004-89', objectiveId: 'tf004-6b', topicId: 'tf004-state', difficulty: 'Hard', type: 'multiple',
    question: 'Which two statements describe safe use of terraform force-unlock? Select two.',
    options: [
      'Use the lock ID reported by the failed locking operation',
      'Confirm that no active operation still owns the lock',
      'Use it routinely before every automated terraform plan',
      'Expect it to modify remote infrastructure immediately',
      'Use it to replace a lost state file with configuration defaults'
    ],
    correctAnswer: null, correctAnswers: [0, 1],
    explanation: 'force-unlock requires the specific lock ID and should be used only after verifying that the lock is stale. It removes a state lock; it does not rebuild state or directly change infrastructure.'
  },
  {
    id: 'q-tf004-90', objectiveId: 'tf004-7a', topicId: 'tf004-maintenance', difficulty: 'Medium', type: 'single',
    question: 'Before running terraform import aws_instance.web i-0123456789, what must exist in configuration?',
    options: [
      'A resource block at the destination address aws_instance.web',
      'An output named i-0123456789 containing the instance attributes',
      'A data block that already owns the remote instance lifecycle',
      'A moved block from the instance ID to the destination address'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'The traditional terraform import command binds a remote object to an existing resource address in configuration. The resource arguments must then be reviewed so future plans manage it correctly.'
  },
  {
    id: 'q-tf004-91', objectiveId: 'tf004-7b', topicId: 'tf004-maintenance', difficulty: 'Medium', type: 'single',
    question: 'Which command displays the attributes currently recorded for the state address module.network.aws_vpc.main?',
    options: [
      'terraform state show module.network.aws_vpc.main',
      'terraform output module.network.aws_vpc.main',
      'terraform providers show module.network.aws_vpc.main',
      'terraform validate module.network.aws_vpc.main'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'terraform state show accepts one resource instance address and displays its attributes from state. It is an inspection command and does not refresh or change the remote object.'
  },
  {
    id: 'q-tf004-92', objectiveId: 'tf004-7c', topicId: 'tf004-maintenance', difficulty: 'Medium', type: 'multiple',
    question: 'Which two practices are appropriate when collecting verbose Terraform diagnostic logs? Select two.',
    options: [
      'Set TF_LOG to an appropriate temporary log level',
      'Use TF_LOG_PATH when logs should be written to a file',
      'Publish the raw logs because Terraform always redacts secrets',
      'Leave TRACE logging enabled permanently in shared automation',
      'Store the log inside the provider dependency lock file'
    ],
    correctAnswer: null, correctAnswers: [0, 1],
    explanation: 'TF_LOG controls verbosity and TF_LOG_PATH can direct output to a file. Diagnostic logs may contain sensitive information, so logging should be temporary and its output protected.'
  },
  {
    id: 'q-tf004-93', objectiveId: 'tf004-7a', topicId: 'tf004-maintenance', difficulty: 'Hard', type: 'single',
    question: 'A configuration contains an import block with to = aws_s3_bucket.logs and id = "existing-logs". When does Terraform perform the import?',
    options: [
      'As part of applying a plan that includes the import action',
      'Immediately when the configuration file is saved to disk',
      'Only after the import block is removed from configuration',
      'During terraform fmt before provider initialization occurs'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Import blocks make import actions plannable and reviewable. Terraform performs the import during apply after the plan is approved, rather than when files are saved or formatted.'
  },
  {
    id: 'q-tf004-94', objectiveId: 'tf004-7b', topicId: 'tf004-maintenance', difficulty: 'Hard', type: 'single',
    question: 'What is the effect of terraform state rm aws_s3_bucket.archive when the remote bucket still exists?',
    options: [
      'Terraform forgets the state binding without deleting the remote bucket',
      'Terraform deletes the bucket but retains its address in state',
      'Terraform imports the bucket into a new automatically chosen address',
      'Terraform encrypts the bucket record and hides it from state list'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'terraform state rm removes the binding from state and does not destroy the remote object. If the resource block remains, a later plan may propose creating another object.'
  },
  {
    id: 'q-tf004-95', objectiveId: 'tf004-8a', topicId: 'tf004-hcp', difficulty: 'Easy', type: 'single',
    question: 'What does HCP Terraform provide when a workspace uses remote execution?',
    options: [
      'A managed environment that runs Terraform plans and applies',
      'A replacement cloud provider that owns all created resources',
      'A local backend that stores state only on the user laptop',
      'A compiler that converts HCL into provider source code'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Remote execution runs Terraform operations in HCP Terraform infrastructure while retaining workspace state, variables, history, and controls. Providers still create resources in their target platforms.'
  },
  {
    id: 'q-tf004-96', objectiveId: 'tf004-8b', topicId: 'tf004-hcp', difficulty: 'Medium', type: 'multiple',
    question: 'Which two HCP Terraform capabilities support reuse and governance across teams? Select two.',
    options: [
      'A private module and provider Registry',
      'Policy checks integrated into run workflows',
      'One shared administrator login for every workspace',
      'Automatic removal of historical state versions',
      'Credentials embedded in reusable module source code'
    ],
    correctAnswer: null, correctAnswers: [0, 1],
    explanation: 'The private Registry helps teams publish approved reusable modules and providers, while policy checks apply governance to runs. Shared accounts and embedded credentials undermine controlled collaboration.'
  },
  {
    id: 'q-tf004-97', objectiveId: 'tf004-8c', topicId: 'tf004-hcp', difficulty: 'Medium', type: 'single',
    question: 'An organization groups its networking workspaces into one HCP Terraform project. What can the project help administrators manage?',
    options: [
      'Organization and access boundaries for related workspaces',
      'One combined state file shared by every networking workspace',
      'A single provider version that overrides all lock files',
      'Automatic conversion of workspaces into child modules'
    ],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Projects organize related workspaces and support project-scoped permissions and settings. Each workspace continues to have its own runs and state.'
  },
  {
    id: 'q-tf004-98', objectiveId: 'tf004-8d', topicId: 'tf004-hcp', difficulty: 'Medium', type: 'single',
    question: 'Which command authenticates the Terraform CLI to an HCP Terraform or Terraform Enterprise host?',
    options: ['terraform login', 'terraform cloud init', 'terraform auth provider', 'terraform workspace connect'],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'terraform login obtains and stores an API token for the selected HCP Terraform or Terraform Enterprise hostname. The token should be treated as sensitive.'
  },
  {
    id: 'q-tf004-99', objectiveId: 'tf004-8b', topicId: 'tf004-hcp', difficulty: 'Hard', type: 'single',
    question: 'A security scanning service must evaluate an HCP Terraform plan before apply and return a pass or fail result. Which integration is intended for this?',
    options: ['An HCP Terraform run task', 'A local backend workspace', 'A provider alias map', 'A dependency lock checksum'],
    correctAnswer: 0, correctAnswers: null,
    explanation: 'Run tasks integrate external services at defined run stages so they can inspect run information and return a result. Enforcement settings determine whether a failed result blocks progress.'
  },
  {
    id: 'q-tf004-100', objectiveId: 'tf004-8d', topicId: 'tf004-hcp', difficulty: 'Hard', type: 'multiple',
    question: 'Which two statements describe HCP Terraform dynamic provider credentials? Select two.',
    options: [
      'They can issue short-lived cloud credentials for individual runs',
      'They use a configured trust relationship with the target platform',
      'They require permanent access keys committed to configuration',
      'They combine all workspaces into one cloud administrator identity',
      'They prevent providers from making any remote API requests'
    ],
    correctAnswer: null, correctAnswers: [0, 1],
    explanation: 'Dynamic credentials use a trust relationship, commonly based on workload identity, to obtain temporary credentials for a run. This reduces reliance on long-lived static keys.'
  }
]);
