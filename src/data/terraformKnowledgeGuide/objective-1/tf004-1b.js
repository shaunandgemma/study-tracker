export const guide = Object.freeze({
  "id": "tf004-1b",
  "group": "iac",
  "title": "Why teams use infrastructure-as-code patterns",
  "plainEnglish": "IaC turns infrastructure work into a consistent engineering process. The same configuration can be checked, reviewed and repeated, reducing undocumented manual differences.",
  "whyItMatters": "Repeatability, audit history and automated validation reduce mistakes. Teams can review a proposed plan before a change and can reproduce an environment after a failure.",
  "workplaceExample": "A pull request shows that a security-group rule will change. Reviewers discuss the exact diff and plan before the production pipeline applies it.",
  "examFocus": "Recognise benefits such as consistency, repeatability, version control, collaboration, automation and recoverability. IaC does not guarantee that code is correct or eliminate drift automatically.",
  "keyPoints": [
    "Configuration can be peer reviewed.",
    "Automation reduces repetitive manual work.",
    "The same pattern can be reused across environments.",
    "Plans make proposed changes visible before apply."
  ],
  "commonMistake": "Treating Terraform like a list of shell commands. Terraform describes the result you want; providers decide which API operations are needed.",
  "example": null,
  "sources": [
    {
      "title": "Terraform Associate 004 exam content list",
      "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004"
    },
    {
      "title": "Official Terraform documentation for this topic",
      "url": "https://developer.hashicorp.com/terraform/intro"
    }
  ]
});

export default guide;
