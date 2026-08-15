import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-11",
  "title": "Row-Level Security",
  "plainEnglish": "Row-level security (RLS) is an Enterprise Edition dataset control that decides which records a person can see. User-based RLS matches registered Quick Sight users or groups to allowed field values in a permissions dataset; tag-based RLS supports embedded sessions for unregistered users.",
  "whyItMatters": "One governed dataset and dashboard can safely serve different regions, departments, or tenants without creating a separate copy for each audience. Because enforcement occurs at the dataset, its rules follow the data into the analyses and dashboards that use it.",
  "workplaceExample": "A global sales dataset contains every territory. Its permissions dataset maps the EMEA-Sales group to EMEA and the US-Sales group to US, so both groups open the same dashboard but receive only matching rows.",
  "examFocus": "RLS restricts rows; column-level security restricts fields. Use user or group rules for registered Quick Sight identities and tag-based rules for anonymous embedded sessions. A visual filter is an analysis feature, not a security boundary.",
  "keyPoints": [
    "RLS is configured on a dataset in Enterprise Edition.",
    "User-based rules use a permissions dataset containing user or group identity and allowed string values.",
    "A registered user or group with no matching grant rule cannot see rows in the restricted dataset.",
    "A blank or NULL restriction value in a valid user-based grant rule can represent all values, so rule data needs careful review.",
    "Tag-based RLS passes approved tag values into anonymous embedded sessions.",
    "Dataset owners can see all data, so testing should include a real restricted reader identity."
  ],
  "commonMistake": "Do not rely on a region filter or hidden visual to protect records. Apply RLS to the dataset, avoid accidental all-value grants in the rules, and test positive and negative cases using the same identity type as the intended audience.",
  "example": "Create a rules dataset with GroupName and SalesRegion string columns, mark it for RLS use, attach it to the sales dataset, add narrowly scoped group mappings, and verify that an unmapped reader sees no restricted data.",
  "sources": [
    {
      "title": "Using row-level security in Amazon Quick",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/row-level-security.html"
    },
    {
      "title": "Using user-based rules to restrict access to a dataset",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/restrict-access-to-a-data-set-using-row-level-security.html"
    }
  ]
});
