import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'inspector-4',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'EC2 Vulnerability Scanning',
  status: 'ready',
  plainEnglish: 'Amazon Inspector EC2 scanning collects software inventory from eligible instances and compares it with security-advisory data to find package vulnerabilities; it also evaluates EC2 network reachability. Agent-based scanning uses Systems Manager inventory and the Inspector SSM plugin for supported managed instances. In hybrid mode, eligible EBS-backed instances that are not suitably managed can instead be scanned agentlessly from temporary EBS snapshots.',
  whyItMatters: 'EC2 fleets often contain both well-managed servers and instances that are not connected to Systems Manager. Understanding scan modes prevents false assumptions about coverage and lets teams choose faster inventory-driven scanning where possible while retaining supported agentless visibility where appropriate.',
  workplaceExample: 'A fleet has managed Amazon Linux application servers and an isolated Linux appliance. Inspector uses the agent-based method for eligible managed servers and, with hybrid scanning configured, uses the agentless method for the eligible EBS-backed appliance. The coverage page shows which method scanned each instance.',
  examFocus: 'Do not claim that every EC2 vulnerability scan requires SSM Agent. Agent-based mode scans eligible SSM-managed instances; hybrid mode can use both agent-based and supported agentless methods. Agentless collection uses EBS snapshots and has eligibility requirements. Inspector detects vulnerabilities; Systems Manager Patch Manager can deploy patches to managed nodes.',
  keyPoints: [
    'EC2 scanning produces package vulnerability and network reachability findings.',
    'Agent-based package scanning uses Systems Manager inventory and an Inspector SSM plugin.',
    'Hybrid mode uses agent-based scanning for eligible managed instances and agentless scanning for other eligible instances.',
    'Agentless scanning obtains inventory from temporary snapshots of eligible EBS-backed instances.',
    'Operating system, instance state, storage, encryption, tags, and other documented conditions can affect eligibility.',
    'The coverage view identifies scan status, scan method, and reasons an instance is not monitored.'
  ],
  commonMistake: 'Troubleshooting every unscanned instance by reinstalling SSM Agent ignores hybrid and agentless eligibility. Check the account scan mode and the specific coverage reason before deciding whether to repair Systems Manager management or satisfy agentless requirements.',
  example: 'Select one managed and one unmanaged EBS-backed test instance. Confirm the configured EC2 scan mode, inspect each coverage status and scan method, review any package findings, and use the approved server update process before verifying that inventory was reevaluated.',
  sources: [
    { title: 'Scanning Amazon EC2 instances with Amazon Inspector', url: 'https://docs.aws.amazon.com/inspector/latest/user/scanning-ec2.html' },
    { title: 'Assessing Amazon Inspector coverage', url: 'https://docs.aws.amazon.com/inspector/latest/user/assessing-coverage.html' },
    { title: 'Supported operating systems and programming languages', url: 'https://docs.aws.amazon.com/inspector/latest/user/supported.html' },
    { title: 'AWS Systems Manager Patch Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager.html' }
  ]
});
