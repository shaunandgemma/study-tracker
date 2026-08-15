import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-4",
  "title": "Fargate vs ECS on EC2",
  "plainEnglish": "When running containers on Amazon ECS, you can choose between two primary launch types: AWS Fargate (serverless compute where AWS manages the underlying infrastructure) and Amazon EC2 (where you manage the virtual machines in your ECS cluster). Fargate prioritizes operational simplicity and isolation, while ECS on EC2 offers deep hardware customization and host-level control.",
  "whyItMatters": "Choosing between Fargate and EC2 launch types dictates your team's operational overhead, architectural constraints, and cost structure. Fargate is optimal for unpredictable workloads, standard microservices, and teams wanting to eliminate server patching. EC2 is required for specialized hardware (such as GPU instances), daemon services running on every host, custom AMIs, or extreme high-density bin-packing for predictable baseline workloads.",
  "workplaceExample": "A SaaS company runs two tiers: their standard web REST APIs and background queue processors run on Fargate for zero server maintenance, while their heavy video-encoding and 3D rendering pipeline runs on ECS on EC2 with GPU-enabled g5 instances and custom Linux AMIs containing proprietary codecs.",
  "examFocus": "Know when to choose Fargate vs. EC2 for ECS: Choose Fargate for standard stateless web apps/microservices, variable traffic, fast scaling without managing AMIs, and strong security isolation. Choose EC2 when you need GPU hardware, ARM/x86 host tuning, daemon services (one container per host), custom EBS volume attachments, or deeply discounted reserved/savings plan EC2 pricing with high bin-packing.",
  "keyPoints": [
    "AWS Fargate eliminates EC2 instance provisioning, OS patching, Docker daemon maintenance, and cluster capacity planning.",
    "ECS on EC2 gives full administrative access (SSH/SSM) to underlying host instances, custom AMIs, and host-level system configurations.",
    "Fargate tasks strictly use 'awsvpc' networking, whereas EC2 supports bridge, host, macvlan, none, and awsvpc network modes.",
    "ECS on EC2 supports Daemon task placement strategies (running one copy of a task per container instance), which Fargate does not support.",
    "ECS on EC2 is required for GPU-accelerated workloads (e.g., P and G instance families) and specific niche EBS volume attachment configurations.",
    "Cost trade-off: Fargate charges per second for exact task vCPU/memory; EC2 charges for full instances regardless of container packing density."
  ],
  "commonMistake": "Assuming Fargate is always cheaper than ECS on EC2. For stable, predictable, high-utilization 24/7 workloads with dense container bin-packing on Reserved Instances or Compute Savings Plans, ECS on EC2 can have a lower raw compute cost per container.",
  "example": "Configure an ECS cluster with both FARGATE and EC2 capacity providers, routing unpredictable web-tier microservices to FARGATE and batch GPU rendering tasks to an EC2 Auto Scaling group capacity provider.",
  "sources": [
    {
      "title": "Amazon ECS Launch Types Comparison",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html"
    },
    {
      "title": "AWS Fargate vs Amazon EC2 for Amazon ECS",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html"
    }
  ]
});
