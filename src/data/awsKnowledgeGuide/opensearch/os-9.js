import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-9',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'OpenSearch Dashboards',
  status: 'ready',
  plainEnglish: 'OpenSearch Dashboards (the open-source successor to Kibana) is an integrated web-based user interface bundled with Amazon OpenSearch Service. It allows administrators, developers, and analysts to visually search index data, build interactive line graphs, pie charts, and heatmaps, manage security roles, and monitor cluster performance in real time.',
  whyItMatters: 'Raw JSON search query outputs are hard to digest for operations teams. OpenSearch Dashboards turns raw log files and search metrics into live visual dashboards for real-time monitoring and threat detection.',
  workplaceExample: 'A DevOps team builds a live dashboard in OpenSearch Dashboards showing HTTP 5xx error spikes, API latencies by region, and top requesting IP addresses. The dashboard updates every 5 seconds from incoming web server logs.',
  examFocus: 'SAA-C03 Dashboards Integration & Security:\n- Access Control: Secured via IAM DB Auth, Cognito Authentication, SAML single sign-on, or Internal User Database.\n- URL Endpoint: Accessed via the domain\'s dedicated Dashboards HTTPS endpoint (e.g. `https://domain-endpoint/_dashboards/`).\n- Multi-Tenancy: OpenSearch Dashboards multi-tenancy allows separating visual dashboards and index patterns per team or customer tenant.',
  keyPoints: [
    'Integrated web UI for data visualization and OpenSearch cluster management.',
    'Provides interactive charts, graphs, maps, and real-time dashboard layouts.',
    'Secured via Cognito, SAML SSO, IAM, or OpenSearch Fine-Grained Access Control.',
    'Supports multi-tenancy for tenant-level dashboard and visualization isolation.',
    'Included automatically with every Amazon OpenSearch Service domain.'
  ],
  commonMistake: 'Exposing the OpenSearch Dashboards endpoint to the public internet without configuring authentication (Cognito/SAML) or VPC Security Group restriction.',
  example: 'Accessing OpenSearch Dashboards Endpoint:\nhttps://vpc-prod-logs-c123.us-east-1.es.amazonaws.com/_dashboards/',
  sources: [
    { title: 'Using OpenSearch Dashboards', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/dashboards.html' }
  ]
});
