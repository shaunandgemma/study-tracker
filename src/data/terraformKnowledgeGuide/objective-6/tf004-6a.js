export const guide = Object.freeze({
  "id": "tf004-6a",
  "group": "state",
  "title": "The local backend",
  "plainEnglish": "A backend determines where Terraform stores state and how operations interact with it. Without another backend configuration, Terraform uses the local backend and normally writes terraform.tfstate in the working directory.",
  "whyItMatters": "Local state is simple for learning but weak for teamwork because the file can be lost, copied, exposed or changed concurrently.",
  "workplaceExample": "A learner uses local state for a disposable exercise. A team migrates important shared state to a protected backend or HCP Terraform.",
  "examFocus": "Know the default state filename, local backend purpose and why remote state is preferred for collaboration.",
  "keyPoints": [
    "Backend controls state storage.",
    "Local is the default backend.",
    "Local state may contain secrets.",
    "Do not commit state to version control."
  ],
  "commonMistake": "Editing or sharing a state file manually. State may contain sensitive data and must be protected and changed with supported workflows.",
  "example": null,
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
