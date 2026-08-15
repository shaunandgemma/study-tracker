import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-12',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'Cross-Region Aggregation',
  status: 'ready',
  plainEnglish: 'Cross-Region Aggregation in AWS Security Hub allows centralizing security findings, security scores, and control evaluation statuses from multiple AWS Regions into a single designated Aggregation Region (Home Region). Finding updates and workflow status changes made in the Aggregation Region automatically synchronize back to original source Regions.',
  whyItMatters: 'Operating in 15+ AWS Regions forces security analysts to manually switch console regions to check for local threats. Cross-Region Aggregation aggregates findings across all global regions into one central Home Region dashboard.',
  workplaceExample: 'A global cloud enterprise operates in `us-east-1`, `eu-west-1`, and `ap-southeast-1`. They designate `us-east-1` as the Security Hub Aggregation Region. All global security findings stream to `us-east-1` for unified SOC monitoring.',
  examFocus: 'SAA-C03 Cross-Region Aggregation Mechanics:\n- Home/Aggregation Region: The single designated target region where global findings are aggregated.\n- Bidirectional Synchronization: Updating finding workflow status (e.g. `RESOLVED`) in the Home Region automatically updates the finding in the source region.\n- Regional Isolation Note: Aggregating findings centralizes visibility; it does NOT convert Regional AWS resources into global resources.\n- AWS Organizations Integration: Integrates seamlessly with Delegated Administrator for organization-wide global aggregation.',
  keyPoints: [
    'Aggregates findings, security scores, and controls from multiple AWS Regions into one Home Region.',
    'Provides a single global pane of glass for multi-region security operations.',
    'Synchronizes finding updates (workflow status, notes) bidirectionally across regions.',
    'Eliminates the requirement to manually switch AWS console regions during incident response.',
    'Configured easily via Security Hub console or `create-finding-aggregator` API.'
  ],
  commonMistake: 'Assuming Cross-Region Aggregation automatically enables Security Hub in secondary regions. Security Hub must still be enabled in source regions.',
  example: 'Creating a Finding Aggregator in the Home Region via AWS CLI:\naws securityhub create-finding-aggregator --region-linking-mode "ALL_REGIONS"',
  sources: [
    { title: 'Cross-Region aggregation in AWS Security Hub', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/finding-aggregation.html' }
  ]
});
