export const guide = Object.freeze({
  "id": "tf004-2c",
  "group": "fundamentals",
  "title": "Use multiple provider configurations",
  "plainEnglish": "A configuration can use multiple provider types or multiple configurations of the same provider. An alias names an alternate configuration, and a resource or module can select it explicitly.",
  "whyItMatters": "This supports infrastructure spanning regions, accounts or services without duplicating the whole Terraform workflow.",
  "workplaceExample": "A default AWS provider manages London resources while aws.ireland manages a disaster-recovery resource in eu-west-1.",
  "examFocus": "Know default providers, aliases, the provider meta-argument and passing provider configurations into child modules.",
  "keyPoints": [
    "An unaliased configuration is the default.",
    "alias creates an alternate provider configuration.",
    "Resources select an alias with provider = aws.alias.",
    "Child modules can receive explicit provider mappings."
  ],
  "commonMistake": "Mixing up the Terraform CLI, providers and cloud services. They are separate parts with different versions and responsibilities.",
  "example": "provider \"aws\" { region = \"eu-west-2\" }\nprovider \"aws\" {\n  alias  = \"ireland\"\n  region = \"eu-west-1\"\n}\n\nresource \"aws_s3_bucket\" \"dr\" {\n  provider = aws.ireland\n  bucket   = \"example-dr-bucket\"\n}",
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
