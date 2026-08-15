import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-19", "topicId": "topic-transfer-family", "topicTitle": "AWS Transfer Family", "objectiveCode": "Management", "title": "CloudWatch Logging", "status": "ready",
  "plainEnglish": "Amazon CloudWatch Logs can record Transfer Family server session and file-operation events, including connections, authentication failures, errors, opens, closes, and other supported actions. Structured logging writes JSON fields that CloudWatch Logs Insights can query. Managed workflows have their own execution logging requirements and need a logging role.",
  "whyItMatters": "Logs let operators answer whether a client reached the endpoint, authenticated, attempted a file operation, and encountered a protocol or authorization error. Metrics and alarms reveal trends, but neither proves that downstream business processing completed or automatically satisfies an audit-retention policy.",
  "workplaceExample": "An operations dashboard tracks failed authentication and transfer errors for several SFTP servers. A Logs Insights query groups structured events by server and redacted user identifier, an alarm pages the owning team on sustained failures, and the log group has an approved retention period and access policy.",
  "examFocus": "Use CloudWatch for Transfer Family logs, metrics, queries, dashboards, and alarms. Use CloudTrail to audit supported AWS API activity and configuration actions. CloudTrail is not a copy of transferred file content, and workflow success must be monitored separately from upload completion.",
  "keyPoints": [
    "Structured JSON logging is recommended for new and existing Transfer Family servers and enables field-based Logs Insights queries.",
    "Choose an appropriate log group, retention period, encryption setting, and access policy according to operational and compliance needs.",
    "Server events can distinguish connection, authentication, file-operation, and protocol errors when the relevant logging is enabled.",
    "Managed workflows require a logging role for workflow logging even when structured server logging is configured.",
    "CloudWatch metrics use dimensions such as server identifiers; verify Region, dimensions, time range, and test activity when data appears missing.",
    "Create alarms for actionable symptoms and assign a runbook owner instead of alarming on every individual log line.",
    "Avoid exposing sensitive filenames, user details, policies, or customer data in dashboards, notifications, and broad log-reader permissions."
  ],
  "commonMistake": "Do not enable a log group and assume monitoring is finished. Generate harmless test activity, verify expected structured fields and workflow logs, create useful alarms, set retention and access controls, and confirm someone owns the response procedure.",
  "example": "In a non-production log group, generate one successful test login, one failed login, one allowed upload, and one denied path. Query the structured activity types, check that sensitive content is absent, validate an alarm with a temporary threshold, confirm retention and readers, and document how CloudTrail would be used for a related server-configuration change.",
  "sources": [
    {"title": "Creating, updating, and viewing logging for servers", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/log-server-manage.html"},
    {"title": "CloudWatch log structure for Transfer Family", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/cw-structure-logs.html"},
    {"title": "AWS CloudTrail logging for AWS Transfer Family", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/cloudtrail-logging.html"}
  ]
});
