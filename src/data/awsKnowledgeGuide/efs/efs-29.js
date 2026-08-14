import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-efs",
  "topicTitle": "Amazon EFS (Elastic File System)",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "efs-29",
  "title": "EFS with Amazon ECS and Fargate",
  "plainEnglish": "Amazon Elastic Container Service (ECS) tasks can mount EFS as a volume, including tasks on AWS Fargate. The task definition describes the volume and maps it into a container, so replacement tasks can continue using the same files.",
  "whyItMatters": "A container filesystem normally disappears when its task stops. EFS is useful when several tasks need the same durable files or data must remain independent of the host.",
  "workplaceExample": "A web application runs as several Fargate tasks across Availability Zones. Every task mounts an EFS access point at /srv/uploads, so customers see the same files after scaling or task replacement.",
  "examFocus": "Choose EFS when ECS tasks need shared persistent files. Expect an EFS task-definition volume, reachable mount targets, NFS port 2049 rules, and optional access-point plus task-role IAM authorization. Fargate supports EFS on Linux platform version 1.4.0 or later.",
  "keyPoints": [
    "EFS capacity changes with stored files, independently of the ECS task lifecycle.",
    "A task definition references the EFS volume and a container mount point.",
    "Tasks across a fleet can access the same persistent data regardless of where they run.",
    "Fargate uses a small supervisor container to manage the EFS volume.",
    "An access point can enforce an application root directory and POSIX user identity.",
    "The task network must reach a mount target on TCP port 2049; IAM authorization does not replace this path."
  ],
  "commonMistake": "When an access point is referenced, setting a different EFS root directory is incorrect. The task definition root must be omitted or set to / so the access point path is enforced.",
  "example": "Define an EFS volume with transit encryption and an application access point, mount it at /data, allow TCP 2049 from tasks to mount targets, and grant the task role only required client actions.",
  "sources": [
    {
      "title": "Use Amazon EFS volumes with Amazon ECS",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/efs-volumes.html"
    },
    {
      "title": "Best practices for using Amazon EFS with Amazon ECS",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/efs-best-practices.html"
    }
  ]
});
