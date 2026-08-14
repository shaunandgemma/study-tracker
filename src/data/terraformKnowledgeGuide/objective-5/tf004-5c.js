export const guide = Object.freeze({
  "id": "tf004-5c",
  "group": "modules",
  "title": "Use modules in configuration",
  "plainEnglish": "A module block selects a source and supplies required input arguments. Terraform installs it during init and includes its resources in the same dependency graph and state.",
  "whyItMatters": "Modules let teams reuse tested patterns instead of repeatedly rebuilding the same collection of resources.",
  "workplaceExample": "An application calls a network module, passes a CIDR and references its subnet output when configuring compute resources.",
  "examFocus": "Know source, version for registry modules, input arguments, outputs, provider mappings and init after source changes.",
  "keyPoints": [
    "Add a module block.",
    "Provide required inputs.",
    "Run init to install it.",
    "Reference outputs as module.<name>.<output>."
  ],
  "commonMistake": "Treating a module as a pasted folder rather than a reusable interface with inputs, outputs, a source and a version.",
  "example": "module \"network\" {\n  source  = \"./modules/network\"\n  vpc_cidr = \"10.0.0.0/16\"\n}\n\nresource \"aws_instance\" \"web\" {\n  subnet_id = module.network.public_subnet_id\n}",
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
