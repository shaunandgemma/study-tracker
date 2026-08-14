export const guide = Object.freeze({
  "id": "tf004-4c",
  "group": "configuration",
  "title": "Input variables and output values",
  "plainEnglish": "Input variables are a module’s configurable inputs. Output values expose selected results to users, automation or a calling module.",
  "whyItMatters": "A clear input/output interface makes configuration reusable without requiring consumers to edit its internal resource blocks.",
  "workplaceExample": "A network module accepts a CIDR as an input and returns the created VPC ID as an output.",
  "examFocus": "Know variable types, descriptions, defaults and value sources; know how outputs reference values and can be marked sensitive.",
  "keyPoints": [
    "Variables parameterise configuration.",
    "Outputs expose useful values.",
    "Locals are internal reusable expressions.",
    "Sensitive marks affect display but do not by themselves remove values from state."
  ],
  "commonMistake": "Copying an expression without understanding its value type, references or the dependencies it creates.",
  "example": "variable \"vpc_cidr\" {\n  type = string\n}\n\noutput \"vpc_id\" {\n  value = aws_vpc.main.id\n}",
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
