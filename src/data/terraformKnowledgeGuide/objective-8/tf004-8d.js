export const guide = Object.freeze({
  "id": "tf004-8d",
  "group": "hcp",
  "title": "HCP Terraform integrations",
  "plainEnglish": "HCP Terraform integrates with version-control systems, APIs, notifications, run tasks, agents, dynamic credentials and other tools used in delivery workflows.",
  "whyItMatters": "Integrations connect infrastructure changes to review, security, observability and private-network requirements.",
  "workplaceExample": "A GitHub pull request starts a speculative plan, a security run task checks it, and an agent performs the approved run inside a private network.",
  "examFocus": "Understand the purpose of VCS integration, agents, run tasks, notifications and API-driven automation rather than memorising one vendor setup.",
  "keyPoints": [
    "VCS changes can trigger plans.",
    "Agents run operations with private connectivity.",
    "Run tasks add external checks.",
    "APIs support controlled automation."
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
