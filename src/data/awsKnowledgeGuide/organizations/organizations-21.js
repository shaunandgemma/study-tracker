import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-21',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Tag Policies',
  status: 'ready',
  plainEnglish: 'Tag Policies are governance policies in AWS Organizations that standardize tag keys and case sensitivities across resources in member accounts. A Tag Policy specifies allowed tag keys and value rules (e.g. mandating that all resources must have an `Environment` tag with values restricted to `Production`, `Staging`, or `Development`).',
  whyItMatters: 'Inconsistent resource tagging (e.g. `Env`, `environment`, `ENV`) breaks automated cost allocation reports and IAM tag-based access control (ABAC). Tag Policies enforce consistent tagging standards and prevent non-compliant resource creation.',
  workplaceExample: 'A financial enterprise attaches a Tag Policy to `Root`. It mandates that the tag key `CostCenter` must be attached to EC2 instances and S3 buckets upon creation, preventing developers from launching untagged infrastructure.',
  examFocus: 'SAA-C03 Tag Policy Enforcement Mechanics:\n- Compliance Auditing: Tag Policies generate non-compliance reports in AWS Resource Groups for untagged or incorrectly cased resources.\n- Enforcement Option: Can be configured with enforcement (`"enforceable": "true"`) to actively BLOCK resource creation requests that do not comply with tag rules.\n- Case Sensitivity: Standardizes letter casing (e.g. enforces `Environment` vs `environment`).',
  keyPoints: [
    'Standardizes resource tag keys, value formats, and letter-casing across member accounts.',
    'Generates compliance reports for resources failing tagging standards.',
    'Can actively enforce tagging compliance by blocking non-compliant creation requests.',
    'Essential for enterprise Cost Allocation tagging and Attribute-Based Access Control (ABAC).',
    'Inherited down the OU tree structure from the Organization Root.'
  ],
  commonMistake: 'Assuming Tag Policies automatically add tags to existing untagged resources. Tag Policies audit compliance and block non-compliant future creations.',
  example: 'Tag Policy JSON Enforcing `Environment` Tag Values:\n{\n  "tags": {\n    "Environment": {\n      "tag_key": {\n        "@@assign": "Environment"\n      },\n      "tag_value": {\n        "@@assign": ["Production", "Staging", "Development"]\n      },\n      "enforceable": {\n        "@@assign": "true"\n      }\n    }\n  }\n}',
  sources: [
    { title: 'Tag policies in AWS Organizations', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_tag-policies.html' }
  ]
});
