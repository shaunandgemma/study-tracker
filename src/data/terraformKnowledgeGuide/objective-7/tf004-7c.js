export const guide = Object.freeze({
  "id": "tf004-7c",
  "group": "maintenance",
  "title": "Verbose Terraform logging",
  "plainEnglish": "TF_LOG enables detailed Terraform logs for troubleshooting. Levels include TRACE, DEBUG, INFO, WARN and ERROR. TF_LOG_PATH can direct logs to a file when logging is enabled.",
  "whyItMatters": "Detailed logs help diagnose provider, authentication, graph and API problems that normal messages do not fully explain.",
  "workplaceExample": "An engineer reproduces a failed plan with TF_LOG=DEBUG, protects the log because it may contain sensitive values, then disables logging after diagnosis.",
  "examFocus": "Know the environment variables and that verbose logs may expose secrets. Do not leave TRACE logging enabled routinely.",
  "keyPoints": [
    "Set TF_LOG only while diagnosing.",
    "Higher verbosity creates large output.",
    "Protect and delete sensitive logs.",
    "Unset the variable after use."
  ],
  "commonMistake": "Using a state command before confirming the workspace, address and backup or recovery path.",
  "example": "TF_LOG=DEBUG terraform plan",
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
