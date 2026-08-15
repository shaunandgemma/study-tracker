export default Object.freeze({
  id: 'terraform-syntax-validation',
  examId: 'terraform-associate-004',
  order: 1,
  category: 'Terraform configuration',
  title: 'Repair a Terraform validation failure',
  difficulty: 'Beginner',
  summary: 'Inspect a small Terraform configuration that cannot pass validation.',
  scenario: 'A teammate copied an S3 bucket resource into a training project. Terraform formatting succeeds, but validation stops before a plan can be created.',
  task: 'Identify the invalid HCL expression, correct only the broken line, and explain why Terraform rejected it.',
  evidence: [
    {
      id: 'main-tf',
      title: 'main.tf',
      kind: 'code',
      content: `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "eu-west-2"
}

resource "aws_s3_bucket" "training" {
  bucket "fa-tf004-troubleshooting-bucket"
}`
    },
    {
      id: 'validate-output',
      title: 'terraform validate output',
      kind: 'code',
      content: `Error: Missing key/value separator

  on main.tf line 15, in resource "aws_s3_bucket" "training":
  15:   bucket "fa-tf004-troubleshooting-bucket"

Expected an equals sign ("=") to mark the beginning of the attribute value.`
    }
  ],
  successCriteria: [
    'The bucket argument uses valid HCL attribute syntax.',
    'terraform fmt completes successfully.',
    'terraform validate reports that the configuration is valid.',
    'The learner can explain the difference between an argument and a nested block.'
  ],
  hints: [
    'Read the exact line number and expected token in the validation error.',
    'An argument assigns a value with name = expression.',
    'Change the bucket line to: bucket = "fa-tf004-troubleshooting-bucket".'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What caused the validation failure?',
      options: [
        { id: 'missing-equals', text: 'The bucket argument is missing its equals sign.' },
        { id: 'missing-backend', text: 'The configuration has no remote backend.' },
        { id: 'wrong-region', text: 'S3 is unavailable in eu-west-2.' },
        { id: 'missing-state', text: 'A state file has not been created yet.' }
      ],
      correctOptionId: 'missing-equals',
      explanation: 'HCL arguments use name = expression. The bucket line was written like a block label instead of an argument assignment.'
    },
    {
      id: 'next-check',
      prompt: 'Which command should confirm the corrected configuration is internally valid?',
      options: [
        { id: 'validate', text: 'terraform validate' },
        { id: 'destroy', text: 'terraform destroy' },
        { id: 'state-rm', text: 'terraform state rm' },
        { id: 'force-unlock', text: 'terraform force-unlock' }
      ],
      correctOptionId: 'validate',
      explanation: 'terraform validate checks configuration syntax and internal consistency without changing infrastructure.'
    }
  ],
  solution: {
    rootCause: 'The bucket argument omitted the equals sign required by HCL argument syntax.',
    fix: 'Replace bucket "fa-tf004-troubleshooting-bucket" with bucket = "fa-tf004-troubleshooting-bucket", then run terraform fmt and terraform validate.',
    prevention: 'Run terraform fmt and terraform validate locally or in CI before creating a plan.'
  }
});
