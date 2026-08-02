# SAA / Load Balancing & Auto Scaling Hands-On Tasks Conversion Report

Generated: 2026-08-01T18:16:15.640Z

## Executive Summary

* **Source Batch File**: `hands_on_tasks/batches/SAA/load-balancing-auto-scaling.json`
* **Total Batch Source Records**: 20
* **Quarantined EC2 Review Tasks Resolved**: 2 (EC2 Task 9: `Set up an EC2 Auto Scaling Group` $\rightarrow$ `topic-ec2-asg`; EC2 Task 26: `Integrate EC2 with ALB and NLB` $\rightarrow$ `topic-elb`)
* **Total Integrated Tasks**: 22 (`13` in `src/data/tasks/elbTasks.js` under `topic-elb`, `9` in `src/data/tasks/autoScalingTasks.js` under `topic-ec2-asg`)
* **Duplicates Excluded**: 0
* **Review Required / Flagged**: 0
* **Console-only Tasks**: 0
* **CLI-only Tasks**: 0
* **Both Console & CLI Modes**: 22
* **Tasks with Linked Flashcards**: 20

---

## Technical & Security Corrections Applied

1. **Topic-Based Partitioning**: Categorized tasks cleanly between `topic-elb` (13 tasks) and `topic-ec2-asg` (9 tasks).
2. **EC2 Quarantine Resolution**: Successfully resolved EC2 Review Tasks 9 & 26 into their proper ELB and Auto Scaling topics without duplication.
3. **Step 1 Login Instruction Sanitization**: Sanitized Step 1 instructions across all tasks to specify IAM user or lab role with ELB or Auto Scaling permissions instead of root user / broad AdministratorAccess.
4. **ELB Cost Warnings**: Added explicit non-numeric cost warnings for ELB tasks regarding load balancer hourly running time (~$0.0225/hr), LCU usage charges, public IPv4 addressing, and data processing.
5. **Auto Scaling Cost Warnings**: Added explicit warnings stating Auto Scaling itself is free, but users are charged for the EC2 instances, EBS volumes, and load balancers launched by the ASG.
6. **Destructive Commands Warning**: Flagged destructive commands (`delete-load-balancer`, `delete-target-group`, `delete-auto-scaling-group`, `delete-launch-template`, `terminate-instances`, `delete-listener`, `delete-rule`).
7. **Cleanup Sequence**: Ensured proper deletion sequence in cleanup sections (detach ASG $\rightarrow$ delete listeners/rules $\rightarrow$ delete load balancer $\rightarrow$ delete target groups / set ASG capacity to 0 $ightarrow$ delete ASG $ightarrow$ delete launch template).
8. **Obsolete Exam Tips Filtered**: Filtered out SOA-C02 and DVA-C02 specific exam tips; retained SAA-C03 exam tips.
9. **HTML Sanitization**: Converted all HTML tags and decoded HTML entities into plain text.

---

## Task Conversion Audit Table

