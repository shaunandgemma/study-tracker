import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-13",
  "title": "Dashboard Sharing",
  "plainEnglish": "Dashboard sharing grants selected Quick Sight users or groups permission to open a published dashboard. Viewer access supports reading and permitted interactions; eligible authors can receive broader permissions such as co-owner access, so the permission level should match their job.",
  "whyItMatters": "Publishing makes a dashboard asset, but sharing determines its audience. Group-based sharing and least privilege make access easier to review as staff join, leave, or change roles.",
  "workplaceExample": "A business intelligence owner publishes a staffing dashboard and grants Viewer access to the Operations-Managers group. Two reporting authors receive only the additional access they need to maintain the dashboard, while dataset RLS limits each manager's rows.",
  "examFocus": "Separate three ideas: publishing creates the dashboard, sharing grants access to the asset, and dataset security limits visible data. A shared-view link preserves selected filter state but still requires the recipient to have dashboard permission.",
  "keyPoints": [
    "A dashboard can be shared with active users and groups in the Quick account.",
    "Readers can receive Viewer access, while eligible authors can have Viewer or Co-owner access.",
    "Viewer interactions such as filtering and sorting do not edit the published dashboard.",
    "Sharing with groups is generally easier to govern than maintaining many individual grants.",
    "Dashboard permission does not replace row-level or column-level dataset controls.",
    "A link to a dashboard or saved view does not bypass the recipient's required permissions."
  ],
  "commonMistake": "Do not assume that sending the dashboard URL grants access, or that granting dashboard access automatically limits its rows. Explicitly manage the dashboard audience and independently validate the dataset's security rules.",
  "example": "Publish the approved dashboard, grant Viewer access to a managed finance-reader group, reserve Co-owner access for maintainers, test opening it as a reader, and schedule periodic reviews of group membership and asset permissions.",
  "sources": [
    {
      "title": "Granting users and groups access to a dashboard",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/share-a-dashboard-grant-access-users.html"
    },
    {
      "title": "Sharing your view of a dashboard",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/share-dashboard-view.html"
    }
  ]
});
