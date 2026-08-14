export const guide = Object.freeze({
  "id": "tf004-2d",
  "group": "fundamentals",
  "title": "How Terraform uses and manages state",
  "plainEnglish": "State records the link between Terraform resource addresses and real remote objects, along with metadata and known attributes. Terraform uses it to decide what must change.",
  "whyItMatters": "Without the mapping, Terraform would not reliably know which real object belongs to each resource block. State also helps Terraform calculate dependencies and performance-efficient refreshes.",
  "workplaceExample": "State links aws_vpc.main to a particular VPC ID. When the configuration changes, Terraform knows which VPC to update instead of creating an unrelated one.",
  "examFocus": "State is required, may contain sensitive data and should not be edited directly. Local state is the default; team workflows normally use protected remote state.",
  "keyPoints": [
    "State maps addresses to remote objects.",
    "Terraform refreshes information before planning.",
    "State may contain sensitive values.",
    "Use supported state commands rather than editing JSON."
  ],
  "commonMistake": "Mixing up the Terraform CLI, providers and cloud services. They are separate parts with different versions and responsibilities.",
  "example": null,
  "sources": [
    {
      "title": "Terraform Associate 004 exam content list",
      "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004"
    },
    {
      "title": "Official Terraform documentation for this topic",
      "url": "https://developer.hashicorp.com/terraform/language/providers"
    }
  ]
});

export default guide;