| Source ID | Task ID | Topic ID | Title | Difficulty (Inferred) | Duration (Inferred) | Flashcards | Status |
|---|---|---|---|---|---|---|---|
| 1 | `task-saa-elb-create-an-alb-in-front-of-an-auto-scaling-group-001` | `topic-elb` | Create an ALB in front of an Auto Scaling Group | Medium | 30 mins | Yes | Approved & Integrated |
| 2 | `task-saa-elb-create-a-network-load-balancer-002` | `topic-elb` | Create a Network Load Balancer | Medium | 30 mins | Yes | Approved & Integrated |
| 3 | `task-saa-elb-create-a-gateway-load-balancer-style-architecture-003` | `topic-elb` | Create a Gateway Load Balancer style architecture | Hard | 45 mins | Yes | Approved & Integrated |
| 4 | `task-saa-elb-configure-alb-path-based-listener-rules-004` | `topic-elb` | Configure ALB path-based listener rules | Medium | 30 mins | Yes | Approved & Integrated |
| 5 | `task-saa-asg-add-an-auto-scaling-target-tracking-policy-005` | `topic-ec2-asg` | Add an Auto Scaling target tracking policy | Medium | 30 mins | Yes | Approved & Integrated |
| 6 | `task-saa-asg-tune-cooldown-and-instance-warmup-006` | `topic-ec2-asg` | Tune cooldown and instance warmup | Medium | 30 mins | Yes | Approved & Integrated |
| 7 | `task-saa-asg-use-health-checks-and-termination-policies-007` | `topic-ec2-asg` | Use health checks and termination policies | Medium | 30 mins | Yes | Approved & Integrated |
| 8 | `task-saa-elb-add-https-to-an-alb-and-redirect-http-008` | `topic-elb` | Add HTTPS to an ALB and redirect HTTP | Hard | 45 mins | Yes | Approved & Integrated |
| 9 | `task-saa-elb-sticky-sessions-on-an-alb-target-group-009` | `topic-elb` | Sticky Sessions on an ALB target group | Medium | 30 mins | Yes | Approved & Integrated |
| 10 | `task-saa-elb-cross-zone-load-balancing-traffic-distribution-010` | `topic-elb` | Cross-Zone Load Balancing traffic distribution | Medium | 30 mins | Yes | Approved & Integrated |
| 11 | `task-saa-elb-deregistration-delay-and-connection-draining-011` | `topic-elb` | Deregistration Delay and connection draining | Medium | 30 mins | Yes | Approved & Integrated |
| 12 | `task-saa-asg-create-and-roll-out-auto-scaling-launch-template-versions-012` | `topic-ec2-asg` | Create and roll out Auto Scaling launch template versions | Medium | 30 mins | Yes | Approved & Integrated |
| 13 | `task-saa-asg-configure-an-asg-mixed-instances-policy-013` | `topic-ec2-asg` | Configure an ASG mixed instances policy | Hard | 45 mins | Yes | Approved & Integrated |
| 14 | `task-saa-asg-compare-ec2-and-elb-health-checks-in-an-auto-scaling-group-014` | `topic-ec2-asg` | Compare EC2 and ELB health checks in an Auto Scaling group | Easy | 20 mins | Yes | Approved & Integrated |
| 15 | `task-saa-asg-scaling-types-comparison-015` | `topic-ec2-asg` | Scaling Types Comparison | Easy | 20 mins | Yes | Approved & Integrated |
| 16 | `task-saa-asg-lifecycle-hooks-016` | `topic-ec2-asg` | Lifecycle Hooks | Hard | 45 mins | Yes | Approved & Integrated |
| 17 | `task-saa-elb-alb-websockets-017` | `topic-elb` | ALB + WebSockets | Hard | 45 mins | Yes | Approved & Integrated |
| 18 | `task-saa-elb-compare-internal-and-internet-facing-load-balancers-018` | `topic-elb` | Compare internal and internet-facing load balancers | Easy | 20 mins | Yes | Approved & Integrated |
| 19 | `task-saa-elb-enable-alb-access-logs-019` | `topic-elb` | Enable ALB access logs | Medium | 30 mins | No | Approved & Integrated |
| 20 | `task-saa-elb-test-alb-deletion-protection-020` | `topic-elb` | Test ALB deletion protection | Easy | 20 mins | No | Approved & Integrated |
| EC2-9 | `task-saa-asg-set-up-an-ec2-auto-scaling-group-009` | `topic-ec2-asg` | Set up an EC2 Auto Scaling Group | Easy | 20 mins | Yes | Resolved from EC2 Quarantine |
| EC2-26 | `task-saa-elb-integrate-ec2-with-alb-and-nlb-026` | `topic-elb` | Integrate EC2 with ALB and NLB | Medium | 30 mins | Yes | Resolved from EC2 Quarantine |

---

## Review Required Output Details

No tasks required quarantine. All 22 ELB & Auto Scaling tasks passed schema validation and technical safety checks.
