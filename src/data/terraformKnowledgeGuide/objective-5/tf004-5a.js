export const guide = Object.freeze({
  "id": "tf004-5a",
  "group": "modules",
  "title": "Where Terraform modules come from",
  "plainEnglish": "Every Terraform configuration is a module. A module called by another is a child module. The source argument tells Terraform where to obtain it, such as a local path, registry or version-control repository.",
  "whyItMatters": "Source choice affects reproducibility, trust and how updates are controlled.",
  "workplaceExample": "A team publishes a reviewed VPC module in a private registry and application repositories call a pinned version.",
  "examFocus": "Know local, registry and Git sources. terraform init installs child modules, and source selection occurs before normal plan-time values.",
  "keyPoints": [
    "The working directory is the root module.",
    "module blocks call child modules.",
    "source locates module code.",
    "Review third-party module code before use."
  ],
  "commonMistake": "Treating a module as a pasted folder rather than a reusable interface with inputs, outputs, a source and a version.",
  "example": null,
  "sources": [
    {
      "title": "Terraform Associate 004 exam content list",
      "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004"
    },
    {
      "title": "Official Terraform documentation for this topic",
      "url": "https://developer.hashicorp.com/terraform/language/modules"
    }
  ]
});

export default guide;
