export const guide = Object.freeze({
  "id": "tf004-8c",
  "group": "hcp",
  "title": "HCP Terraform workspaces and projects",
  "plainEnglish": "A workspace is an individual Terraform execution and state boundary. A project groups related workspaces and helps organise permissions and settings.",
  "whyItMatters": "Separate state and permissions reduce the blast radius between applications, environments and teams.",
  "workplaceExample": "A payments project contains network-production, application-production and monitoring workspaces, each with separate state and controlled access.",
  "examFocus": "Do not confuse HCP Terraform workspaces with CLI workspaces. Both separate state, but HCP workspaces also contain run and configuration settings.",
  "keyPoints": [
    "Workspace separates state and runs.",
    "Project groups workspaces.",
    "Permissions can be applied at useful boundaries.",
    "Choose boundaries that limit blast radius."
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
