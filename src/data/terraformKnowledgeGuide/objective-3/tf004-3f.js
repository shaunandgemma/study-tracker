export const guide = Object.freeze({
  "id": "tf004-3f",
  "group": "workflow",
  "title": "Destroy Terraform-managed infrastructure",
  "plainEnglish": "terraform destroy plans and applies deletion for all resources managed in the current configuration, workspace and state.",
  "whyItMatters": "Temporary environments must be removed to control cost, but broad destruction is dangerous if the wrong workspace or state is selected.",
  "workplaceExample": "A short-lived test environment is destroyed after verification. The team first reviews terraform plan -destroy and confirms every target.",
  "examFocus": "Understand that destroy uses state, asks for approval and can be reviewed as a saved destroy plan. Dependencies influence deletion order.",
  "keyPoints": [
    "Verify workspace and account first.",
    "Review a destroy plan.",
    "Destroy operates on resources in the selected state.",
    "Provider or protection settings can prevent deletion."
  ],
  "commonMistake": "Running apply before reading the plan, or running commands from the wrong working directory or workspace.",
  "example": "terraform plan -destroy -out=destroy.tfplan\nterraform apply destroy.tfplan",
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
