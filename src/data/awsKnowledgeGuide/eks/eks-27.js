import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-27",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS with EBS",
  "status": "ready",
  "plainEnglish": "Amazon EKS with Amazon EBS allows stateful Kubernetes pods to dynamically provision, attach, and persist data using dedicated Amazon Elastic Block Store (EBS) volumes via the Amazon EBS CSI (Container Storage Interface) driver. Whenever a stateful pod requests persistent storage using a Kubernetes `PersistentVolumeClaim` (PVC), the EBS CSI driver automatically calls the AWS EC2 API to create an EBS volume (e.g. `gp3`, `io2`) and attaches it directly to the worker node hosting that pod.",
  "whyItMatters": "Databases and stateful container applications (such as PostgreSQL, Elasticsearch, Redis, and Kafka) require high IOPS, low latency, and guaranteed data persistence across pod restarts. EBS integration ensures that if a database pod is restarted or moved to another EC2 node within the same Availability Zone, the EBS volume follows the pod and reattaches automatically.",
  "workplaceExample": "A company deploys a self-hosted single-node PostgreSQL database on EKS. The database deployment uses a 500 GB `gp3` PVC with 3,000 IOPS. When Kubernetes performs a rolling node update and reschedules the PostgreSQL pod to another EC2 instance in the same AZ, the EBS CSI driver automatically detaches the volume from the old node and reattaches it to the new node with zero data loss.",
  "examFocus": "For SAA-C03, remember these key architectural properties of EBS on EKS: (1) Single-AZ limitation: EBS volumes exist in a SINGLE Availability Zone and can only attach to pods running on EC2 nodes in that SAME Availability Zone. (2) Access Mode: Supports `ReadWriteOnce` (RWO)—only one pod/node can attach the volume for read-write access at a time. (3) Not supported on AWS Fargate (use EFS for Fargate). (4) Requires `volumeBindingMode: WaitForFirstConsumer` in the StorageClass so the EBS volume is created in the exact AZ where the pod is scheduled.",
  "keyPoints": [
    "Dynamically provisions high-performance block storage volumes for Kubernetes pods.",
    "Managed via the Amazon EBS CSI Driver (installed as an Amazon EKS Add-on).",
    "Single-AZ constraint: EBS volumes can only attach to pods in the same Availability Zone.",
    "Access Mode: `ReadWriteOnce (RWO)` (single node/pod attachment).",
    "Not supported on AWS Fargate worker pods (requires EC2 worker nodes).",
    "Use `WaitForFirstConsumer` binding mode to align volume AZ with pod scheduling."
  ],
  "commonMistake": "Attempting to attach a single EBS volume to multiple pods running across different nodes in different AZs (`ReadWriteMany`). EBS only supports `ReadWriteOnce`; use Amazon EFS for multi-pod shared file storage.",
  "example": "apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: db-data-pvc\nspec:\n  accessModes:\n    - ReadWriteOnce\n  storageClassName: ebs-gp3-sc\n  resources:\n    requests:\n      storage: 100Gi",
  "sources": [
    {
      "title": "Amazon EBS CSI Driver for Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html"
    },
    {
      "title": "Configuring Persistent Storage with Amazon EBS on EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/storage.html"
    }
  ]
});
