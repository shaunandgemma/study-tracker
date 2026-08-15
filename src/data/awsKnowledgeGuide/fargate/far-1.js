import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-1",
  "title": "Serverless Compute for Containers",
  "plainEnglish": "AWS Fargate is a serverless, pay-as-you-go compute engine for containers that allows you to run applications without managing the underlying virtual servers. Instead of provisioning, configuring, and scaling Amazon EC2 instances to host your containers, you package your application into a container, specify resource requirements (CPU and memory), and Fargate runs the container in an isolated environment.",
  "whyItMatters": "Managing container host instances requires continuous operational effort, including patching operating systems, configuring Docker daemons, scaling server clusters, and handling hardware degradation. AWS Fargate removes this undifferentiated heavy lifting, allowing engineering teams to focus purely on building and operating containerized microservices.",
  "workplaceExample": "A fintech development team packages a microservice into a Docker container. Instead of calculating how many EC2 instances to provision and setting up EC2 auto-scaling policies, they deploy their container directly to AWS Fargate, which automatically allocates the required compute capacity and bills them only for the seconds the task executes.",
  "examFocus": "Understand that AWS Fargate is a compute engine, not a container orchestrator. It works alongside orchestrators like Amazon ECS and Amazon EKS. Remember that each Fargate task runs in its own dedicated, isolated microVM kernel boundary, providing tenant-level security isolation without shared host kernels.",
  "keyPoints": [
    "AWS Fargate provides serverless compute capacity for container workloads running on Amazon ECS or Amazon EKS.",
    "Eliminates the operational overhead of provisioning, patching, updating, and scaling clusters of Amazon EC2 instances.",
    "Each Fargate task or pod runs inside its own dedicated microVM, ensuring strict kernel-level security isolation between workloads.",
    "Billed on a per-second basis based on the exact vCPU, memory, and optional ephemeral storage allocated to each running task.",
    "Supports both Linux (x86_64 and ARM64 AWS Graviton architectures) and Windows Server containers on Amazon ECS.",
    "Requires container definitions to specify task-level CPU and memory combinations supported by the Fargate platform."
  ],
  "commonMistake": "Thinking AWS Fargate is a container orchestrator that replaces Amazon ECS or Kubernetes. Orchestration (scheduling, service discovery, rolling deployments) is still handled by ECS or EKS; Fargate simply executes the containers without EC2 server management.",
  "example": "Create an ECS task definition specifying requiresCompatibilities as [\"FARGATE\"], networkMode as \"awsvpc\", cpu as \"512\", and memory as \"1024\", then launch the service on an ECS cluster without registering any EC2 instances.",
  "sources": [
    {
      "title": "AWS Fargate on Amazon ECS",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html"
    },
    {
      "title": "Amazon ECS Launch Types and Fargate",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html"
    }
  ]
});
