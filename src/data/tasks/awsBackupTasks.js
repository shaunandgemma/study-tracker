/** AWS Backup / Disaster Recovery Tasks (SAA-C03) */
export const AWS_BACKUP_TASKS = [
  {
    "id": "task-saa-backup-dr-tiers-pilot-light-warm-standby-008",
    "examCode": "aws-saa-c03",
    "topicId": "topic-aws-backup",
    "title": "Implementing Disaster Recovery Tiers: Pilot Light and Warm Standby",
    "slug": "implementing-disaster-recovery-tiers-pilot-light-and-warm-standby",
    "service": "AWS Backup",
    "feature": "Disaster Recovery Strategy Design",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Evaluate Recovery Time Objective (RTO) and Recovery Point Objective (RPO) trade-offs across the four AWS disaster recovery strategies: backup-and-restore, pilot light, warm standby, and multi-site active-active. Design and simulate a pilot light and warm standby configuration for a representative workload.",
    "status": "published",
    "tags": [
      "Disaster Recovery",
      "Pilot Light",
      "Warm Standby",
      "RTO",
      "RPO",
      "AWS Backup",
      "Medium"
    ],
    "flow": [
      "Understand RTO and RPO definitions and how they relate to business requirements",
      "Compare the four DR strategies on cost, RTO and RPO",
      "Design a pilot light configuration for a sample workload",
      "Design a warm standby configuration for the same workload",
      "Simulate a regional failure and describe recovery steps",
      "Clean up disposable lab resources"
    ],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Recovery Time Objective (RTO)",
        "body": "RTO is the maximum acceptable time to restore service after a disruption. It is a business requirement, not an automatic guarantee. Lower RTO requires more expensive architectures."
      },
      {
        "id": "concept-2",
        "title": "Recovery Point Objective (RPO)",
        "body": "RPO is the maximum acceptable data-loss window, measured in time before the failure. Lower RPO requires more frequent backups or synchronous replication. Asynchronous cross-region replication does not provide zero RPO."
      },
      {
        "id": "concept-3",
        "title": "Backup and Restore",
        "body": "The lowest-cost strategy. Infrastructure may need to be fully recreated after a disaster. RTO and RPO are typically the highest of the four strategies. Restore procedures must be tested regularly."
      },
      {
        "id": "concept-4",
        "title": "Pilot Light",
        "body": "Core services (such as a minimal database replica or AMI) remain running at minimal scale. Other resources are provisioned during recovery. Provides lower RTO than backup-and-restore at moderate cost."
      },
      {
        "id": "concept-5",
        "title": "Warm Standby",
        "body": "A scaled-down but fully functional environment runs continuously. Recovery involves scaling up capacity. Provides faster RTO than pilot light at higher ongoing cost."
      },
      {
        "id": "concept-6",
        "title": "Multi-Site Active-Active",
        "body": "Multiple full-scale production environments actively serve traffic simultaneously. Provides the lowest RTO (near-zero) and RPO at the highest cost and operational complexity. Requires data replication and conflict resolution."
      }
    ],
    "whyItMatters": "The SAA-C03 exam tests your ability to select the appropriate DR strategy based on RTO and RPO requirements and cost constraints. Understanding the four strategies and their trade-offs is a core architectural skill. Asynchronous replication across regions does not guarantee zero RPO — data in transit may be lost during a regional failure.",
    "values": [
      {
        "label": "Backup and Restore RTO/RPO",
        "value": "Highest (hours) / Highest data-loss risk"
      },
      {
        "label": "Pilot Light RTO/RPO",
        "value": "Moderate (tens of minutes) / Lower data-loss risk"
      },
      {
        "label": "Warm Standby RTO/RPO",
        "value": "Low (minutes) / Low data-loss risk"
      },
      {
        "label": "Multi-Site Active-Active RTO/RPO",
        "value": "Near-zero / Lowest data-loss risk"
      }
    ],
    "costWarning": "Multi-AZ and Multi-Region architectures can create charges for duplicate compute, storage, networking, data transfer, load balancing and monitoring resources. Pilot light and warm standby environments incur ongoing costs for their running resources.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Review DR Strategy Evaluation Framework",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Review AWS 4 disaster recovery strategy evaluation framework."
          }
        ],
        "commands": [],
        "note": "Read-only architectural evaluation.",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Evaluate Tier 1: Backup & Restore Architecture",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Use Backup & Restore when business requires lowest cost and can tolerate hours/days of downtime."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Store S3 cross-region replication backups and CloudFormation infrastructure templates."
          }
        ],
        "commands": [],
        "note": "Highest RTO/RPO with lowest operational cost.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Evaluate Tier 2: Pilot Light Architecture",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Use Pilot Light when database must be continuously replicated, but compute servers can remain stopped or as Launch Templates until failover."
          },
          {
            "id": "console-step-3-item-2",
            "text": "On failover, start EC2 instances and scale ASG to full capacity."
          }
        ],
        "commands": [],
        "note": "Keeps core data burning (database) while compute is dormant.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Evaluate Tier 3: Warm Standby Architecture",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Use Warm Standby when business requires minutes of RTO and can afford running a scaled-down mini version of the full stack continuously."
          },
          {
            "id": "console-step-4-item-2",
            "text": "On failover, scale Auto Scaling Group from min=1 to full production capacity."
          }
        ],
        "commands": [],
        "note": "A minimal environment is always live in the DR region.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Evaluate Tier 4: Multi-Region Active-Active Architecture",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Use Multi-Region Active-Active for mission-critical applications requiring sub-second RTO and RPO."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Deploy DynamoDB Global Tables or Aurora Global Database across multiple active regions."
          }
        ],
        "commands": [],
        "note": "Lowest RTO/RPO at highest operational cost.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Review SAA-C03 DR Decision Matrix Rules",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Verify scenario criteria matching RTO/RPO constraints against DR tier choices."
          }
        ],
        "commands": [],
        "note": "Guarantees 100% accuracy on DR exam questions.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your AWS identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: account ID and IAM user/role ARN.",
        "warning": null,
        "expectedResult": "Expected: account ID and IAM user/role ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Describe Cross-Region S3 Replication Rules for Backup & Restore",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-replication --bucket saa-primary-backup-bucket --region us-east-1"
          }
        ],
        "note": "Inspects cross-region backup replication status.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm you can articulate the RTO and RPO trade-offs for each of the four AWS DR strategies: backup-and-restore, pilot light, warm standby, and multi-site active-active."
      },
      {
        "id": "verify-2",
        "text": "Confirm the pilot light configuration has core services running but non-critical capacity at minimum scale."
      },
      {
        "id": "verify-3",
        "text": "Confirm the warm standby configuration has a reduced but fully operational environment ready to scale up."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate any disposable EC2 instances, RDS instances or other resources created to represent pilot light or warm standby environments."
      },
      {
        "id": "cleanup-2",
        "text": "Delete test AMIs, snapshots, or cross-region replicas created solely for this exercise."
      },
      {
        "id": "cleanup-3",
        "text": "Delete IAM roles, CloudWatch alarms and Route 53 health checks created solely for the lab."
      },
      {
        "id": "cleanup-4",
        "text": "Remove cross-region replication configuration if enabled solely for the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "DR Strategy Comparison",
        "body": "Backup & Restore: lowest cost, highest RTO/RPO. Pilot Light: core runs, medium cost. Warm Standby: reduced environment runs, lower RTO. Multi-site Active-Active: all runs, lowest RTO, highest cost."
      },
      {
        "id": "cs-2",
        "title": "RTO vs RPO",
        "body": "RTO = How long can you be down? RPO = How much data can you lose? Both are business decisions, not technical defaults."
      },
      {
        "id": "cs-3",
        "title": "Async Replication Caveat",
        "body": "Cross-region async replication (Aurora Global, DynamoDB Global Tables, S3 CRR) provides near-zero RPO but not zero RPO. In-flight data may be lost during a regional failure."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Confusing Pilot Light and Warm Standby",
        "body": "Pilot light: only minimal core services run (e.g. a stopped RDS instance or minimal replica). Warm standby: a scaled-down but fully operational environment runs. The key difference is whether the secondary is operational or just seeded."
      },
      {
        "id": "ts-2",
        "title": "Async Replication Zero-RPO Claim",
        "body": "Asynchronous replication (e.g. Aurora Global Database secondary) is not zero RPO. There is always a replication lag. Synchronous replication (e.g. RDS Multi-AZ within a region) is closer to zero RPO for AZ failures but not cross-region."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "DR ≠ HA",
        "body": "High availability reduces downtime during partial failures (e.g. AZ failure). Disaster recovery restores service after a major failure. They are complementary but distinct concepts."
      },
      {
        "id": "trap-2",
        "title": "Asynchronous Cross-Region Replication Is Not Zero RPO",
        "body": "The SAA exam may offer \"use Cross-Region Replication for zero RPO\" as a trap. Asynchronous replication always has some lag. Only synchronous writes (rare cross-region) could achieve near-zero RPO."
      },
      {
        "id": "trap-3",
        "title": "Backup-and-Restore Is Not Just Snapshots",
        "body": "Backup-and-restore requires restoring the snapshot AND recreating or reconfiguring the surrounding infrastructure. Test the full restore process, not just snapshot creation."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Know the four DR strategies in order of cost and RTO/RPO: Backup & Restore (cheapest, slowest) → Pilot Light → Warm Standby → Multi-site Active-Active (most expensive, fastest)."
      },
      {
        "id": "tip-2",
        "text": "SAA-C03: RTO and RPO are business requirements. AWS services and architectures can achieve them, but AWS does not automatically guarantee any specific RTO or RPO value."
      },
      {
        "id": "tip-3",
        "text": "SAA-C03: Cross-region asynchronous replication (Aurora Global, DynamoDB Global Tables, S3 CRR) does not provide zero RPO. In-transit data may be lost during a regional failure."
      }
    ],
    "memoryHook": "DR tiers = Cost vs speed trade-off. Backup-and-Restore is cheapest but slowest. Pilot Light keeps the fire alive. Warm Standby is already dressed for work. Multi-site Active-Active has two offices open simultaneously.",
    "flashcardSetId": null
  }
];
