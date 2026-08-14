export const guide = Object.freeze({
  "id": "tf004-3d",
  "group": "workflow",
  "title": "Generate and review an execution plan",
  "plainEnglish": "terraform plan compares configuration, state and refreshed remote information, then proposes actions needed to reach the desired state.",
  "whyItMatters": "The plan is the main safety review. It shows additions, in-place changes, replacements and deletions before they happen.",
  "workplaceExample": "A pipeline stores a binary plan after review. Deployment uses terraform apply tfplan so it applies the reviewed actions rather than silently calculating a different plan.",
  "examFocus": "Read symbols and the summary. Understand that an unsaved plan is speculative, while a saved plan can be supplied to apply.",
  "keyPoints": [
    "Plan does not normally change infrastructure.",
    "It refreshes managed object information.",
    "Review replacements and deletions carefully.",
    "Saved plans are machine-readable artifacts, not source code."
  ],
  "commonMistake": "Running apply before reading the plan, or running commands from the wrong working directory or workspace.",
  "example": "terraform plan -out=tfplan\nterraform show tfplan",
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
