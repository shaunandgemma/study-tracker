export const guide = Object.freeze({
  "id": "tf004-4e",
  "group": "configuration",
  "title": "Expressions and functions",
  "plainEnglish": "Expressions calculate values. They can use literals, references, operators, conditionals, for expressions, splats, templates and built-in functions.",
  "whyItMatters": "Dynamic expressions reduce duplication and let configuration adapt to inputs while remaining declarative.",
  "workplaceExample": "A conditional selects an instance type by environment, and merge combines mandatory tags with team-supplied tags.",
  "examFocus": "Be able to recognise conditional syntax, for expressions, collection access and common functions rather than memorising every function.",
  "keyPoints": [
    "Expressions produce values.",
    "Functions transform values.",
    "Conditionals choose between two results.",
    "for and splat expressions transform collections."
  ],
  "commonMistake": "Copying an expression without understanding its value type, references or the dependencies it creates.",
  "example": "locals {\n  instance_type = var.environment == \"production\" ? \"t3.small\" : \"t3.micro\"\n  tags = merge(var.extra_tags, { ManagedBy = \"Terraform\" })\n}",
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
