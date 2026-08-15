import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-12",
  "title": "Maintenance Windows",
  "plainEnglish": "AWS Systems Manager Maintenance Windows allows you to set up scheduled, recurring time windows to execute disruptive operational and administrative tasks across your managed nodes without impacting end-user productivity. A maintenance window defines a schedule (e.g., every Saturday at 2:00 AM UTC), a duration (e.g., 4 hours), a cutoff time (which stops new tasks from launching before the window closes), targeted instances (by tags or resource groups), and the specific tasks to run (such as Patch Manager updates, Run Command scripts, Automation runbooks, or AWS Lambda functions).",
  "whyItMatters": "Running server patches, database re-indexing, or application restarts during business hours causes service interruptions and degraded customer experience. Maintenance Windows ensures that all potentially disruptive maintenance operations are restricted strictly to approved, low-traffic time periods with built-in concurrency controls and automatic task cutoff protection.",
  "workplaceExample": "A global e-commerce company establishes an off-peak maintenance schedule. They configure a 3-hour Maintenance Window on Sundays at 1:00 AM UTC with a 1-hour cutoff. They register two tasks: (1) Patch Manager installing operating system security updates, and (2) An Automation runbook performing database index maintenance. When the window opens, tasks execute with a 20% concurrency limit. At 3:00 AM (the 1-hour cutoff mark), Systems Manager stops starting new tasks, ensuring all instances are fully healthy and ready for morning traffic.",
  "examFocus": "Understand Maintenance Window parameters and task types: (1) Duration: Total length of the maintenance window in hours (e.g., 4 hours). (2) Cutoff: Number of hours before the window ends when Systems Manager stops initiating new tasks (e.g., 1 hour before window close). (3) Schedule: Expressed using cron or rate expressions with timezone support. (4) Supported Tasks: Four task types: (a) Run Command, (b) Automation Runbooks, (c) AWS Lambda functions, (d) AWS Step Functions tasks.",
  "keyPoints": [
    "Defines scheduled recurring time windows for executing disruptive operational tasks.",
    "Configured with a Schedule (cron/rate), Duration (in hours), and Cutoff time.",
    "Cutoff time prevents new tasks from starting before the maintenance window expires.",
    "Supports four task types: Run Command, Automation, AWS Lambda, and Step Functions.",
    "Targets managed nodes flexibly using Amazon EC2 tags, Resource Groups, or instance IDs.",
    "Enforces Max Concurrency and Error Thresholds to control task rollout and limit blast radius."
  ],
  "commonMistake": "Setting the Cutoff time equal to or greater than the Duration time, or forgetting to configure a Cutoff. Without a Cutoff time, a long-running patch installation might start 2 minutes before the window closes and cause unexpected instance reboots during peak business hours.",
  "example": "Create a 4-hour maintenance window with a 1-hour cutoff every Sunday at 02:00 UTC using the AWS CLI: aws ssm create-maintenance-window --name 'SundayPatchingWindow' --schedule 'cron(0 2 ? * SUN *)' --duration 4 --cutoff 1 --allow-unassociated-targets.",
  "sources": [
    {
      "title": "AWS Systems Manager Maintenance Windows Overview",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-maintenance.html"
    },
    {
      "title": "Scheduling and Managing Maintenance Windows",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-maintenance-schedule.html"
    }
  ]
});
