import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-10",
  "title": "EMR on EKS",
  "plainEnglish": "Amazon EMR on EKS enables organizations to run open-source big-data analytics frameworks (such as Apache Spark) on Amazon Elastic Kubernetes Service (EKS). It decouples analytics applications from dedicated EC2 clusters, allowing Spark drivers and executors to run as containerized pods on a shared, centralized Kubernetes cluster.",
  "whyItMatters": "Enterprises often operate centralized Kubernetes clusters for microservices, web applications, and machine learning pipelines. EMR on EKS allows data platform teams to share the same EKS compute infrastructure and operations tooling across analytics and standard microservices, improving hardware utilization, reducing infrastructure costs, and standardizing container deployments.",
  "workplaceExample": "A SaaS engineering department maintains a multi-tenant Amazon EKS cluster across several Availability Zones. Rather than provisioning independent EMR on EC2 clusters for each developer team, they register an EMR virtual cluster with a designated Kubernetes namespace, letting engineers submit Spark jobs that spin up Kubernetes pods instantly alongside web services.",
  "examFocus": "Recognize EMR on EKS as the solution for running Spark workloads on existing Kubernetes (EKS) infrastructure. Understand the concept of 'Virtual Clusters' (an EMR construct mapped to a Kubernetes namespace) and know that it provides the performance-optimized Amazon EMR runtime for Spark inside container images.",
  "keyPoints": [
    "EMR on EKS runs Apache Spark applications in container pods scheduled on Amazon Elastic Kubernetes Service (EKS).",
    "Uses the concept of a 'Virtual Cluster', which registers an EMR target mapped directly to an existing EKS namespace.",
    "Includes the performance-optimized Amazon EMR runtime for Apache Spark, delivering up to 3x faster performance than open-source Spark on Kubernetes.",
    "Enables unified infrastructure management, consolidating analytics workloads and containerized microservices onto shared Kubernetes node pools.",
    "Supports custom Docker images for Spark jobs, giving developers total control over language libraries, dependencies, and OS packages.",
    "Leverages Kubernetes native features such as namespaces, resource quotas, Karpenter/Cluster Autoscaler, and AWS IAM Roles for Service Accounts (IRSA)."
  ],
  "commonMistake": "Thinking EMR on EKS provisions dedicated EC2 virtual machines via the EMR console. EMR on EKS requires an existing Amazon EKS cluster and schedules Spark workloads as Kubernetes pods; node scaling is handled by Kubernetes autoscalers (such as Karpenter or Cluster Autoscaler).",
  "example": "Register a virtual cluster using the AWS CLI: aws emr-containers create-virtual-cluster --name 'analytics-virtual-cluster' --container-provider '{\"id\":\"my-eks-cluster\",\"type\":\"EKS\",\"info\":{\"eksInfo\":{\"namespace\":\"spark-jobs\"}}}' and submit jobs with start-job-run.",
  "sources": [
    {
      "title": "What is Amazon EMR on EKS?",
      "url": "https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/what-is-eks.html"
    },
    {
      "title": "Virtual Clusters in Amazon EMR on EKS",
      "url": "https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/virtual-cluster.html"
    }
  ]
});
