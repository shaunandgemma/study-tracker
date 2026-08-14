import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-6',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Direct Connect Locations',
  status: 'ready',
  plainEnglish: 'An AWS Direct Connect Location (also known as a Point of Presence or PoP) is a third-party colocation data center or facility where AWS network equipment is installed. To set up Direct Connect, your organization or partner network provider runs a physical cross-connect fiber cable from your router inside the facility to the AWS Direct Connect port inside the same facility. From there, AWS routes your traffic across its global network backbone to any AWS region worldwide.',
  whyItMatters: 'Direct Connect Locations bridge the gap between physical corporate infrastructure and AWS virtual private clouds. Choosing a location close to your on-premises data center minimizes physical latency and fiber installation costs.',
  workplaceExample: 'A manufacturing company with a data center in Chicago orders a Direct Connect connection at an Equinix colocation facility in Chicago. Once the cross-connect cable is plugged into the AWS rack inside the facility, their Chicago data center gains direct access to AWS resources in us-east-1 and us-west-2 over the AWS network backbone.',
  examFocus: 'For SAA-C03, understand that a Direct Connect connection at a single Direct Connect Location provides access to AWS resources in ALL public AWS regions (except AWS GovCloud and China) via a Direct Connect Gateway. To build high availability, deploy connections across MULTIPLE distinct Direct Connect Locations.',
  keyPoints: [
    'Physical colocation facilities housing AWS Direct Connect hardware.',
    'Requires ordering a physical fiber cross-connect cable within the facility.',
    'Connects to AWS global backbone to reach any public AWS region via Direct Connect Gateway.',
    'Location selection impacts physical latency and fiber provisioning timelines.',
    'Using multi-location Direct Connect setups guards against facility-level outages.'
  ],
  commonMistake: 'Believing a Direct Connect connection at a location in Virginia can only access resources in the us-east-1 region. Using a Direct Connect Gateway, that connection can reach VPCs in any AWS region globally.',
  example: 'Location Connection Setup:\nFacility: Equinix Ashburn (DC2)\nAWS Port Speed: 10 Gbps Dedicated\nCross-Connect LOA-CFA: Issued by AWS, completed by Equinix technician.',
  sources: [
    { title: 'AWS Direct Connect Locations', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html' }
  ]
});
