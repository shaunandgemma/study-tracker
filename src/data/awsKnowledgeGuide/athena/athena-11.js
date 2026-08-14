import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-11",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Athena Workgroups",
  "status": "ready",
  "plainEnglish": "Athena Workgroups are logical administrative containers used to isolate users, teams, applications, and workloads within Amazon Athena. With workgroups, you can separate development queries from production queries, assign dedicated S3 query result locations, configure per-query or per-workgroup data scan limits, enforce query execution policies, and publish dedicated Amazon CloudWatch metrics for query cost monitoring and alerting.",
  "whyItMatters": "Without workgroups, all users share the same query environment and S3 output bucket. A single runaway query written by an intern could scan petabytes of data and cost thousands of dollars. Workgroups allow cloud administrators to set strict data scan limits (e.g., maximum 50 GB per query) and track individual team costs.",
  "workplaceExample": "An enterprise creates two Athena workgroups: marketing-analytics and security-audit. The marketing workgroup has a 100 GB per-query data scan limit and sends results to s3://marketing-athena-results/, while the security workgroup has higher data scan thresholds and dedicated CloudWatch budget alarms.",
  "examFocus": "For SAA-C03, remember that Athena Workgroups are used to manage query access, enforce data scan limits (cost controls), isolate query history, assign specific S3 output buckets, and monitor query metrics via Amazon CloudWatch. If a question asks how to prevent users from exceeding budget limits when querying Athena, the answer is configuring data usage limits in Athena Workgroups.",
  "keyPoints": [
    "Workgroups isolate queries, users, applications, and workloads.",
    "Allows setting data usage limits (both per-query and cumulative workgroup thresholds) to prevent budget overruns.",
    "Enforces dedicated S3 output locations and KMS encryption settings for query results.",
    "Integrates with Amazon CloudWatch to track query execution times, data scanned, and query errors.",
    "IAM policies can restrict users to specific Athena workgroups for governance."
  ],
  "commonMistake": "Letting all teams query using the default primary workgroup without scan limits. A poorly written query without partition filters can accidentally scan tens of terabytes of data. Create custom workgroups with enforced query scan limits for every team.",
  "example": "SELECT workgroup_name, query_execution_id, state, data_scanned_in_bytes FROM system.runtime.queries WHERE workgroup_name = 'analytics_team';",
  "sources": [
    {
      "title": "Managing Workgroups in Amazon Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/workgroups.html"
    },
    {
      "title": "Setting Data Usage Limits in Athena Workgroups",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/workgroups-setting-data-limits.html"
    }
  ]
});
