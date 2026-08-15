import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-15',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'DDoS Cost Protection',
  status: 'ready',
  plainEnglish: 'DDoS Cost Protection is a financial benefit included with AWS Shield Advanced that protects organizations against unexpected AWS bill spikes caused by DDoS attacks. If attack traffic causes protected resources (such as Amazon EC2 Auto Scaling groups, Application Load Balancers, CloudFront, or Route 53) to scale up automatically and incur surge charges, AWS provides service credits to reimburse the extra scaling costs.',
  whyItMatters: 'A massive DDoS attack can force EC2 Auto Scaling groups to scale up to hundreds of instances, generating thousands of dollars in unexpected compute and bandwidth charges. DDoS Cost Protection ensures security incidents do not result in financial devastation.',
  workplaceExample: 'An enterprise e-commerce platform suffers a 3-day DDoS attack. EC2 Auto Scaling expands from 10 to 200 instances to handle traffic, generating $12,000 in unexpected compute charges. The customer submits a cost protection request, and AWS issues $12,000 in service credits.',
  examFocus: 'SAA-C03 Cost Protection Eligibility & Workflow:\n- Covered Resources: EC2, CloudFront, Elastic Load Balancing, Global Accelerator, and Route 53 protected by Shield Advanced.\n- Claim Process: Open an AWS Support case requesting DDoS Cost Protection credits for the specific attack timeframe.\n- Architecture Prerequisite: Resources MUST be explicitly added as protected resources under Shield Advanced BEFORE the attack occurs.',
  keyPoints: [
    'Financial protection reimbursing scaling charges caused by DDoS attack traffic.',
    'Provides AWS service credits for scaling surges on EC2, ELB, CloudFront, and Route 53.',
    'Protects against unexpected cloud bill spikes resulting from malicious traffic floods.',
    'Requires resources to be explicitly protected under Shield Advanced prior to the attack.',
    'Claimed by submitting an AWS Support request with incident event telemetry.'
  ],
  commonMistake: 'Assuming DDoS Cost Protection automatically reimburses scaling costs for unprotected resources or resources added to Shield Advanced after an attack ends.',
  example: 'Submitting a DDoS Cost Protection Claim:\nClaims are submitted via AWS Support Console referencing the Shield Event ID and affected AWS bill billing period.',
  sources: [
    { title: 'DDoS cost protection for AWS Shield Advanced', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-advanced-summary.html' }
  ]
});
