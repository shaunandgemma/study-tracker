import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ta-1',
  topicId: 'topic-trusted-advisor',
  topicTitle: 'AWS Trusted Advisor',
  objectiveCode: 'Management',
  title: '5 Optimization Pillars: Cost Optimization, Performance, Security, Fault Tolerance, Service Limits',
  status: 'ready',
  plainEnglish: 'AWS Trusted Advisor examines supported parts of an AWS account and compares what it finds with AWS best-practice checks. Its five original optimisation areas are cost optimisation, performance, security, fault tolerance, and service limits. The current Trusted Advisor console also has an Operational Excellence category. A result is a recommendation to investigate; it is not an automatic change, a complete security audit, or proof that a workload is well architected.',
  whyItMatters: 'The categories help teams review an environment from several angles instead of optimising only cost or only security. An inexpensive system can still be fragile, and a highly available system can still expose data or approach a quota. Engineers use the categories as a repeatable starting point, then validate every recommendation against workload requirements and change-control procedures.',
  workplaceExample: 'During a monthly cloud review, a platform team separates Trusted Advisor results by category. Finance owns idle-resource investigations, operations reviews performance and quota warnings, security validates exposure findings, and service teams assess fault-tolerance recommendations before scheduling approved changes.',
  examFocus: 'SAA-C03 category recognition:\n- Cost optimisation identifies possible waste and savings opportunities.\n- Performance highlights configurations that might restrict workload performance.\n- Security identifies supported settings that could weaken security.\n- Fault tolerance highlights resilience and availability risks.\n- Service limits warns when usage approaches supported quotas.\n- Operational Excellence is an additional current category focused on operational practices.',
  keyPoints: [
    'Trusted Advisor evaluates supported resources and account settings against AWS-authored checks.',
    'The five original areas are cost optimisation, performance, security, fault tolerance, and service limits.',
    'The current check reference also includes Operational Excellence as a category.',
    'A recommendation identifies something to review; it does not safely remediate the resource automatically.',
    'Available checks and refresh behaviour depend on the AWS Support plan and on the individual check.',
    'Trusted Advisor complements, but does not replace, Well-Architected reviews, monitoring, security services, or human judgement.'
  ],
  commonMistake: 'Treating a green Trusted Advisor summary as proof that the entire account is secure, resilient, performant, and cost optimised. Trusted Advisor covers defined checks only, so risks outside those checks still require other controls and reviews.',
  example: 'A red security result is prioritised for immediate validation, a yellow service-quota result triggers capacity planning, and an idle-instance cost result is checked with the application owner before any instance is stopped. Each category leads to a different investigation rather than an automatic bulk change.',
  sources: [
    { title: 'AWS Trusted Advisor check reference and categories', url: 'https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor-check-reference.html' },
    { title: 'AWS Trusted Advisor overview', url: 'https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html' }
  ]
});
