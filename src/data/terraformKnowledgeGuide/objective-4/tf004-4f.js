export const guide = Object.freeze({
  "id": "tf004-4f",
  "group": "configuration",
  "title": "Resource dependencies",
  "plainEnglish": "Terraform builds a dependency graph. A reference usually creates an implicit dependency. depends_on declares a dependency that exists in behaviour but is not visible through a value reference.",
  "whyItMatters": "Correct dependencies let independent resources run in parallel while forcing connected operations into the required order.",
  "workplaceExample": "An instance references subnet.id, so Terraform infers that the subnet must exist first. A hidden operational requirement may need an explicit depends_on.",
  "examFocus": "Prefer implicit dependencies. Use depends_on only when Terraform cannot infer the real dependency.",
  "keyPoints": [
    "References create implicit dependencies.",
    "depends_on creates explicit dependencies.",
    "Terraform parallelises independent graph branches.",
    "Unnecessary explicit dependencies can make plans conservative."
  ],
  "commonMistake": "Copying an expression without understanding its value type, references or the dependencies it creates.",
  "example": "resource \"aws_instance\" \"web\" {\n  subnet_id = aws_subnet.public.id\n}\n\nresource \"example_service\" \"app\" {\n  depends_on = [example_policy.ready]\n}",
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
