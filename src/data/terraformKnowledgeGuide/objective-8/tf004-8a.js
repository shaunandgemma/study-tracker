export const guide = Object.freeze({
  "id": "tf004-8a",
  "group": "hcp",
  "title": "Create infrastructure with HCP Terraform",
  "plainEnglish": "HCP Terraform can store state and run Terraform remotely or through agents. A workspace connects configuration, variables, state and run history.",
  "whyItMatters": "Centralised runs give teams consistent execution, controlled credentials, audit history and collaboration beyond a developer laptop.",
  "workplaceExample": "A VCS-connected workspace automatically creates a plan when a pull request changes Terraform files and waits for an approved apply.",
  "examFocus": "Understand remote runs, CLI-driven runs, VCS-driven runs, workspace variables and where state is held.",
  "keyPoints": [
    "Workspace holds operational context.",
    "Runs can execute remotely.",
    "Variables and credentials are configured securely.",
    "Plans still require review and policy checks."
  ],
  "commonMistake": "Assuming an HCP Terraform workspace is only a folder. It is an execution and state boundary with variables, runs and access controls.",
  "example": null,
  "sources": [
    {
      "title": "Terraform Associate 004 exam content list",
      "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004"
    },
    {
      "title": "Official Terraform documentation for this topic",
      "url": "https://developer.hashicorp.com/terraform/cloud-docs"
    }
  ]
});

export default guide;
