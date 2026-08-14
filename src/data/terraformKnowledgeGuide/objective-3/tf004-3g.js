export const guide = Object.freeze({
  "id": "tf004-3g",
  "group": "workflow",
  "title": "Format Terraform configuration",
  "plainEnglish": "terraform fmt rewrites Terraform configuration into the canonical style. terraform fmt -check reports whether formatting is already correct.",
  "whyItMatters": "Consistent formatting makes reviews easier because diffs focus on meaningful changes instead of personal spacing choices.",
  "workplaceExample": "A CI check rejects an unformatted pull request. The developer runs terraform fmt -recursive and commits the clean result.",
  "examFocus": "fmt changes presentation, not infrastructure intent. It is different from validate.",
  "keyPoints": [
    "Canonical style improves readability.",
    "fmt may rewrite files.",
    "fmt -check is useful in CI.",
    "Formatting success does not validate provider arguments."
  ],
  "commonMistake": "Running apply before reading the plan, or running commands from the wrong working directory or workspace.",
  "example": "terraform fmt -recursive\nterraform fmt -check -recursive",
  "sources": [
    {
      "title": "Terraform Associate 004 exam content list",
      "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004"
    },
    {
      "title": "Official Terraform documentation for this topic",
      "url": "https://developer.hashicorp.com/terraform/cli/run"
    }
  ]
});

export default guide;
