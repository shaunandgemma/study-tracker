export const guide = Object.freeze({
  "id": "tf004-1c",
  "group": "iac",
  "title": "Multi-cloud, hybrid-cloud and service-agnostic workflows",
  "plainEnglish": "Terraform uses providers to communicate with different APIs. One workflow can manage AWS, Azure, Google Cloud, Kubernetes, SaaS products and on-premises systems, although each provider still has its own resource types.",
  "whyItMatters": "Organisations rarely use only one API. A shared Terraform workflow lets teams use familiar commands and configuration patterns while managing different platforms.",
  "workplaceExample": "One configuration creates an AWS network, a Cloudflare DNS record and a GitHub repository by declaring three providers and the required resources.",
  "examFocus": "Terraform is workflow-consistent, not resource-identical. Providers expose platform-specific schemas, and separate credentials and permissions are still required.",
  "keyPoints": [
    "Providers translate Terraform operations into API calls.",
    "Multiple providers can be used in one configuration.",
    "Hybrid cloud combines cloud and on-premises services.",
    "Service-agnostic does not mean every provider uses identical arguments."
  ],
  "commonMistake": "Treating Terraform like a list of shell commands. Terraform describes the result you want; providers decide which API operations are needed.",
  "example": "terraform {\n  required_providers {\n    aws = { source = \"hashicorp/aws\" }\n    github = { source = \"integrations/github\" }\n  }\n}",
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
