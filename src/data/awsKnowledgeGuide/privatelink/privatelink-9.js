import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-9",
  "title": "Network Load Balancer for Endpoint Services",
  "plainEnglish": "A Network Load Balancer (NLB) serves as the core layer for customer-owned VPC Endpoint Services in AWS PrivateLink. Operating at Layer 4 (Transport Layer), an internal NLB receives incoming TCP and UDP connections forwarded through PrivateLink from consumer Interface Endpoints, terminates or routes the transport streams with ultra-low latency, and distributes traffic evenly across backend targets such as EC2 instances, ECS containers, or private Application Load Balancers.",
  "whyItMatters": "PrivateLink connects consumers to a single service entry point that must be highly available, ultra-low latency, and capable of scaling to millions of requests per second. The Network Load Balancer provides the required high-throughput infrastructure, health checks, and cross-zone load balancing to ensure reliable service delivery.",
  "workplaceExample": "A healthcare provider deploys an electronic health records API on Amazon ECS across 3 AZs. They configure an internal Network Load Balancer targeting the ECS containers. By attaching this NLB to a VPC Endpoint Service and enabling Proxy Protocol v2 on the NLB target group, the backend microservices receive each consumer's original client source IP and VPC endpoint ID for audit logging while maintaining multi-AZ resilience.",
  "examFocus": "Understand NLB configuration for PrivateLink endpoint services: (1) Internal Scheme: The NLB must be an internal load balancer deployed in the service provider's VPC. (2) Protocols: Supports TCP, TLS, and UDP listeners. (3) Client IP Preservation & Proxy Protocol: PrivateLink translates the source IP to the endpoint ENI's private IP; to capture the consumer's original client IP address, enable Proxy Protocol v2 on the NLB target group. (4) Cross-Zone Load Balancing: Can be enabled on the NLB to distribute traffic across targets in all AZs.",
  "keyPoints": [
    "An internal Network Load Balancer (NLB) is required to create a custom TCP/UDP VPC Endpoint Service.",
    "Operates at Layer 4 (Transport Layer) handling millions of requests per second with sub-millisecond latency.",
    "Performs continuous health checks on backend targets (EC2 instances, IP targets, or Application Load Balancers).",
    "Supports Proxy Protocol version 2 to pass the consumer's original client IP address and endpoint ID to backend targets.",
    "Distributes incoming PrivateLink connections across targets in multiple Availability Zones.",
    "Can terminate TLS at the NLB using AWS Certificate Manager (ACM) certificates or pass encrypted TCP directly to backend targets."
  ],
  "commonMistake": "Expecting backend EC2 targets behind an NLB endpoint service to see the original client IP directly without Proxy Protocol. Because PrivateLink translates source packets, backend applications must parse the Proxy Protocol v2 header to discover the actual consumer client IP.",
  "example": "Enable Proxy Protocol v2 on an NLB target group using the AWS CLI: aws elbv2 modify-target-group-attributes --target-group-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/ehr-targets/1234 --attributes Key=proxy_protocol_v2.enabled,Value=true.",
  "sources": [
    {
      "title": "Creating a VPC Endpoint Service Configuration with an NLB",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/create-endpoint-service.html"
    },
    {
      "title": "Network Load Balancers in Amazon Elastic Load Balancing",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/network-load-balancers.html"
    }
  ]
});
