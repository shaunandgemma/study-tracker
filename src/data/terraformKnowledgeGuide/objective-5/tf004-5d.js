export const guide = Object.freeze({
  "id": "tf004-5d",
  "group": "modules",
  "title": "Manage module versions",
  "plainEnglish": "Registry modules support a version constraint. Git sources can select a tag or commit with ref. Pinning a reviewed version prevents an upstream change from arriving unexpectedly.",
  "whyItMatters": "Controlled upgrades make module behaviour reproducible and give teams a deliberate review point.",
  "workplaceExample": "A repository uses version = \"~> 3.2\" and upgrades only after reviewing the module changelog and a Terraform plan.",
  "examFocus": "Know version constraints and that the version argument applies to registry modules. For Git, use a ref in the source URL.",
  "keyPoints": [
    "Pin reviewed module versions.",
    "Use constraints deliberately.",
    "Run init -upgrade for controlled upgrades.",
    "Review the resulting plan before apply."
  ],
  "commonMistake": "Treating a module as a pasted folder rather than a reusable interface with inputs, outputs, a source and a version.",
  "example": "module \"network\" {\n  source  = \"example/network/aws\"\n  version = \"~> 3.2\"\n}",
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
