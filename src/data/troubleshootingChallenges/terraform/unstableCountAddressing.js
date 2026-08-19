export default Object.freeze({
  id: 'terraform-unstable-count-addressing',
  examId: 'terraform-associate-004',
  order: 12,
  category: 'Terraform Configuration',
  title: 'Stabilize Count or for_each Resource Addressing',
  difficulty: 'Intermediate',
  summary: 'Prevent existing resources changing identity when an ordered list is edited.',
  scenario: 'A Terraform configuration creates SSM parameters from a list using count. The team inserted a new parameter name into the middle of the list, and the next plan proposes changing two existing parameter instances even though their logical names should remain stable. The existing parameters must keep their logical identities while a new exam parameter is added.',
  task: 'Use the configuration and plan evidence to identify why list index changes are affecting existing resource addresses, refactor to stable key-based addressing, and verify that each logical parameter has a predictable identity.',
  evidence: [
    {
      id: 'count-config',
      title: 'Current Configuration',
      kind: 'code',
      content: `variable "parameter_names" {
  type = list(string)
  default = [
    "application",
    "exam",
    "owner",
    "purpose"
  ]
}

resource "aws_ssm_parameter" "training" {
  count = length(var.parameter_names)

  name  = "/fa-training/\${var.parameter_names[count.index]}"
  type  = "String"
  value = var.parameter_names[count.index]
}`
    },
    {
      id: 'previous-addresses',
      title: 'Addresses Before List Change',
      kind: 'code',
      content: `Previous parameter_names:
[
  "application",
  "owner",
  "purpose"
]

Existing state addresses:
aws_ssm_parameter.training[0] -> /fa-training/application
aws_ssm_parameter.training[1] -> /fa-training/owner
aws_ssm_parameter.training[2] -> /fa-training/purpose

Change made:
Inserted "exam" between "application" and "owner".`
    },
    {
      id: 'plan-change',
      title: 'terraform plan Summary',
      kind: 'code',
      content: `# aws_ssm_parameter.training[1] will be updated/replaced
  name: "/fa-training/owner" -> "/fa-training/exam"

# aws_ssm_parameter.training[2] will be updated/replaced
  name: "/fa-training/purpose" -> "/fa-training/owner"

# aws_ssm_parameter.training[3] will be created
  name: "/fa-training/purpose"

Expected logical identities:
application -> application
owner       -> owner
purpose     -> purpose
exam        -> new exam instance

Approved direction:
Use stable keys derived from each parameter name rather than list positions.`
    }
  ],
  successCriteria: [
    'The learner identifies list-index-based count addresses as the reason existing logical resources shift when an item is inserted.',
    'The resource is refactored to use for_each with stable parameter-name keys.',
    'The intended resource addresses use keys such as training["application"], training["owner"], training["purpose"], and training["exam"].',
    'A reviewed migration plan preserves the existing logical parameters and adds only the new exam parameter rather than unintentionally changing their identities.'
  ],
  hints: [
    'Compare what training[1] and training[2] represented before and after the list insertion.',
    'count identifies instances by numeric index, while for_each identifies instances by stable map or set keys.',
    'Refactor the collection to stable parameter-name keys and use for_each so owner stays keyed as "owner" even when another item is inserted.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why do existing parameter instances appear to change identity after adding exam to the list?',
      options: [
        { id: 'count-index-shift', text: 'count addresses instances by numeric index, so inserting a list element shifts the indices associated with owner and purpose.' },
        { id: 'ssm-random', text: 'AWS Systems Manager randomly changes parameter identities whenever Terraform adds a new item.' },
        { id: 'for-each-sorting', text: 'The resource already uses for_each and Terraform reordered its stable keys.' },
        { id: 'state-lock', text: 'A Terraform state lock renumbered the count instances.' }
      ],
      correctOptionId: 'count-index-shift',
      explanation: 'The old index 1 represented owner but now represents exam, while index 2 moves from purpose to owner, so the numeric addresses no longer map to the same logical objects.'
    },
    {
      id: 'safe-resolution',
      prompt: 'Which design best provides stable logical identities for these named parameters?',
      options: [
        { id: 'for-each-keys', text: 'Use for_each with parameter names as stable keys so each instance is addressed by its logical name rather than list position.' },
        { id: 'keep-count-sort', text: 'Keep count and manually reorder the list before every plan.' },
        { id: 'hardcode-count', text: 'Keep count and hard-code count = 4 so indices cannot change.' },
        { id: 'ignore-plan', text: 'Apply the proposed replacements because Terraform state addresses do not affect resource identity.' }
      ],
      correctOptionId: 'for-each-keys',
      explanation: 'for_each creates key-based instance addresses, so adding a new key does not inherently renumber the existing application, owner, or purpose instances.'
    }
  ],
  solution: {
    rootCause: 'The resource uses count over an ordered list, so its state addresses are numeric. Inserting exam at index 1 shifts owner and purpose to new indices, causing Terraform to associate existing numeric addresses with different logical parameter names.',
    fix: 'Refactor the resource to use for_each with stable keys derived from the parameter names, use each.key or each.value for the parameter name and value, and migrate existing addresses deliberately so application, owner, and purpose retain their logical identities while exam is added as a new keyed instance.',
    prevention: 'Use for_each instead of count when resource instances have meaningful stable identities, especially when collection members may be inserted, removed, or reordered independently.'
  }
});
