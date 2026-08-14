export const guide = Object.freeze({
  "id": "tf004-5b",
  "group": "modules",
  "title": "Variable scope inside modules",
  "plainEnglish": "A module has its own scope. Its resources can use that module’s variables and locals. A parent passes values through module arguments and reads only declared child outputs.",
  "whyItMatters": "Encapsulation prevents child implementation details leaking into every caller and creates a stable reusable interface.",
  "workplaceExample": "The root module passes environment = \"production\" to module.network and reads module.network.vpc_id after apply.",
  "examFocus": "Variables are not automatically global across modules. Parent-to-child inputs and child-to-parent outputs are explicit.",
  "keyPoints": [
    "Each module has separate variables and locals.",
    "Parents pass input arguments.",
    "Children expose outputs.",
    "A child cannot directly read arbitrary parent locals."
  ],
  "commonMistake": "Treating a module as a pasted folder rather than a reusable interface with inputs, outputs, a source and a version.",
  "example": "module \"network\" {\n  source      = \"./modules/network\"\n  environment = var.environment\n}\n\noutput \"vpc_id\" { value = module.network.vpc_id }",
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
