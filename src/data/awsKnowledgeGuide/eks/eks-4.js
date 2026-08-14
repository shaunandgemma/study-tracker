import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-4",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Persistent Storage Drivers (EBS CSI Driver & EFS CSI Driver)",
  "status": "ready",
  "plainEnglish": "EKS Persistent Storage Drivers are standard Container Storage Interface (CSI) plugins that allow Kubernetes Pods running on Amazon EKS to dynamically provision and mount stateful AWS storage volumes. (1) The Amazon EBS CSI Driver provisions high-performance block storage volumes (e.g. `gp3`, `io2`) for single-pod workloads (`ReadWriteOnce`), bound to a single Availability Zone. (2) The Amazon EFS CSI Driver provisions managed elastic file systems (`ReadWriteMany`) that can be simultaneously mounted and shared across hundreds of pods running in multiple Availability Zones.",
  "whyItMatters": "Containers are ephemeral by default—when a container restarts or is rescheduled to a new worker node, its local disk data is wiped out. CSI drivers enable stateful applications (such as databases, CMS file uploads, data processing pipelines, and Git runners) to maintain persistent storage across container lifecycles.",
  "workplaceExample": "A company deploys a content management system (WordPress) on EKS. The WordPress web frontend pods scale across 3 Availability Zones and mount a shared Amazon EFS file system using the EFS CSI driver (`ReadWriteMany`) so all pods share the same uploaded images. The MySQL database pod runs on an EC2 worker node and attaches an Amazon EBS `gp3` volume via the EBS CSI driver (`ReadWriteOnce`) for high-speed transaction logging.",
  "examFocus": "For SAA-C03, compare the storage access modes: (1) `EBS CSI Driver`: Provides `ReadWriteOnce (RWO)` access mode. Locked to a SINGLE Availability Zone (an EBS volume cannot attach to pods in different AZs). (2) `EFS CSI Driver`: Provides `ReadWriteMany (RWX)` access mode. Can be mounted across MULTIPLE Availability Zones simultaneously. (3) CSI Drivers are installed as EKS Add-ons and use IRSA for IAM permissions.",
  "keyPoints": [
    "CSI plugins enable Kubernetes Pods to attach AWS persistent storage volumes dynamically.",
    "Amazon EBS CSI Driver: Block storage, high IOPS, `ReadWriteOnce (RWO)`, single-AZ bound.",
    "Amazon EFS CSI Driver: Shared NFS file storage, `ReadWriteMany (RWX)`, multi-AZ accessible.",
    "Installed as managed Amazon EKS Add-ons with automated lifecycle updates.",
    "Requires IAM Roles for Service Accounts (IRSA) to grant permissions to provision AWS storage.",
    "Kubernetes StorageClasses define automated volume provisioning parameters (e.g. volumeType: gp3)."
  ],
  "commonMistake": "Attempting to mount an Amazon EBS volume to multiple pods running across different Availability Zones. EBS volumes are strictly single-AZ block devices; use Amazon EFS with the EFS CSI Driver if multiple pods across AZs need to share the same file system.",
  "example": "apiVersion: storage.k8s.io/v1\nkind: StorageClass\nmetadata:\n  name: ebs-gp3-sc\nprovisioner: ebs.csi.aws.com\nvolumeBindingMode: WaitForFirstConsumer\nparameters:\n  type: gp3\n  encrypted: \"true\"",
  "sources": [
    {
      "title": "Amazon EBS CSI Driver for Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html"
    },
    {
      "title": "Amazon EFS CSI Driver for Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/efs-csi.html"
    }
  ]
});
