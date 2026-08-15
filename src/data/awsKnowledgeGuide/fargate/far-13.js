import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-13",
  "title": "Fargate Ephemeral Storage",
  "plainEnglish": "Fargate Ephemeral Storage is temporary, local scratch disk space attached to every Fargate task. Each Amazon ECS task running on Fargate automatically receives 20 GiB of free ephemeral storage by default. On Fargate platform version 1.4.0 or later (Linux), you can configure this temporary disk space up to a maximum of 200 GiB.",
  "whyItMatters": "Many containerized workloads (such as image resizing, machine learning model inference, archive decompression, and ETL data staging) need large local scratch space during execution. Fargate ephemeral storage provides fast, encrypted local NVMe disk access without requiring an external networked file system.",
  "workplaceExample": "A document conversion microservice running on Fargate downloads 50 GiB zipped PDF archives, unzips them locally, performs optical character recognition (OCR), and uploads the output to Amazon S3. In their task definition, the team specifies ephemeralStorage sizeInGiB as 100, providing sufficient local scratch room for parallel extraction.",
  "examFocus": "Know that Fargate tasks receive 20 GiB of ephemeral storage by default (free of charge) and can be configured up to 200 GiB (billed per GB above 20 GiB). Crucially, ephemeral storage is temporary and encrypted with AWS-managed keys; when the task stops or terminates, all data stored on the ephemeral disk is permanently deleted. For persistent data, use Amazon EFS.",
  "keyPoints": [
    "Every Fargate task receives 20 GiB of free ephemeral storage by default.",
    "Configurable up to 200 GiB per task on Fargate Platform Version 1.4.0 or later for Linux tasks.",
    "Storage is automatically encrypted at rest using AWS Key Management Service (AWS KMS) with AWS-managed keys.",
    "Data is strictly ephemeral: when the task stops, crashes, or is replaced, all local disk data is permanently destroyed.",
    "Shared among all containers defined inside the same ECS task definition via local mount points or bind mounts.",
    "Charges apply only for ephemeral storage provisioned beyond the default 20 GiB baseline per task.",
    "Windows containers on Fargate also support configurable ephemeral storage starting from platform version 1.0.0."
  ],
  "commonMistake": "Using Fargate ephemeral storage for application state that must survive container restarts or be shared across multiple running tasks. Ephemeral storage is strictly local and temporary; use Amazon EFS for durable, cross-task persistent storage.",
  "example": "Configure 100 GiB of ephemeral storage in an ECS task definition JSON: {\"family\": \"ocr-worker\", \"requiresCompatibilities\": [\"FARGATE\"], \"cpu\": \"1024\", \"memory\": \"2048\", \"ephemeralStorage\": {\"sizeInGiB\": 100}, \"containerDefinitions\": [...]}.",
  "sources": [
    {
      "title": "Amazon ECS Task Storage with AWS Fargate",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-storage.html"
    },
    {
      "title": "Configuring Ephemeral Storage for Fargate Tasks",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html"
    }
  ]
});
