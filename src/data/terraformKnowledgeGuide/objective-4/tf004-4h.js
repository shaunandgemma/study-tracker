export const guide = Object.freeze({
  "id": "tf004-4h",
  "group": "configuration",
  "title": "Sensitive data and secrets",
  "plainEnglish": "Secrets should enter Terraform through approved secret systems or protected runtime variables, not hard-coded files. sensitive reduces accidental CLI display, while ephemeral and write-only capabilities can prevent some values being persisted when supported.",
  "whyItMatters": "Terraform plans and state can contain sensitive data. Protecting only the configuration file is not enough; backend access, logs, outputs and pipeline variables also matter.",
  "workplaceExample": "A CI system injects a short-lived cloud credential at runtime. State is encrypted remotely with strict access controls, and no credential is committed to Git.",
  "examFocus": "Know that sensitive = true redacts normal output but may still store the value in state. Never treat it as encryption.",
  "keyPoints": [
    "Do not hard-code credentials.",
    "Protect remote state and plan artifacts.",
    "Use short-lived credentials where possible.",
    "Marking a value sensitive controls display, not all storage."
  ],
  "commonMistake": "Copying an expression without understanding its value type, references or the dependencies it creates.",
  "example": "variable \"api_token\" {\n  type      = string\n  sensitive = true\n  ephemeral = true\n}",
  "sources": [
    {
      "title": "Terraform Associate 004 exam content list",
      "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004"
    },
    {
      "title": "Official Terraform documentation for this topic",
      "url": "https://developer.hashicorp.com/terraform/language"
    }
  ]
});

export default guide;
