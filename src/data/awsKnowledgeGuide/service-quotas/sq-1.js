import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-service-quotas",
  "topicTitle": "AWS Service Quotas",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "sq-1",
  "title": "Service Quotas Review & Increase Requests",
  "plainEnglish": "AWS Service Quotas is a central place to review supported AWS quotas and request increases for adjustable ones. A service quota is a maximum resource amount or operation rate. The AWS default is the starting value; the applied quota is the value currently assigned at the relevant account or resource scope. The service name, service code, quota name, quota code, scope, and Region identify the exact quota being reviewed.",
  "whyItMatters": "Deployments, scaling events, and disaster recovery can fail when planned demand plus existing usage exceeds an applied quota. Reviewing quotas early provides time to justify an increase, follow its request status, adjust the design if it is rejected or only partly approved, and validate the final applied value before deployment.",
  "workplaceExample": "A platform team is preparing a new production environment and a separate recovery Region. For each account and Region, it inventories the resources the pipeline will create, retrieves the applicable quota codes and applied values, measures current usage, includes forecast growth and failover demand, and submits only the required adjustable-quota requests well before launch.",
  "examFocus": "Know the difference between default and applied quota values, adjustable and non-adjustable quotas, and account-level and supported resource-level requests. Approval is not guaranteed. A Regional increase applies only in that Region and account unless the service documentation says otherwise; global quotas follow their documented request scope.",
  "keyPoints": [
    "Service quotas were historically called limits, but service quota is the current term.",
    "Not every AWS service or quota is visible or adjustable through Service Quotas.",
    "A request needs the exact account, Region, service code, quota code, scope, and justified desired value.",
    "Support can approve, deny, or partially approve an increase, and processing can take time.",
    "Request history shows pending and resolved states and can link to a support case when applicable.",
    "CloudWatch utilization and alarms are available only when the relevant usage metric is published.",
    "An Organizations quota request template submits selected requests for new member accounts; it does not update existing accounts.",
    "Raising a quota increases possible scale and cost exposure, so request permissions should use least privilege."
  ],
  "commonMistake": "Submitting a request for one account or Region and assuming every deployment scope now has the same value leaves recovery plans exposed. Recheck the exact applied quota in every participating account and Region after the request is resolved.",
  "example": "For a planned deployment, record current usage U, additional deployment demand D, justified growth headroom H, and failover demand F. Compare U + D + H + F with the applied quota Q in each target scope. If the requirement exceeds Q, confirm adjustability and the current codes, request a justified value early, track its status, and block deployment until the applied value is sufficient.",
  "sources": [
    {
      "title": "What is AWS Service Quotas?",
      "url": "https://docs.aws.amazon.com/servicequotas/latest/userguide/intro.html"
    },
    {
      "title": "Requesting a Quota Increase in AWS Service Quotas",
      "url": "https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html"
    },
    {
      "title": "Verifying your quota request",
      "url": "https://docs.aws.amazon.com/servicequotas/latest/userguide/quota-history.html"
    },
    {
      "title": "Using Service Quotas request templates",
      "url": "https://docs.aws.amazon.com/servicequotas/latest/userguide/organization-templates.html"
    }
  ]
});
