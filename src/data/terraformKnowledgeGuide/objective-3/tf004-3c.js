export const guide = Object.freeze({
  "id": "tf004-3c",
  "group": "workflow",
  "title": "Validate Terraform configuration",
  "plainEnglish": "terraform validate checks whether the configuration is internally valid, including syntax, argument names and value types. It does not prove that permissions, quotas or every runtime value will succeed.",
  "whyItMatters": "Fast local validation catches structural mistakes before a costly or risky plan and is commonly included in continuous integration.",
  "workplaceExample": "A missing brace or string supplied where a number is required makes validation fail with a file and line reference.",
  "examFocus": "Know the difference between fmt, validate and plan. validate checks configuration consistency; plan also evaluates against state and provider APIs.",
  "keyPoints": [
    "Validation requires an initialised directory.",
    "It checks syntax and internal consistency.",
    "It does not create infrastructure.",
    "A successful validation does not guarantee a successful apply."
  ],
  "commonMistake": "Running apply before reading the plan, or running commands from the wrong working directory or workspace.",
  "example": "terraform validate",
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
