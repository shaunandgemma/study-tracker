export const guide = Object.freeze({
  "id": "tf004-3a",
  "group": "workflow",
  "title": "The core Terraform workflow",
  "plainEnglish": "The core workflow is write, initialise, plan, apply and repeat. Teams usually add formatting, validation, version control and approval around those steps.",
  "whyItMatters": "A consistent workflow separates writing from reviewing and performing changes. It gives people a chance to catch the wrong account, workspace or destructive action.",
  "workplaceExample": "A developer edits configuration, runs fmt and validate, commits it, and a pipeline creates a plan for review before an approved apply.",
  "examFocus": "Understand the purpose and order of init, fmt, validate, plan, apply and destroy. A saved plan lets apply perform the exact reviewed actions.",
  "keyPoints": [
    "Write desired configuration.",
    "Initialise providers, modules and backend.",
    "Review a plan before apply.",
    "Repeat the workflow for later changes."
  ],
  "commonMistake": "Running apply before reading the plan, or running commands from the wrong working directory or workspace.",
  "example": null,
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
