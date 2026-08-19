export default Object.freeze({
  id: 'terraform-module-output-not-exposed',
  examId: 'terraform-associate-004',
  order: 18,
  category: 'Terraform Modules',
  title: 'Expose a Missing Child Module Output',
  difficulty: 'Intermediate',
  summary: 'Diagnose why a root module cannot access a value created inside a child module.',
  scenario: 'A network child module successfully creates two private subnets. The root module now needs their IDs to configure an application component, but terraform validate reports that module.network has no private_subnet_ids attribute. The subnet resources must remain encapsulated inside the child module.',
  task: 'Use the child resource configuration and root reference to identify the missing module interface, expose the required value through a child output, and verify that the root module can consume it without reaching directly into child resource addresses.',
  evidence: [
    {
      id: 'child-resources',
      title: 'modules/network/main.tf',
      kind: 'code',
      content: `variable "private_subnets" {
  type = map(string)
}

resource "aws_subnet" "private" {
  for_each = var.private_subnets

  vpc_id            = aws_vpc.training.id
  cidr_block        = each.value
  availability_zone = each.key
}`
    },
    {
      id: 'root-reference',
      title: 'Root main.tf',
      kind: 'code',
      content: `module "network" {
  source = "./modules/network"

  private_subnets = {
    "eu-west-2a" = "10.90.10.0/24"
    "eu-west-2b" = "10.90.20.0/24"
  }
}

resource "aws_db_subnet_group" "training" {
  name       = "fa-training-db-subnets"
  subnet_ids = module.network.private_subnet_ids
}`
    },
    {
      id: 'validation-error',
      title: 'terraform validate Output',
      kind: 'code',
      content: `$ terraform validate

╷
│ Error: Unsupported attribute
│
│   on main.tf line 12, in resource "aws_db_subnet_group" "training":
│   12: subnet_ids = module.network.private_subnet_ids
│     ├────────────────
│     │ module.network is an object
│
│ This object does not have an attribute named "private_subnet_ids".
╵

Child module outputs.tf:
No output blocks are currently defined.

Approved interface:
The root module may consume a child output named private_subnet_ids.
Do not duplicate the subnet resources in the root module.`
    }
  ],
  successCriteria: [
    'The learner identifies that the child module creates the subnet IDs but does not expose them as an output.',
    'The child module defines output "private_subnet_ids" using the private subnet resource IDs.',
    'The root module continues to use module.network.private_subnet_ids rather than duplicating or bypassing the child module.',
    'A final terraform validate succeeds and the root DB subnet group receives the child module subnet IDs.'
  ],
  hints: [
    'The subnets exist in the child configuration, but inspect the child module interface for any declared output with the name used by the root module.',
    'Parent modules can access child-module values through outputs exposed by the child and referenced as module.<name>.<output>.',
    'Add output "private_subnet_ids" in the network module with a value derived from aws_subnet.private, then keep the existing root reference.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does module.network.private_subnet_ids produce Unsupported attribute?',
      options: [
        { id: 'missing-child-output', text: 'The network child module does not declare an output named private_subnet_ids.' },
        { id: 'for-each-hides', text: 'Resources created with for_each can never be exposed from a module.' },
        { id: 'root-before-child', text: 'The root module must be applied once before any child output can be referenced.' },
        { id: 'module-dot-invalid', text: 'Terraform does not support module.<name>.<output> references.' }
      ],
      correctOptionId: 'missing-child-output',
      explanation: 'The child contains the subnet resources but has no outputs, so the module object presented to the parent has no private_subnet_ids attribute.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the correct module-interface repair?',
      options: [
        { id: 'add-output', text: 'Add output "private_subnet_ids" in the child with value = values(aws_subnet.private)[*].id and keep the root module reference.' },
        { id: 'direct-child-address', text: 'Reference module.network.aws_subnet.private directly from the root module.' },
        { id: 'duplicate-subnets', text: 'Create another pair of private subnets in the root module so their IDs are locally available.' },
        { id: 'hardcode-ids', text: 'Copy the current subnet IDs into the root configuration as string literals.' }
      ],
      correctOptionId: 'add-output',
      explanation: 'A child output is the supported module interface for exposing selected internal values to its parent while keeping resource implementation details inside the module.'
    }
  ],
  solution: {
    rootCause: 'The child network module creates aws_subnet.private instances but declares no output named private_subnet_ids, so the parent module object has no attribute with that name.',
    fix: 'Add output "private_subnet_ids" { value = values(aws_subnet.private)[*].id } to the child module, keep subnet_ids = module.network.private_subnet_ids in the root module, and rerun terraform validate.',
    prevention: 'Treat module outputs as an explicit public interface: define and document values that callers need, and test module call examples whenever the child implementation or parent requirements change.'
  }
});
