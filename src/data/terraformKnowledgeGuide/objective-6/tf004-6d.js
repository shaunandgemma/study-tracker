export const guide = Object.freeze({
  "id": "tf004-6d",
  "group": "state",
  "title": "Resource drift and state",
  "plainEnglish": "Drift occurs when real infrastructure no longer matches the last known Terraform-managed configuration, often because someone changed it outside Terraform. Refresh during planning updates Terraform’s view and the plan proposes reconciliation.",
  "whyItMatters": "Uncontrolled drift makes environments inconsistent and can cause surprising changes during the next deployment.",
  "workplaceExample": "Someone changes a tag in the AWS Console. The next plan detects it and proposes restoring the configured value, unless the configuration is deliberately updated.",
  "examFocus": "Know refresh behaviour, refresh-only planning, import and configuration reconciliation. Do not manually edit state to hide drift.",
  "keyPoints": [
    "Plan refreshes managed object data.",
    "Configuration remains the desired state.",
    "A refresh-only plan updates state without changing remote objects.",
    "Decide whether to restore configuration or adopt the intentional change."
  ],
  "commonMistake": "Editing or sharing a state file manually. State may contain sensitive data and must be protected and changed with supported workflows.",
  "example": "terraform plan -refresh-only",
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
