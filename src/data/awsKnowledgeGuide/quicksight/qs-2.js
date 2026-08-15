import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "qs-2",
  "title": "Dashboard Embedding into Web Apps, ML Automated Insights, & Row-Level Security",
  "plainEnglish": "Quick Sight can place dashboards inside a web application, add machine-learning (ML) insights such as anomalies or forecasts, and restrict dataset rows with row-level security (RLS). These are separate capabilities: embedding presents analytics, ML assists interpretation, and RLS enforces which records a viewer may see.",
  "whyItMatters": "A customer portal can deliver useful analytics without exposing one tenant's data to another. The application must authenticate and authorize the viewer, generate a supported embed URL securely, apply dataset security, and treat automated insights as evidence to review rather than guaranteed truth.",
  "workplaceExample": "A software-as-a-service portal embeds a usage dashboard. Its backend authorizes the tenant and requests an anonymous embed session with tenant tags; tag-based RLS restricts rows, while an anomaly visual highlights unusual usage for investigation.",
  "examFocus": "Enterprise embedding can serve registered or approved anonymous sessions. Generate embed URLs on a protected backend, allow-list domains, and apply RLS or column-level security. Domain allow lists and hidden visuals are not authorization controls. ML results depend on data and configuration.",
  "keyPoints": [
    "Quick Sight supports registered-user and approved anonymous embedding patterns.",
    "A protected backend calls the supported API; AWS credentials must never be placed in browser code.",
    "Allowed embedding domains reduce where content can render but do not identify or authorize a tenant.",
    "User/group rules protect registered viewers, while tag-based RLS supports appropriate anonymous embedding scenarios.",
    "RLS is configured on the dataset, so ordinary filters cannot replace it.",
    "Forecasts, anomaly detection, and automatic narratives require suitable data and human validation."
  ],
  "commonMistake": "Passing a tenant filter as a URL parameter without enforcing RLS lets the interface appear separated while the underlying viewer could still access unauthorized rows.",
  "example": "Authenticate a sample tenant in the application backend, authorize one dashboard, generate an anonymous embed URL with scoped session tags, restrict approved domains, apply RLS to tenant_id, and test that changing client-side controls cannot cross tenant boundaries.",
  "sources": [
    {
      "title": "Embedding with the Amazon Quick Sight APIs",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/embedded-analytics-api.html"
    },
    {
      "title": "Using row-level security in Amazon Quick",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/row-level-security.html"
    },
    {
      "title": "Machine-learning insights in Amazon Quick Sight",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/making-data-driven-decisions-with-ml-in-quicksight.html"
    }
  ]
});
