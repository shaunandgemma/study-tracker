/**
 * Centralized Exam Configuration & Practice Question Data Bank
 * 
 * Single-Level Checklist Structure:
 * - Level 1: Service / Topic Header (e.g. "Amazon S3")
 * - Level 2: Flat List of Checkable Items & Sub-topics (e.g. "Amazon S3 Intelligent-Tiering", "S3 Bucket Policies")
 */

export const DEFAULT_EXAMS = [
  {
    "id": "aws-saa-c03",
    "code": "AWS SAA-C03",
    "title": "AWS Certified Solutions Architect - Associate",
    "description": "Validates technical expertise in designing and deploying scalable, highly available, and fault-tolerant systems on AWS.",
    "passingScore": 72,
    "timeLimitMinutes": 130,
    "badgeColor": "from-amber-500 to-orange-600",
    "topics": [
      {
        "id": "topic-vpc",
        "code": "Networking",
        "title": "Amazon VPC",
        "weight": 4,
        "description": "Isolated virtual network infrastructure, subnets, route tables, and security controls.",
        "items": [
          {
            "id": "vpc-1",
            "text": "VPC CIDR Sizing, Public Subnets vs Private Subnets Architecture"
          },
          {
            "id": "vpc-6",
            "text": "VPC CIDR Blocks"
          },
          {
            "id": "vpc-7",
            "text": "IPv4 and IPv6 Addressing"
          },
          {
            "id": "vpc-8",
            "text": "Public and Private Subnets"
          },
          {
            "id": "vpc-9",
            "text": "Route Tables"
          },
          {
            "id": "vpc-10",
            "text": "Main and Custom Route Tables"
          },
          {
            "id": "vpc-11",
            "text": "Internet Gateway - IGW"
          },
          {
            "id": "vpc-12",
            "text": "NAT Gateway"
          },
          {
            "id": "vpc-13",
            "text": "NAT Gateway High Availability per Availability Zone"
          },
          {
            "id": "vpc-14",
            "text": "Egress-Only Internet Gateway for IPv6"
          },
          {
            "id": "vpc-15",
            "text": "Security Groups"
          },
          {
            "id": "vpc-16",
            "text": "Network ACLs - NACLs"
          },
          {
            "id": "vpc-17",
            "text": "Security Groups vs Network ACLs"
          },
          {
            "id": "vpc-18",
            "text": "Elastic Network Interfaces - ENIs"
          },
          {
            "id": "vpc-19",
            "text": "Elastic IP Addresses"
          },
          {
            "id": "vpc-20",
            "text": "VPC DNS Resolution and DNS Hostnames"
          },
          {
            "id": "vpc-22",
            "text": "VPC Peering"
          },
          {
            "id": "vpc-23",
            "text": "VPC Peering Non-Transitive Routing"
          },
          {
            "id": "vpc-24",
            "text": "VPC Gateway Endpoints for S3 and DynamoDB"
          },
          {
            "id": "vpc-25",
            "text": "VPC Interface Endpoints with AWS PrivateLink"
          },
          {
            "id": "vpc-26",
            "text": "VPC Endpoint Policies"
          },
          {
            "id": "vpc-27",
            "text": "VPC Flow Logs"
          },
          {
            "id": "vpc-28",
            "text": "VPC Sharing with AWS RAM"
          },
          {
            "id": "vpc-30",
            "text": "VPC Reachability Analyzer"
          },
          {
            "id": "vpc-32",
            "text": "VPC Subnet Route Design"
          },
          {
            "id": "vpc-33",
            "text": "Public IP Address Requirements"
          },
          {
            "id": "vpc-34",
            "text": "Bastion Hosts and Private Instance Access"
          },
          {
            "id": "vpc-35",
            "text": "NAT Gateway vs Internet Gateway"
          },
          {
            "id": "vpc-36",
            "text": "VPC Peering vs Transit Gateway"
          },
          {
            "id": "vpc-37",
            "text": "VPC Endpoints vs NAT Gateway"
          }
        ]
      },
      {
        "id": "topic-ec2",
        "code": "Compute",
        "title": "EC2 (Elastic Compute Cloud)",
        "weight": 5,
        "description": "Virtual server instances, purchasing options, placement groups, and management.",
        "items": [
          {
            "id": "ec2-6",
            "text": "EC2 Instances"
          },
          {
            "id": "ec2-7",
            "text": "EC2 Instance Families and Workload Selection"
          },
          {
            "id": "ec2-8",
            "text": "General Purpose Instances"
          },
          {
            "id": "ec2-9",
            "text": "Compute Optimized Instances"
          },
          {
            "id": "ec2-10",
            "text": "Memory Optimized Instances"
          },
          {
            "id": "ec2-11",
            "text": "Storage Optimized Instances"
          },
          {
            "id": "ec2-12",
            "text": "Accelerated Computing Instances"
          },
          {
            "id": "ec2-13",
            "text": "EC2 On-Demand Instances"
          },
          {
            "id": "ec2-14",
            "text": "EC2 Reserved Instances"
          },
          {
            "id": "ec2-15",
            "text": "EC2 Savings Plans"
          },
          {
            "id": "ec2-16",
            "text": "EC2 Spot Instances"
          },
          {
            "id": "ec2-17",
            "text": "EC2 Dedicated Hosts"
          },
          {
            "id": "ec2-18",
            "text": "EC2 Dedicated Instances"
          },
          {
            "id": "ec2-19",
            "text": "EC2 Capacity Reservations"
          },
          {
            "id": "ec2-20",
            "text": "EC2 Spot Interruption"
          },
          {
            "id": "ec2-21",
            "text": "EC2 Spot Fleet"
          },
          {
            "id": "ec2-22",
            "text": "EC2 AMIs"
          },
          {
            "id": "ec2-23",
            "text": "Public, Private and Shared AMIs"
          },
          {
            "id": "ec2-24",
            "text": "EC2 User Data"
          },
          {
            "id": "ec2-25",
            "text": "EC2 Instance Metadata Service - IMDS"
          },
          {
            "id": "ec2-26",
            "text": "IMDSv2"
          },
          {
            "id": "ec2-27",
            "text": "EC2 Instance Profiles and IAM Roles"
          },
          {
            "id": "ec2-28",
            "text": "EC2 Security Groups"
          },
          {
            "id": "ec2-29",
            "text": "EC2 Key Pairs"
          },
          {
            "id": "ec2-30",
            "text": "EC2 Elastic Network Interfaces - ENIs"
          },
          {
            "id": "ec2-31",
            "text": "EC2 Elastic IP Addresses"
          },
          {
            "id": "ec2-32",
            "text": "EC2 Public and Private IP Addresses"
          },
          {
            "id": "ec2-33",
            "text": "EC2 Placement Groups - Cluster"
          },
          {
            "id": "ec2-34",
            "text": "EC2 Placement Groups - Spread"
          },
          {
            "id": "ec2-35",
            "text": "EC2 Placement Groups - Partition"
          },
          {
            "id": "ec2-36",
            "text": "EC2 Hibernate"
          },
          {
            "id": "ec2-37",
            "text": "EC2 Stop, Start, Reboot and Terminate"
          },
          {
            "id": "ec2-38",
            "text": "EC2 Termination Protection"
          },
          {
            "id": "ec2-39",
            "text": "EC2 Instance Store"
          },
          {
            "id": "ec2-40",
            "text": "EC2 EBS-Backed Instances"
          },
          {
            "id": "ec2-41",
            "text": "EC2 Detailed Monitoring"
          },
          {
            "id": "ec2-42",
            "text": "EC2 Status Checks"
          },
          {
            "id": "ec2-43",
            "text": "EC2 Systems Manager Integration"
          },
          {
            "id": "ec2-44",
            "text": "EC2 Auto Recovery"
          },
          {
            "id": "ec2-45",
            "text": "EC2 Launch Templates"
          },
          {
            "id": "ec2-47",
            "text": "EC2 Enhanced Networking"
          },
          {
            "id": "ec2-49",
            "text": "EC2 vs Lambda"
          },
          {
            "id": "ec2-50",
            "text": "EC2 High Availability across Availability Zones"
          }
        ]
      },
      {
        "id": "topic-s3",
        "code": "Storage",
        "title": "Amazon S3",
        "weight": 5,
        "description": "Object storage, storage classes, lifecycle policies, security, replication, encryption, and performance.",
        "items": [
          {
            "id": "s3-2",
            "text": "S3 Express One Zone (Directory Buckets for sub-millisecond data access)"
          },
          {
            "id": "s3-4",
            "text": "S3 Multi-Region Access Points (MRAP) & Route 53 Global Accelerator Anycast routing"
          },
          {
            "id": "s3-5",
            "text": "S3 Block Public Access (Account-level and Bucket-level controls)"
          },
          {
            "id": "s3-11",
            "text": "Amazon S3 Standard"
          },
          {
            "id": "s3-12",
            "text": "Amazon S3 Intelligent-Tiering"
          },
          {
            "id": "s3-13",
            "text": "Amazon S3 Standard-Infrequent Access - Standard-IA"
          },
          {
            "id": "s3-14",
            "text": "Amazon S3 One Zone-Infrequent Access - One Zone-IA"
          },
          {
            "id": "s3-15",
            "text": "Amazon S3 Glacier Instant Retrieval"
          },
          {
            "id": "s3-16",
            "text": "Amazon S3 Glacier Flexible Retrieval"
          },
          {
            "id": "s3-17",
            "text": "Amazon S3 Glacier Deep Archive"
          },
          {
            "id": "s3-18",
            "text": "Amazon S3 Express One Zone"
          },
          {
            "id": "s3-19",
            "text": "S3 Bucket Policies"
          },
          {
            "id": "s3-20",
            "text": "S3 IAM Identity-Based Policies"
          },
          {
            "id": "s3-21",
            "text": "S3 Access Control Lists - ACLs"
          },
          {
            "id": "s3-22",
            "text": "S3 Object Ownership - Bucket Owner Enforced"
          },
          {
            "id": "s3-23",
            "text": "S3 Block Public Access"
          },
          {
            "id": "s3-24",
            "text": "S3 Access Points"
          },
          {
            "id": "s3-25",
            "text": "S3 Multi-Region Access Points"
          },
          {
            "id": "s3-26",
            "text": "S3 CORS"
          },
          {
            "id": "s3-27",
            "text": "S3 Versioning"
          },
          {
            "id": "s3-28",
            "text": "S3 Object Lock"
          },
          {
            "id": "s3-29",
            "text": "S3 MFA Delete"
          },
          {
            "id": "s3-30",
            "text": "S3 Same-Region Replication - SRR"
          },
          {
            "id": "s3-31",
            "text": "S3 Cross-Region Replication - CRR"
          },
          {
            "id": "s3-32",
            "text": "S3 Replication Time Control - RTC"
          },
          {
            "id": "s3-33",
            "text": "S3 Server-Side Encryption with Amazon S3 Managed Keys - SSE-S3"
          },
          {
            "id": "s3-34",
            "text": "S3 Server-Side Encryption with AWS KMS Keys - SSE-KMS"
          },
          {
            "id": "s3-35",
            "text": "S3 Bucket Keys"
          },
          {
            "id": "s3-36",
            "text": "S3 Server-Side Encryption with Customer-Provided Keys - SSE-C"
          },
          {
            "id": "s3-37",
            "text": "S3 Client-Side Encryption"
          },
          {
            "id": "s3-38",
            "text": "S3 Enforcing HTTPS with aws:SecureTransport"
          },
          {
            "id": "s3-39",
            "text": "S3 Multipart Upload"
          },
          {
            "id": "s3-40",
            "text": "S3 Byte-Range Fetches"
          },
          {
            "id": "s3-41",
            "text": "S3 Transfer Acceleration"
          },
          {
            "id": "s3-42",
            "text": "S3 Lifecycle Rules"
          },
          {
            "id": "s3-43",
            "text": "S3 Lifecycle Transitions"
          },
          {
            "id": "s3-44",
            "text": "S3 Lifecycle Expiration"
          },
          {
            "id": "s3-45",
            "text": "S3 Incomplete Multipart Upload Cleanup"
          },
          {
            "id": "s3-46",
            "text": "S3 Event Notifications"
          },
          {
            "id": "s3-47",
            "text": "S3 EventBridge Integration"
          },
          {
            "id": "s3-48",
            "text": "S3 Storage Lens"
          },
          {
            "id": "s3-49",
            "text": "S3 Inventory"
          },
          {
            "id": "s3-50",
            "text": "S3 Storage Class Analysis"
          },
          {
            "id": "s3-51",
            "text": "S3 CloudWatch Request Metrics"
          },
          {
            "id": "s3-52",
            "text": "S3 Server Access Logging"
          },
          {
            "id": "s3-53",
            "text": "S3 CloudTrail Data Events"
          },
          {
            "id": "s3-54",
            "text": "S3 Requester Pays"
          },
          {
            "id": "s3-55",
            "text": "S3 Batch Operations"
          },
          {
            "id": "s3-56",
            "text": "S3 Static Website Hosting"
          },
          {
            "id": "s3-57",
            "text": "S3 Object Tagging and Metadata"
          },
          {
            "id": "s3-58",
            "text": "S3 Presigned URLs"
          }
        ]
      },
      {
        "id": "topic-iam",
        "code": "Security",
        "title": "AWS IAM (Identity and Access Management)",
        "weight": 4,
        "description": "Securely manage access to AWS services and resources with granular permissions.",
        "items": [
          {
            "id": "iam-6",
            "text": "IAM Users"
          },
          {
            "id": "iam-7",
            "text": "IAM Groups"
          },
          {
            "id": "iam-8",
            "text": "IAM Roles"
          },
          {
            "id": "iam-9",
            "text": "IAM Identity-Based Policies"
          },
          {
            "id": "iam-10",
            "text": "IAM Resource-Based Policies"
          },
          {
            "id": "iam-11",
            "text": "IAM Managed Policies"
          },
          {
            "id": "iam-12",
            "text": "IAM Inline Policies"
          },
          {
            "id": "iam-13",
            "text": "IAM Policy Evaluation Logic"
          },
          {
            "id": "iam-14",
            "text": "Explicit Deny Overrides Allow"
          },
          {
            "id": "iam-15",
            "text": "Least Privilege"
          },
          {
            "id": "iam-16",
            "text": "IAM Permissions Boundaries"
          },
          {
            "id": "iam-17",
            "text": "IAM Role Trust Policies"
          },
          {
            "id": "iam-18",
            "text": "Cross-Account IAM Roles"
          },
          {
            "id": "iam-19",
            "text": "AWS STS Temporary Credentials"
          },
          {
            "id": "iam-20",
            "text": "IAM Role Assumption"
          },
          {
            "id": "iam-21",
            "text": "Service Roles"
          },
          {
            "id": "iam-22",
            "text": "Service-Linked Roles"
          },
          {
            "id": "iam-23",
            "text": "IAM PassRole"
          },
          {
            "id": "iam-24",
            "text": "IAM Policy Conditions"
          },
          {
            "id": "iam-25",
            "text": "Multi-Factor Authentication - MFA"
          },
          {
            "id": "iam-26",
            "text": "Root User Security"
          },
          {
            "id": "iam-27",
            "text": "Access Keys"
          },
          {
            "id": "iam-28",
            "text": "IAM Access Analyzer"
          },
          {
            "id": "iam-31",
            "text": "Identity-Based vs Resource-Based Policies"
          }
        ]
      },
      {
        "id": "topic-elb",
        "code": "Networking",
        "title": "Elastic Load Balancing (ELB)",
        "weight": 3,
        "description": "Distributes incoming application traffic across multiple targets (EC2, containers, IPs).",
        "items": [
          {
            "id": "elb-5",
            "text": "Application Load Balancer - ALB"
          },
          {
            "id": "elb-6",
            "text": "Network Load Balancer - NLB"
          },
          {
            "id": "elb-7",
            "text": "Gateway Load Balancer - GWLB"
          },
          {
            "id": "elb-8",
            "text": "Classic Load Balancer - Legacy"
          },
          {
            "id": "elb-9",
            "text": "Load Balancer Listeners"
          },
          {
            "id": "elb-10",
            "text": "Target Groups"
          },
          {
            "id": "elb-11",
            "text": "Target Types - Instance, IP and Lambda"
          },
          {
            "id": "elb-12",
            "text": "Health Checks"
          },
          {
            "id": "elb-13",
            "text": "ALB Layer 7 HTTP and HTTPS Load Balancing"
          },
          {
            "id": "elb-14",
            "text": "ALB Host-Based Routing"
          },
          {
            "id": "elb-15",
            "text": "ALB Path-Based Routing"
          },
          {
            "id": "elb-16",
            "text": "ALB HTTP Header and Query String Routing"
          },
          {
            "id": "elb-17",
            "text": "ALB Lambda Targets"
          },
          {
            "id": "elb-18",
            "text": "NLB Layer 4 TCP, TLS and UDP Load Balancing"
          },
          {
            "id": "elb-19",
            "text": "NLB Static IP Addresses"
          },
          {
            "id": "elb-20",
            "text": "NLB Elastic IP Addresses"
          },
          {
            "id": "elb-21",
            "text": "Gateway Load Balancer for Virtual Network Appliances"
          },
          {
            "id": "elb-22",
            "text": "Cross-Zone Load Balancing"
          },
          {
            "id": "elb-23",
            "text": "Connection Draining and Deregistration Delay"
          },
          {
            "id": "elb-24",
            "text": "Sticky Sessions"
          },
          {
            "id": "elb-25",
            "text": "TLS Termination"
          },
          {
            "id": "elb-26",
            "text": "ELB Certificates with AWS Certificate Manager"
          },
          {
            "id": "elb-27",
            "text": "Internet-Facing vs Internal Load Balancers"
          },
          {
            "id": "elb-28",
            "text": "Load Balancer Security Groups"
          },
          {
            "id": "elb-29",
            "text": "Access Logs"
          },
          {
            "id": "elb-30",
            "text": "CloudWatch Metrics"
          },
          {
            "id": "elb-31",
            "text": "Load Balancer Integration with Auto Scaling"
          },
          {
            "id": "elb-32",
            "text": "ALB vs NLB vs GWLB"
          }
        ]
      },
      {
        "id": "topic-ec2-asg",
        "code": "Compute",
        "title": "EC2 Auto Scaling",
        "weight": 3,
        "description": "Automated horizontal instance scaling, health checks, and capacity management.",
        "items": [
          {
            "id": "ec2-asg-6",
            "text": "Auto Scaling Groups - ASGs"
          },
          {
            "id": "ec2-asg-7",
            "text": "Minimum, Desired and Maximum Capacity"
          },
          {
            "id": "ec2-asg-8",
            "text": "Launch Templates"
          },
          {
            "id": "ec2-asg-9",
            "text": "Multiple Availability Zone Deployment"
          },
          {
            "id": "ec2-asg-10",
            "text": "Elastic Load Balancing Integration"
          },
          {
            "id": "ec2-asg-11",
            "text": "Health Checks"
          },
          {
            "id": "ec2-asg-12",
            "text": "EC2 Health Checks"
          },
          {
            "id": "ec2-asg-13",
            "text": "ELB Health Checks"
          },
          {
            "id": "ec2-asg-14",
            "text": "Replacing Unhealthy Instances"
          },
          {
            "id": "ec2-asg-15",
            "text": "Dynamic Scaling"
          },
          {
            "id": "ec2-asg-16",
            "text": "Target Tracking Scaling Policies"
          },
          {
            "id": "ec2-asg-17",
            "text": "Step Scaling Policies"
          },
          {
            "id": "ec2-asg-18",
            "text": "Simple Scaling Policies"
          },
          {
            "id": "ec2-asg-19",
            "text": "Scheduled Scaling"
          },
          {
            "id": "ec2-asg-20",
            "text": "Predictive Scaling"
          },
          {
            "id": "ec2-asg-21",
            "text": "CloudWatch Alarm Integration"
          },
          {
            "id": "ec2-asg-22",
            "text": "Scale Out and Scale In"
          },
          {
            "id": "ec2-asg-23",
            "text": "Cooldown Periods"
          },
          {
            "id": "ec2-asg-24",
            "text": "Instance Warmup"
          },
          {
            "id": "ec2-asg-25",
            "text": "Lifecycle Hooks"
          },
          {
            "id": "ec2-asg-26",
            "text": "Termination Policies"
          },
          {
            "id": "ec2-asg-27",
            "text": "Instance Refresh"
          },
          {
            "id": "ec2-asg-28",
            "text": "Mixed Instances Policies"
          },
          {
            "id": "ec2-asg-29",
            "text": "On-Demand and Spot Instances in ASGs"
          },
          {
            "id": "ec2-asg-30",
            "text": "Capacity Rebalancing for Spot Instances"
          },
          {
            "id": "ec2-asg-31",
            "text": "Warm Pools"
          },
          {
            "id": "ec2-asg-32",
            "text": "Auto Scaling with Multi-AZ Architecture"
          }
        ]
      },
      {
        "id": "topic-rds",
        "code": "Databases",
        "title": "Amazon RDS",
        "weight": 4,
        "description": "Managed relational database engine (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server).",
        "items": [
          {
            "id": "rds-6",
            "text": "RDS Supported Relational Database Engines"
          },
          {
            "id": "rds-7",
            "text": "RDS DB Instances"
          },
          {
            "id": "rds-8",
            "text": "RDS Multi-AZ Deployments"
          },
          {
            "id": "rds-9",
            "text": "RDS Multi-AZ DB Clusters"
          },
          {
            "id": "rds-10",
            "text": "RDS Read Replicas"
          },
          {
            "id": "rds-11",
            "text": "RDS Cross-Region Read Replicas"
          },
          {
            "id": "rds-12",
            "text": "RDS Automated Backups"
          },
          {
            "id": "rds-13",
            "text": "RDS Manual Snapshots"
          },
          {
            "id": "rds-14",
            "text": "RDS Point-in-Time Recovery"
          },
          {
            "id": "rds-15",
            "text": "RDS Backup Retention"
          },
          {
            "id": "rds-16",
            "text": "RDS Storage Types - General Purpose SSD, Provisioned IOPS SSD and Magnetic"
          },
          {
            "id": "rds-17",
            "text": "RDS Storage Auto Scaling"
          },
          {
            "id": "rds-18",
            "text": "RDS Encryption with AWS KMS"
          },
          {
            "id": "rds-19",
            "text": "RDS Encryption in Transit with TLS"
          },
          {
            "id": "rds-20",
            "text": "RDS IAM Database Authentication"
          },
          {
            "id": "rds-21",
            "text": "RDS Security Groups and VPC Deployment"
          },
          {
            "id": "rds-22",
            "text": "RDS DB Subnet Groups"
          },
          {
            "id": "rds-23",
            "text": "RDS Parameter Groups"
          },
          {
            "id": "rds-25",
            "text": "RDS Proxy"
          },
          {
            "id": "rds-26",
            "text": "RDS Enhanced Monitoring and CloudWatch Monitoring"
          },
          {
            "id": "rds-27",
            "text": "RDS Performance Insights"
          },
          {
            "id": "rds-29",
            "text": "RDS Failover Behavior"
          },
          {
            "id": "rds-30",
            "text": "RDS Multi-AZ vs Read Replicas"
          },
          {
            "id": "rds-31",
            "text": "RDS High Availability vs Read Scaling"
          }
        ]
      },
      {
        "id": "topic-route53",
        "code": "Networking",
        "title": "Amazon Route 53",
        "weight": 3,
        "description": "Highly available and scalable cloud Domain Name System (DNS) web service.",
        "items": [
          {
            "id": "route53-6",
            "text": "Route 53 Public Hosted Zones"
          },
          {
            "id": "route53-7",
            "text": "Route 53 Private Hosted Zones"
          },
          {
            "id": "route53-8",
            "text": "DNS Record Types - A, AAAA, CNAME, MX, TXT and NS"
          },
          {
            "id": "route53-9",
            "text": "Route 53 Alias Records"
          },
          {
            "id": "route53-10",
            "text": "Alias Records vs CNAME Records"
          },
          {
            "id": "route53-11",
            "text": "Simple Routing Policy"
          },
          {
            "id": "route53-12",
            "text": "Weighted Routing Policy"
          },
          {
            "id": "route53-13",
            "text": "Latency-Based Routing Policy"
          },
          {
            "id": "route53-14",
            "text": "Failover Routing Policy"
          },
          {
            "id": "route53-15",
            "text": "Geolocation Routing Policy"
          },
          {
            "id": "route53-16",
            "text": "Geoproximity Routing Policy"
          },
          {
            "id": "route53-17",
            "text": "Multi-Value Answer Routing Policy"
          },
          {
            "id": "route53-18",
            "text": "Route 53 Health Checks"
          },
          {
            "id": "route53-19",
            "text": "Health Check Failover"
          },
          {
            "id": "route53-20",
            "text": "Route 53 Domain Registration"
          },
          {
            "id": "route53-21",
            "text": "Route 53 Resolver"
          },
          {
            "id": "route53-22",
            "text": "Route 53 Resolver Inbound Endpoints"
          },
          {
            "id": "route53-23",
            "text": "Route 53 Resolver Outbound Endpoints"
          },
          {
            "id": "route53-24",
            "text": "Route 53 Resolver Rules"
          },
          {
            "id": "route53-25",
            "text": "Hybrid DNS Resolution"
          },
          {
            "id": "route53-28",
            "text": "Route 53 Integration with ELB, CloudFront and S3"
          }
        ]
      },
      {
        "id": "topic-aurora",
        "code": "Databases",
        "title": "Amazon Aurora",
        "weight": 3,
        "description": "High-performance cloud-native relational database compatible with MySQL and PostgreSQL.",
        "items": [
          {
            "id": "aurora-5",
            "text": "Aurora MySQL-Compatible and PostgreSQL-Compatible Editions"
          },
          {
            "id": "aurora-6",
            "text": "Aurora DB Clusters"
          },
          {
            "id": "aurora-7",
            "text": "Aurora Cluster Volume and Distributed Storage"
          },
          {
            "id": "aurora-8",
            "text": "Aurora Multi-AZ Architecture"
          },
          {
            "id": "aurora-9",
            "text": "Aurora Replicas"
          },
          {
            "id": "aurora-10",
            "text": "Aurora Automatic Failover"
          },
          {
            "id": "aurora-11",
            "text": "Aurora Writer Endpoint"
          },
          {
            "id": "aurora-12",
            "text": "Aurora Reader Endpoint"
          },
          {
            "id": "aurora-14",
            "text": "Aurora Storage Auto Scaling"
          },
          {
            "id": "aurora-15",
            "text": "Aurora Automated Backups and Snapshots"
          },
          {
            "id": "aurora-16",
            "text": "Aurora Point-in-Time Recovery"
          },
          {
            "id": "aurora-17",
            "text": "Aurora Global Database"
          },
          {
            "id": "aurora-18",
            "text": "Aurora Serverless v2"
          },
          {
            "id": "aurora-19",
            "text": "Aurora Database Cloning"
          },
          {
            "id": "aurora-20",
            "text": "Aurora Backtrack for Aurora MySQL"
          },
          {
            "id": "aurora-21",
            "text": "Aurora Encryption with AWS KMS"
          },
          {
            "id": "aurora-22",
            "text": "Aurora IAM Database Authentication"
          },
          {
            "id": "aurora-23",
            "text": "Aurora with RDS Proxy"
          },
          {
            "id": "aurora-24",
            "text": "Aurora Replica Auto Scaling"
          },
          {
            "id": "aurora-25",
            "text": "Aurora vs Standard Amazon RDS"
          }
        ]
      },
      {
        "id": "topic-dynamodb",
        "code": "Databases",
        "title": "Amazon DynamoDB",
        "weight": 4,
        "description": "Fully managed NoSQL key-value and document database delivering single-digit millisecond latency.",
        "items": [
          {
            "id": "dynamodb-6",
            "text": "DynamoDB Tables, Items and Attributes"
          },
          {
            "id": "dynamodb-7",
            "text": "DynamoDB Partition Keys"
          },
          {
            "id": "dynamodb-8",
            "text": "DynamoDB Composite Primary Keys - Partition Key and Sort Key"
          },
          {
            "id": "dynamodb-9",
            "text": "DynamoDB On-Demand Capacity Mode"
          },
          {
            "id": "dynamodb-10",
            "text": "DynamoDB Provisioned Capacity Mode"
          },
          {
            "id": "dynamodb-11",
            "text": "DynamoDB Auto Scaling"
          },
          {
            "id": "dynamodb-12",
            "text": "DynamoDB Read and Write Capacity Units"
          },
          {
            "id": "dynamodb-13",
            "text": "DynamoDB Strongly Consistent Reads"
          },
          {
            "id": "dynamodb-14",
            "text": "DynamoDB Eventually Consistent Reads"
          },
          {
            "id": "dynamodb-15",
            "text": "DynamoDB Global Secondary Indexes"
          },
          {
            "id": "dynamodb-16",
            "text": "DynamoDB Local Secondary Indexes"
          },
          {
            "id": "dynamodb-17",
            "text": "DynamoDB Global Tables"
          },
          {
            "id": "dynamodb-18",
            "text": "DynamoDB Streams"
          },
          {
            "id": "dynamodb-19",
            "text": "DynamoDB Accelerator - DAX"
          },
          {
            "id": "dynamodb-20",
            "text": "DynamoDB Time to Live - TTL"
          },
          {
            "id": "dynamodb-21",
            "text": "DynamoDB Point-in-Time Recovery"
          },
          {
            "id": "dynamodb-22",
            "text": "DynamoDB On-Demand Backups"
          },
          {
            "id": "dynamodb-23",
            "text": "DynamoDB Transactions"
          },
          {
            "id": "dynamodb-24",
            "text": "DynamoDB Conditional Writes"
          },
          {
            "id": "dynamodb-25",
            "text": "DynamoDB Encryption at Rest"
          },
          {
            "id": "dynamodb-26",
            "text": "DynamoDB VPC Gateway Endpoints"
          },
          {
            "id": "dynamodb-27",
            "text": "DynamoDB Adaptive Capacity and Hot Partitions"
          },
          {
            "id": "dynamodb-28",
            "text": "DynamoDB Partition Key Design"
          },
          {
            "id": "dynamodb-29",
            "text": "DynamoDB Standard vs Standard-Infrequent Access Table Classes"
          },
          {
            "id": "dynamodb-30",
            "text": "DynamoDB vs Amazon RDS"
          }
        ]
      },
      {
        "id": "topic-cloudfront",
        "code": "Networking",
        "title": "Amazon CloudFront",
        "weight": 3,
        "description": "Global content delivery network (CDN) delivering data, videos, APIs, and static assets.",
        "items": [
          {
            "id": "cloudfront-6",
            "text": "CloudFront Content Delivery Network - CDN"
          },
          {
            "id": "cloudfront-7",
            "text": "CloudFront Distributions"
          },
          {
            "id": "cloudfront-8",
            "text": "CloudFront Edge Locations"
          },
          {
            "id": "cloudfront-9",
            "text": "CloudFront Origins"
          },
          {
            "id": "cloudfront-10",
            "text": "S3 Origins"
          },
          {
            "id": "cloudfront-11",
            "text": "Application Load Balancer and Custom Origins"
          },
          {
            "id": "cloudfront-12",
            "text": "CloudFront Cache Behaviors"
          },
          {
            "id": "cloudfront-13",
            "text": "CloudFront Cache Keys"
          },
          {
            "id": "cloudfront-14",
            "text": "CloudFront TTL Settings"
          },
          {
            "id": "cloudfront-15",
            "text": "CloudFront Origin Access Control - OAC"
          },
          {
            "id": "cloudfront-16",
            "text": "CloudFront Origin Access Identity - OAI Legacy"
          },
          {
            "id": "cloudfront-17",
            "text": "CloudFront Signed URLs"
          },
          {
            "id": "cloudfront-18",
            "text": "CloudFront Signed Cookies"
          },
          {
            "id": "cloudfront-19",
            "text": "CloudFront Geo Restriction"
          },
          {
            "id": "cloudfront-20",
            "text": "CloudFront Origin Failover"
          },
          {
            "id": "cloudfront-21",
            "text": "CloudFront with AWS WAF"
          },
          {
            "id": "cloudfront-22",
            "text": "CloudFront with AWS Shield"
          },
          {
            "id": "cloudfront-23",
            "text": "CloudFront HTTPS and TLS Certificates"
          },
          {
            "id": "cloudfront-24",
            "text": "CloudFront Viewer Protocol Policies"
          },
          {
            "id": "cloudfront-26",
            "text": "Lambda at Edge"
          },
          {
            "id": "cloudfront-27",
            "text": "CloudFront Cache Invalidation"
          },
          {
            "id": "cloudfront-28",
            "text": "CloudFront Price Classes"
          },
          {
            "id": "cloudfront-29",
            "text": "CloudFront Compression"
          },
          {
            "id": "cloudfront-30",
            "text": "CloudFront Access Logs"
          },
          {
            "id": "cloudfront-31",
            "text": "CloudFront vs S3 Transfer Acceleration"
          },
          {
            "id": "cloudfront-32",
            "text": "CloudFront vs AWS Global Accelerator"
          },
          {
            "id": "cf-r1",
            "text": "Origin Access Control (OAC) vs Origin Access Identity (OAI) - OAC is the Modern Preferred Approach"
          }
        ]
      },
      {
        "id": "topic-kms",
        "code": "Security",
        "title": "AWS KMS (Key Management Service)",
        "weight": 3,
        "description": "Create and manage cryptographic keys to control data encryption across AWS services.",
        "items": [
          {
            "id": "kms-6",
            "text": "KMS Keys"
          },
          {
            "id": "kms-7",
            "text": "Customer Managed KMS Keys"
          },
          {
            "id": "kms-8",
            "text": "AWS Managed KMS Keys"
          },
          {
            "id": "kms-9",
            "text": "AWS Owned Keys"
          },
          {
            "id": "kms-10",
            "text": "Symmetric Encryption KMS Keys"
          },
          {
            "id": "kms-11",
            "text": "Asymmetric KMS Keys"
          },
          {
            "id": "kms-12",
            "text": "Envelope Encryption"
          },
          {
            "id": "kms-13",
            "text": "Data Encryption Keys"
          },
          {
            "id": "kms-14",
            "text": "KMS Key Policies"
          },
          {
            "id": "kms-15",
            "text": "IAM Policies with KMS"
          },
          {
            "id": "kms-16",
            "text": "KMS Grants"
          },
          {
            "id": "kms-17",
            "text": "KMS Key Rotation"
          },
          {
            "id": "kms-18",
            "text": "KMS Key Aliases"
          },
          {
            "id": "kms-19",
            "text": "KMS Multi-Region Keys"
          },
          {
            "id": "kms-20",
            "text": "KMS Encryption Context"
          },
          {
            "id": "kms-21",
            "text": "KMS Cross-Account Access"
          },
          {
            "id": "kms-22",
            "text": "KMS Key Deletion and Waiting Period"
          },
          {
            "id": "kms-24",
            "text": "KMS Integration with AWS Services"
          },
          {
            "id": "kms-25",
            "text": "KMS Encryption at Rest"
          },
          {
            "id": "kms-26",
            "text": "KMS API Calls and Permissions"
          }
        ]
      },
      {
        "id": "topic-lambda",
        "code": "Compute",
        "title": "AWS Lambda",
        "weight": 4,
        "description": "Serverless event-driven compute engine running code without server management.",
        "items": [
          {
            "id": "lambda-6",
            "text": "Lambda Serverless Functions"
          },
          {
            "id": "lambda-7",
            "text": "Lambda Event-Driven Compute"
          },
          {
            "id": "lambda-8",
            "text": "Lambda Execution Role"
          },
          {
            "id": "lambda-9",
            "text": "Lambda Resource-Based Policies"
          },
          {
            "id": "lambda-10",
            "text": "Lambda Function Versions"
          },
          {
            "id": "lambda-11",
            "text": "Lambda Aliases"
          },
          {
            "id": "lambda-12",
            "text": "Lambda Environment Variables"
          },
          {
            "id": "lambda-13",
            "text": "Lambda Layers"
          },
          {
            "id": "lambda-14",
            "text": "Lambda Runtime"
          },
          {
            "id": "lambda-15",
            "text": "Lambda Memory and CPU Allocation"
          },
          {
            "id": "lambda-16",
            "text": "Lambda Timeout"
          },
          {
            "id": "lambda-17",
            "text": "Lambda Ephemeral Storage"
          },
          {
            "id": "lambda-18",
            "text": "Lambda Concurrency"
          },
          {
            "id": "lambda-19",
            "text": "Reserved Concurrency"
          },
          {
            "id": "lambda-20",
            "text": "Provisioned Concurrency"
          },
          {
            "id": "lambda-21",
            "text": "Lambda Scaling"
          },
          {
            "id": "lambda-22",
            "text": "Lambda Cold Starts"
          },
          {
            "id": "lambda-23",
            "text": "Lambda Synchronous Invocation"
          },
          {
            "id": "lambda-24",
            "text": "Lambda Asynchronous Invocation"
          },
          {
            "id": "lambda-25",
            "text": "Lambda Event Source Mappings"
          },
          {
            "id": "lambda-26",
            "text": "Lambda with Amazon SQS"
          },
          {
            "id": "lambda-27",
            "text": "Lambda with Amazon Kinesis"
          },
          {
            "id": "lambda-28",
            "text": "Lambda with DynamoDB Streams"
          },
          {
            "id": "lambda-30",
            "text": "Lambda Dead-Letter Queues"
          },
          {
            "id": "lambda-31",
            "text": "Lambda Retry Behaviour"
          },
          {
            "id": "lambda-32",
            "text": "Lambda VPC Integration"
          },
          {
            "id": "lambda-33",
            "text": "Lambda Internet Access from a VPC"
          },
          {
            "id": "lambda-34",
            "text": "Lambda with Amazon EFS"
          },
          {
            "id": "lambda-35",
            "text": "Lambda Environment Variable Encryption"
          },
          {
            "id": "lambda-36",
            "text": "Lambda with Secrets Manager and Parameter Store"
          },
          {
            "id": "lambda-37",
            "text": "Lambda CloudWatch Logs"
          },
          {
            "id": "lambda-38",
            "text": "Lambda Monitoring with CloudWatch"
          },
          {
            "id": "lambda-40",
            "text": "Lambda with API Gateway"
          },
          {
            "id": "lambda-41",
            "text": "Lambda@Edge"
          },
          {
            "id": "lambda-42",
            "text": "Lambda vs EC2"
          },
          {
            "id": "lambda-43",
            "text": "Lambda vs Fargate"
          },
          {
            "id": "lam-2",
            "text": "Lambda Event Source Mappings (SQS, Kinesis, DynamoDB Streams) vs Synchronous Invocations (API Gateway, ALB)"
          }
        ]
      },
      {
        "id": "topic-sqs",
        "code": "Integration",
        "title": "Amazon SQS",
        "weight": 3,
        "description": "Fully managed message queuing service for decoupling application microservices.",
        "items": [
          {
            "id": "sqs-5",
            "text": "SQS Standard Queues"
          },
          {
            "id": "sqs-6",
            "text": "SQS FIFO Queues"
          },
          {
            "id": "sqs-7",
            "text": "At-Least-Once Delivery"
          },
          {
            "id": "sqs-8",
            "text": "Best-Effort Ordering in Standard Queues"
          },
          {
            "id": "sqs-9",
            "text": "FIFO Ordering"
          },
          {
            "id": "sqs-10",
            "text": "FIFO Message Group IDs"
          },
          {
            "id": "sqs-11",
            "text": "FIFO Message Deduplication"
          },
          {
            "id": "sqs-12",
            "text": "Visibility Timeout"
          },
          {
            "id": "sqs-13",
            "text": "Long Polling"
          },
          {
            "id": "sqs-14",
            "text": "Short Polling"
          },
          {
            "id": "sqs-15",
            "text": "Message Retention Period"
          },
          {
            "id": "sqs-16",
            "text": "Delay Queues"
          },
          {
            "id": "sqs-17",
            "text": "Dead-Letter Queues - DLQs"
          },
          {
            "id": "sqs-18",
            "text": "Redrive Policies"
          },
          {
            "id": "sqs-19",
            "text": "Queue Access Policies"
          },
          {
            "id": "sqs-20",
            "text": "Server-Side Encryption"
          },
          {
            "id": "sqs-21",
            "text": "SQS with AWS KMS"
          },
          {
            "id": "sqs-22",
            "text": "SQS Lambda Event Source Mapping"
          },
          {
            "id": "sqs-23",
            "text": "Decoupling Application Components"
          },
          {
            "id": "sqs-24",
            "text": "SQS Buffering and Load Leveling"
          },
          {
            "id": "sqs-25",
            "text": "SQS vs SNS"
          },
          {
            "id": "sqs-26",
            "text": "SQS vs Amazon MQ"
          },
          {
            "id": "sqs-r1",
            "text": "SQS Standard vs FIFO Queues (Throughput, Ordering, Deduplication, and Use Case Comparison)"
          }
        ]
      },
      {
        "id": "topic-ebs",
        "code": "Storage",
        "title": "Amazon EBS (Elastic Block Store)",
        "weight": 3,
        "description": "Persistent block storage volumes, volume types, snapshots, and encryption.",
        "items": [
          {
            "id": "ebs-5",
            "text": "EBS Elastic Volumes (Modifying volume size, IOPS, and type dynamically)"
          },
          {
            "id": "ebs-6",
            "text": "EBS Block Storage for EC2"
          },
          {
            "id": "ebs-7",
            "text": "EBS General Purpose SSD - gp3"
          },
          {
            "id": "ebs-8",
            "text": "EBS General Purpose SSD - gp2"
          },
          {
            "id": "ebs-9",
            "text": "EBS Provisioned IOPS SSD - io2"
          },
          {
            "id": "ebs-10",
            "text": "EBS Throughput Optimized HDD - st1"
          },
          {
            "id": "ebs-11",
            "text": "EBS Cold HDD - sc1"
          },
          {
            "id": "ebs-12",
            "text": "EBS Volume Types and Workload Selection"
          },
          {
            "id": "ebs-13",
            "text": "EBS Availability Zone Scope"
          },
          {
            "id": "ebs-14",
            "text": "EBS Volume Attachment to EC2"
          },
          {
            "id": "ebs-15",
            "text": "EBS Multi-Attach for Supported io1 and io2 Volumes"
          },
          {
            "id": "ebs-16",
            "text": "EBS Root Volumes"
          },
          {
            "id": "ebs-17",
            "text": "EBS Data Volumes"
          },
          {
            "id": "ebs-18",
            "text": "EBS Encryption with AWS KMS"
          },
          {
            "id": "ebs-19",
            "text": "EBS Encryption by Default"
          },
          {
            "id": "ebs-20",
            "text": "EBS Snapshots"
          },
          {
            "id": "ebs-21",
            "text": "EBS Incremental Snapshots"
          },
          {
            "id": "ebs-22",
            "text": "EBS Snapshot Copy"
          },
          {
            "id": "ebs-23",
            "text": "EBS Cross-Region Snapshot Copy"
          },
          {
            "id": "ebs-24",
            "text": "EBS Fast Snapshot Restore"
          },
          {
            "id": "ebs-25",
            "text": "EBS Snapshot Archive"
          },
          {
            "id": "ebs-26",
            "text": "EBS Recycle Bin for Snapshots"
          },
          {
            "id": "ebs-27",
            "text": "EBS Volume Resize"
          },
          {
            "id": "ebs-28",
            "text": "EBS Modify Volume without Detaching"
          },
          {
            "id": "ebs-29",
            "text": "EBS IOPS and Throughput"
          },
          {
            "id": "ebs-30",
            "text": "EBS Delete on Termination"
          },
          {
            "id": "ebs-31",
            "text": "EBS Lifecycle Manager"
          },
          {
            "id": "ebs-32",
            "text": "EBS vs Instance Store"
          },
          {
            "id": "ebs-33",
            "text": "EBS vs EFS"
          }
        ]
      },
      {
        "id": "topic-efs",
        "code": "Storage",
        "title": "Amazon EFS (Elastic File System)",
        "weight": 3,
        "description": "Fully managed POSIX shared file system for Linux EC2 instances and ECS/EKS containers.",
        "items": [
          {
            "id": "efs-4",
            "text": "EFS Replication (Cross-Region & Intra-Region Automated Replication)"
          },
          {
            "id": "efs-5",
            "text": "EFS Managed NFS File Storage"
          },
          {
            "id": "efs-6",
            "text": "EFS Regional File Systems"
          },
          {
            "id": "efs-7",
            "text": "EFS One Zone File Systems"
          },
          {
            "id": "efs-8",
            "text": "EFS Multi-AZ Availability"
          },
          {
            "id": "efs-9",
            "text": "EFS Mount Targets"
          },
          {
            "id": "efs-10",
            "text": "EFS Security Groups"
          },
          {
            "id": "efs-11",
            "text": "EFS NFSv4 Protocol"
          },
          {
            "id": "efs-12",
            "text": "EFS Concurrent Access from Multiple EC2 Instances"
          },
          {
            "id": "efs-13",
            "text": "EFS Standard Storage Class"
          },
          {
            "id": "efs-14",
            "text": "EFS Infrequent Access Storage Class"
          },
          {
            "id": "efs-15",
            "text": "EFS Archive Storage Class"
          },
          {
            "id": "efs-16",
            "text": "EFS Intelligent-Tiering"
          },
          {
            "id": "efs-17",
            "text": "EFS Lifecycle Management"
          },
          {
            "id": "efs-18",
            "text": "EFS Bursting Throughput"
          },
          {
            "id": "efs-19",
            "text": "EFS Provisioned Throughput"
          },
          {
            "id": "efs-20",
            "text": "EFS Elastic Throughput"
          },
          {
            "id": "efs-21",
            "text": "EFS General Purpose Performance Mode"
          },
          {
            "id": "efs-22",
            "text": "EFS Max I/O Performance Mode"
          },
          {
            "id": "efs-23",
            "text": "EFS Encryption at Rest"
          },
          {
            "id": "efs-24",
            "text": "EFS Encryption in Transit"
          },
          {
            "id": "efs-25",
            "text": "EFS Access Points"
          },
          {
            "id": "efs-26",
            "text": "EFS IAM Authorization"
          },
          {
            "id": "efs-27",
            "text": "EFS File System Policies"
          },
          {
            "id": "efs-28",
            "text": "EFS with AWS Lambda"
          },
          {
            "id": "efs-29",
            "text": "EFS with Amazon ECS and Fargate"
          },
          {
            "id": "efs-30",
            "text": "EFS Backup with AWS Backup"
          },
          {
            "id": "efs-31",
            "text": "EFS vs EBS"
          },
          {
            "id": "efs-32",
            "text": "EFS vs Amazon FSx"
          },
          {
            "id": "efs-r1",
            "text": "EFS Performance Modes vs Throughput Modes (General Purpose vs Max I/O; Bursting vs Provisioned vs Elastic)"
          }
        ]
      },
      {
        "id": "topic-organizations",
        "code": "Management",
        "title": "AWS Organizations",
        "weight": 3,
        "description": "Centralized account management, consolidated billing, and governance policies.",
        "items": [
          {
            "id": "organizations-4",
            "text": "AWS Organizations Multi-Account Management"
          },
          {
            "id": "organizations-5",
            "text": "Management Account"
          },
          {
            "id": "organizations-6",
            "text": "Member Accounts"
          },
          {
            "id": "organizations-7",
            "text": "Organizational Units - OUs"
          },
          {
            "id": "organizations-8",
            "text": "Organization Root"
          },
          {
            "id": "organizations-9",
            "text": "Service Control Policies - SCPs"
          },
          {
            "id": "organizations-10",
            "text": "SCP Allow Lists and Deny Lists"
          },
          {
            "id": "organizations-11",
            "text": "SCPs Do Not Grant Permissions"
          },
          {
            "id": "organizations-12",
            "text": "Explicit Deny in SCPs"
          },
          {
            "id": "organizations-13",
            "text": "SCP Inheritance"
          },
          {
            "id": "organizations-14",
            "text": "Consolidated Billing"
          },
          {
            "id": "organizations-15",
            "text": "Volume Pricing Benefits"
          },
          {
            "id": "organizations-16",
            "text": "All Features Mode"
          },
          {
            "id": "organizations-17",
            "text": "Account Creation and Management"
          },
          {
            "id": "organizations-18",
            "text": "Moving Accounts between OUs"
          },
          {
            "id": "organizations-19",
            "text": "Delegated Administrator"
          },
          {
            "id": "organizations-20",
            "text": "Trusted Access for AWS Services"
          },
          {
            "id": "organizations-21",
            "text": "Tag Policies"
          },
          {
            "id": "organizations-22",
            "text": "Backup Policies"
          },
          {
            "id": "organizations-23",
            "text": "Organizations Integration with AWS RAM"
          },
          {
            "id": "organizations-24",
            "text": "Organizations Integration with Control Tower"
          }
        ]
      },
      {
        "id": "topic-direct-connect",
        "code": "Networking",
        "title": "AWS Direct Connect",
        "weight": 2,
        "description": "Dedicated private physical network connection from on-premises data center to AWS.",
        "items": [
          {
            "id": "dx-5",
            "text": "Direct Connect Dedicated Private Network Connection"
          },
          {
            "id": "dx-6",
            "text": "Direct Connect Locations"
          },
          {
            "id": "dx-7",
            "text": "Dedicated Connections"
          },
          {
            "id": "dx-8",
            "text": "Hosted Connections"
          },
          {
            "id": "dx-9",
            "text": "Private Virtual Interfaces - Private VIF"
          },
          {
            "id": "dx-10",
            "text": "Public Virtual Interfaces - Public VIF"
          },
          {
            "id": "dx-11",
            "text": "Transit Virtual Interfaces - Transit VIF"
          },
          {
            "id": "dx-12",
            "text": "Direct Connect Gateway"
          },
          {
            "id": "dx-13",
            "text": "Direct Connect with Virtual Private Gateway"
          },
          {
            "id": "dx-14",
            "text": "Direct Connect with Transit Gateway"
          },
          {
            "id": "dx-15",
            "text": "BGP Routing"
          },
          {
            "id": "dx-16",
            "text": "Direct Connect Redundancy"
          },
          {
            "id": "dx-17",
            "text": "Multiple Direct Connect Connections for High Availability"
          },
          {
            "id": "dx-18",
            "text": "Direct Connect with Site-to-Site VPN for Encryption"
          },
          {
            "id": "dx-20",
            "text": "Direct Connect vs Site-to-Site VPN"
          },
          {
            "id": "dx-r1",
            "text": "Direct Connect Virtual Interface Types - Private VIF vs Public VIF vs Transit VIF"
          }
        ]
      },
      {
        "id": "topic-vpn",
        "code": "Networking",
        "title": "AWS Site-to-Site VPN",
        "weight": 2,
        "description": "Encrypted IPsec VPN connection between on-premises network and AWS VPCs.",
        "items": [
          {
            "id": "vpn-3",
            "text": "AWS Client VPN (OpenVPN desktop remote worker access to VPC resources)"
          },
          {
            "id": "vpn-4",
            "text": "Site-to-Site VPN IPsec Connectivity"
          },
          {
            "id": "vpn-5",
            "text": "Customer Gateway"
          },
          {
            "id": "vpn-6",
            "text": "Virtual Private Gateway"
          },
          {
            "id": "vpn-7",
            "text": "Transit Gateway VPN Attachments"
          },
          {
            "id": "vpn-8",
            "text": "Two VPN Tunnels for High Availability"
          },
          {
            "id": "vpn-9",
            "text": "Static Routing"
          },
          {
            "id": "vpn-10",
            "text": "Dynamic Routing with BGP"
          },
          {
            "id": "vpn-11",
            "text": "VPN Route Propagation"
          },
          {
            "id": "vpn-12",
            "text": "VPN Tunnel Monitoring"
          },
          {
            "id": "vpn-13",
            "text": "Accelerated Site-to-Site VPN"
          },
          {
            "id": "vpn-14",
            "text": "Site-to-Site VPN over the Internet"
          },
          {
            "id": "vpn-15",
            "text": "Site-to-Site VPN with Direct Connect"
          },
          {
            "id": "vpn-16",
            "text": "Site-to-Site VPN vs Client VPN"
          },
          {
            "id": "vpn-17",
            "text": "Site-to-Site VPN vs Direct Connect"
          },
          {
            "id": "vpn-r1",
            "text": "Static Routing vs Dynamic Routing with BGP - Border Gateway Protocol"
          }
        ]
      },
      {
        "id": "topic-transit-gateway",
        "code": "Networking",
        "title": "AWS Transit Gateway",
        "weight": 2,
        "description": "Centralized network transit hub to interconnect VPCs, Direct Connect, and VPN connections.",
        "items": [
          {
            "id": "tgw-4",
            "text": "Transit Gateway Hub-and-Spoke Networking"
          },
          {
            "id": "tgw-5",
            "text": "Transit Gateway VPC Attachments"
          },
          {
            "id": "tgw-6",
            "text": "Transit Gateway VPN Attachments"
          },
          {
            "id": "tgw-7",
            "text": "Transit Gateway Direct Connect Gateway Integration"
          },
          {
            "id": "tgw-8",
            "text": "Transit Gateway Peering Attachments"
          },
          {
            "id": "tgw-9",
            "text": "Transit Gateway Route Tables"
          },
          {
            "id": "tgw-10",
            "text": "Transit Gateway Route Table Associations"
          },
          {
            "id": "tgw-11",
            "text": "Transit Gateway Route Propagation"
          },
          {
            "id": "tgw-12",
            "text": "Transit Gateway Static Routes"
          },
          {
            "id": "tgw-14",
            "text": "Transit Gateway Cross-Account Sharing with AWS RAM"
          },
          {
            "id": "tgw-15",
            "text": "Transit Gateway Inter-Region Peering"
          },
          {
            "id": "tgw-16",
            "text": "Transit Gateway Appliance Mode"
          },
          {
            "id": "tgw-17",
            "text": "Transit Gateway Centralized Internet Egress"
          },
          {
            "id": "tgw-18",
            "text": "Transit Gateway Centralized Inspection"
          },
          {
            "id": "tgw-19",
            "text": "Transit Gateway vs VPC Peering"
          }
        ]
      },
      {
        "id": "topic-privatelink",
        "code": "Networking",
        "title": "AWS PrivateLink",
        "weight": 2,
        "description": "Private connectivity between VPCs, AWS services, and on-premises applications without exposing traffic to the public internet.",
        "items": [
          {
            "id": "privatelink-4",
            "text": "AWS PrivateLink Private Service Connectivity"
          },
          {
            "id": "privatelink-5",
            "text": "Interface VPC Endpoints"
          },
          {
            "id": "privatelink-6",
            "text": "Endpoint Elastic Network Interfaces"
          },
          {
            "id": "privatelink-7",
            "text": "Private IP Connectivity"
          },
          {
            "id": "privatelink-8",
            "text": "VPC Endpoint Services"
          },
          {
            "id": "privatelink-9",
            "text": "Network Load Balancer for Endpoint Services"
          },
          {
            "id": "privatelink-10",
            "text": "Private DNS for Interface Endpoints"
          },
          {
            "id": "privatelink-11",
            "text": "Security Groups on Interface Endpoints"
          },
          {
            "id": "privatelink-12",
            "text": "VPC Endpoint Policies"
          },
          {
            "id": "privatelink-13",
            "text": "Cross-Account Endpoint Services"
          },
          {
            "id": "privatelink-14",
            "text": "Accessing AWS Services without Internet or NAT"
          },
          {
            "id": "privatelink-15",
            "text": "PrivateLink Non-Transitive Connectivity"
          },
          {
            "id": "privatelink-16",
            "text": "PrivateLink vs VPC Peering"
          },
          {
            "id": "privatelink-17",
            "text": "PrivateLink vs NAT Gateway"
          },
          {
            "id": "pl-r1",
            "text": "VPC Gateway Endpoints vs Interface Endpoints (S3 and DynamoDB free routing vs PrivateLink private IP)"
          }
        ]
      },
      {
        "id": "topic-sns",
        "code": "Integration",
        "title": "Amazon SNS",
        "weight": 2,
        "description": "Managed pub/sub messaging and notification service for web and mobile applications.",
        "items": [
          {
            "id": "sns-4",
            "text": "SNS Publish-Subscribe Messaging"
          },
          {
            "id": "sns-5",
            "text": "SNS Topics"
          },
          {
            "id": "sns-6",
            "text": "SNS Standard Topics"
          },
          {
            "id": "sns-7",
            "text": "SNS FIFO Topics"
          },
          {
            "id": "sns-8",
            "text": "SNS Subscriptions"
          },
          {
            "id": "sns-9",
            "text": "SNS to SQS Fanout"
          },
          {
            "id": "sns-10",
            "text": "SNS to Lambda"
          },
          {
            "id": "sns-11",
            "text": "SNS HTTP and HTTPS Endpoints"
          },
          {
            "id": "sns-12",
            "text": "SNS Email Notifications"
          },
          {
            "id": "sns-13",
            "text": "Message Filtering Policies"
          },
          {
            "id": "sns-14",
            "text": "Message Delivery Retries"
          },
          {
            "id": "sns-15",
            "text": "SNS Dead-Letter Queues"
          },
          {
            "id": "sns-16",
            "text": "SNS Server-Side Encryption"
          },
          {
            "id": "sns-17",
            "text": "SNS Topic Access Policies"
          },
          {
            "id": "sns-18",
            "text": "Cross-Account Publishing and Subscriptions"
          },
          {
            "id": "sns-19",
            "text": "SNS FIFO with SQS FIFO"
          },
          {
            "id": "sns-20",
            "text": "SNS vs SQS"
          }
        ]
      },
      {
        "id": "topic-elasticache",
        "code": "Databases",
        "title": "Amazon ElastiCache",
        "weight": 2,
        "description": "In-memory data store and cache supporting Redis/Valkey and Memcached engines.",
        "items": [
          {
            "id": "ec-3",
            "text": "Caching Patterns: Lazy Loading (Cache-Aside), Write-Through, & Session Store Offloading"
          },
          {
            "id": "elasticache-4",
            "text": "ElastiCache Managed In-Memory Caching"
          },
          {
            "id": "elasticache-5",
            "text": "ElastiCache for Valkey"
          },
          {
            "id": "elasticache-6",
            "text": "ElastiCache for Redis OSS"
          },
          {
            "id": "elasticache-7",
            "text": "ElastiCache for Memcached"
          },
          {
            "id": "elasticache-8",
            "text": "ElastiCache Redis or Valkey Replication"
          },
          {
            "id": "elasticache-9",
            "text": "ElastiCache Multi-AZ with Automatic Failover"
          },
          {
            "id": "elasticache-10",
            "text": "ElastiCache Read Replicas"
          },
          {
            "id": "elasticache-11",
            "text": "ElastiCache Cluster Mode and Sharding"
          },
          {
            "id": "elasticache-12",
            "text": "ElastiCache Memcached Horizontal Scaling"
          },
          {
            "id": "elasticache-13",
            "text": "ElastiCache Subnet Groups"
          },
          {
            "id": "elasticache-14",
            "text": "ElastiCache Security Groups"
          },
          {
            "id": "elasticache-15",
            "text": "ElastiCache Encryption in Transit"
          },
          {
            "id": "elasticache-16",
            "text": "ElastiCache Encryption at Rest"
          },
          {
            "id": "elasticache-17",
            "text": "ElastiCache Backups and Snapshots"
          },
          {
            "id": "elasticache-19",
            "text": "ElastiCache Session Storage"
          },
          {
            "id": "elasticache-20",
            "text": "ElastiCache Database Query Caching"
          },
          {
            "id": "elasticache-21",
            "text": "ElastiCache vs DynamoDB Accelerator - DAX"
          }
        ]
      },
      {
        "id": "topic-secrets-manager",
        "code": "Security",
        "title": "AWS Secrets Manager",
        "weight": 2,
        "description": "Rotate, manage, and retrieve database credentials, API keys, and secrets.",
        "items": [
          {
            "id": "secrets-manager-4",
            "text": "Secrets Manager Secret Storage"
          },
          {
            "id": "secrets-manager-5",
            "text": "Database Credentials and API Keys"
          },
          {
            "id": "secrets-manager-6",
            "text": "Encryption with AWS KMS"
          },
          {
            "id": "secrets-manager-7",
            "text": "Automatic Secret Rotation"
          },
          {
            "id": "secrets-manager-8",
            "text": "Rotation with AWS Lambda"
          },
          {
            "id": "secrets-manager-9",
            "text": "Secret Versions"
          },
          {
            "id": "secrets-manager-11",
            "text": "Fine-Grained IAM Access"
          },
          {
            "id": "secrets-manager-12",
            "text": "Secrets Manager Resource Policies"
          },
          {
            "id": "secrets-manager-13",
            "text": "Cross-Account Secret Access"
          },
          {
            "id": "secrets-manager-14",
            "text": "VPC Interface Endpoints"
          },
          {
            "id": "secrets-manager-15",
            "text": "Secrets Manager Integration with RDS"
          },
          {
            "id": "secrets-manager-17",
            "text": "Secrets Manager vs Systems Manager Parameter Store"
          }
        ]
      },
      {
        "id": "topic-api-gateway",
        "code": "Integration",
        "title": "Amazon API Gateway",
        "weight": 3,
        "description": "Create, publish, maintain, monitor, and secure REST, HTTP, and WebSocket APIs.",
        "items": [
          {
            "id": "apig-5",
            "text": "API Gateway REST APIs"
          },
          {
            "id": "apig-6",
            "text": "API Gateway HTTP APIs"
          },
          {
            "id": "apig-7",
            "text": "API Gateway WebSocket APIs"
          },
          {
            "id": "apig-8",
            "text": "Regional API Endpoints"
          },
          {
            "id": "apig-9",
            "text": "Edge-Optimized API Endpoints"
          },
          {
            "id": "apig-10",
            "text": "Private API Endpoints"
          },
          {
            "id": "apig-11",
            "text": "Lambda Proxy Integration"
          },
          {
            "id": "apig-12",
            "text": "HTTP Integrations"
          },
          {
            "id": "apig-13",
            "text": "AWS Service Integrations"
          },
          {
            "id": "apig-14",
            "text": "IAM Authorization"
          },
          {
            "id": "apig-15",
            "text": "Cognito User Pool Authorization"
          },
          {
            "id": "apig-16",
            "text": "Lambda Authorizers"
          },
          {
            "id": "apig-17",
            "text": "API Keys"
          },
          {
            "id": "apig-18",
            "text": "Usage Plans"
          },
          {
            "id": "apig-19",
            "text": "Throttling"
          },
          {
            "id": "apig-20",
            "text": "API Gateway Caching"
          },
          {
            "id": "apig-21",
            "text": "Stages and Deployments"
          },
          {
            "id": "apig-22",
            "text": "Custom Domain Names"
          },
          {
            "id": "apig-23",
            "text": "CORS"
          },
          {
            "id": "apig-24",
            "text": "Request and Response Transformations"
          },
          {
            "id": "apig-25",
            "text": "CloudWatch Logging and Metrics"
          },
          {
            "id": "apig-26",
            "text": "AWS WAF Integration"
          },
          {
            "id": "apig-27",
            "text": "VPC Links"
          },
          {
            "id": "apig-28",
            "text": "API Gateway vs Application Load Balancer"
          },
          {
            "id": "apig-r1",
            "text": "REST API vs HTTP API vs WebSocket API - Choosing the Right API Gateway Type"
          }
        ]
      },
      {
        "id": "topic-cloudformation",
        "code": "Management",
        "title": "AWS CloudFormation",
        "weight": 3,
        "description": "Model and provision AWS resources declaratively with Infrastructure as Code (IaC).",
        "items": [
          {
            "id": "cfn-4",
            "text": "CloudFormation Infrastructure as Code"
          },
          {
            "id": "cfn-5",
            "text": "CloudFormation Templates"
          },
          {
            "id": "cfn-6",
            "text": "YAML and JSON Templates"
          },
          {
            "id": "cfn-7",
            "text": "CloudFormation Stacks"
          },
          {
            "id": "cfn-8",
            "text": "Stack Creation, Update and Deletion"
          },
          {
            "id": "cfn-9",
            "text": "Parameters"
          },
          {
            "id": "cfn-10",
            "text": "Mappings"
          },
          {
            "id": "cfn-11",
            "text": "Resources"
          },
          {
            "id": "cfn-12",
            "text": "Outputs"
          },
          {
            "id": "cfn-13",
            "text": "Conditions"
          },
          {
            "id": "cfn-14",
            "text": "Intrinsic Functions"
          },
          {
            "id": "cfn-15",
            "text": "Resource Dependencies"
          },
          {
            "id": "cfn-16",
            "text": "Change Sets"
          },
          {
            "id": "cfn-17",
            "text": "Stack Sets"
          },
          {
            "id": "cfn-18",
            "text": "Cross-Account and Cross-Region StackSets"
          },
          {
            "id": "cfn-19",
            "text": "Nested Stacks"
          },
          {
            "id": "cfn-20",
            "text": "Rollback on Failure"
          },
          {
            "id": "cfn-21",
            "text": "Deletion Policies"
          },
          {
            "id": "cfn-23",
            "text": "Drift Detection"
          },
          {
            "id": "cfn-24",
            "text": "CloudFormation Exports and Imports"
          },
          {
            "id": "cfn-25",
            "text": "CloudFormation vs AWS CDK"
          }
        ]
      },
      {
        "id": "topic-eventbridge",
        "code": "Integration",
        "title": "Amazon EventBridge",
        "weight": 3,
        "description": "Serverless event bus service connecting application data from AWS and SaaS applications.",
        "items": [
          {
            "id": "eventbridge-4",
            "text": "EventBridge Event-Driven Architecture"
          },
          {
            "id": "eventbridge-5",
            "text": "Default Event Bus"
          },
          {
            "id": "eventbridge-6",
            "text": "Custom Event Buses"
          },
          {
            "id": "eventbridge-7",
            "text": "Partner Event Buses"
          },
          {
            "id": "eventbridge-8",
            "text": "EventBridge Rules"
          },
          {
            "id": "eventbridge-9",
            "text": "Event Patterns"
          },
          {
            "id": "eventbridge-10",
            "text": "Event Targets"
          },
          {
            "id": "eventbridge-11",
            "text": "Scheduled Events"
          },
          {
            "id": "eventbridge-12",
            "text": "Cross-Account Event Buses"
          },
          {
            "id": "eventbridge-13",
            "text": "Event Bus Resource Policies"
          },
          {
            "id": "eventbridge-14",
            "text": "Event Archive"
          },
          {
            "id": "eventbridge-15",
            "text": "Event Replay"
          },
          {
            "id": "eventbridge-17",
            "text": "Dead-Letter Queues"
          },
          {
            "id": "eventbridge-18",
            "text": "Retry Policies"
          },
          {
            "id": "eventbridge-19",
            "text": "EventBridge Pipes"
          },
          {
            "id": "eventbridge-20",
            "text": "EventBridge vs SNS"
          },
          {
            "id": "eventbridge-21",
            "text": "EventBridge vs CloudWatch Events"
          }
        ]
      },
      {
        "id": "topic-waf",
        "code": "Security",
        "title": "AWS WAF",
        "weight": 2,
        "description": "Web application firewall to protect web applications from common web exploits and bots.",
        "items": [
          {
            "id": "waf-1",
            "text": "Protects CloudFront, Application Load Balancers (ALB), API Gateway, & AppSync"
          },
          {
            "id": "waf-4",
            "text": "AWS WAF Web Application Firewall"
          },
          {
            "id": "waf-5",
            "text": "Web ACLs"
          },
          {
            "id": "waf-6",
            "text": "WAF Rules"
          },
          {
            "id": "waf-7",
            "text": "AWS Managed Rules"
          },
          {
            "id": "waf-8",
            "text": "Custom Rules"
          },
          {
            "id": "waf-9",
            "text": "IP Set Match Rules"
          },
          {
            "id": "waf-10",
            "text": "Rate-Based Rules"
          },
          {
            "id": "waf-11",
            "text": "String and Regex Matching"
          },
          {
            "id": "waf-12",
            "text": "SQL Injection Protection"
          },
          {
            "id": "waf-13",
            "text": "Cross-Site Scripting Protection"
          },
          {
            "id": "waf-14",
            "text": "WAF Rule Priority"
          },
          {
            "id": "waf-15",
            "text": "Allow, Block, Count, CAPTCHA and Challenge Actions"
          },
          {
            "id": "waf-16",
            "text": "WAF on Amazon CloudFront"
          },
          {
            "id": "waf-17",
            "text": "WAF on Application Load Balancer"
          },
          {
            "id": "waf-18",
            "text": "WAF on Amazon API Gateway"
          },
          {
            "id": "waf-19",
            "text": "WAF Logging"
          },
          {
            "id": "waf-21",
            "text": "WAF vs AWS Shield"
          },
          {
            "id": "waf-22",
            "text": "WAF Layer 7 Protection"
          }
        ]
      },
      {
        "id": "topic-shield",
        "code": "Security",
        "title": "AWS Shield",
        "weight": 2,
        "description": "Managed Distributed Denial of Service (DDoS) protection service for AWS applications.",
        "items": [
          {
            "id": "shield-3",
            "text": "AWS Shield Standard"
          },
          {
            "id": "shield-4",
            "text": "AWS Shield Advanced"
          },
          {
            "id": "shield-5",
            "text": "Distributed Denial of Service - DDoS Protection"
          },
          {
            "id": "shield-6",
            "text": "Layer 3 and Layer 4 DDoS Protection"
          },
          {
            "id": "shield-7",
            "text": "Shield Standard Automatic Protection"
          },
          {
            "id": "shield-8",
            "text": "Shield Advanced Enhanced Detection and Mitigation"
          },
          {
            "id": "shield-9",
            "text": "Shield Advanced with CloudFront"
          },
          {
            "id": "shield-10",
            "text": "Shield Advanced with Route 53"
          },
          {
            "id": "shield-11",
            "text": "Shield Advanced with Elastic Load Balancing"
          },
          {
            "id": "shield-12",
            "text": "Shield Advanced with Global Accelerator"
          },
          {
            "id": "shield-13",
            "text": "Shield Advanced AWS WAF Integration"
          },
          {
            "id": "shield-14",
            "text": "Shield Response Team - SRT"
          },
          {
            "id": "shield-15",
            "text": "DDoS Cost Protection"
          },
          {
            "id": "shield-16",
            "text": "Shield Standard vs Shield Advanced"
          },
          {
            "id": "shield-17",
            "text": "Shield vs AWS WAF"
          }
        ]
      },
      {
        "id": "topic-ssm-parameter-store",
        "code": "Security",
        "title": "AWS Systems Manager (Parameter Store)",
        "weight": 2,
        "description": "Secure, hierarchical storage for configuration data management and secrets.",
        "items": [
          {
            "id": "ps-4",
            "text": "Parameter Store Centralized Configuration Storage"
          },
          {
            "id": "ps-5",
            "text": "String Parameters"
          },
          {
            "id": "ps-6",
            "text": "StringList Parameters"
          },
          {
            "id": "ps-7",
            "text": "SecureString Parameters"
          },
          {
            "id": "ps-8",
            "text": "SecureString Encryption with AWS KMS"
          },
          {
            "id": "ps-9",
            "text": "Parameter Hierarchies"
          },
          {
            "id": "ps-10",
            "text": "Parameter Versions"
          },
          {
            "id": "ps-11",
            "text": "Standard Parameters"
          },
          {
            "id": "ps-12",
            "text": "Advanced Parameters"
          },
          {
            "id": "ps-14",
            "text": "IAM Access Control"
          },
          {
            "id": "ps-15",
            "text": "VPC Interface Endpoints"
          },
          {
            "id": "ps-17",
            "text": "Parameter Store Integration with Applications"
          },
          {
            "id": "ps-18",
            "text": "Parameter Store vs Secrets Manager"
          },
          {
            "id": "ps-19",
            "text": "Parameter Store Does Not Provide Built-In Automatic Secret Rotation"
          }
        ]
      },
      {
        "id": "topic-aws-backup",
        "code": "Storage",
        "title": "AWS Backup",
        "weight": 2,
        "description": "Centralized policy-based backup management across AWS services and hybrid workloads.",
        "items": [
          {
            "id": "bak-4",
            "text": "AWS Backup Centralized Backup Management"
          },
          {
            "id": "bak-5",
            "text": "Backup Plans"
          },
          {
            "id": "bak-6",
            "text": "Backup Rules"
          },
          {
            "id": "bak-7",
            "text": "Backup Vaults"
          },
          {
            "id": "bak-8",
            "text": "Backup Vault Encryption"
          },
          {
            "id": "bak-9",
            "text": "Resource Assignments"
          },
          {
            "id": "bak-10",
            "text": "Tag-Based Backup Selection"
          },
          {
            "id": "bak-11",
            "text": "Schedule-Based Backups"
          },
          {
            "id": "bak-12",
            "text": "Backup Retention"
          },
          {
            "id": "bak-13",
            "text": "Lifecycle to Cold Storage"
          },
          {
            "id": "bak-14",
            "text": "Cross-Region Backup Copy"
          },
          {
            "id": "bak-15",
            "text": "Cross-Account Backup Copy"
          },
          {
            "id": "bak-16",
            "text": "AWS Organizations Integration"
          },
          {
            "id": "bak-17",
            "text": "Backup Policies with AWS Organizations"
          },
          {
            "id": "bak-18",
            "text": "Backup Vault Lock"
          },
          {
            "id": "bak-19",
            "text": "Backup Restore Testing"
          },
          {
            "id": "bak-20",
            "text": "Point-in-Time Recovery for Supported Services"
          },
          {
            "id": "bak-21",
            "text": "EC2 Backup"
          },
          {
            "id": "bak-22",
            "text": "EBS Backup"
          },
          {
            "id": "bak-23",
            "text": "RDS and Aurora Backup"
          },
          {
            "id": "bak-24",
            "text": "DynamoDB Backup"
          },
          {
            "id": "bak-25",
            "text": "EFS Backup"
          },
          {
            "id": "bak-26",
            "text": "FSx Backup"
          },
          {
            "id": "bak-27",
            "text": "Storage Gateway Backup"
          },
          {
            "id": "bak-28",
            "text": "S3 Backup"
          },
          {
            "id": "bak-29",
            "text": "AWS Backup Audit Manager"
          },
          {
            "id": "bak-30",
            "text": "AWS Backup vs Native Service Backups"
          }
        ]
      },
      {
        "id": "topic-ecs",
        "code": "Containers",
        "title": "ECS (Elastic Container Service)",
        "weight": 3,
        "description": "Highly scalable Docker container management and orchestration service.",
        "items": [
          {
            "id": "ecs-3",
            "text": "ECS Task Networking Modes: awsvpc (Dedicated ENI per task), host, bridge, none"
          },
          {
            "id": "ecs-6",
            "text": "Amazon ECS Container Orchestration"
          },
          {
            "id": "ecs-7",
            "text": "ECS Clusters"
          },
          {
            "id": "ecs-8",
            "text": "ECS Task Definitions"
          },
          {
            "id": "ecs-9",
            "text": "ECS Tasks"
          },
          {
            "id": "ecs-10",
            "text": "ECS Services"
          },
          {
            "id": "ecs-11",
            "text": "ECS on EC2"
          },
          {
            "id": "ecs-12",
            "text": "ECS on AWS Fargate"
          },
          {
            "id": "ecs-13",
            "text": "ECS Capacity Providers"
          },
          {
            "id": "ecs-14",
            "text": "FARGATE Capacity Provider"
          },
          {
            "id": "ecs-15",
            "text": "FARGATE_SPOT Capacity Provider"
          },
          {
            "id": "ecs-16",
            "text": "EC2 Capacity Providers"
          },
          {
            "id": "ecs-17",
            "text": "ECS Service Auto Scaling"
          },
          {
            "id": "ecs-18",
            "text": "ECS Cluster Auto Scaling"
          },
          {
            "id": "ecs-19",
            "text": "ECS awsvpc Network Mode"
          },
          {
            "id": "ecs-22",
            "text": "ECS Task IAM Role"
          },
          {
            "id": "ecs-23",
            "text": "ECS Task Execution IAM Role"
          },
          {
            "id": "ecs-24",
            "text": "ECS with Amazon ECR"
          },
          {
            "id": "ecs-25",
            "text": "ECS with Application Load Balancer"
          },
          {
            "id": "ecs-26",
            "text": "ECS with Network Load Balancer"
          },
          {
            "id": "ecs-27",
            "text": "ECS Service Discovery"
          },
          {
            "id": "ecs-29",
            "text": "ECS Secrets Manager Integration"
          },
          {
            "id": "ecs-30",
            "text": "ECS Parameter Store Integration"
          },
          {
            "id": "ecs-31",
            "text": "ECS CloudWatch Logs"
          },
          {
            "id": "ecs-32",
            "text": "ECS Container Insights"
          },
          {
            "id": "ecs-33",
            "text": "ECS with Amazon EFS"
          },
          {
            "id": "ecs-36",
            "text": "ECS EC2 vs Fargate Launch Types"
          },
          {
            "id": "ecs-37",
            "text": "ECS vs EKS"
          }
        ]
      },
      {
        "id": "topic-fargate",
        "code": "Containers",
        "title": "AWS Fargate",
        "weight": 2,
        "description": "Serverless compute engine for containers operating with ECS and EKS.",
        "items": [
          {
            "id": "far-1",
            "text": "Serverless Compute for Containers"
          },
          {
            "id": "far-2",
            "text": "Fargate with Amazon ECS"
          },
          {
            "id": "far-3",
            "text": "Fargate with Amazon EKS"
          },
          {
            "id": "far-4",
            "text": "Fargate vs ECS on EC2"
          },
          {
            "id": "far-5",
            "text": "Fargate Task CPU and Memory Configuration"
          },
          {
            "id": "far-6",
            "text": "Fargate awsvpc Networking"
          },
          {
            "id": "far-7",
            "text": "Fargate Security Groups"
          },
          {
            "id": "far-8",
            "text": "Fargate IAM Task Role"
          },
          {
            "id": "far-9",
            "text": "Fargate Task Execution Role"
          },
          {
            "id": "far-10",
            "text": "Fargate with Application Load Balancer"
          },
          {
            "id": "far-11",
            "text": "Fargate Service Auto Scaling"
          },
          {
            "id": "far-12",
            "text": "Fargate Spot"
          },
          {
            "id": "far-13",
            "text": "Fargate Ephemeral Storage"
          },
          {
            "id": "far-14",
            "text": "Fargate with Amazon EFS"
          },
          {
            "id": "far-15",
            "text": "Fargate Logging and Monitoring with CloudWatch"
          },
          {
            "id": "far-16",
            "text": "Fargate with Secrets Manager and Parameter Store"
          },
          {
            "id": "far-17",
            "text": "Fargate Private Subnet Internet Access using NAT Gateway"
          },
          {
            "id": "far-18",
            "text": "Fargate VPC Endpoints for Private AWS Access"
          },
          {
            "id": "far-19",
            "text": "Fargate Pricing - vCPU and Memory Usage"
          },
          {
            "id": "far-20",
            "text": "Fargate vs AWS Lambda"
          }
        ]
      },
      {
        "id": "topic-eks",
        "code": "Containers",
        "title": "EKS (Elastic Kubernetes Service)",
        "weight": 2,
        "description": "Managed Kubernetes service to run Kubernetes applications on AWS.",
        "items": [
          {
            "id": "eks-1",
            "text": "EKS Managed Control Plane & Node Groups (Managed Nodes, Self-Managed, Fargate Profiles)"
          },
          {
            "id": "eks-2",
            "text": "EKS Pod IAM Roles (IRSA - IAM Roles for Service Accounts via OIDC Provider)"
          },
          {
            "id": "eks-4",
            "text": "EKS Persistent Storage Drivers (EBS CSI Driver & EFS CSI Driver)"
          },
          {
            "id": "eks-5",
            "text": "Amazon EKS Managed Kubernetes"
          },
          {
            "id": "eks-6",
            "text": "EKS Control Plane"
          },
          {
            "id": "eks-7",
            "text": "EKS Worker Nodes"
          },
          {
            "id": "eks-8",
            "text": "EKS Managed Node Groups"
          },
          {
            "id": "eks-9",
            "text": "EKS Self-Managed Nodes"
          },
          {
            "id": "eks-10",
            "text": "EKS with AWS Fargate"
          },
          {
            "id": "eks-11",
            "text": "EKS Fargate Profiles"
          },
          {
            "id": "eks-16",
            "text": "Kubernetes Cluster High Availability"
          },
          {
            "id": "eks-17",
            "text": "EKS Multi-AZ Control Plane"
          },
          {
            "id": "eks-23",
            "text": "IAM Roles for Service Accounts - IRSA"
          },
          {
            "id": "eks-25",
            "text": "EKS with Application Load Balancer"
          },
          {
            "id": "eks-27",
            "text": "EKS with EBS"
          },
          {
            "id": "eks-28",
            "text": "EKS with EFS"
          },
          {
            "id": "eks-29",
            "text": "EKS with Amazon ECR"
          },
          {
            "id": "eks-30",
            "text": "EKS Auto Scaling"
          },
          {
            "id": "eks-33",
            "text": "EKS CloudWatch Container Insights"
          },
          {
            "id": "eks-34",
            "text": "EKS Secrets Management"
          },
          {
            "id": "eks-35",
            "text": "EKS Private Endpoint Access"
          },
          {
            "id": "eks-36",
            "text": "EKS Public Endpoint Access"
          },
          {
            "id": "eks-37",
            "text": "EKS vs ECS"
          }
        ]
      },
      {
        "id": "topic-fsx",
        "code": "Storage",
        "title": "Amazon FSx",
        "weight": 2,
        "description": "Feature-rich third-party high-performance file systems (Windows, Lustre, ONTAP, OpenZFS).",
        "items": [
          {
            "id": "fsx-2",
            "text": "FSx for Lustre (HPC high-throughput, sub-millisecond latencies, S3 Data Repository integration)"
          },
          {
            "id": "fsx-3",
            "text": "FSx for NetApp ONTAP (Multi-protocol SMB/NFS/iSCSI, Data Compression & Deduplication)"
          },
          {
            "id": "fsx-4",
            "text": "FSx for OpenZFS (High performance NFS Linux shared storage)"
          },
          {
            "id": "fsx-5",
            "text": "Amazon FSx Managed File Systems"
          },
          {
            "id": "fsx-6",
            "text": "FSx for Windows File Server"
          },
          {
            "id": "fsx-7",
            "text": "FSx for Lustre"
          },
          {
            "id": "fsx-8",
            "text": "FSx for NetApp ONTAP"
          },
          {
            "id": "fsx-9",
            "text": "FSx for OpenZFS"
          },
          {
            "id": "fsx-10",
            "text": "FSx for Windows SMB Protocol"
          },
          {
            "id": "fsx-11",
            "text": "FSx for Windows Active Directory Integration"
          },
          {
            "id": "fsx-12",
            "text": "FSx for Windows Multi-AZ Deployment"
          },
          {
            "id": "fsx-13",
            "text": "FSx for Windows Single-AZ Deployment"
          },
          {
            "id": "fsx-17",
            "text": "FSx for Lustre High-Performance File System"
          },
          {
            "id": "fsx-18",
            "text": "FSx for Lustre Integration with Amazon S3"
          },
          {
            "id": "fsx-19",
            "text": "FSx for Lustre Scratch File Systems"
          },
          {
            "id": "fsx-20",
            "text": "FSx for Lustre Persistent File Systems"
          },
          {
            "id": "fsx-21",
            "text": "FSx for NetApp ONTAP NFS, SMB and iSCSI"
          },
          {
            "id": "fsx-22",
            "text": "FSx for NetApp ONTAP Multi-Protocol Access"
          },
          {
            "id": "fsx-23",
            "text": "FSx for OpenZFS NFS"
          },
          {
            "id": "fsx-24",
            "text": "FSx Storage Capacity and Throughput Capacity"
          },
          {
            "id": "fsx-25",
            "text": "FSx SSD and HDD Storage Options"
          },
          {
            "id": "fsx-26",
            "text": "FSx Automatic Backups"
          },
          {
            "id": "fsx-27",
            "text": "FSx Manual Backups"
          },
          {
            "id": "fsx-28",
            "text": "FSx Encryption at Rest"
          },
          {
            "id": "fsx-29",
            "text": "FSx Encryption in Transit"
          },
          {
            "id": "fsx-30",
            "text": "FSx vs EFS"
          },
          {
            "id": "fsx-31",
            "text": "FSx vs EBS"
          }
        ]
      },
      {
        "id": "topic-storage-gateway",
        "code": "Storage",
        "title": "AWS Storage Gateway",
        "weight": 2,
        "description": "Hybrid storage appliances connecting on-premises environments to AWS cloud storage.",
        "items": [
          {
            "id": "sgw-5",
            "text": "Storage Gateway Hybrid Cloud Storage"
          },
          {
            "id": "sgw-6",
            "text": "S3 File Gateway"
          },
          {
            "id": "sgw-7",
            "text": "FSx File Gateway"
          },
          {
            "id": "sgw-8",
            "text": "Volume Gateway"
          },
          {
            "id": "sgw-9",
            "text": "Tape Gateway"
          },
          {
            "id": "sgw-10",
            "text": "File Gateway NFS Access"
          },
          {
            "id": "sgw-11",
            "text": "File Gateway SMB Access"
          },
          {
            "id": "sgw-12",
            "text": "File Gateway Object Storage in Amazon S3"
          },
          {
            "id": "sgw-13",
            "text": "File Gateway Local Cache"
          },
          {
            "id": "sgw-14",
            "text": "FSx File Gateway with FSx for Windows File Server"
          },
          {
            "id": "sgw-15",
            "text": "Volume Gateway Cached Volumes"
          },
          {
            "id": "sgw-16",
            "text": "Volume Gateway Stored Volumes"
          },
          {
            "id": "sgw-17",
            "text": "iSCSI Block Storage"
          },
          {
            "id": "sgw-18",
            "text": "Volume Gateway EBS Snapshots"
          },
          {
            "id": "sgw-19",
            "text": "Tape Gateway Virtual Tape Library"
          },
          {
            "id": "sgw-20",
            "text": "Tape Gateway Virtual Tape Shelf"
          },
          {
            "id": "sgw-21",
            "text": "Tape Gateway with S3 Glacier Storage Classes"
          },
          {
            "id": "sgw-22",
            "text": "Storage Gateway Hardware Appliance"
          },
          {
            "id": "sgw-23",
            "text": "Storage Gateway VM Appliance"
          },
          {
            "id": "sgw-24",
            "text": "Storage Gateway EC2 Deployment"
          },
          {
            "id": "sgw-25",
            "text": "Storage Gateway Local Cache"
          },
          {
            "id": "sgw-26",
            "text": "Storage Gateway Encryption"
          },
          {
            "id": "sgw-27",
            "text": "Storage Gateway with AWS Backup"
          },
          {
            "id": "sgw-28",
            "text": "Storage Gateway vs DataSync"
          },
          {
            "id": "sgw-29",
            "text": "Storage Gateway vs Snow Family"
          }
        ]
      },
      {
        "id": "topic-redshift",
        "code": "Databases",
        "title": "Amazon Redshift",
        "weight": 2,
        "description": "Petabyte-scale cloud data warehouse for fast SQL analytics and OLAP workloads.",
        "items": [
          {
            "id": "redshift-5",
            "text": "Redshift Data Warehousing"
          },
          {
            "id": "redshift-6",
            "text": "Redshift Massively Parallel Processing - MPP"
          },
          {
            "id": "redshift-7",
            "text": "Redshift Columnar Storage"
          },
          {
            "id": "redshift-8",
            "text": "Redshift Provisioned Clusters"
          },
          {
            "id": "redshift-9",
            "text": "Redshift Serverless"
          },
          {
            "id": "redshift-10",
            "text": "Redshift RA3 Nodes and Managed Storage"
          },
          {
            "id": "redshift-11",
            "text": "Redshift Leader Node and Compute Nodes"
          },
          {
            "id": "redshift-12",
            "text": "Redshift Distribution Styles and Distribution Keys"
          },
          {
            "id": "redshift-13",
            "text": "Redshift Sort Keys"
          },
          {
            "id": "redshift-14",
            "text": "Redshift COPY from Amazon S3"
          },
          {
            "id": "redshift-15",
            "text": "Redshift UNLOAD to Amazon S3"
          },
          {
            "id": "redshift-16",
            "text": "Redshift Spectrum"
          },
          {
            "id": "redshift-18",
            "text": "Redshift Concurrency Scaling"
          },
          {
            "id": "redshift-20",
            "text": "Redshift Data Sharing"
          },
          {
            "id": "redshift-21",
            "text": "Redshift Federated Queries"
          },
          {
            "id": "redshift-22",
            "text": "Redshift Automated and Manual Snapshots"
          },
          {
            "id": "redshift-23",
            "text": "Redshift Cross-Region Snapshot Copy"
          },
          {
            "id": "redshift-24",
            "text": "Redshift Encryption with AWS KMS"
          },
          {
            "id": "redshift-25",
            "text": "Redshift Enhanced VPC Routing"
          },
          {
            "id": "redshift-26",
            "text": "Redshift Elastic Resize and Classic Resize"
          },
          {
            "id": "redshift-27",
            "text": "Redshift vs Amazon RDS"
          },
          {
            "id": "redshift-28",
            "text": "Redshift vs Amazon Athena"
          }
        ]
      },
      {
        "id": "topic-kinesis",
        "code": "Analytics",
        "title": "Amazon Kinesis",
        "weight": 3,
        "description": "Collect, process, and analyze real-time streaming data at scale.",
        "items": [
          {
            "id": "kin-1",
            "text": "Kinesis Data Streams (Real-time ingestion via Shards, Provisioned vs On-Demand capacity)"
          },
          {
            "id": "kin-2",
            "text": "Kinesis Data Firehose (Near-real-time streaming delivery to S3, Redshift, OpenSearch without code)"
          },
          {
            "id": "kin-3",
            "text": "Kinesis Data Analytics (Serverless SQL / Apache Flink over streaming data)"
          },
          {
            "id": "kinesis-4",
            "text": "Kinesis Data Streams"
          },
          {
            "id": "kinesis-5",
            "text": "Kinesis Data Firehose"
          },
          {
            "id": "kinesis-6",
            "text": "Kinesis Data Streams Shards"
          },
          {
            "id": "kinesis-7",
            "text": "Partition Keys"
          },
          {
            "id": "kinesis-8",
            "text": "Shard Capacity"
          },
          {
            "id": "kinesis-9",
            "text": "Data Stream Retention"
          },
          {
            "id": "kinesis-10",
            "text": "Stream Producers"
          },
          {
            "id": "kinesis-11",
            "text": "Stream Consumers"
          },
          {
            "id": "kinesis-12",
            "text": "Enhanced Fan-Out"
          },
          {
            "id": "kinesis-14",
            "text": "On-Demand Stream Capacity Mode"
          },
          {
            "id": "kinesis-15",
            "text": "Provisioned Stream Capacity Mode"
          },
          {
            "id": "kinesis-17",
            "text": "Ordering within a Shard"
          },
          {
            "id": "kinesis-18",
            "text": "Data Firehose Near Real-Time Delivery"
          },
          {
            "id": "kinesis-19",
            "text": "Data Firehose Buffering"
          },
          {
            "id": "kinesis-20",
            "text": "Data Firehose Delivery to S3, Redshift and OpenSearch"
          },
          {
            "id": "kinesis-21",
            "text": "Data Firehose Data Transformation with Lambda"
          },
          {
            "id": "kinesis-22",
            "text": "Kinesis Data Streams vs Data Firehose"
          },
          {
            "id": "kinesis-23",
            "text": "Kinesis vs SQS"
          }
        ]
      },
      {
        "id": "topic-cloudtrail",
        "code": "Management",
        "title": "AWS CloudTrail",
        "weight": 2,
        "description": "Log and audit API calls and account activity across your AWS infrastructure.",
        "items": [
          {
            "id": "ctrail-1",
            "text": "Audit Logging of API Calls across Management Events, Data Events, & Insights Events"
          },
          {
            "id": "ctrail-2",
            "text": "Organization Trails: Centralized S3 Bucket Logging with KMS Encryption & Digest Verification"
          },
          {
            "id": "ctrail-3",
            "text": "CloudTrail API Activity Auditing"
          },
          {
            "id": "ctrail-4",
            "text": "Management Events"
          },
          {
            "id": "ctrail-5",
            "text": "Data Events"
          },
          {
            "id": "ctrail-6",
            "text": "CloudTrail Insights Events"
          },
          {
            "id": "ctrail-7",
            "text": "Event History"
          },
          {
            "id": "ctrail-8",
            "text": "CloudTrail Trails"
          },
          {
            "id": "ctrail-9",
            "text": "Single-Region and Multi-Region Trails"
          },
          {
            "id": "ctrail-10",
            "text": "Organization Trails"
          },
          {
            "id": "ctrail-11",
            "text": "CloudTrail Log Delivery to Amazon S3"
          },
          {
            "id": "ctrail-12",
            "text": "CloudTrail Integration with CloudWatch Logs"
          },
          {
            "id": "ctrail-13",
            "text": "CloudTrail Log File Validation"
          },
          {
            "id": "ctrail-14",
            "text": "CloudTrail Encryption with AWS KMS"
          },
          {
            "id": "ctrail-15",
            "text": "CloudTrail SNS Notifications"
          },
          {
            "id": "ctrail-17",
            "text": "Identifying User Identity and Source IP"
          },
          {
            "id": "ctrail-18",
            "text": "CloudTrail vs CloudWatch"
          },
          {
            "id": "ctrail-19",
            "text": "CloudTrail vs AWS Config"
          }
        ]
      },
      {
        "id": "topic-cloudwatch",
        "code": "Management",
        "title": "Amazon CloudWatch",
        "weight": 3,
        "description": "Observability platform for application monitoring, metrics, log analysis, and alarms.",
        "items": [
          {
            "id": "cw-5",
            "text": "CloudWatch Metrics"
          },
          {
            "id": "cw-6",
            "text": "Namespaces"
          },
          {
            "id": "cw-7",
            "text": "Dimensions"
          },
          {
            "id": "cw-8",
            "text": "Standard AWS Metrics"
          },
          {
            "id": "cw-9",
            "text": "Custom Metrics"
          },
          {
            "id": "cw-10",
            "text": "CloudWatch Alarms"
          },
          {
            "id": "cw-11",
            "text": "Metric Alarms"
          },
          {
            "id": "cw-12",
            "text": "Composite Alarms"
          },
          {
            "id": "cw-13",
            "text": "CloudWatch Dashboards"
          },
          {
            "id": "cw-14",
            "text": "CloudWatch Logs"
          },
          {
            "id": "cw-15",
            "text": "Log Groups and Log Streams"
          },
          {
            "id": "cw-16",
            "text": "CloudWatch Logs Insights"
          },
          {
            "id": "cw-17",
            "text": "Metric Filters"
          },
          {
            "id": "cw-18",
            "text": "CloudWatch Agent"
          },
          {
            "id": "cw-19",
            "text": "EC2 Detailed Monitoring"
          },
          {
            "id": "cw-20",
            "text": "CloudWatch Anomaly Detection"
          },
          {
            "id": "cw-21",
            "text": "CloudWatch Alarm Actions"
          },
          {
            "id": "cw-22",
            "text": "CloudWatch with SNS"
          },
          {
            "id": "cw-23",
            "text": "CloudWatch with Auto Scaling"
          },
          {
            "id": "cw-24",
            "text": "Container Insights"
          },
          {
            "id": "cw-27",
            "text": "CloudWatch vs CloudTrail"
          },
          {
            "id": "cw-28",
            "text": "CloudWatch vs AWS Config"
          }
        ]
      },
      {
        "id": "topic-config",
        "code": "Management",
        "title": "AWS Config",
        "weight": 2,
        "description": "Assess, audit, and evaluate configurations of AWS resources against compliance rules.",
        "items": [
          {
            "id": "cfg-4",
            "text": "AWS Config Resource Configuration Recording"
          },
          {
            "id": "cfg-5",
            "text": "Configuration History"
          },
          {
            "id": "cfg-6",
            "text": "Configuration Snapshots"
          },
          {
            "id": "cfg-7",
            "text": "AWS Config Managed Rules"
          },
          {
            "id": "cfg-8",
            "text": "AWS Config Custom Rules"
          },
          {
            "id": "cfg-9",
            "text": "Compliance Evaluation"
          },
          {
            "id": "cfg-10",
            "text": "Conformance Packs"
          },
          {
            "id": "cfg-11",
            "text": "Automatic Remediation with Systems Manager Automation"
          },
          {
            "id": "cfg-12",
            "text": "Multi-Account and Multi-Region Aggregators"
          },
          {
            "id": "cfg-13",
            "text": "Resource Relationships"
          },
          {
            "id": "cfg-14",
            "text": "Configuration Change Notifications"
          },
          {
            "id": "cfg-15",
            "text": "AWS Config with Organizations"
          },
          {
            "id": "cfg-16",
            "text": "Detective Compliance Controls"
          },
          {
            "id": "cfg-17",
            "text": "AWS Config vs CloudTrail"
          },
          {
            "id": "cfg-18",
            "text": "AWS Config vs CloudWatch"
          }
        ]
      },
      {
        "id": "topic-ram",
        "code": "Security",
        "title": "AWS RAM (Resource Access Manager)",
        "weight": 1,
        "description": "Share AWS resources with any AWS account or within your AWS Organization.",
        "items": [
          {
            "id": "ram-1",
            "text": "Cross-Account Sharing of Subnets, Transit Gateways, Route 53 Rules without duplicating infrastructure"
          },
          {
            "id": "ram-2",
            "text": "Integration with AWS Organizations for automated multi-account sharing"
          },
          {
            "id": "ram-3",
            "text": "RAM Resource Sharing"
          },
          {
            "id": "ram-4",
            "text": "Resource Shares"
          },
          {
            "id": "ram-5",
            "text": "Sharing Resources Across AWS Accounts"
          },
          {
            "id": "ram-6",
            "text": "Sharing Resources within AWS Organizations"
          },
          {
            "id": "ram-7",
            "text": "External Account Invitations"
          },
          {
            "id": "ram-8",
            "text": "Organization Sharing without Invitations"
          },
          {
            "id": "ram-9",
            "text": "RAM Principals"
          },
          {
            "id": "ram-10",
            "text": "RAM Managed Permissions"
          },
          {
            "id": "ram-11",
            "text": "Sharing Transit Gateways"
          },
          {
            "id": "ram-12",
            "text": "VPC Subnet Sharing"
          },
          {
            "id": "ram-13",
            "text": "Route 53 Resolver Rule Sharing"
          },
          {
            "id": "ram-14",
            "text": "Cross-Account Resource Ownership"
          },
          {
            "id": "ram-15",
            "text": "RAM vs VPC Peering"
          }
        ]
      },
      {
        "id": "topic-cognito",
        "code": "Security",
        "title": "Amazon Cognito",
        "weight": 2,
        "description": "Customer identity, authentication, user management, and access control for web/mobile apps.",
        "items": [
          {
            "id": "cog-3",
            "text": "Cognito Lambda Triggers (Pre-sign up, Post-confirmation, Custom Message customization)"
          },
          {
            "id": "cognito-4",
            "text": "Cognito User Pools"
          },
          {
            "id": "cognito-5",
            "text": "Cognito Identity Pools"
          },
          {
            "id": "cognito-6",
            "text": "User Pools for Authentication"
          },
          {
            "id": "cognito-7",
            "text": "Identity Pools for Temporary AWS Credentials"
          },
          {
            "id": "cognito-8",
            "text": "Cognito Hosted UI"
          },
          {
            "id": "cognito-9",
            "text": "User Sign-Up and Sign-In"
          },
          {
            "id": "cognito-10",
            "text": "Multi-Factor Authentication"
          },
          {
            "id": "cognito-11",
            "text": "Password Policies"
          },
          {
            "id": "cognito-12",
            "text": "JWT ID, Access and Refresh Tokens"
          },
          {
            "id": "cognito-13",
            "text": "User Pool App Clients"
          },
          {
            "id": "cognito-14",
            "text": "Social Identity Provider Federation"
          },
          {
            "id": "cognito-15",
            "text": "SAML and OIDC Federation"
          },
          {
            "id": "cognito-16",
            "text": "Identity Pool IAM Roles"
          },
          {
            "id": "cognito-17",
            "text": "Authenticated and Unauthenticated Identities"
          },
          {
            "id": "cognito-18",
            "text": "Cognito with API Gateway"
          },
          {
            "id": "cognito-19",
            "text": "Cognito User Pools vs Identity Pools"
          }
        ]
      },
      {
        "id": "topic-guardduty",
        "code": "Security",
        "title": "Amazon GuardDuty",
        "weight": 2,
        "description": "Continuous threat detection service analyzing AWS account logs and runtime activity.",
        "items": [
          {
            "id": "gd-1",
            "text": "ML Anomaly Detection across VPC Flow Logs, CloudTrail, DNS Logs, EKS Audit Logs, S3, RDS"
          },
          {
            "id": "gd-2",
            "text": "Automated Incident Response Workflows via EventBridge & Lambda"
          },
          {
            "id": "guardduty-3",
            "text": "GuardDuty Managed Threat Detection"
          },
          {
            "id": "guardduty-4",
            "text": "GuardDuty Findings"
          },
          {
            "id": "guardduty-5",
            "text": "CloudTrail Event Analysis"
          },
          {
            "id": "guardduty-6",
            "text": "VPC Flow Log Analysis"
          },
          {
            "id": "guardduty-7",
            "text": "DNS Log Analysis"
          },
          {
            "id": "guardduty-8",
            "text": "S3 Protection"
          },
          {
            "id": "guardduty-9",
            "text": "EKS Protection"
          },
          {
            "id": "guardduty-13",
            "text": "Threat Intelligence and Machine Learning"
          },
          {
            "id": "guardduty-14",
            "text": "GuardDuty EventBridge Integration"
          },
          {
            "id": "guardduty-15",
            "text": "Multi-Account GuardDuty"
          },
          {
            "id": "guardduty-16",
            "text": "Delegated Administrator"
          },
          {
            "id": "guardduty-17",
            "text": "GuardDuty vs Inspector"
          },
          {
            "id": "guardduty-18",
            "text": "GuardDuty vs Macie"
          }
        ]
      },
      {
        "id": "topic-inspector",
        "code": "Security",
        "title": "Amazon Inspector",
        "weight": 1,
        "description": "Automated vulnerability management for EC2, ECR container images, and Lambda.",
        "items": [
          {
            "id": "insp-1",
            "text": "Continuous Automated CVE Vulnerability Scanning for EC2, ECR Images, & Lambda"
          },
          {
            "id": "insp-2",
            "text": "Network Reachability Analysis & Risk Score Evaluation"
          },
          {
            "id": "inspector-3",
            "text": "Inspector Automated Vulnerability Management"
          },
          {
            "id": "inspector-4",
            "text": "EC2 Vulnerability Scanning"
          },
          {
            "id": "inspector-5",
            "text": "Amazon ECR Container Image Scanning"
          },
          {
            "id": "inspector-6",
            "text": "AWS Lambda Function Scanning"
          },
          {
            "id": "inspector-7",
            "text": "Common Vulnerabilities and Exposures - CVEs"
          },
          {
            "id": "inspector-8",
            "text": "Software Package Vulnerability Detection"
          },
          {
            "id": "inspector-9",
            "text": "Network Reachability Findings for EC2"
          },
          {
            "id": "inspector-10",
            "text": "Continuous Scanning"
          },
          {
            "id": "inspector-12",
            "text": "Inspector Findings"
          },
          {
            "id": "inspector-13",
            "text": "Integration with Security Hub"
          },
          {
            "id": "inspector-14",
            "text": "Multi-Account Inspector Management"
          },
          {
            "id": "inspector-15",
            "text": "Inspector vs GuardDuty"
          }
        ]
      },
      {
        "id": "topic-macie",
        "code": "Security",
        "title": "Amazon Macie",
        "weight": 1,
        "description": "Data security service using machine learning to discover sensitive data in S3.",
        "items": [
          {
            "id": "mac-1",
            "text": "Automated Discovery & Classification of PII, Financial Data, and Credentials in S3"
          },
          {
            "id": "mac-2",
            "text": "S3 Bucket Security Assessment (Public Access & Encryption Audit)"
          },
          {
            "id": "macie-3",
            "text": "Macie Sensitive Data Discovery for Amazon S3"
          },
          {
            "id": "macie-4",
            "text": "Automated Sensitive Data Discovery"
          },
          {
            "id": "macie-5",
            "text": "Managed Data Identifiers"
          },
          {
            "id": "macie-6",
            "text": "Custom Data Identifiers"
          },
          {
            "id": "macie-7",
            "text": "Macie Findings"
          },
          {
            "id": "macie-8",
            "text": "S3 Bucket Inventory"
          },
          {
            "id": "macie-9",
            "text": "S3 Security and Access Evaluation"
          },
          {
            "id": "macie-10",
            "text": "Personally Identifiable Information Detection"
          },
          {
            "id": "macie-11",
            "text": "Financial and Credential Data Detection"
          },
          {
            "id": "macie-12",
            "text": "Macie Multi-Account Management"
          },
          {
            "id": "macie-13",
            "text": "EventBridge Integration"
          },
          {
            "id": "macie-14",
            "text": "Macie vs GuardDuty"
          }
        ]
      },
      {
        "id": "topic-security-hub",
        "code": "Security",
        "title": "AWS Security Hub",
        "weight": 2,
        "description": "Centralized posture management and aggregated security findings across AWS services.",
        "items": [
          {
            "id": "shub-1",
            "text": "Centralized Security Posture Dashboard & Compliance Score Aggregator"
          },
          {
            "id": "shub-2",
            "text": "Automated Compliance Checks: CIS AWS Foundations, PCI-DSS, AWS Best Practices"
          },
          {
            "id": "shub-3",
            "text": "Aggregates Findings from GuardDuty, Macie, Inspector, IAM Access Analyzer, WAF"
          },
          {
            "id": "shub-4",
            "text": "Security Hub Centralized Security Findings"
          },
          {
            "id": "shub-6",
            "text": "Security Standards"
          },
          {
            "id": "shub-7",
            "text": "Security Controls"
          },
          {
            "id": "shub-8",
            "text": "AWS Foundational Security Best Practices"
          },
          {
            "id": "shub-9",
            "text": "CIS AWS Foundations Benchmark"
          },
          {
            "id": "shub-10",
            "text": "Security Hub Integrations"
          },
          {
            "id": "shub-11",
            "text": "GuardDuty, Inspector and Macie Findings"
          },
          {
            "id": "shub-12",
            "text": "Cross-Region Aggregation"
          },
          {
            "id": "shub-13",
            "text": "Multi-Account Security Hub"
          },
          {
            "id": "shub-14",
            "text": "Delegated Administrator"
          },
          {
            "id": "shub-16",
            "text": "Security Hub vs GuardDuty"
          }
        ]
      },
      {
        "id": "topic-network-firewall",
        "code": "Security",
        "title": "AWS Network Firewall",
        "weight": 1,
        "description": "Stateful network inspection and filtering service for all VPC traffic.",
        "items": [
          {
            "id": "nf-1",
            "text": "Stateful & Stateless Firewall Engine for VPC Perimeter Protection"
          },
          {
            "id": "nf-2",
            "text": "Suricata-Compatible Intrusion Detection / Prevention System (IDS/IPS)"
          },
          {
            "id": "nf-3",
            "text": "Outbound Domain / FQDN Filtering & Traffic Inspection"
          },
          {
            "id": "nf-4",
            "text": "Network Firewall Managed VPC Firewall"
          },
          {
            "id": "nf-5",
            "text": "Firewall Endpoints"
          },
          {
            "id": "nf-6",
            "text": "Dedicated Firewall Subnets"
          },
          {
            "id": "nf-7",
            "text": "Stateless Rule Groups"
          },
          {
            "id": "nf-8",
            "text": "Stateful Rule Groups"
          },
          {
            "id": "nf-10",
            "text": "Domain List Filtering"
          },
          {
            "id": "nf-11",
            "text": "Network Firewall Policies"
          },
          {
            "id": "nf-12",
            "text": "Route Table Integration"
          },
          {
            "id": "nf-13",
            "text": "Centralized Inspection Architecture"
          },
          {
            "id": "nf-14",
            "text": "Transit Gateway Integration"
          },
          {
            "id": "nf-15",
            "text": "Traffic Logging"
          },
          {
            "id": "nf-17",
            "text": "Network Firewall Layer 3 through Layer 7 Filtering"
          },
          {
            "id": "nf-18",
            "text": "Network Firewall vs Security Groups and NACLs"
          },
          {
            "id": "nf-19",
            "text": "Network Firewall vs AWS WAF"
          }
        ]
      },
      {
        "id": "topic-iam-identity-center",
        "code": "Security",
        "title": "AWS IAM Identity Center",
        "weight": 2,
        "description": "Centralized single sign-on (SSO) management for multi-account AWS environments.",
        "items": [
          {
            "id": "sso-1",
            "text": "Central Portal for Multi-Account SSO Access via AWS Organizations"
          },
          {
            "id": "sso-2",
            "text": "External Identity Provider Integration (Okta, Azure AD / Entra ID, SAML 2.0 / SCIM)"
          },
          {
            "id": "sso-3",
            "text": "Permission Sets & Automated Multi-Account Assignment"
          },
          {
            "id": "sso-4",
            "text": "IAM Identity Center Workforce Single Sign-On"
          },
          {
            "id": "sso-5",
            "text": "Multi-Account AWS Access"
          },
          {
            "id": "sso-6",
            "text": "Permission Sets"
          },
          {
            "id": "sso-7",
            "text": "Users and Groups"
          },
          {
            "id": "sso-8",
            "text": "AWS Organizations Integration"
          },
          {
            "id": "sso-9",
            "text": "External Identity Provider Federation"
          },
          {
            "id": "sso-10",
            "text": "Microsoft Active Directory Integration"
          },
          {
            "id": "sso-11",
            "text": "SAML 2.0 Federation"
          },
          {
            "id": "sso-12",
            "text": "SCIM User and Group Provisioning"
          },
          {
            "id": "sso-13",
            "text": "Temporary AWS Account Credentials"
          },
          {
            "id": "sso-14",
            "text": "Assignment of Permission Sets to Accounts"
          },
          {
            "id": "sso-15",
            "text": "IAM Identity Center vs IAM Users"
          },
          {
            "id": "sso-16",
            "text": "Permission Sets vs Service Control Policies"
          }
        ]
      },
      {
        "id": "topic-step-functions",
        "code": "Integration",
        "title": "AWS Step Functions",
        "weight": 2,
        "description": "Visual workflow orchestrator to build serverless applications and microservice pipelines.",
        "items": [
          {
            "id": "sf-4",
            "text": "Step Functions State Machines"
          },
          {
            "id": "sf-5",
            "text": "Standard Workflows"
          },
          {
            "id": "sf-6",
            "text": "Express Workflows"
          },
          {
            "id": "sf-7",
            "text": "Task States"
          },
          {
            "id": "sf-8",
            "text": "Choice States"
          },
          {
            "id": "sf-9",
            "text": "Parallel States"
          },
          {
            "id": "sf-10",
            "text": "Map States"
          },
          {
            "id": "sf-13",
            "text": "Retry Logic"
          },
          {
            "id": "sf-14",
            "text": "Catch Error Handling"
          },
          {
            "id": "sf-15",
            "text": "Service Integrations"
          },
          {
            "id": "sf-16",
            "text": "Lambda Integration"
          },
          {
            "id": "sf-17",
            "text": "Human Approval and Callback Patterns"
          },
          {
            "id": "sf-18",
            "text": "Execution History"
          },
          {
            "id": "sf-19",
            "text": "Step Functions for Workflow Orchestration"
          },
          {
            "id": "sf-20",
            "text": "Step Functions vs SQS and EventBridge"
          },
          {
            "id": "sf-r1",
            "text": "Standard Workflows vs Express Workflows - Duration, Exactly-Once vs At-Least-Once, and Use Case Selection"
          }
        ]
      },
      {
        "id": "topic-dms",
        "code": "Management",
        "title": "AWS DMS (Database Migration Service)",
        "weight": 2,
        "description": "Migrate databases to AWS quickly and securely with minimal downtime.",
        "items": [
          {
            "id": "dms-4",
            "text": "DMS Database Migration"
          },
          {
            "id": "dms-5",
            "text": "Homogeneous Database Migrations"
          },
          {
            "id": "dms-6",
            "text": "Heterogeneous Database Migrations"
          },
          {
            "id": "dms-7",
            "text": "DMS Source Endpoints"
          },
          {
            "id": "dms-8",
            "text": "DMS Target Endpoints"
          },
          {
            "id": "dms-9",
            "text": "DMS Replication Instances"
          },
          {
            "id": "dms-11",
            "text": "Full Load Migration"
          },
          {
            "id": "dms-12",
            "text": "Change Data Capture - CDC"
          },
          {
            "id": "dms-13",
            "text": "Full Load plus CDC"
          },
          {
            "id": "dms-14",
            "text": "Minimal Downtime Migration"
          },
          {
            "id": "dms-15",
            "text": "AWS Schema Conversion Tool and DMS Schema Conversion"
          },
          {
            "id": "dms-16",
            "text": "Schema Conversion for Heterogeneous Migrations"
          },
          {
            "id": "dms-17",
            "text": "DMS Migration Tasks"
          },
          {
            "id": "dms-18",
            "text": "DMS Premigration Assessments"
          },
          {
            "id": "dms-19",
            "text": "DMS Multi-AZ Replication"
          },
          {
            "id": "dms-20",
            "text": "DMS Amazon S3 Sources and Targets"
          },
          {
            "id": "dms-21",
            "text": "DMS Encryption"
          },
          {
            "id": "dms-22",
            "text": "DMS Monitoring with CloudWatch"
          },
          {
            "id": "dms-23",
            "text": "DMS vs AWS Application Migration Service"
          },
          {
            "id": "dms-r1",
            "text": "Homogeneous vs Heterogeneous Database Migration - Schema Conversion Tool Requirement"
          }
        ]
      },
      {
        "id": "topic-datasync",
        "code": "Management",
        "title": "AWS DataSync",
        "weight": 1,
        "description": "Automated high-speed data transfer service for online data movement to AWS.",
        "items": [
          {
            "id": "datasync-4",
            "text": "DataSync Online Data Transfer Service"
          },
          {
            "id": "datasync-5",
            "text": "DataSync Agents"
          },
          {
            "id": "datasync-6",
            "text": "DataSync Locations"
          },
          {
            "id": "datasync-7",
            "text": "DataSync Tasks"
          },
          {
            "id": "datasync-8",
            "text": "NFS Transfers"
          },
          {
            "id": "datasync-9",
            "text": "SMB Transfers"
          },
          {
            "id": "datasync-10",
            "text": "Amazon S3 Transfers"
          },
          {
            "id": "datasync-11",
            "text": "Amazon EFS Transfers"
          },
          {
            "id": "datasync-12",
            "text": "Amazon FSx Transfers"
          },
          {
            "id": "datasync-13",
            "text": "On-Premises to AWS Data Transfer"
          },
          {
            "id": "datasync-14",
            "text": "AWS Storage Service to AWS Storage Service Transfers"
          },
          {
            "id": "datasync-15",
            "text": "Scheduled Transfers"
          },
          {
            "id": "datasync-16",
            "text": "Bandwidth Throttling"
          },
          {
            "id": "datasync-17",
            "text": "Incremental Transfers"
          },
          {
            "id": "datasync-18",
            "text": "Data Integrity Verification"
          },
          {
            "id": "datasync-19",
            "text": "Encryption in Transit"
          },
          {
            "id": "datasync-20",
            "text": "IAM Roles for AWS Storage Access"
          },
          {
            "id": "datasync-21",
            "text": "DataSync Filtering"
          },
          {
            "id": "datasync-22",
            "text": "DataSync Monitoring with CloudWatch"
          },
          {
            "id": "datasync-23",
            "text": "DataSync vs Storage Gateway"
          },
          {
            "id": "datasync-24",
            "text": "DataSync vs AWS Snow Family"
          }
        ]
      },
      {
        "id": "topic-mgn",
        "code": "Management",
        "title": "AWS MGN (Application Migration Service)",
        "weight": 1,
        "description": "Automated lift-and-shift migration service for server rehosting on AWS.",
        "items": [
          {
            "id": "mgn-1",
            "text": "Primary Migration Service for Lift-and-Shift Server Rehosting to AWS"
          },
          {
            "id": "mgn-4",
            "text": "MGN Lift-and-Shift Rehost Migration"
          },
          {
            "id": "mgn-5",
            "text": "MGN Replication Agent"
          },
          {
            "id": "mgn-6",
            "text": "Block-Level Continuous Replication"
          },
          {
            "id": "mgn-7",
            "text": "MGN Staging Area Subnet"
          },
          {
            "id": "mgn-8",
            "text": "Replication Servers"
          },
          {
            "id": "mgn-9",
            "text": "Source Servers"
          },
          {
            "id": "mgn-10",
            "text": "Launch Settings"
          },
          {
            "id": "mgn-11",
            "text": "EC2 Launch Templates"
          },
          {
            "id": "mgn-12",
            "text": "Test Instances"
          },
          {
            "id": "mgn-16",
            "text": "Continuous Replication before Cutover"
          },
          {
            "id": "mgn-17",
            "text": "Minimal Downtime Server Migration"
          },
          {
            "id": "mgn-18",
            "text": "Post-Launch Actions"
          },
          {
            "id": "mgn-19",
            "text": "MGN Migration Lifecycle"
          },
          {
            "id": "mgn-20",
            "text": "MGN Monitoring and Migration Status"
          },
          {
            "id": "mgn-21",
            "text": "MGN vs DMS"
          },
          {
            "id": "mgn-22",
            "text": "MGN vs DataSync"
          },
          {
            "id": "mgn-rep-1",
            "text": "MGN Testing and Cutover Process"
          }
        ]
      },
      {
        "id": "topic-snow-family",
        "code": "Management",
        "title": "AWS Snow Family",
        "weight": 1,
        "description": "Physical devices for offline data migration and edge computing in remote environments.",
        "items": [
          {
            "id": "snow-1",
            "text": "Physical Offline Data Transfer Devices: Snowcone (8TB), Snowball Edge (80TB), Snowmobile (100PB)"
          },
          {
            "id": "snow-2",
            "text": "Edge Compute (Running EC2 instances & IoT Greengrass in disconnected locations)"
          },
          {
            "id": "snow-3",
            "text": "Encrypted Hardware Devices with Integrated KMS Key Security"
          },
          {
            "id": "snow-4",
            "text": "AWS Snow Family Offline and Edge Data Transfer"
          },
          {
            "id": "snow-5",
            "text": "AWS Snowcone"
          },
          {
            "id": "snow-6",
            "text": "AWS Snowball Edge"
          },
          {
            "id": "snow-7",
            "text": "AWS Snowmobile"
          },
          {
            "id": "snow-8",
            "text": "Offline Data Transfer to and from Amazon S3"
          },
          {
            "id": "snow-9",
            "text": "Snowball Edge Storage Optimized"
          },
          {
            "id": "snow-10",
            "text": "Snowball Edge Compute Optimized"
          },
          {
            "id": "snow-11",
            "text": "Edge Computing on Snow Devices"
          },
          {
            "id": "snow-12",
            "text": "Amazon EC2-Compatible Compute on Snowball Edge"
          },
          {
            "id": "snow-14",
            "text": "Snow Device Encryption"
          },
          {
            "id": "snow-15",
            "text": "AWS KMS Integration"
          },
          {
            "id": "snow-17",
            "text": "DataSync on Snowcone"
          },
          {
            "id": "snow-18",
            "text": "Snow Family Jobs"
          },
          {
            "id": "snow-19",
            "text": "Import and Export Workflows"
          },
          {
            "id": "snow-20",
            "text": "Snow Family vs DataSync"
          },
          {
            "id": "snow-21",
            "text": "Snow Family for Limited or No Network Connectivity"
          }
        ]
      },
      {
        "id": "topic-transfer-family",
        "code": "Management",
        "title": "AWS Transfer Family",
        "weight": 1,
        "description": "Fully managed support for file transfers directly into and out of Amazon S3 and Amazon EFS.",
        "items": [
          {
            "id": "tf-1",
            "text": "Managed SFTP, FTPS, and FTP File Transfers directly to S3 and EFS"
          },
          {
            "id": "tf-2",
            "text": "Authentication Integration with Active Directory, Cognito, or Custom IdP"
          },
          {
            "id": "tf-3",
            "text": "Transfer Family Managed File Transfer"
          },
          {
            "id": "tf-4",
            "text": "SFTP"
          },
          {
            "id": "tf-5",
            "text": "FTPS"
          },
          {
            "id": "tf-6",
            "text": "FTP"
          },
          {
            "id": "tf-7",
            "text": "AS2"
          },
          {
            "id": "tf-8",
            "text": "Amazon S3 Storage Backend"
          },
          {
            "id": "tf-9",
            "text": "Amazon EFS Storage Backend"
          },
          {
            "id": "tf-10",
            "text": "Service-Managed Users"
          },
          {
            "id": "tf-11",
            "text": "Custom Identity Providers"
          },
          {
            "id": "tf-12",
            "text": "Active Directory Integration"
          },
          {
            "id": "tf-13",
            "text": "Publicly Accessible Endpoints"
          },
          {
            "id": "tf-14",
            "text": "VPC-Hosted Endpoints"
          },
          {
            "id": "tf-15",
            "text": "Security Groups for VPC Endpoints"
          },
          {
            "id": "tf-18",
            "text": "Encryption with AWS KMS"
          },
          {
            "id": "tf-19",
            "text": "CloudWatch Logging"
          },
          {
            "id": "tf-20",
            "text": "Transfer Family for Existing File Transfer Clients"
          },
          {
            "id": "tf-21",
            "text": "Transfer Family vs DataSync"
          }
        ]
      },
      {
        "id": "topic-athena",
        "code": "Analytics",
        "title": "Amazon Athena",
        "weight": 2,
        "description": "Serverless interactive SQL query service for data stored in Amazon S3.",
        "items": [
          {
            "id": "ath-1",
            "text": "Serverless Standard SQL Queries on S3 Data (CSV, JSON, Apache Parquet, ORC)"
          },
          {
            "id": "ath-3",
            "text": "Athena Federated Query (Querying databases outside S3 via Lambda connectors)"
          },
          {
            "id": "athena-4",
            "text": "Athena Serverless SQL Queries"
          },
          {
            "id": "athena-5",
            "text": "Querying Data Directly in Amazon S3"
          },
          {
            "id": "athena-6",
            "text": "Athena Integration with AWS Glue Data Catalog"
          },
          {
            "id": "athena-7",
            "text": "Tables, Databases and Schemas"
          },
          {
            "id": "athena-8",
            "text": "Partitioning"
          },
          {
            "id": "athena-9",
            "text": "Columnar Formats - Parquet and ORC"
          },
          {
            "id": "athena-10",
            "text": "Compression"
          },
          {
            "id": "athena-11",
            "text": "Athena Workgroups"
          },
          {
            "id": "athena-12",
            "text": "Query Result Locations in S3"
          },
          {
            "id": "athena-14",
            "text": "Athena Federated Query"
          },
          {
            "id": "athena-15",
            "text": "Athena Encryption"
          },
          {
            "id": "athena-16",
            "text": "Athena Pay Per Data Scanned"
          },
          {
            "id": "athena-17",
            "text": "Athena Query Optimization"
          },
          {
            "id": "athena-18",
            "text": "Athena vs Amazon Redshift"
          },
          {
            "id": "athena-19",
            "text": "Athena vs Amazon EMR"
          }
        ]
      },
      {
        "id": "topic-glue",
        "code": "Analytics",
        "title": "AWS Glue",
        "weight": 2,
        "description": "Serverless data integration service for ETL data preparation and metadata cataloging.",
        "items": [
          {
            "id": "glue-4",
            "text": "Glue Serverless Data Integration"
          },
          {
            "id": "glue-5",
            "text": "Glue Data Catalog"
          },
          {
            "id": "glue-6",
            "text": "Glue Crawlers"
          },
          {
            "id": "glue-7",
            "text": "Glue ETL Jobs"
          },
          {
            "id": "glue-9",
            "text": "Glue Triggers"
          },
          {
            "id": "glue-10",
            "text": "Glue Workflows"
          },
          {
            "id": "glue-11",
            "text": "Glue Connections"
          },
          {
            "id": "glue-12",
            "text": "Glue Data Catalog with Athena"
          },
          {
            "id": "glue-13",
            "text": "Glue Data Catalog with Redshift Spectrum"
          },
          {
            "id": "glue-14",
            "text": "Glue Data Catalog with Lake Formation"
          },
          {
            "id": "glue-16",
            "text": "Glue Spark-Based ETL"
          },
          {
            "id": "glue-19",
            "text": "Glue vs EMR"
          }
        ]
      },
      {
        "id": "topic-emr",
        "code": "Analytics",
        "title": "Amazon EMR",
        "weight": 1,
        "description": "Big data platform for processing vast amounts of data using open-source tools (Spark, Hadoop).",
        "items": [
          {
            "id": "emr-3",
            "text": "EMR Managed Big Data Platform"
          },
          {
            "id": "emr-4",
            "text": "Apache Hadoop"
          },
          {
            "id": "emr-5",
            "text": "Apache Spark"
          },
          {
            "id": "emr-6",
            "text": "Apache Hive"
          },
          {
            "id": "emr-7",
            "text": "Presto and Trino Workloads"
          },
          {
            "id": "emr-8",
            "text": "EMR on Amazon EC2"
          },
          {
            "id": "emr-9",
            "text": "EMR Serverless"
          },
          {
            "id": "emr-10",
            "text": "EMR on EKS"
          },
          {
            "id": "emr-11",
            "text": "EMR Primary, Core and Task Nodes"
          },
          {
            "id": "emr-14",
            "text": "Spot Instances for EMR Task Capacity"
          },
          {
            "id": "emr-15",
            "text": "EMRFS with Amazon S3"
          },
          {
            "id": "emr-16",
            "text": "HDFS Storage"
          },
          {
            "id": "emr-17",
            "text": "EMR Auto Scaling"
          },
          {
            "id": "emr-18",
            "text": "EMR Managed Scaling"
          },
          {
            "id": "emr-19",
            "text": "EMR Cluster High Availability"
          },
          {
            "id": "emr-20",
            "text": "EMR Security and IAM Roles"
          },
          {
            "id": "emr-21",
            "text": "EMR vs Athena"
          },
          {
            "id": "emr-22",
            "text": "EMR vs AWS Glue"
          }
        ]
      },
      {
        "id": "topic-opensearch",
        "code": "Analytics",
        "title": "Amazon OpenSearch Service",
        "weight": 2,
        "description": "Operational analytics, log monitoring, and real-time application search engine.",
        "items": [
          {
            "id": "os-1",
            "text": "Real-Time Log Analytics, Application Search, & OpenSearch Dashboards (Kibana)"
          },
          {
            "id": "os-3",
            "text": "OpenSearch Managed Search and Analytics"
          },
          {
            "id": "os-4",
            "text": "OpenSearch Domains"
          },
          {
            "id": "os-5",
            "text": "Data Nodes"
          },
          {
            "id": "os-7",
            "text": "Multi-AZ Deployment"
          },
          {
            "id": "os-8",
            "text": "EBS Storage"
          },
          {
            "id": "os-9",
            "text": "OpenSearch Dashboards"
          },
          {
            "id": "os-10",
            "text": "Full-Text Search"
          },
          {
            "id": "os-11",
            "text": "Log Analytics"
          },
          {
            "id": "os-12",
            "text": "UltraWarm Storage"
          },
          {
            "id": "os-14",
            "text": "Automated Snapshots"
          },
          {
            "id": "os-15",
            "text": "VPC Access"
          },
          {
            "id": "os-16",
            "text": "Encryption at Rest"
          },
          {
            "id": "os-17",
            "text": "Node-to-Node Encryption"
          },
          {
            "id": "os-18",
            "text": "Fine-Grained Access Control"
          },
          {
            "id": "os-19",
            "text": "OpenSearch Serverless"
          },
          {
            "id": "os-20",
            "text": "Integration with CloudWatch Logs"
          },
          {
            "id": "os-21",
            "text": "Integration with Kinesis Data Firehose"
          },
          {
            "id": "os-22",
            "text": "OpenSearch vs CloudWatch Logs Insights"
          }
        ]
      },
      {
        "id": "topic-ssm",
        "code": "Management",
        "title": "AWS Systems Manager (SSM)",
        "weight": 2,
        "description": "Operations hub for AWS and hybrid instances to automate tasks and manage configurations.",
        "items": [
          {
            "id": "ssm-2",
            "text": "SSM Session Manager (Secure SSH-less shell access without open inbound ports or bastions)"
          },
          {
            "id": "ssm-4",
            "text": "Systems Manager Managed Nodes"
          },
          {
            "id": "ssm-5",
            "text": "SSM Agent"
          },
          {
            "id": "ssm-6",
            "text": "Session Manager"
          },
          {
            "id": "ssm-7",
            "text": "Run Command"
          },
          {
            "id": "ssm-8",
            "text": "Patch Manager"
          },
          {
            "id": "ssm-9",
            "text": "State Manager"
          },
          {
            "id": "ssm-10",
            "text": "Inventory"
          },
          {
            "id": "ssm-11",
            "text": "Automation"
          },
          {
            "id": "ssm-12",
            "text": "Maintenance Windows"
          },
          {
            "id": "ssm-16",
            "text": "Hybrid and Multicloud Managed Nodes"
          },
          {
            "id": "ssm-17",
            "text": "IAM Roles for Systems Manager"
          },
          {
            "id": "ssm-18",
            "text": "VPC Interface Endpoints for Systems Manager"
          },
          {
            "id": "ssm-19",
            "text": "Systems Manager without SSH or RDP"
          },
          {
            "id": "ssm-20",
            "text": "Systems Manager Parameter Store Integration"
          }
        ]
      },
      {
        "id": "topic-trusted-advisor",
        "code": "Management",
        "title": "AWS Trusted Advisor",
        "weight": 1,
        "description": "Real-time guidance to help provision resources following AWS best practices.",
        "items": [
          {
            "id": "ta-1",
            "text": "5 Optimization Pillars: Cost Optimization, Performance, Security, Fault Tolerance, Service Limits"
          },
          {
            "id": "ta-2",
            "text": "Core Checks (Basic Support) vs Full Checks (Business/Enterprise Support)"
          },
          {
            "id": "ta-3",
            "text": "Trusted Advisor Best-Practice Recommendations"
          },
          {
            "id": "ta-4",
            "text": "Cost Optimization Checks"
          },
          {
            "id": "ta-5",
            "text": "Performance Checks"
          },
          {
            "id": "ta-6",
            "text": "Security Checks"
          },
          {
            "id": "ta-7",
            "text": "Fault Tolerance Checks"
          },
          {
            "id": "ta-8",
            "text": "Service Quotas Checks"
          },
          {
            "id": "ta-9",
            "text": "Operational Excellence Recommendations"
          },
          {
            "id": "ta-10",
            "text": "Trusted Advisor Recommendations and Status"
          },
          {
            "id": "ta-12",
            "text": "Multi-Account Recommendations with AWS Organizations"
          },
          {
            "id": "ta-13",
            "text": "Trusted Advisor vs Compute Optimizer"
          }
        ]
      },
      {
        "id": "topic-compute-optimizer",
        "code": "Management",
        "title": "AWS Compute Optimizer",
        "weight": 1,
        "description": "ML-driven recommendations to optimal AWS compute resources for your workloads.",
        "items": [
          {
            "id": "co-1",
            "text": "ML Right-Sizing Recommendations for EC2 Instances, EBS Volumes, ECS Fargate, & Lambda"
          },
          {
            "id": "co-2",
            "text": "Identifies Over-Provisioned and Under-Provisioned Infrastructure Resources"
          },
          {
            "id": "co-3",
            "text": "Compute Optimizer Rightsizing Recommendations"
          },
          {
            "id": "co-4",
            "text": "EC2 Instance Recommendations"
          },
          {
            "id": "co-5",
            "text": "EC2 Auto Scaling Group Recommendations"
          },
          {
            "id": "co-6",
            "text": "EBS Volume Recommendations"
          },
          {
            "id": "co-7",
            "text": "Lambda Function Recommendations"
          },
          {
            "id": "co-8",
            "text": "ECS on Fargate Recommendations"
          },
          {
            "id": "co-9",
            "text": "Performance Risk"
          },
          {
            "id": "co-10",
            "text": "Utilization Metrics"
          },
          {
            "id": "co-11",
            "text": "CloudWatch Metrics Analysis"
          },
          {
            "id": "co-12",
            "text": "Rightsizing for Cost and Performance"
          },
          {
            "id": "co-14",
            "text": "Compute Optimizer vs Trusted Advisor"
          },
          {
            "id": "co-15",
            "text": "Compute Optimizer vs Cost Explorer"
          }
        ]
      },
      {
        "id": "topic-cost-explorer",
        "code": "Management",
        "title": "AWS Cost Explorer",
        "weight": 1,
        "description": "Visualize, understand, and manage your AWS costs and usage over time.",
        "items": [
          {
            "id": "ce-1",
            "text": "Visualize Historical & Forecasted AWS Cost and Usage Data"
          },
          {
            "id": "ce-4",
            "text": "Cost Explorer Cost and Usage Analysis"
          },
          {
            "id": "ce-5",
            "text": "Historical Cost Analysis"
          },
          {
            "id": "ce-6",
            "text": "Cost Forecasting"
          },
          {
            "id": "ce-7",
            "text": "Filtering Costs"
          },
          {
            "id": "ce-8",
            "text": "Grouping Costs"
          },
          {
            "id": "ce-9",
            "text": "Cost by Service"
          },
          {
            "id": "ce-10",
            "text": "Cost by Account"
          },
          {
            "id": "ce-11",
            "text": "Cost by Region"
          },
          {
            "id": "ce-12",
            "text": "Cost Allocation Tags"
          },
          {
            "id": "ce-13",
            "text": "Reserved Instance Utilization and Coverage"
          },
          {
            "id": "ce-14",
            "text": "Savings Plans Utilization and Coverage"
          },
          {
            "id": "ce-15",
            "text": "Rightsizing Recommendations"
          },
          {
            "id": "ce-16",
            "text": "Cost Anomaly Investigation"
          },
          {
            "id": "ce-17",
            "text": "Cost Explorer vs AWS Budgets"
          }
        ]
      },
      {
        "id": "topic-budgets",
        "code": "Management",
        "title": "AWS Budgets",
        "weight": 1,
        "description": "Set custom budgets that alert you when cost or usage exceeds your threshold.",
        "items": [
          {
            "id": "budgets-4",
            "text": "AWS Budgets Cost Budgets"
          },
          {
            "id": "budgets-5",
            "text": "Usage Budgets"
          },
          {
            "id": "budgets-6",
            "text": "Reserved Instance Budgets"
          },
          {
            "id": "budgets-7",
            "text": "Savings Plans Budgets"
          },
          {
            "id": "budgets-8",
            "text": "Actual Cost Alerts"
          },
          {
            "id": "budgets-9",
            "text": "Forecasted Cost Alerts"
          },
          {
            "id": "budgets-10",
            "text": "Email and SNS Notifications"
          },
          {
            "id": "budgets-11",
            "text": "Budget Thresholds"
          },
          {
            "id": "budgets-12",
            "text": "Budget Actions"
          },
          {
            "id": "budgets-16",
            "text": "AWS Budgets vs Cost Explorer"
          }
        ]
      },
      {
        "id": "topic-documentdb",
        "code": "Databases",
        "title": "Amazon DocumentDB",
        "weight": 1,
        "description": "Fully managed MongoDB-compatible document database for JSON workloads.",
        "items": [
          {
            "id": "doc-1",
            "text": "Decoupled Compute & Storage Architecture Replicated across 3 Availability Zones"
          },
          {
            "id": "doc-2",
            "text": "DocumentDB Read Replicas (Up to 15 read replicas) & KMS Storage Encryption"
          },
          {
            "id": "documentdb-3",
            "text": "DocumentDB MongoDB-Compatible Document Database"
          },
          {
            "id": "documentdb-4",
            "text": "DocumentDB Clusters"
          },
          {
            "id": "documentdb-5",
            "text": "DocumentDB Instances and Cluster Storage"
          },
          {
            "id": "documentdb-6",
            "text": "DocumentDB Primary and Replica Instances"
          },
          {
            "id": "documentdb-7",
            "text": "DocumentDB Read Scaling with Replicas"
          },
          {
            "id": "documentdb-8",
            "text": "DocumentDB Multi-AZ High Availability"
          },
          {
            "id": "documentdb-9",
            "text": "DocumentDB Automatic Failover"
          },
          {
            "id": "documentdb-10",
            "text": "DocumentDB Cluster and Reader Endpoints"
          },
          {
            "id": "documentdb-11",
            "text": "DocumentDB Automated Backups and Snapshots"
          },
          {
            "id": "documentdb-12",
            "text": "DocumentDB Point-in-Time Restore"
          },
          {
            "id": "documentdb-13",
            "text": "DocumentDB Encryption with AWS KMS"
          },
          {
            "id": "documentdb-14",
            "text": "DocumentDB TLS Encryption"
          },
          {
            "id": "documentdb-15",
            "text": "DocumentDB VPC and Security Groups"
          },
          {
            "id": "documentdb-16",
            "text": "DocumentDB Use Cases for JSON-Like Document Data"
          },
          {
            "id": "documentdb-17",
            "text": "DocumentDB vs DynamoDB"
          }
        ]
      },
      {
        "id": "topic-neptune",
        "code": "Databases",
        "title": "Amazon Neptune",
        "weight": 1,
        "description": "Fully managed graph database engine built for connected data applications.",
        "items": [
          {
            "id": "nep-1",
            "text": "Graph Data Models: Property Graph (Gremlin) & W3C RDF (SPARQL)"
          },
          {
            "id": "nep-2",
            "text": "Multi-AZ High Availability Architecture with 6-way storage replication"
          },
          {
            "id": "neptune-3",
            "text": "Neptune Managed Graph Database"
          },
          {
            "id": "neptune-4",
            "text": "Neptune Property Graphs"
          },
          {
            "id": "neptune-5",
            "text": "Neptune RDF Graphs"
          },
          {
            "id": "neptune-9",
            "text": "Neptune Clusters and Instances"
          },
          {
            "id": "neptune-10",
            "text": "Neptune Read Replicas"
          },
          {
            "id": "neptune-11",
            "text": "Neptune Multi-AZ High Availability"
          },
          {
            "id": "neptune-12",
            "text": "Neptune Automatic Failover"
          },
          {
            "id": "neptune-13",
            "text": "Neptune Cluster and Reader Endpoints"
          },
          {
            "id": "neptune-14",
            "text": "Neptune Automated Backups and Snapshots"
          },
          {
            "id": "neptune-15",
            "text": "Neptune Encryption with AWS KMS"
          },
          {
            "id": "neptune-16",
            "text": "Neptune VPC Deployment"
          },
          {
            "id": "neptune-17",
            "text": "Neptune Graph Use Cases - Social, Fraud and Knowledge Graphs"
          }
        ]
      },
      {
        "id": "topic-mq",
        "code": "Integration",
        "title": "Amazon MQ",
        "weight": 1,
        "description": "Managed message broker service for Apache ActiveMQ and RabbitMQ.",
        "items": [
          {
            "id": "mq-1",
            "text": "Migration Path for Open-Source Legacy Message Queues (JMS, AMQP, STOMP, MQTT)"
          },
          {
            "id": "mq-2",
            "text": "ActiveMQ High Availability Active/Standby Broker Architecture"
          },
          {
            "id": "mq-3",
            "text": "Amazon MQ Managed Message Broker"
          },
          {
            "id": "mq-4",
            "text": "Apache ActiveMQ"
          },
          {
            "id": "mq-5",
            "text": "RabbitMQ"
          },
          {
            "id": "mq-6",
            "text": "Migration of Existing Message Broker Applications"
          },
          {
            "id": "mq-7",
            "text": "Industry-Standard Messaging Protocols"
          },
          {
            "id": "mq-8",
            "text": "ActiveMQ Active-Standby High Availability"
          },
          {
            "id": "mq-9",
            "text": "Multi-AZ Broker Deployment"
          },
          {
            "id": "mq-10",
            "text": "Broker Storage"
          },
          {
            "id": "mq-11",
            "text": "Encryption in Transit and at Rest"
          },
          {
            "id": "mq-12",
            "text": "VPC and Security Group Integration"
          },
          {
            "id": "mq-13",
            "text": "Amazon MQ vs Amazon SQS"
          },
          {
            "id": "mq-14",
            "text": "Amazon MQ vs Amazon SNS"
          }
        ]
      },
      {
        "id": "topic-ecr",
        "code": "Containers",
        "title": "ECR (Elastic Container Registry)",
        "weight": 1,
        "description": "Fully managed Docker container registry for storing, managing, and deploying images.",
        "items": [
          {
            "id": "ecr-1",
            "text": "ECR Docker Image Repositories (Private vs Public Repositories)"
          },
          {
            "id": "ecr-2",
            "text": "ECR Image Vulnerability Scanning (Basic via Clair vs Enhanced via Amazon Inspector)"
          },
          {
            "id": "ecr-3",
            "text": "ECR Cross-Account Access Policies & Cross-Region Image Replication"
          },
          {
            "id": "ecr-4",
            "text": "ECR Image Tag Immutability & Lifecycle Rules for Old Image Cleanup"
          },
          {
            "id": "ecr-5",
            "text": "Amazon ECR Managed Container Registry"
          },
          {
            "id": "ecr-6",
            "text": "ECR Private Repositories"
          },
          {
            "id": "ecr-7",
            "text": "ECR Public Repositories"
          },
          {
            "id": "ecr-8",
            "text": "ECR Container Images"
          },
          {
            "id": "ecr-9",
            "text": "ECR Image Tags"
          },
          {
            "id": "ecr-11",
            "text": "ECR Authentication"
          },
          {
            "id": "ecr-12",
            "text": "ECR IAM Permissions"
          },
          {
            "id": "ecr-13",
            "text": "ECR Repository Policies"
          },
          {
            "id": "ecr-14",
            "text": "ECR Cross-Account Access"
          },
          {
            "id": "ecr-15",
            "text": "ECR Encryption at Rest"
          },
          {
            "id": "ecr-16",
            "text": "ECR Encryption with AWS KMS"
          },
          {
            "id": "ecr-17",
            "text": "ECR Image Scanning"
          },
          {
            "id": "ecr-18",
            "text": "ECR Enhanced Scanning with Amazon Inspector"
          },
          {
            "id": "ecr-19",
            "text": "ECR Lifecycle Policies"
          },
          {
            "id": "ecr-20",
            "text": "ECR Cross-Region Replication"
          },
          {
            "id": "ecr-23",
            "text": "ECR with Amazon ECS"
          },
          {
            "id": "ecr-24",
            "text": "ECR with Amazon EKS"
          },
          {
            "id": "ecr-25",
            "text": "ECR with AWS Lambda"
          },
          {
            "id": "ecr-26",
            "text": "ECR VPC Interface Endpoints"
          }
        ]
      },
      {
        "id": "topic-msk",
        "code": "Analytics",
        "title": "Amazon MSK (Managed Streaming for Apache Kafka)",
        "weight": 1,
        "description": "Fully managed Apache Kafka service for streaming data pipelines.",
        "items": [
          {
            "id": "msk-1",
            "text": "Fully Managed Apache Kafka Clusters (Provisioned vs Serverless)"
          },
          {
            "id": "msk-3",
            "text": "MSK Managed Apache Kafka"
          },
          {
            "id": "msk-4",
            "text": "MSK Provisioned Clusters"
          },
          {
            "id": "msk-5",
            "text": "MSK Serverless"
          },
          {
            "id": "msk-6",
            "text": "Kafka Brokers"
          },
          {
            "id": "msk-7",
            "text": "Kafka Topics and Partitions"
          },
          {
            "id": "msk-8",
            "text": "Multi-AZ Broker Deployment"
          },
          {
            "id": "msk-9",
            "text": "Replication and High Availability"
          },
          {
            "id": "msk-10",
            "text": "Broker Storage"
          },
          {
            "id": "msk-11",
            "text": "Storage Auto Scaling"
          },
          {
            "id": "msk-12",
            "text": "TLS Encryption"
          },
          {
            "id": "msk-13",
            "text": "Encryption at Rest"
          },
          {
            "id": "msk-14",
            "text": "IAM Access Control"
          },
          {
            "id": "msk-16",
            "text": "VPC Networking"
          },
          {
            "id": "msk-18",
            "text": "MSK Monitoring with CloudWatch"
          },
          {
            "id": "msk-19",
            "text": "MSK vs Kinesis Data Streams"
          }
        ]
      },
      {
        "id": "topic-lake-formation",
        "code": "Analytics",
        "title": "AWS Lake Formation",
        "weight": 1,
        "description": "Build, secure, and manage data lakes quickly with centralized access controls.",
        "items": [
          {
            "id": "lf-1",
            "text": "Centralized Data Lake Governance & Automated S3 Data Ingestion"
          },
          {
            "id": "lf-2",
            "text": "Fine-Grained Access Control (Column-level, Row-level, and Cell-level security)"
          },
          {
            "id": "lf-3",
            "text": "Lake Formation Data Lake Management"
          },
          {
            "id": "lf-4",
            "text": "Centralized Data Lake Permissions"
          },
          {
            "id": "lf-5",
            "text": "Integration with AWS Glue Data Catalog"
          },
          {
            "id": "lf-6",
            "text": "Fine-Grained Data Access"
          },
          {
            "id": "lf-7",
            "text": "Database and Table Permissions"
          },
          {
            "id": "lf-8",
            "text": "Column-Level Permissions"
          },
          {
            "id": "lf-11",
            "text": "Cross-Account Data Sharing"
          },
          {
            "id": "lf-12",
            "text": "Data Lake Administrators"
          },
          {
            "id": "lf-13",
            "text": "Registered Amazon S3 Locations"
          },
          {
            "id": "lf-14",
            "text": "Integration with Athena"
          },
          {
            "id": "lf-15",
            "text": "Integration with Redshift Spectrum"
          },
          {
            "id": "lf-16",
            "text": "Lake Formation vs IAM-Only S3 Permissions"
          }
        ]
      },
      {
        "id": "topic-quicksight",
        "code": "Analytics",
        "title": "Amazon QuickSight",
        "weight": 1,
        "description": "Cloud-native serverless Business Intelligence (BI) service for interactive dashboards.",
        "items": [
          {
            "id": "qs-1",
            "text": "Fast In-Memory Data Engine (SPICE) for rapid interactive visualizations"
          },
          {
            "id": "qs-2",
            "text": "Dashboard Embedding into Web Apps, ML Automated Insights, & Row-Level Security"
          },
          {
            "id": "quicksight-3",
            "text": "QuickSight Business Intelligence"
          },
          {
            "id": "quicksight-4",
            "text": "QuickSight Data Sources"
          },
          {
            "id": "quicksight-5",
            "text": "QuickSight Datasets"
          },
          {
            "id": "quicksight-6",
            "text": "QuickSight Analyses"
          },
          {
            "id": "quicksight-7",
            "text": "QuickSight Dashboards"
          },
          {
            "id": "quicksight-8",
            "text": "SPICE In-Memory Engine"
          },
          {
            "id": "quicksight-9",
            "text": "Direct Query"
          },
          {
            "id": "quicksight-10",
            "text": "Scheduled Dataset Refresh"
          },
          {
            "id": "quicksight-11",
            "text": "Row-Level Security"
          },
          {
            "id": "quicksight-13",
            "text": "Dashboard Sharing"
          },
          {
            "id": "quicksight-15",
            "text": "QuickSight with Athena"
          },
          {
            "id": "quicksight-16",
            "text": "QuickSight with Redshift"
          },
          {
            "id": "quicksight-17",
            "text": "QuickSight with RDS and Aurora"
          }
        ]
      },
      {
        "id": "topic-keyspaces",
        "code": "Databases",
        "title": "Amazon Keyspaces",
        "weight": 1,
        "description": "Scalable, highly available, and managed Apache Cassandra-compatible database.",
        "items": [
          {
            "id": "key-1",
            "text": "Serverless Apache Cassandra API compatibility"
          },
          {
            "id": "key-2",
            "text": "On-Demand vs Provisioned Capacity Modes & KMS Data Encryption"
          },
          {
            "id": "keyspaces-3",
            "text": "Keyspaces Apache Cassandra-Compatible Database"
          },
          {
            "id": "keyspaces-4",
            "text": "Keyspaces Serverless Architecture"
          },
          {
            "id": "keyspaces-5",
            "text": "Keyspaces Tables and Partition Keys"
          },
          {
            "id": "keyspaces-6",
            "text": "Keyspaces On-Demand Capacity"
          },
          {
            "id": "keyspaces-7",
            "text": "Keyspaces Provisioned Capacity"
          },
          {
            "id": "keyspaces-8",
            "text": "Keyspaces Auto Scaling"
          },
          {
            "id": "keyspaces-9",
            "text": "Keyspaces Multi-Region Replication"
          },
          {
            "id": "keyspaces-10",
            "text": "Keyspaces Consistency"
          },
          {
            "id": "keyspaces-11",
            "text": "Keyspaces Time to Live - TTL"
          },
          {
            "id": "keyspaces-13",
            "text": "Keyspaces Encryption at Rest"
          },
          {
            "id": "keyspaces-14",
            "text": "Keyspaces IAM Authentication and Authorization"
          },
          {
            "id": "keyspaces-15",
            "text": "Keyspaces VPC Interface Endpoints"
          },
          {
            "id": "keyspaces-16",
            "text": "Keyspaces Use Cases for Cassandra Workloads"
          }
        ]
      },
      {
        "id": "topic-timestream",
        "code": "Databases",
        "title": "Amazon Timestream",
        "weight": 1,
        "description": "Fast, scalable, and serverless time-series database for IoT and operational metrics.",
        "items": [
          {
            "id": "ts-1",
            "text": "Auto-Tiering Storage: In-Memory Store (Fast recent writes) to Magnetic Store (Cost-effective analytics)"
          },
          {
            "id": "ts-2",
            "text": "Built-in Time-Series SQL Analytics Functions (Smoothing, Interpolation, Rate of Change)"
          },
          {
            "id": "timestream-3",
            "text": "Timestream Serverless Time-Series Database"
          },
          {
            "id": "timestream-4",
            "text": "Timestream Tables and Time-Series Records"
          },
          {
            "id": "timestream-5",
            "text": "Timestream Memory Store"
          },
          {
            "id": "timestream-6",
            "text": "Timestream Magnetic Store"
          },
          {
            "id": "timestream-7",
            "text": "Timestream Retention Policies"
          },
          {
            "id": "timestream-8",
            "text": "Timestream Automatic Data Tiering"
          },
          {
            "id": "timestream-10",
            "text": "Timestream Time-Series Analytics"
          },
          {
            "id": "timestream-11",
            "text": "Timestream Encryption at Rest"
          },
          {
            "id": "timestream-13",
            "text": "Timestream Use Cases - IoT, DevOps and Application Metrics"
          },
          {
            "id": "timestream-14",
            "text": "Timestream vs General-Purpose Databases"
          }
        ]
      },
      {
        "id": "topic-control-tower",
        "code": "Management",
        "title": "AWS Control Tower",
        "weight": 2,
        "description": "Set up and govern a secure, multi-account AWS landing zone environment.",
        "items": [
          {
            "id": "ct-1",
            "text": "Automated Multi-Account Landing Zone Best Practices Setup"
          },
          {
            "id": "ct-2",
            "text": "Guardrails: Preventive Guardrails (SCPs) vs Detective Guardrails (Config rules)"
          },
          {
            "id": "ct-3",
            "text": "Account Factory for automated standardized account provisioning"
          },
          {
            "id": "ct-4",
            "text": "Control Tower Multi-Account Landing Zone"
          },
          {
            "id": "ct-5",
            "text": "AWS Organizations Integration"
          },
          {
            "id": "ct-6",
            "text": "Control Tower Governed OUs"
          },
          {
            "id": "ct-7",
            "text": "Account Factory"
          },
          {
            "id": "ct-8",
            "text": "Preventive Controls"
          },
          {
            "id": "ct-9",
            "text": "Detective Controls"
          },
          {
            "id": "ct-10",
            "text": "Proactive Controls"
          },
          {
            "id": "ct-11",
            "text": "Mandatory, Strongly Recommended and Elective Controls"
          },
          {
            "id": "ct-12",
            "text": "Control Tower Dashboard"
          },
          {
            "id": "ct-13",
            "text": "Log Archive Account"
          },
          {
            "id": "ct-14",
            "text": "Audit Account"
          },
          {
            "id": "ct-15",
            "text": "Centralized Logging"
          },
          {
            "id": "ct-16",
            "text": "AWS Config Integration"
          },
          {
            "id": "ct-17",
            "text": "Service Control Policy Integration"
          },
          {
            "id": "ct-18",
            "text": "Account Enrollment"
          },
          {
            "id": "ct-20",
            "text": "Control Tower vs AWS Organizations"
          }
        ]
      },
      {
        "id": "topic-beanstalk",
        "code": "Compute",
        "title": "AWS Elastic Beanstalk",
        "weight": 2,
        "description": "PaaS platform for quickly deploying and scaling web applications and services.",
        "items": [
          {
            "id": "eb-1",
            "text": "Beanstalk Environments: Web Server Environment vs Worker Environment (SQS Daemon)"
          },
          {
            "id": "eb-3",
            "text": "Beanstalk Configuration Files (.ebextensions / Procfile) & Platform Updates"
          },
          {
            "id": "eb-4",
            "text": "Decoupled External RDS Database Architecture Best Practices"
          },
          {
            "id": "beanstalk-5",
            "text": "Elastic Beanstalk Platform as a Service"
          },
          {
            "id": "beanstalk-6",
            "text": "Elastic Beanstalk Applications"
          },
          {
            "id": "beanstalk-7",
            "text": "Elastic Beanstalk Environments"
          },
          {
            "id": "beanstalk-8",
            "text": "Web Server Environments"
          },
          {
            "id": "beanstalk-9",
            "text": "Worker Environments"
          },
          {
            "id": "beanstalk-10",
            "text": "Elastic Beanstalk Environment Tiers"
          },
          {
            "id": "beanstalk-11",
            "text": "Managed EC2 Infrastructure"
          },
          {
            "id": "beanstalk-12",
            "text": "Elastic Beanstalk with Auto Scaling"
          },
          {
            "id": "beanstalk-13",
            "text": "Elastic Beanstalk with Elastic Load Balancing"
          },
          {
            "id": "beanstalk-14",
            "text": "Elastic Beanstalk Application Versions"
          },
          {
            "id": "beanstalk-15",
            "text": "Elastic Beanstalk Environment Configuration"
          },
          {
            "id": "beanstalk-16",
            "text": "Elastic Beanstalk Deployment Policies"
          },
          {
            "id": "beanstalk-20",
            "text": "Immutable Deployment"
          },
          {
            "id": "beanstalk-22",
            "text": "Blue-Green Deployment using Environment Swap"
          },
          {
            "id": "beanstalk-23",
            "text": "Elastic Beanstalk Environment Variables"
          },
          {
            "id": "beanstalk-25",
            "text": "Elastic Beanstalk Monitoring with CloudWatch"
          },
          {
            "id": "beanstalk-26",
            "text": "Elastic Beanstalk Logs"
          },
          {
            "id": "beanstalk-27",
            "text": "Elastic Beanstalk with RDS"
          },
          {
            "id": "beanstalk-28",
            "text": "Elastic Beanstalk vs CloudFormation"
          }
        ]
      },
      {
        "id": "topic-batch",
        "code": "Compute",
        "title": "AWS Batch",
        "weight": 1,
        "description": "Fully managed batch processing for containerized batch workloads at scale.",
        "items": [
          {
            "id": "bat-1",
            "text": "AWS Batch Architecture: Compute Environments (Managed vs Unmanaged, Fargate vs Spot EC2)"
          },
          {
            "id": "bat-3",
            "text": "Automated Job Scheduling & Dependency Workflow Pipelines"
          },
          {
            "id": "batch-4",
            "text": "AWS Batch Managed Batch Processing"
          },
          {
            "id": "batch-5",
            "text": "Batch Jobs"
          },
          {
            "id": "batch-6",
            "text": "Job Definitions"
          },
          {
            "id": "batch-7",
            "text": "Job Queues"
          },
          {
            "id": "batch-8",
            "text": "Compute Environments"
          },
          {
            "id": "batch-9",
            "text": "Managed Compute Environments"
          },
          {
            "id": "batch-11",
            "text": "AWS Batch with Amazon EC2"
          },
          {
            "id": "batch-12",
            "text": "AWS Batch with EC2 Spot Instances"
          },
          {
            "id": "batch-13",
            "text": "AWS Batch with AWS Fargate"
          },
          {
            "id": "batch-14",
            "text": "Job Scheduling"
          },
          {
            "id": "batch-15",
            "text": "Job Dependencies"
          },
          {
            "id": "batch-18",
            "text": "Retry Strategies"
          },
          {
            "id": "batch-19",
            "text": "Job Timeouts"
          },
          {
            "id": "batch-20",
            "text": "IAM Roles for AWS Batch"
          },
          {
            "id": "batch-21",
            "text": "AWS Batch with Amazon ECR"
          },
          {
            "id": "batch-22",
            "text": "AWS Batch with CloudWatch Logs"
          },
          {
            "id": "batch-23",
            "text": "AWS Batch vs AWS Lambda"
          },
          {
            "id": "batch-24",
            "text": "AWS Batch vs Amazon ECS"
          }
        ]
      },
      {
        "id": "topic-global-accelerator",
        "code": "Networking",
        "title": "AWS Global Accelerator",
        "weight": 2,
        "description": "Networking service using static Anycast IPs over AWS global private backbone to improve application availability.",
        "items": [
          {
            "id": "ga-1",
            "text": "2 Static Anycast IP Addresses Routing Traffic to Nearest AWS Edge Location"
          },
          {
            "id": "ga-2",
            "text": "AWS Global Backbone Routing for TCP/UDP Latency Reduction"
          },
          {
            "id": "ga-3",
            "text": "Endpoint Groups & Automatic Health-Check Failover (ALB, NLB, EC2, Elastic IP)"
          },
          {
            "id": "ga-4",
            "text": "Global Accelerator Anycast Static IP Addresses"
          },
          {
            "id": "ga-5",
            "text": "Global Accelerator Standard Accelerators"
          },
          {
            "id": "ga-6",
            "text": "Global Accelerator Listeners"
          },
          {
            "id": "ga-7",
            "text": "Global Accelerator Endpoint Groups"
          },
          {
            "id": "ga-8",
            "text": "Global Accelerator Endpoints"
          },
          {
            "id": "ga-9",
            "text": "Supported Endpoints - ALB, NLB, EC2 and Elastic IP"
          },
          {
            "id": "ga-10",
            "text": "Global Accelerator Health Checks"
          },
          {
            "id": "ga-11",
            "text": "Global Accelerator Automatic Failover"
          },
          {
            "id": "ga-12",
            "text": "Global Accelerator Traffic Dials"
          },
          {
            "id": "ga-13",
            "text": "Global Accelerator Endpoint Weights"
          },
          {
            "id": "ga-14",
            "text": "Global Accelerator TCP and UDP Traffic"
          },
          {
            "id": "ga-15",
            "text": "Global Accelerator AWS Global Network Routing"
          },
          {
            "id": "ga-16",
            "text": "Global Accelerator Multi-Region Applications"
          },
          {
            "id": "ga-17",
            "text": "Global Accelerator Static Entry Point"
          },
          {
            "id": "ga-18",
            "text": "Global Accelerator vs Amazon CloudFront"
          },
          {
            "id": "ga-19",
            "text": "Global Accelerator vs Route 53"
          }
        ]
      },
      {
        "id": "topic-cdk",
        "code": "Management",
        "title": "AWS CDK (Cloud Development Kit)",
        "weight": 2,
        "description": "Model cloud infrastructure using programming languages (TypeScript, Python, Java, Go).",
        "items": [
          {
            "id": "cdk-4",
            "text": "AWS CDK Infrastructure as Code"
          },
          {
            "id": "cdk-12",
            "text": "CDK Synthesis to CloudFormation"
          }
        ]
      }
    ],
    "questions": []
  },
  {
    "id": "comptia-sec-plus",
    "code": "CompTIA Security+",
    "title": "CompTIA Security+ (SY0-701)",
    "description": "Establishes core cybersecurity knowledge for infrastructure security, threat management, and identity controls.",
    "passingScore": 75,
    "timeLimitMinutes": 90,
    "badgeColor": "from-emerald-500 to-teal-600",
    "topics": [
      {
        "id": "topic-sec-crypto",
        "code": "Core Concepts",
        "title": "Cryptography & Zero Trust Architecture",
        "weight": 20,
        "description": "CIA Triad, Zero Trust principles, symmetric & asymmetric encryption algorithms.",
        "items": [
          {
            "id": "sec-1",
            "text": "CIA Triad (Confidentiality, Integrity, Availability)"
          },
          {
            "id": "sec-2",
            "text": "Zero Trust Architecture (Never Trust, Always Verify)"
          },
          {
            "id": "sec-3",
            "text": "Symmetric Encryption (AES-256, ChaCha20)"
          },
          {
            "id": "sec-4",
            "text": "Asymmetric Encryption (RSA, ECC, Diffie-Hellman)"
          },
          {
            "id": "sec-5",
            "text": "Hashing Algorithms (SHA-256, SHA-3) & Salted Hashes"
          }
        ]
      },
      {
        "id": "topic-sec-threats",
        "code": "Threats & Attacks",
        "title": "Threat Actors, Social Engineering & Malware",
        "weight": 25,
        "description": "Phishing variants, ransomware, web application exploits, and threat actor profiling.",
        "items": [
          {
            "id": "sec-6",
            "text": "Phishing, Spear Phishing, Whaling & Smishing Attacks"
          },
          {
            "id": "sec-7",
            "text": "Ransomware, Trojans, Rootkits & Logic Bombs"
          },
          {
            "id": "sec-8",
            "text": "Web Application Exploits: SQL Injection, XSS, CSRF"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q-sec-1",
        "topicId": "topic-sec-crypto",
        "difficulty": "Easy",
        "type": "single",
        "question": "An organization implements a policy requiring all users to authenticate using both a password and a push notification on a registered smartphone. Which security concept is demonstrated?",
        "options": [
          "Single Sign-On (SSO)",
          "Multi-Factor Authentication (MFA)",
          "Federated Identity Management",
          "Role-Based Access Control (RBAC)"
        ],
        "correctAnswers": [
          1
        ],
        "explanation": "MFA requires two or more distinct authentication factors from different categories (Something you know: password + Something you have: smartphone)."
      }
    ]
  }
];
