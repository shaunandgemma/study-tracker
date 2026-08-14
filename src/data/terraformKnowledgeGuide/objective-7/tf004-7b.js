export const guide = Object.freeze({
  "id": "tf004-7b",
  "group": "maintenance",
  "title": "Inspect Terraform state with the CLI",
  "plainEnglish": "terraform state subcommands inspect and safely manipulate the address mappings in state. Common read operations include state list and state show.",
  "whyItMatters": "State inspection helps troubleshoot addresses and attributes without opening and editing raw state JSON.",
  "workplaceExample": "An engineer uses terraform state list to find a module address and terraform state show to compare its recorded attributes with a plan.",
  "examFocus": "Know state list, state show, state mv and state rm. Mutating commands change Terraform’s management records and require extra care.",
  "keyPoints": [
    "Prefer read commands first.",
    "Use full resource addresses.",
    "state rm forgets an object; it does not delete the remote object.",
    "state mv changes an address mapping."
  ],
  "commonMistake": "Using a state command before confirming the workspace, address and backup or recovery path.",
  "example": "terraform state list\nterraform state show aws_s3_bucket.logs",
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
