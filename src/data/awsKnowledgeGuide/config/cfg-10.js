import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-10',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'Conformance Packs',
  status: 'ready',
  plainEnglish: 'A Conformance Pack is a collection of AWS Config rules and remediation actions packaged together into a single YAML template that can be deployed across an entire AWS account or organization. Conformance packs allow security teams to define and manage security, operational, and regulatory compliance baselines (such as PCI-DSS, HIPAA, SOC 2, or AWS Security Best Practices) as code.',
  whyItMatters: 'Managing individual config rules across hundreds of accounts and regions manually is error-prone and unscalable. Conformance packs treat compliance baselines as infrastructure-as-code, allowing centralized deployment, version control, and multi-account auditing.',
  workplaceExample: 'A healthcare organization deploys the official AWS HIPAA Conformance Pack template across 50 AWS accounts using AWS Organizations. All 50 accounts instantly enforce 40+ standardized HIPAA compliance rules and automated remediation scripts from a single management template.',
  examFocus: 'SAA-C03 scenarios involving deploying standardized compliance rules across an entire AWS Organization efficiently will point to Organization Conformance Packs. Know that Conformance Packs use YAML templates and can contain both Config Rules and Systems Manager Automation remediation actions.',
  keyPoints: [
    'Collection of AWS Config rules and remediation actions packaged into a YAML template.',
    'Enables Compliance-as-Code for regulatory frameworks (PCI-DSS, HIPAA, NIST).',
    'Deploys centrally across an entire AWS Organization from the management account.',
    'Prevents member accounts from modifying or deleting deployed organization rules.',
    'Provides an aggregated compliance score across all packed rules.'
  ],
  commonMistake: 'Creating individual Config rules manually in every member account instead of deploying an Organization Conformance Pack from the AWS Organizations management account.',
  example: 'Sample Conformance Pack Template Snippet (YAML):\nResources:\n  S3PublicReadRule:\n    Type: AWS::Config::ConfigRule\n    Properties:\n      ConfigRuleName: s3-bucket-public-read-prohibited\n      Source:\n        Owner: AWS\n        SourceIdentifier: S3_BUCKET_PUBLIC_READ_PROHIBITED',
  sources: [
    { title: 'Conformance Packs', url: 'https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html' }
  ]
});
