export const guide = Object.freeze({
  "id": "tf004-7a",
  "group": "maintenance",
  "title": "Import existing infrastructure",
  "plainEnglish": "Import associates an existing remote object with a Terraform resource address. The configuration must still describe the desired object; import does not automatically make every configuration decision for you.",
  "whyItMatters": "Import lets teams adopt manually created or previously unmanaged infrastructure without recreating it.",
  "workplaceExample": "A team writes an aws_s3_bucket resource block, imports the existing bucket ID to that address and adjusts configuration until the plan reports no unintended changes.",
  "examFocus": "Know CLI import and import blocks, the need for matching configuration and the importance of a no-change plan after reconciliation.",
  "keyPoints": [
    "Choose the correct resource address.",
    "Use the provider’s required import ID.",
    "Write or generate configuration.",
    "Reconcile until the plan is understood."
  ],
  "commonMistake": "Using a state command before confirming the workspace, address and backup or recovery path.",
  "example": "terraform import aws_s3_bucket.logs existing-bucket-name",
  "sources": [
    {
      "title": "Terraform Associate 004 exam content list",
      "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004"
    },
    {
      "title": "Official Terraform documentation for this topic",
      "url": "https://developer.hashicorp.com/terraform/cli/state"
    }
  ]
});

export default guide;
