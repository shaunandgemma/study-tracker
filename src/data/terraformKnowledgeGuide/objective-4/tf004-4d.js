export const guide = Object.freeze({
  "id": "tf004-4d",
  "group": "configuration",
  "title": "Complex Terraform types",
  "plainEnglish": "Complex values contain other values. Collections include list, set and map; structural types include object and tuple. Type constraints define the shape a variable accepts.",
  "whyItMatters": "Well-defined types catch invalid input early and let one block represent structured settings cleanly.",
  "workplaceExample": "An object variable groups instance size, monitoring and tags into one validated application configuration.",
  "examFocus": "Know list ordering and duplicates, set uniqueness, map keys, and fixed object attributes. Terraform can convert compatible values in some contexts.",
  "keyPoints": [
    "list is ordered.",
    "set contains unique unordered values.",
    "map uses string keys.",
    "object defines named attributes with their own types."
  ],
  "commonMistake": "Copying an expression without understanding its value type, references or the dependencies it creates.",
  "example": "variable \"application\" {\n  type = object({\n    instance_type = string\n    monitoring    = bool\n    tags          = map(string)\n  })\n}",
  "sources": [
    {
      "title": "Terraform Associate 004 exam content list",
      "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004"
    },
    {
      "title": "Official Terraform documentation for this topic",
      "url": "https://developer.hashicorp.com/terraform/language"
    }
  ]
});

export default guide;
