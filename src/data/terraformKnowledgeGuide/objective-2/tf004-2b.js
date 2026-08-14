export const guide = Object.freeze({
  "id": "tf004-2b",
  "group": "fundamentals",
  "title": "How Terraform uses providers",
  "plainEnglish": "Terraform Core reads configuration and builds a dependency graph. Provider plugins understand specific APIs, authenticate to them, validate provider-specific arguments and create, read, update or delete remote objects.",
  "whyItMatters": "This separation allows Terraform to use one language and workflow while providers evolve independently for thousands of APIs.",
  "workplaceExample": "Terraform Core decides an EC2 instance needs changing; the AWS provider translates that planned change into AWS API calls and reports the result back to Terraform.",
  "examFocus": "Distinguish Terraform Core from providers. Provider configuration supplies settings such as Region or endpoint, while credentials should normally come from supported external credential mechanisms.",
  "keyPoints": [
    "Core manages configuration, graph, plan and state.",
    "Providers communicate with remote APIs.",
    "Resource schemas come from providers.",
    "Provider configuration and provider requirements are different concepts."
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
