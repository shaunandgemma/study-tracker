export const guide = Object.freeze({
  "id": "tf004-1a",
  "group": "iac",
  "title": "What infrastructure as code means",
  "plainEnglish": "Infrastructure as code, usually shortened to IaC, means describing infrastructure in text files that tools can read. Instead of repeatedly clicking through a cloud console, you describe the required result: for example, one network, two subnets and a security group.",
  "whyItMatters": "The files create a repeatable record of the intended infrastructure. They can be reviewed, tested, versioned and used again instead of relying on memory or handwritten setup notes.",
  "workplaceExample": "A team stores its network configuration in Git. A reviewed change adds a subnet, the pipeline produces a Terraform plan, and an approved run creates the same change in each required environment.",
  "examFocus": "Know that Terraform is declarative: configuration describes desired state. Terraform compares that state with managed infrastructure and proposes the actions required to reconcile them.",
  "keyPoints": [
    "IaC represents infrastructure in machine-readable files.",
    "Declarative configuration focuses on the required result.",
    "Version control provides history, review and collaboration.",
    "Terraform uses providers and state to reconcile infrastructure."
  ],
  "commonMistake": "Treating Terraform like a list of shell commands. Terraform describes the result you want; providers decide which API operations are needed.",
  "example": "resource \"aws_s3_bucket\" \"logs\" {\n  bucket = \"example-training-logs\"\n}",
  "sources": [
    {
      "title": "Terraform Associate 004 exam content list",
      "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004"
    },
    {
      "title": "Official Terraform documentation for this topic",
      "url": "https://developer.hashicorp.com/terraform/intro"
    }
  ]
});

export default guide;
