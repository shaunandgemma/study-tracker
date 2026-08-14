export const guide = Object.freeze({
  "id": "tf004-6c",
  "group": "state",
  "title": "Configure remote state with a backend block",
  "plainEnglish": "A backend block selects a remote storage mechanism. After changing backend configuration, terraform init configures or migrates state with explicit confirmation.",
  "whyItMatters": "Remote state supports collaboration, central protection and often locking, but its storage and credentials must be secured.",
  "workplaceExample": "A team stores state in a private versioned S3 bucket with locking and narrowly controlled access, while credentials come from the runtime environment.",
  "examFocus": "Backend blocks cannot freely use ordinary input variables. Understand partial configuration, init -backend-config and state migration prompts.",
  "keyPoints": [
    "Declare backend type in terraform block.",
    "Re-run init after backend changes.",
    "Review migration carefully.",
    "Keep backend credentials out of configuration."
  ],
  "commonMistake": "Editing or sharing a state file manually. State may contain sensitive data and must be protected and changed with supported workflows.",
  "example": "terraform {\n  backend \"s3\" {\n    bucket       = \"example-terraform-state\"\n    key          = \"network/terraform.tfstate\"\n    region       = \"eu-west-2\"\n    use_lockfile = true\n  }\n}",
  "sources": [
    {
      "title": "Terraform Associate 004 exam content list",
      "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004"
    },
    {
      "title": "Official Terraform documentation for this topic",
      "url": "https://developer.hashicorp.com/terraform/language/state"
    }
  ]
});

export default guide;
