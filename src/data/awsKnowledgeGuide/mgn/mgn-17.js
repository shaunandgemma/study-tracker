import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-17',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'Minimal Downtime Server Migration',
  status: 'ready',
  plainEnglish: 'Minimal Downtime Server Migration is the primary business outcome delivered by AWS MGN. By performing continuous block-level data replication in the background while source servers remain online, MGN restricts actual application downtime strictly to the brief cutover window required to stop source application writes, sync final delta blocks, launch production EC2 instances, and update DNS records.',
  whyItMatters: 'Enterprise applications (ERP, CRM, e-commerce) cannot tolerate days of downtime for server migrations. MGN reduces migration downtime from days or weekends to a planned 15-to-30 minute maintenance window.',
  workplaceExample: 'A global e-commerce portal migrates its Linux web application servers to AWS. On cutover night at 2:00 AM, the team pauses web traffic for 15 minutes, flushes final disk blocks to MGN, launches target EC2 instances, redirects Route 53 DNS, and resumes live user traffic at 2:15 AM.',
  examFocus: 'SAA-C03 Cutover Sequence for Minimal Downtime:\n1. Pre-Cutover: Verify continuous replication status (`Healthy`) and replication lag (< 5 seconds).\n2. Quiesce Source: Stop source database/application write services on-premises.\n3. Final Sync: Wait for final delta block flush to complete in MGN.\n4. Launch Cutover: Trigger "Launch Cutover Instances" in MGN Console.\n5. Redirect & Validate: Verify EC2 instances, update DNS (Route 53 / local DNS), and finalize cutover.',
  keyPoints: [
    'Restricts migration downtime strictly to the brief final cutover maintenance window.',
    'Maintains live source server uptime during weeks of background block replication.',
    'Reduces cutover outage duration from days/weekends to 15-30 minutes.',
    'Requires stopping source writes during cutover to guarantee 100% data consistency.',
    'Final cutover steps include launching EC2 instances, DNS redirection, and finalization.'
  ],
  commonMistake: 'Failing to stop source database application services before launching cutover instances, allowing new writes to occur on the source server after cutover launch.',
  example: 'Starting Cutover Launch via AWS CLI:\naws mgn start-cutover --source-server-ids s-1234567890abcdef0',
  sources: [
    { title: 'Cutover process in AWS Application Migration Service', url: 'https://docs.aws.amazon.com/mgn/latest/ug/cutover-process.html' }
  ]
});
