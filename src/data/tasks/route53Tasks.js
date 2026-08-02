/** Amazon Route 53 Tasks (SAA-C03) */
export const ROUTE53_TASKS = [
  {
    "id": "task-saa-route53-global-failover-health-check-005",
    "examCode": "aws-saa-c03",
    "topicId": "topic-route53",
    "title": "Global Traffic Routing and Health Check Failover with Amazon Route 53",
    "slug": "global-traffic-routing-and-health-check-failover-with-amazon-route-53",
    "service": "Amazon Route 53",
    "feature": "Failover Routing and Health Checks",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Configure Amazon Route 53 health checks and a failover routing policy to automatically reroute global user traffic away from an unhealthy primary endpoint to a healthy secondary endpoint. Understand how TTL and DNS caching affect failover timing.",
    "status": "published",
    "tags": [
      "Amazon Route 53",
      "High Availability",
      "Failover",
      "DNS",
      "Health Checks",
      "Medium"
    ],
    "flow": [
      "Configure Route 53 health checks for primary and secondary endpoints",
      "Create failover routing records with appropriate TTL",
      "Simulate a primary endpoint failure",
      "Verify DNS failover to secondary endpoint",
      "Understand TTL and DNS caching impact on RTO",
      "Clean up health checks, records and hosted zone"
    ],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Failover Routing Policy",
        "body": "Route 53 failover routing policy designates one record as primary and another as secondary. When the primary health check fails, Route 53 returns the secondary record."
      },
      {
        "id": "concept-2",
        "title": "Health Checks",
        "body": "Route 53 health checks monitor endpoints (HTTP, HTTPS, TCP) or other Route 53 health checks (calculated). They run from multiple AWS locations globally."
      },
      {
        "id": "concept-3",
        "title": "TTL and DNS Caching",
        "body": "DNS records have a Time To Live (TTL) value in seconds. Resolvers and clients cache records for this duration. Lower TTLs reduce failover time but increase DNS query costs. DNS failover is not instantaneous."
      },
      {
        "id": "concept-4",
        "title": "Evaluate Target Health",
        "body": "When enabled on alias records, Evaluate Target Health allows Route 53 to follow health checks of the target resource (e.g. load balancer targets) rather than requiring a separate health check."
      },
      {
        "id": "concept-5",
        "title": "RTO vs TTL",
        "body": "The effective Recovery Time Objective (RTO) for DNS failover is influenced by the health check interval, failure threshold, and the TTL of the DNS record. Lower TTL and shorter health-check intervals reduce effective RTO."
      }
    ],
    "whyItMatters": "Route 53 is the primary DNS-layer mechanism for achieving global high availability and disaster recovery failover on AWS. Understanding health checks, failover routing policies, and TTL is essential for SAA-C03 architecture questions. DNS failover is not instantaneous — TTL and resolver caching affect how quickly clients see the new record.",
    "values": [
      {
        "label": "Health Check Interval",
        "value": "30 seconds (standard) or 10 seconds (fast)"
      },
      {
        "label": "Failure Threshold",
        "value": "3 consecutive failures before marking unhealthy"
      },
      {
        "label": "DNS TTL",
        "value": "Lower values (e.g. 60s) speed up failover at higher query cost"
      }
    ],
    "costWarning": "Route 53 hosted zone, DNS query, health-check and traffic-routing charges may apply.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Set up the lab user and permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Use an IAM user or role (do not use the root user)."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "commands": [],
        "note": "Identity check:\nsts:GetCallerIdentity Route 53 permissions:\nroute53:CreateHostedZone, route53:CreateHealthCheck, route53:ChangeResourceRecordSets Cleanup:\nroute53:DeleteHealthCheck, route53:DeleteHostedZone",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create Route 53 Health Check for Primary Endpoint",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon Route 53 Console -> Choose Health checks -> Click Create health check."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Set Name to primary-endpoint-healthcheck."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Select What to monitor Endpoint -> Protocol HTTP -> Domain name or IP of Primary ALB."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set Path to / -> Failure threshold to 3 -> Click Next -> Click Create health check."
          }
        ],
        "commands": [],
        "note": "Route 53 probes the primary endpoint globally every 30 seconds.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Configure Primary Failover Record (Active)",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Route 53 Console -> Choose Hosted zones -> Select your domain."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Click Create record."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Set Record name to app.example.com -> Select Routing policy Failover."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Set Failover record type to Primary."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Toggle Alias to Yes -> Route traffic to Alias to Application and Classic Load Balancer -> Select us-east-1 Primary ALB."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Under Health check ID, select primary-endpoint-healthcheck."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Click Create records."
          }
        ],
        "commands": [],
        "note": "Primary record serves 100% of traffic as long as the health check remains healthy.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Configure Secondary Failover Record (Passive)",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Click Create record."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Set Record name to app.example.com -> Select Routing policy Failover."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Set Failover record type to Secondary."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Toggle Alias to Yes -> Route traffic to eu-west-1 Secondary ALB."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Set Record ID to Secondary-Passive."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Click Create records."
          }
        ],
        "commands": [],
        "note": "Secondary record acts as the passive backup target during primary outages.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Simulate Primary Failure and Test Automatic DNS Failover",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Block traffic or stop web service on Primary ALB to trigger health check failure."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Monitor Route 53 Health Check status -> Confirm status transitions to Unhealthy."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Perform DNS lookup: dig app.example.com (or nslookup app.example.com)."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Confirm Route 53 DNS responses automatically resolve to the Secondary ALB endpoint IP address."
          }
        ],
        "commands": [],
        "note": "Validates automatic Active-Passive DNS failover routing.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down lab resources",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Delete resource record sets in hosted zone."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete health check primary-endpoint-healthcheck."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete test hosted zone."
          }
        ],
        "commands": [],
        "note": null,
        "warning": "Delete health checks and record sets before deleting hosted zones.",
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
        "title": "List Route 53 Health Checks",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws route53 list-health-checks"
          }
        ],
        "note": "Lists active Route 53 health checks.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm Route 53 health checks show Healthy status for the primary endpoint."
      },
      {
        "id": "verify-2",
        "text": "Confirm DNS failover records exist for both primary and secondary endpoints with correct TTL."
      },
      {
        "id": "verify-3",
        "text": "Confirm that simulating a primary failure triggers Route 53 to route traffic to the secondary endpoint."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete all test Route 53 health checks created for this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Remove the failover DNS records (primary and secondary) from the hosted zone."
      },
      {
        "id": "cleanup-3",
        "text": "Delete the hosted zone only if it was created solely for this lab."
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudWatch alarms and SNS notifications created for health-check monitoring."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Failover Record Setup",
        "body": "Create a Primary FAILOVER record pointing to your active endpoint with a health check. Create a Secondary FAILOVER record pointing to your DR endpoint. Enable health checks on the primary."
      },
      {
        "id": "cs-2",
        "title": "Health Check Types",
        "body": "Endpoint health checks: monitor a URL or IP. Calculated health checks: combine results of multiple child health checks. CloudWatch alarm health checks: based on a CloudWatch alarm state."
      },
      {
        "id": "cs-3",
        "title": "TTL Best Practice",
        "body": "Lower TTL before a planned failover or maintenance window. Restore normal TTL afterward to reduce DNS query costs."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Health Check Shows Unhealthy Unexpectedly",
        "body": "Check that security groups and NACLs allow inbound connections from Route 53 health check IP ranges. Verify the endpoint is responding correctly on the configured port and path."
      },
      {
        "id": "ts-2",
        "title": "Failover Not Happening",
        "body": "Verify the primary record has a health check associated. Check that Evaluate Target Health is enabled if using alias records. Confirm the health check is actually failing."
      },
      {
        "id": "ts-3",
        "title": "DNS Still Resolving to Old Endpoint",
        "body": "DNS caching at the resolver or client level based on TTL. Wait for the TTL to expire. Use tools like dig or nslookup to check current DNS responses from multiple locations."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "DNS Failover Is Not Instantaneous",
        "body": "TTL and resolver caching mean clients may continue resolving to the failed endpoint for the TTL duration even after health check failure is detected. This must be factored into RTO calculations."
      },
      {
        "id": "trap-2",
        "title": "Private Hosted Zones and Health Checks",
        "body": "Route 53 health checks cannot directly monitor VPC-internal endpoints. Use CloudWatch alarm-based health checks for internal resources."
      },
      {
        "id": "trap-3",
        "title": "Failover vs Weighted vs Latency Routing",
        "body": "Failover routing is for active-passive DR. Weighted routing splits traffic by percentage. Latency routing directs users to the lowest-latency region. Do not confuse them."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Route 53 failover routing requires a health check on the primary record. When the health check fails, Route 53 returns the secondary record. TTL and resolver caching affect how quickly clients see the change."
      },
      {
        "id": "tip-2",
        "text": "SAA-C03: Failover routing is for active-passive DR. For active-active with health-based distribution, consider weighted or latency routing with health checks."
      }
    ],
    "memoryHook": "Route 53 failover = DNS-layer lifeguard. When primary drowns (health check fails), secondary gets the traffic — but clients cached to the old answer still need to wait for their TTL to expire.",
    "flashcardSetId": null
  }
];
