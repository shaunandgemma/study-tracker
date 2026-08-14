export const guide = Object.freeze({
  "id": "tf004-3b",
  "group": "workflow",
  "title": "Initialise a Terraform working directory",
  "plainEnglish": "terraform init prepares the current working directory. It initialises the backend, downloads providers and child modules, and creates or updates dependency information.",
  "whyItMatters": "Most Terraform commands require an initialised directory. Reinitialisation is required after changing backend, module source or provider requirements.",
  "workplaceExample": "After cloning a repository, a developer runs terraform init before plan. Terraform downloads dependencies into .terraform and reads the backend settings.",
  "examFocus": "init is safe to run repeatedly, but backend migration or reconfiguration options deserve careful review.",
  "keyPoints": [
    "Run init after cloning a configuration.",
    "It installs providers and modules.",
    "It configures the backend.",
    ".terraform is generated; the lock file is normally version controlled."
  ],
  "commonMistake": "Running apply before reading the plan, or running commands from the wrong working directory or workspace.",
  "example": "terraform init",
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
