import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-8",
  "title": "Patch Manager",
  "plainEnglish": "AWS Systems Manager Patch Manager is an automated patching service that scans and applies operating system, security, and software updates across large fleets of Amazon EC2 instances and on-premises managed nodes. Using predefined or custom Patch Baselines, Patch Manager defines rules for which operating system patches (such as Critical or Important security fixes) are automatically approved after a testing delay, which patches are rejected, and when patches are installed via scheduled Maintenance Windows.",
  "whyItMatters": "Unpatched operating systems and outdated software libraries are the primary entry point for malware and security vulnerabilities. Manually tracking CVE bulletins and applying patches across heterogeneous operating systems (Linux, Windows Server, macOS) is overwhelming. Patch Manager automates the patching lifecycle, provides centralized compliance reporting, and reduces business disruption through automated rollback and staging.",
  "workplaceExample": "An enterprise security policy mandates that all Critical security patches must be applied within 14 days of release. The cloud operations team creates a custom Patch Baseline: (1) Auto-approve Critical and Important security patches 7 days after vendor release (allowing 7 days of sandbox testing), (2) Assign the baseline to production servers using the tag `Patch Group=Production-Linux`, and (3) Schedule automated patching every Sunday at 3:00 AM using an SSM Maintenance Window. Patch Manager updates the servers and generates a compliance dashboard for auditors.",
  "examFocus": "Understand Patch Manager components and workflows: (1) Patch Baselines: Defines auto-approval rules based on operating system, patch classification (Security, Bugfix), severity (Critical, High), and approval delay in days. (2) Patch Groups: Uses the specific EC2 tag key `Patch Group` to associate managed nodes with specific patch baselines. (3) Scan vs Install: `Scan` checks node compliance without making changes; `Install` installs approved patches and optionally reboots the instance. (4) Compliance Dashboard: Surfaces patch compliance status in Fleet Manager and AWS Config.",
  "keyPoints": [
    "Automates scanning and installation of operating system and security patches at scale.",
    "Custom Patch Baselines define auto-approval rules, severity thresholds, and approval delays.",
    "Uses the `Patch Group` tag to map specific groups of instances to dedicated patch baselines.",
    "Supports both non-disruptive `Scan` operations and patch `Install` operations.",
    "Integrates with SSM Maintenance Windows to enforce patching during scheduled downtime windows.",
    "Reports detailed patch compliance metrics viewable in Systems Manager and AWS Config."
  ],
  "commonMistake": "Configuring a custom patch baseline with a 0-day approval delay directly on production servers. Zero-day approval installs new patches the moment vendors release them, risking application crashes if a patch has bugs; always specify an approval delay (e.g., 7 days) and test in staging first.",
  "example": "Execute a non-disruptive patch compliance scan across all web servers using the AWS CLI: aws ssm send-command --document-name 'AWS-RunPatchBaseline' --targets 'Key=tag:Role,Values=WebServer' --parameters 'Operation=Scan'.",
  "sources": [
    {
      "title": "AWS Systems Manager Patch Manager User Guide",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager.html"
    },
    {
      "title": "Working with Custom Patch Baselines in Patch Manager",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-patch-baselines.html"
    }
  ]
});
