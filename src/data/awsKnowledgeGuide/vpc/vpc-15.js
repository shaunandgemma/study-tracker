import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-15', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'Security Groups', status: 'ready',
  plainEnglish: 'A security group is a stateful virtual firewall associated with supported network interfaces and resources. Its inbound and outbound rules allow traffic by protocol, port, and source or destination. Security groups contain allow rules, not explicit deny rules, and response traffic for an allowed connection is automatically permitted by the stateful connection tracking behaviour.',
  whyItMatters: 'Security groups implement workload-level least privilege. Referencing another security group can describe trusted application relationships more safely than maintaining changing IP lists. They do not create routes, authenticate users, or inspect application content.',
  workplaceExample: 'A load-balancer security group permits HTTPS from approved clients. The application security group permits its service port only from the load-balancer security group, and the database group permits its database port only from the application group.',
  examFocus: 'SAA-C03: security groups are stateful, apply to resource interfaces, support allow rules only, evaluate all rules together, and automatically allow return traffic. A resource can use multiple groups whose rules are combined.',
  keyPoints: [
    'Security groups are stateful and automatically allow return traffic for permitted flows.',
    'Rules allow traffic; there are no numbered explicit deny rules.',
    'Inbound and outbound directions are configured separately.',
    'Multiple attached security groups combine their allowed traffic.',
    'Security-group references can express trusted resource relationships within supported boundaries.',
    'A permissive security group cannot overcome a missing route or a blocking network ACL.'
  ],
  commonMistake: 'Opening an application port to 0.0.0.0/0 because the load balancer is public, instead of allowing the backend only from the load balancer security group.',
  example: 'Web-sg allows TCP 443 from approved client ranges. App-sg allows TCP 8080 from web-sg. Db-sg allows TCP 5432 from app-sg, creating a tiered least-privilege path.',
  sources: [{ title: 'Control traffic using security groups', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html' }]
});
