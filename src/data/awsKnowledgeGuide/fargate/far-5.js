import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-5",
  "title": "Fargate Task CPU and Memory Configuration",
  "plainEnglish": "In AWS Fargate, compute resources are allocated at the task level rather than the server level. When creating an ECS task definition for Fargate, you must specify the total CPU units and memory (GB or MB) that the task requires. Fargate supports specific valid combinations of vCPU and memory (from 0.25 vCPU with 0.5 GB memory up to 16 vCPU with 120 GB memory), and these resources are shared among all containers inside that task.",
  "whyItMatters": "Because Fargate bills you directly for the exact vCPU and memory configured in your task definition, choosing the appropriate resource tier prevents overpaying for idle capacity or causing containers to crash due to out-of-memory (OOM) errors.",
  "workplaceExample": "A backend team profiles their Java Spring Boot application and discovers it requires 1.5 GB of RAM during startup and under 0.8 vCPU at peak load. In their Fargate task definition, they configure task CPU as '1024' (1 vCPU) and task memory as '3072' (3 GB), which falls into a supported Fargate ratio, preventing JVM garbage collection thrashing and keeping costs low.",
  "examFocus": "Know that for Fargate tasks, task-level CPU and memory are required parameters (specified in CPU units where 1024 units = 1 vCPU). Understand that Fargate only allows specific predefined combinations of CPU and memory (e.g., 0.25 vCPU supports 0.5 GB, 1 GB, 2 GB; 1 vCPU supports 2 GB to 8 GB). Container-level CPU/memory limits are optional and cannot exceed the task-level totals.",
  "keyPoints": [
    "Task-level 'cpu' and 'memory' parameters are mandatory in ECS task definitions when using the FARGATE launch type.",
    "CPU is measured in CPU units (where 256 units = 0.25 vCPU, 512 units = 0.5 vCPU, 1024 units = 1 vCPU, up to 16384 units = 16 vCPU).",
    "Memory must match one of the predefined valid ranges supported for the chosen CPU allocation (e.g., 2 vCPU supports 4 GB to 16 GB).",
    "Individual containers inside a multi-container task can specify optional container-level memory limits (soft/hard) within the task-level ceiling.",
    "If a container exceeds its memory allocation or the task-level memory limit, the Linux kernel terminates the container with an Out of Memory (OOM) exit code 137.",
    "Supports both x86_64 and ARM64 (AWS Graviton2) CPU architectures, allowing up to 40% better price-performance with Graviton."
  ],
  "commonMistake": "Specifying unsupported CPU and memory combinations (such as 0.25 vCPU with 8 GB of RAM) in a Fargate task definition, which will cause task registration or service creation to fail with a validation error.",
  "example": "Define valid CPU and memory in an ECS task definition JSON: {\"cpu\": \"1024\", \"memory\": \"2048\", \"runtimePlatform\": {\"cpuArchitecture\": \"ARM64\", \"operatingSystemFamily\": \"LINUX\"}, \"requiresCompatibilities\": [\"FARGATE\"]}.",
  "sources": [
    {
      "title": "Task CPU and Memory Parameters on AWS Fargate",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html"
    },
    {
      "title": "Amazon ECS Task Definition CPU and Memory Errors",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html"
    }
  ]
});
