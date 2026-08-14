import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-19',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Session Storage',
  status: 'ready',
  plainEnglish: 'ElastiCache Session Storage is a common architectural design pattern where user HTTP session data (such as login tokens, shopping cart contents, or user preferences) is stored in a centralized ElastiCache in-memory cluster rather than on local web server disks.',
  whyItMatters: 'If HTTP user sessions are stored locally on individual web servers, a user MUST always be routed to the exact same web server (Sticky Sessions), which breaks even load balancing and prevents Auto Scaling EC2 instances from scaling in or out smoothly.',
  workplaceExample: 'An online retailer offloads all web session state to an ElastiCache Redis cluster. During a flash sale, Auto Scaling adds 50 new EC2 web servers. Because session state is stored in ElastiCache, any web server can handle any user request seamlessly.',
  examFocus: 'SAA-C03 Session State Architecture:\n- Local Web Server Session Storage: Requires Sticky Sessions (ALB Cookie Affinity). Disadvantage: Uneven load balancing, lost sessions during server terminate/scale-in.\n- ElastiCache Session Storage: Centralized in-memory session store. Advantage: Completely stateless web tier, perfectly even load balancing, seamless Auto Scaling.',
  keyPoints: [
    'Centralizes user HTTP session state in ElastiCache (Redis/Valkey/Memcached).',
    'Renders the web server tier completely stateless.',
    'Eliminates the requirement for Application Load Balancer Sticky Sessions.',
    'Ensures smooth Auto Scaling scale-in without dropping active user logins.',
    'Delivers sub-millisecond session validation response times.'
  ],
  commonMistake: 'Relying on local web server memory for user session state, causing users to be logged out whenever Auto Scaling terminates an EC2 instance.',
  example: 'Session Key Format in ElastiCache:\n`Key: "session:user_88392"` -> `Value: {"user_id": 88392, "cart_items": [101, 204], "authenticated": true}` (TTL: 1800s).',
  sources: [
    { title: 'Caching Strategies for Amazon ElastiCache', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Strategies.html' }
  ]
});
