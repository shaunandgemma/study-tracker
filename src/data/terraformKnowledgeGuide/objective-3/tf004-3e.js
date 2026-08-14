export const guide = Object.freeze({
  "id": "tf004-3e",
  "group": "workflow",
  "title": "Apply Terraform changes",
  "plainEnglish": "terraform apply performs the planned actions through providers and then records the resulting state. Without a saved plan, apply creates a fresh plan and requests approval.",
  "whyItMatters": "Apply is the point where intended configuration becomes real infrastructure, so identity, workspace, plan and approval boundaries matter.",
  "workplaceExample": "Production automation applies a previously reviewed saved plan using controlled credentials and records the run result.",
  "examFocus": "Know interactive approval, saved-plan apply and the risk of -auto-approve. Applying can add, change, replace or destroy resources.",
  "keyPoints": [
    "Apply changes real infrastructure.",
    "A saved plan applies exact reviewed actions.",
    "State is updated after provider operations.",
    "Do not assume apply only creates resources."
  ],
  "commonMistake": "Running apply before reading the plan, or running commands from the wrong working directory or workspace.",
  "example": "terraform apply tfplan",
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
