export const guide = Object.freeze({
  "id": "tf004-8b",
  "group": "hcp",
  "title": "HCP Terraform collaboration and governance",
  "plainEnglish": "HCP Terraform adds team access, run history, policy checks, private modules, variable sets, cost information and other governance controls around Terraform workflows.",
  "whyItMatters": "Organisations need more than shared state: they need controlled access, approval, evidence and reusable standards.",
  "workplaceExample": "A policy prevents public storage, a team permission limits who can apply production runs, and the run history records the decision.",
  "examFocus": "Recognise policy enforcement, teams, permissions, run tasks, private registry and audit capabilities. Availability can depend on product tier.",
  "keyPoints": [
    "Governance checks proposed changes.",
    "RBAC separates responsibilities.",
    "Run history supports audit.",
    "Private modules standardise approved patterns."
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
