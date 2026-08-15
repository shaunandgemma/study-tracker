import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-10',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'Security Hub Integrations',
  status: 'ready',
  plainEnglish: 'Security Hub Integrations allow external AWS services, third-party Security Information and Event Management (SIEM) systems, threat intelligence feeds, vulnerability scanners, and ticketing platforms (such as Splunk, Datadog, Jira, and ServiceNow) to send findings TO Security Hub or consume normalized ASFF findings FROM Security Hub via Amazon EventBridge.',
  whyItMatters: 'Enterprise security operations centers (SOC) rely on centralized SIEM tools. Security Hub Integrations eliminate custom data parsing by delivering normalized findings to third-party SIEM tools or automated ticket queues via EventBridge.',
  workplaceExample: 'An enterprise connects Security Hub with Jira via Amazon EventBridge. When a CRITICAL Security Hub finding occurs, EventBridge automatically creates a high-priority ticket in Jira assigned to the infrastructure team.',
  examFocus: 'SAA-C03 Integration Flow & Patterns:\n- Inbound Integrations: Ingest findings from partner security software into Security Hub using the ASFF schema.\n- Outbound EventBridge Integration: Automatically stream Security Hub ASFF findings to EventBridge rules.\n- Custom Actions: Create custom Security Hub drop-down actions that send selected findings to EventBridge for manual SOC triage.\n- Systems Manager Integration: Route findings to AWS Systems Manager OpsCenter as OpsItems for incident tracking.',
  keyPoints: [
    'Supports bidirectional integrations with AWS services and third-party security partner products.',
    'Streams ASFF normalized findings to Amazon EventBridge for automated routing.',
    'Integrates with Systems Manager OpsCenter to automatically create OpsItems from findings.',
    'Provides Custom Actions allowing SOC analysts to trigger manual remediation workflows.',
    'Enables direct ingestion of partner vulnerability scans into the Security Hub dashboard.'
  ],
  commonMistake: 'Attempting to poll Security Hub APIs continuously in a tight loop to forward findings to SIEMs instead of using EventBridge event-driven streaming.',
  example: 'Creating a Security Hub Custom Action via AWS CLI:\naws securityhub create-action-target --name "SendToJira" --description "Triggers Jira Ticket Creation" --id "SendToJiraAction"',
  sources: [
    { title: 'Product integrations in AWS Security Hub', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-partner-providers.html' }
  ]
});
