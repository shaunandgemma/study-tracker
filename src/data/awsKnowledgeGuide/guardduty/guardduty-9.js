import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "guardduty-9",
  "title": "EKS Protection",
  "plainEnglish": "Amazon GuardDuty EKS Protection detects threats and suspicious behavior within Amazon Elastic Kubernetes Service (Amazon EKS) clusters. It works at both the Kubernetes control plane level (analyzing Amazon EKS audit logs for unauthorized Kubernetes API requests) and the container runtime level (via GuardDuty EKS Runtime Monitoring to detect host-level anomalies, file system modifications, and malicious processes inside running containers).",
  "whyItMatters": "Containerized workloads face unique Kubernetes-specific attack vectors, such as compromised service accounts, malicious container images, unauthorized cluster role bindings, and cryptojacking pods. EKS Protection provides end-to-end security visibility from Kubernetes control plane operations down to operating system syscalls within container pods.",
  "workplaceExample": "An attacker compromises a developer's kubeconfig credentials and calls the Kubernetes API to create a privileged pod running an unauthorized cryptocurrency miner image. GuardDuty EKS Audit Log Monitoring immediately generates a PrivilegeEscalation:Kubernetes/PrivilegedPod finding, and EKS Runtime Monitoring detects the mining binary executing inside the container.",
  "examFocus": "Distinguish between EKS Audit Log Monitoring (control plane monitoring that analyzes Kubernetes API audit logs without deploying agents) and EKS Runtime Monitoring (host-level agent deployed as a DaemonSet or managed add-on to inspect container file access, process execution, and network connections).",
  "keyPoints": [
    "EKS Audit Log Monitoring analyzes Amazon EKS control plane audit logs directly from the managed Kubernetes control plane with zero agent overhead.",
    "EKS Runtime Monitoring deploys an automated lightweight security agent (DaemonSet) to monitor process execution, file access, and socket syscalls in real time.",
    "Detects suspicious Kubernetes API actions such as privileged pod launches, suspicious ClusterRoleBindings, and anonymous API calls.",
    "Identifies container runtime threats including reverse shells, cryptocurrency miners, suspicious file execution from /tmp, and host path mounts.",
    "Requires no manual ingestion or configuration of CloudWatch log groups for EKS audit log analysis.",
    "Can be enabled centrally across all Amazon EKS clusters in an AWS Organization using the Delegated Administrator account."
  ],
  "commonMistake": "Believing EKS Audit Log Monitoring alone will catch malicious binary execution inside a container pod. Audit log monitoring sees Kubernetes API requests (control plane); detecting actual malware execution or suspicious shell activity inside a running pod requires EKS Runtime Monitoring.",
  "example": "Enable EKS Audit Log Monitoring and EKS Runtime Monitoring in GuardDuty via the AWS CLI: aws guardduty update-detector --detector-id 12abc34d567e8fa9012bc34de5678901 --features '[{\"Name\":\"EKS_AUDIT_LOGS\",\"Status\":\"ENABLED\"},{\"Name\":\"EKS_RUNTIME_MONITORING\",\"Status\":\"ENABLED\"}]'.",
  "sources": [
    {
      "title": "Amazon GuardDuty EKS Protection",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/eks-protection.html"
    },
    {
      "title": "Kubernetes Finding Types in Amazon GuardDuty",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-kubernetes.html"
    }
  ]
});
