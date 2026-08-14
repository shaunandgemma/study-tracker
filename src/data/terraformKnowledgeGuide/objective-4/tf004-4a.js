export const guide = Object.freeze({
  "id": "tf004-4a",
  "group": "configuration",
  "title": "Resource blocks and data blocks",
  "plainEnglish": "A resource block declares an object Terraform manages. A data block reads information from a provider without taking ownership of that object.",
  "whyItMatters": "Choosing the correct block prevents Terraform from accidentally trying to manage something that should only be looked up.",
  "workplaceExample": "A data source finds the current AWS account ID, while a resource block creates and manages a Parameter Store value.",
  "examFocus": "Know resource and data addresses, provider-defined schemas and the difference between managing and reading.",
  "keyPoints": [
    "resource manages lifecycle.",
    "data reads existing information.",
    "Both expose attributes for expressions.",
    "Provider documentation defines supported arguments."
  ],
  "commonMistake": "Copying an expression without understanding its value type, references or the dependencies it creates.",
  "example": "data \"aws_caller_identity\" \"current\" {}\n\nresource \"aws_ssm_parameter\" \"app\" {\n  name  = \"/example/app\"\n  type  = \"String\"\n  value = \"demo\"\n}",
  "sources": [
    {
      "title": "Terraform Associate 004 exam content list",
      "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004"
    },
    {
      "title": "Official Terraform documentation for this topic",
      "url": "https://developer.hashicorp.com/terraform/language"
    }
  ]
});

export default guide;
