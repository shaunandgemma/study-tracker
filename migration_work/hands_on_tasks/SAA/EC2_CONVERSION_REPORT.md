# SAA / EC2 Hands-On Tasks Batch Conversion Report

Generated: 2026-08-01T18:05:56.426Z

## Executive Summary

* **Total EC2 Source Records**: 27
* **Eligible Records**: 27 (all marked `needs-minor-source-cleanup`)
* **Converted & Approved**: 25
* **Integrated into Application**: 25 (in `src/data/tasks/ec2Tasks.js`)
* **Duplicates Excluded**: 0
* **Review Required / Flagged**: 2
* **Recommended for Another Topic**: 2
* **Console-only Tasks**: 0
* **CLI-only Tasks**: 0
* **Both Console & CLI Modes**: 27
* **Tasks with Linked Flashcards**: 27

---

## Technical & Security Corrections Applied

1. **Step 1 Login Instruction Sanitization**: Sanitized Step 1 instructions across all tasks to specify IAM user or lab role with EC2 permissions instead of root user / broad AdministratorAccess.
2. **SSH / RDP Security Warning**: Added explicit security warnings for tasks involving inbound SSH (port 22) or RDP (port 3389) rules, recommending restricted source IP ranges (/32) or Systems Manager Session Manager.
3. **Destructive Commands Warning**: Flagged destructive commands (`mkfs`, `wipefs`, `rm -rf`, `umount`, `delete-volume`, `delete-snapshot`, `terminate-instances`, `deregister-image`) and ensured warning banners are present.
4. **Elastic IP Cleanup Instructions**: Ensured explicit EIP release instructions are included in the cleanup section to prevent unattached IPv4 charges.
5. **Obsolete Exam Tips Filtered**: Filtered out SOA-C02 and DVA-C02 specific exam tips; retained SAA-C03 exam tips.
6. **HTML Sanitization**: Converted all HTML tags and decoded HTML entities into plain text.

---

## Task Conversion Audit Table

| Source ID | Task ID | Title | Difficulty (Inferred) | Duration (Inferred) | Modes | Flashcards | Status |
|---|---|---|---|---|---|---|---|
| 1 | `task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001` | Launch an EC2 instance using the AWS Console | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 2 | `task-saa-ec2-launch-an-ec2-instance-using-the-aws-cli-002` | Launch an EC2 instance using the AWS CLI | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 3 | `task-saa-ec2-connect-to-an-ec2-instance-using-ssh-or-rdp-003` | Connect to an EC2 instance using SSH or RDP | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 4 | `task-saa-ec2-create-and-attach-an-ebs-volume-to-an-ec2-instance-004` | Create and attach an EBS volume to an EC2 instance | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 5 | `task-saa-ec2-create-an-ami-from-an-ec2-instance-and-launch-a-new-instance-from-the-ami-005` | Create an AMI from an EC2 instance and launch a new instance from the AMI | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 6 | `task-saa-ec2-configure-a-security-group-for-http-and-ssh-006` | Configure a security group for HTTP and SSH | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 7 | `task-saa-ec2-set-up-a-key-pair-and-connect-to-ec2-007` | Set up a key pair and connect to EC2 | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 8 | `task-saa-ec2-stop-start-and-terminate-an-ec2-instance-008` | Stop, start, and terminate an EC2 instance | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 9 | `task-saa-ec2-set-up-an-ec2-auto-scaling-group-009` | Set up an EC2 Auto Scaling Group | Easy | 20 mins | Console + CLI | Yes | Review Required (topic-ec2-asg) |
| 10 | `task-saa-ec2-attach-an-iam-role-to-ec2-for-secure-s3-access-010` | Attach an IAM role to EC2 for secure S3 access | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 11 | `task-saa-ec2-configure-ec2-instance-metadata-options-011` | Configure EC2 instance metadata options | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 12 | `task-saa-ec2-set-up-a-placement-group-012` | Set up a placement group | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 13 | `task-saa-ec2-launch-a-spot-instance-013` | Launch a Spot Instance | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 14 | `task-saa-ec2-use-ec2-instance-connect-014` | Use EC2 Instance Connect | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 15 | `task-saa-ec2-monitor-ec2-instance-metrics-with-cloudwatch-015` | Monitor EC2 instance metrics with CloudWatch | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 16 | `task-saa-ec2-compare-ec2-pricing-models-016` | Compare EC2 pricing models | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 17 | `task-saa-ec2-configure-and-use-enis-and-elastic-ips-with-ec2-017` | Configure and use ENIs and Elastic IPs with EC2 | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 18 | `task-saa-ec2-compare-security-groups-and-nacls-for-ec2-networking-018` | Compare Security Groups and NACLs for EC2 networking | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 19 | `task-saa-ec2-use-ec2-image-builder-to-automate-ami-creation-019` | Use EC2 Image Builder to automate AMI creation | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 20 | `task-saa-ec2-demonstrate-ec2-hibernate-and-stop-start-lifecycle-020` | Demonstrate EC2 Hibernate and Stop/Start lifecycle | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 21 | `task-saa-ec2-recover-an-ec2-instance-and-troubleshoot-common-issues-021` | Recover an EC2 instance and troubleshoot common issues | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 22 | `task-saa-ec2-set-up-ec2-capacity-reservations-022` | Set up EC2 capacity reservations | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 23 | `task-saa-ec2-launch-ec2-instances-in-public-and-private-subnets-and-assign-public-private-ips-023` | Launch EC2 instances in public and private subnets and assign public/private IPs | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 24 | `task-saa-ec2-use-ec2-launch-templates-and-launch-configurations-024` | Use EC2 launch templates and launch configurations | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 25 | `task-saa-ec2-compare-ec2-placement-strategies-cluster-partition-and-spread-025` | Compare EC2 placement strategies: cluster, partition, and spread | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 26 | `task-saa-ec2-integrate-ec2-with-alb-and-nlb-026` | Integrate EC2 with ALB and NLB | Medium | 30 mins | Console + CLI | Yes | Review Required (topic-elb) |
| 27 | `task-saa-ec2-use-ssm-session-manager-and-patch-manager-with-ec2-027` | Use SSM Session Manager and Patch Manager with EC2 | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |

---

## Review Required Output Details

- **Task 9 (Set up an EC2 Auto Scaling Group)**: Primary objective belongs to topic 'topic-ec2-asg' rather than 'topic-ec2'
- **Task 26 (Integrate EC2 with ALB and NLB)**: Primary objective belongs to topic 'topic-elb' rather than 'topic-ec2'
