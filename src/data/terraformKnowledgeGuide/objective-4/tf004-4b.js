export const guide = Object.freeze({
  "id": "tf004-4b",
  "group": "configuration",
  "title": "Resource attributes and cross-resource references",
  "plainEnglish": "A reference reads a value exposed by another block. Terraform can then pass an ID or other attribute between resources and infer their dependency order.",
  "whyItMatters": "References avoid manually copying identifiers and keep connected resources correct when an ID changes.",
  "workplaceExample": "A subnet references aws_vpc.main.id, so Terraform creates the VPC before the subnet and uses the actual returned ID.",
  "examFocus": "Read addresses as resource type, local name and attribute. References normally create implicit dependencies.",
  "keyPoints": [
    "References are expressions.",
    "Attributes are values exported after evaluation.",
    "References create dependency edges.",
    "Avoid copying cloud-generated IDs into configuration."
  ],
  "commonMistake": "Copying an expression without understanding its value type, references or the dependencies it creates.",
  "example": "resource \"aws_subnet\" \"public\" {\n  vpc_id     = aws_vpc.main.id\n  cidr_block = \"10.0.1.0/24\"\n}",
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
