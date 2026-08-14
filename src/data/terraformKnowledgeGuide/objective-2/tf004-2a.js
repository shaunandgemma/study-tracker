export const guide = Object.freeze({
  "id": "tf004-2a",
  "group": "fundamentals",
  "title": "Install and version Terraform providers",
  "plainEnglish": "A provider is a plugin that gives Terraform resource types and data sources for an API. required_providers declares where a provider comes from and which versions are acceptable. terraform init installs a matching version.",
  "whyItMatters": "Version constraints and the dependency lock file make provider selection predictable across developer computers and automation runners.",
  "workplaceExample": "A repository requires hashicorp/aws version 6.x. Developers and CI run terraform init and use the locked compatible version instead of silently choosing unrelated releases.",
  "examFocus": "Know the roles of required_providers, source, version constraints, terraform init and .terraform.lock.hcl.",
  "keyPoints": [
    "Providers are separate plugins.",
    "terraform init installs required providers.",
    "Version constraints describe acceptable versions.",
    "The lock file records selected versions and checksums."
  ],
  "commonMistake": "Mixing up the Terraform CLI, providers and cloud services. They are separate parts with different versions and responsibilities.",
  "example": "terraform {\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 6.0\"\n    }\n  }\n}",
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
