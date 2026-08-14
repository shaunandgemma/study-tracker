export const guide = Object.freeze({
  "id": "tf004-4g",
  "group": "configuration",
  "title": "Custom validation and conditions",
  "plainEnglish": "Terraform supports checks that stop or warn when assumptions are not met. Variable validation rejects invalid inputs; preconditions and postconditions protect resource and output expectations; check blocks can report ongoing assertions.",
  "whyItMatters": "Good conditions turn hidden assumptions into clear error messages before unsafe or confusing changes proceed.",
  "workplaceExample": "A Region variable permits only approved Regions and explains the required correction when a different value is supplied.",
  "examFocus": "Know where variable validation, preconditions, postconditions and check blocks operate and that a condition must evaluate to a boolean.",
  "keyPoints": [
    "Write actionable error messages.",
    "Variable validation checks inputs.",
    "Preconditions check before an operation.",
    "Postconditions check resulting attributes."
  ],
  "commonMistake": "Copying an expression without understanding its value type, references or the dependencies it creates.",
  "example": "variable \"environment\" {\n  type = string\n  validation {\n    condition     = contains([\"development\", \"production\"], var.environment)\n    error_message = \"Use development or production.\"\n  }\n}",
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
