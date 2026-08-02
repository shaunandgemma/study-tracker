/** Amazon ElastiCache Tasks (SAA-C03) */
export const ELASTICACHE_TASKS = [
  {
    "id": "task-saa-elasticache-compare-elasticache-redis-vs-memcached-019",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elasticache",
    "title": "Compare ElastiCache Redis vs Memcached",
    "slug": "compare-elasticache-redis-vs-memcached",
    "service": "Amazon ElastiCache",
    "feature": "Amazon ElastiCache",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "us-east-1",
    "goal": "Goal: Comparison breakdown focusing on multi-AZ, persistent data structures/replication (Redis) vs. simple multithreaded key-value caching (Memcached).",
    "status": "published",
    "tags": [
      "Amazon ElastiCache",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Amazon ElastiCache Overview",
        "body": "Fully managed in-memory data store service that accelerates application performance by caching frequently accessed data in RAM."
      },
      {
        "id": "concept-2",
        "title": "ElastiCache for Redis / Valkey",
        "body": "In-memory data store supporting advanced data structures (Strings, Hashes, Lists, Sets, Sorted Sets), snapshots, Multi-AZ failover, and Pub/Sub."
      },
      {
        "id": "concept-3",
        "title": "ElastiCache for Memcached",
        "body": "Pure, simple, multithreaded in-memory key-value cache designed for simple horizontal scaling without persistence or replication."
      },
      {
        "id": "concept-4",
        "title": "Persistence & Replication Comparison",
        "body": "Redis: Supports data persistence (snapshots/AOF), Multi-AZ replication, and automatic failover. Memcached: Purely volatile memory; no persistence, no replication."
      },
      {
        "id": "concept-5",
        "title": "Redis vs Memcached Architectural Decision Matrix",
        "body": "FeatureElastiCache for Redis (Valkey)ElastiCache for MemcachedData typesComplex (Strings, Hashes, Lists, Sets, Sorted Sets)Simple Key-Value strings / objectsMultithreadingSingle-threaded (Cluster mode sharding)Multithreaded architecturePersistenceYes (RDB Snapshots & AOF append-only logs)No (Volatile RAM only)High availabilityMulti-AZ replication groups with Auto-FailoverNo replication (Nodes run independently)Pub / Sub messagingSupported nativelyNot supportedGeospatial indexesSupported nativelyNot supported"
      }
    ],
    "whyItMatters": "This matters because recognizing when to select Redis (sorted sets, pub/sub, failover) vs. Memcached (pure horizontally-scaled memory caching) is frequently tested on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Redis Engine",
        "value": "Persistent, Multi-AZ, Complex Data Structures"
      },
      {
        "label": "Memcached Engine",
        "value": "Volatile, Multithreaded, Pure Key-Value"
      },
      {
        "label": "Primary Selection Rule",
        "value": "High availability, data persistence, and data structure requirements"
      }
    ],
    "costWarning": "Cache node or serverless cache charges apply while the resource exists. Delete replication groups and nodes promptly.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Review IAM ElastiCache Administration Permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Ensure your identity has permissions to list ElastiCache clusters (elasticache:DescribeCacheClusters) and replication groups (elasticache:DescribeReplicationGroups)."
          }
        ],
        "note": "Read-only access is sufficient for evaluating caching engine parameters.",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Evaluate Data Persistence Requirements",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Choose ElastiCache for Redis if your cache must survive node restarts, support snapshots to S3, or write append-only logs (AOF)."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose ElastiCache for Memcached if cache data is entirely transient and can be recomputed from the primary database upon node failure."
          }
        ],
        "note": "Memcached nodes store data in volatile RAM only; node restarts clear all cached data.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Evaluate High Availability and Multi-AZ Failover",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Choose Redis when high availability and Multi-AZ automatic failover are required."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Note that Memcached does not support cross-node replication; if a Memcached node fails, an empty node is provisioned."
          }
        ],
        "note": "Redis replication groups support up to 5 read replicas per primary node.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Evaluate Advanced Data Structures and Messaging",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Choose Redis when your application requires sorted sets (leaderboards), geospatial queries, atomic counters, or Publish/Subscribe (Pub/Sub) messaging."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Memcached for simple key-value string caching (e.g., HTML page fragments or session blobs)."
          }
        ],
        "note": "Redis sorted sets (ZSET) are ideal for real-time game leaderboards.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Evaluate Threading and Horizontal Scaling Models",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Choose Memcached when you need a simple multithreaded caching engine that scales horizontally by adding nodes to a cluster."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Redis Cluster Mode when you need to shard data across multiple node groups with automated cluster management."
          }
        ],
        "note": "Memcached handles multiple CPU cores per node natively via multithreading.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Review SAA-C03 Caching Decision Matrix",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Verify your caching engine choice against exam criteria (Persistence, Multi-AZ, Data Types, Multithreading)."
          }
        ],
        "note": "Matching caching features to requirements guarantees the correct exam choice.",
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
        "title": "List Available ElastiCache Reserved Cache Nodes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws elasticache describe-reserved-cache-nodes-offerings --duration 1year --region us-east-1"
          }
        ],
        "note": "Lists ElastiCache node options.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon ElastiCache configuration verified in Amazon ElastiCache."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete the ElastiCache cluster or replication group."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the cache subnet group and associated security group."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "ElastiCache Redis",
        "body": "Supports persistent data structures, Multi-AZ replication, automatic failover, snapshots, Pub/Sub, and leaderboards."
      },
      {
        "id": "cs-2",
        "title": "ElastiCache Memcached",
        "body": "Simple multithreaded key-value cache. No persistence, no replication, no failover. Pure memory speed."
      },
      {
        "id": "cs-3",
        "title": "Leaderboard Keyword",
        "body": "If an exam question mentions a game leaderboard, choose Redis Sorted Sets (ZSET)."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Wrong Caching Selection on Exam",
        "body": "If a scenario requires Multi-AZ failover or data persistence, do NOT select Memcached. Always select Redis."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Memcached High Availability Trap",
        "body": "Memcached does NOT support multi-AZ failover or replication. If a node fails, data is lost and must be reloaded from the backend database."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon ElastiCache concepts and multi-AZ / replication design in Amazon ElastiCache."
      }
    ],
    "memoryHook": "Redis = Rich Data, Replication & Failover | Memcached = Multithreaded Memory Only",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-elasticache-create-an-elasticache-cluster-implement-caching-patterns-020",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elasticache",
    "title": "Create an ElastiCache Cluster & Implement Caching Patterns",
    "slug": "create-an-elasticache-cluster-implement-caching-patterns",
    "service": "Amazon ElastiCache",
    "feature": "Amazon ElastiCache",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Launch a small ElastiCache cluster inside a VPC private subnet, review connection endpoints, and evaluate Lazy Loading vs. Write-Through caching patterns.",
    "status": "published",
    "tags": [
      "Amazon ElastiCache",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "ElastiCache VPC Subnet Groups",
        "body": "ElastiCache clusters should ALWAYS be deployed in private subnets with a Security Group allowing inbound port 6379 (Redis) or 11211 (Memcached) from application servers."
      },
      {
        "id": "concept-2",
        "title": "Lazy Loading (Cache-Aside Pattern)",
        "body": "App checks cache first. If hit, return data. If miss, read from RDS, write result to cache with TTL, and return data. Pros: Only requested data is cached. Cons: Cache miss penalty."
      },
      {
        "id": "concept-3",
        "title": "Write-Through Caching Pattern",
        "body": "App writes data to database and cache simultaneously. Pros: Data in cache is never stale. Cons: Write penalty; caches data that might never be read."
      },
      {
        "id": "concept-4",
        "title": "Cache Eviction & TTL",
        "body": "Setting a Time-To-Live (TTL) on cached keys prevents stale data from persisting when underlying database records are updated."
      },
      {
        "id": "concept-5",
        "title": "Caching Patterns Decision Matrix",
        "body": "Caching PatternHow It WorksProsConsPrimary Use CaseLazy Loading (Cache-Aside)App reads cache; on miss, reads DB & populates cacheNode failure is not fatal; caches only requested dataCache miss latency penalty; risk of stale data without TTLRead-heavy, general-purpose web application cachingWrite-ThroughApp writes to DB and cache simultaneouslyCache is never stale; fast subsequent readsWrite latency penalty; stores unread data in RAMFinancial systems, user profile updates, real-time inventory"
      }
    ],
    "whyItMatters": "This matters because offloading database read pressure and reducing latency for high-traffic relational databases using Lazy Loading vs. Write-Through caching patterns is heavily tested on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Cluster Name",
        "value": "saa-cache-cluster"
      },
      {
        "label": "Node Type",
        "value": "cache.t3.micro (Free Tier eligible)"
      },
      {
        "label": "Engine",
        "value": "Redis OSS / Valkey"
      },
      {
        "label": "Port",
        "value": "6379"
      }
    ],
    "costWarning": "Cache node or serverless cache charges apply while the resource exists. Delete replication groups and nodes promptly.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate database permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate database permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity ElastiCache permissions: elasticache:CreateCacheCluster, elasticache:CreateReplicationGroup, elasticache:DescribeCacheClusters EC2 permissions: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress Cleanup: elasticache:DeleteCacheCluster, ec2:DeleteSecurityGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a Security Group for ElastiCache",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2 Console -> Choose Security Groups -> Click Create security group."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Set Name to saa-elasticache-sg -> Description to Allow Redis port 6379 -> Select lab VPC."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Add Inbound Rule: Type Custom TCP -> Port 6379 -> Source Custom (select application security group or VPC CIDR)."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Create security group."
          }
        ],
        "note": "ElastiCache security groups restrict cache access strictly to authorized VPC resources.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Launch ElastiCache Redis Cluster",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Amazon ElastiCache Console."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-3-item-3",
            "text": "In the left navigation sidebar, click Redis clusters -> Choose Create Redis cluster."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Select deployment option Configure and create a new cluster."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Set Cluster name to saa-cache-cluster."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Set Node type to cache.t3.micro (Free Tier eligible)."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Set Number of replicas to 0 (Single-AZ cluster for lab practice)."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Under Subnet group, select your private VPC subnet group."
          },
          {
            "id": "console-step-3-item-9",
            "text": "Under Security groups, select saa-elasticache-sg."
          },
          {
            "id": "console-step-3-item-10",
            "text": "Choose Create."
          }
        ],
        "note": "Launching in private subnets ensures in-memory data is isolated from public internet exposure.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Retrieve Connection Primary Endpoint",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Monitor Cluster status transitioning from creating to available."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Select saa-cache-cluster -> Copy the Primary endpoint DNS name (e.g. saa-cache-cluster.xxxxxx.ng.0001.use1.cache.amazonaws.com:6379)."
          }
        ],
        "note": "Application clients use this endpoint string to connect and issue Redis `GET` / `SET` commands.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Evaluate Lazy Loading (Cache-Aside) Code Pattern",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Review Lazy Loading logic flow:"
          },
          {
            "id": "console-step-5-item-2",
            "text": "1. App queries Redis: `data = redis.get(user_id)`"
          },
          {
            "id": "console-step-5-item-3",
            "text": "2. If `data` exists (Cache Hit), return `data` immediately."
          },
          {
            "id": "console-step-5-item-4",
            "text": "3. If `data` is null (Cache Miss), query RDS database: `data = db.query(user_id)`."
          },
          {
            "id": "console-step-5-item-5",
            "text": "4. Save to Redis with TTL: `redis.setex(user_id, 3600, data)`."
          },
          {
            "id": "console-step-5-item-6",
            "text": "5. Return `data` to user."
          }
        ],
        "note": "Lazy Loading ensures only actively requested records consume cache memory.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Evaluate Write-Through Caching Code Pattern",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Review Write-Through logic flow:"
          },
          {
            "id": "console-step-6-item-2",
            "text": "1. App updates data: `db.update(user_id, new_data)`"
          },
          {
            "id": "console-step-6-item-3",
            "text": "2. App immediately updates Redis: `redis.set(user_id, new_data)`."
          },
          {
            "id": "console-step-6-item-4",
            "text": "3. Subsequent reads hit Redis directly with zero chance of stale data."
          }
        ],
        "note": "Write-Through avoids stale cache data at the cost of additional write latency.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down lab resources in dependency order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Select cluster saa-cache-cluster -> Click Actions -> Choose Delete."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Uncheck final backup creation and click Delete."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete Security Group saa-elasticache-sg."
          }
        ],
        "note": null,
        "warning": "Delete the cluster to stop hourly node charges.",
        "expectedResult": "Step 7 completed successfully."
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
        "title": "Set variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=us-east-1\nCLUSTER=saa-cache-cluster"
          }
        ],
        "note": "Sets CLI variable names.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create ElastiCache Redis Cluster",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws elasticache create-cache-cluster --cache-cluster-id $CLUSTER --cache-node-type cache.t3.micro --engine redis --num-cache-nodes 1 --region $REGION"
          }
        ],
        "note": "Launches single-node cache.t3.micro Redis cluster.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Describe ElastiCache Cluster Primary Endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws elasticache describe-cache-clusters --cache-cluster-id $CLUSTER --show-cache-node-info --region $REGION"
          }
        ],
        "note": "Displays connection endpoint DNS.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Delete ElastiCache Cluster",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws elasticache delete-cache-cluster --cache-cluster-id $CLUSTER --region $REGION"
          }
        ],
        "note": "Deletes the cluster.",
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon ElastiCache configuration verified in Amazon ElastiCache."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete the ElastiCache cluster or replication group."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the cache subnet group and associated security group."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Lazy Loading (Cache-Aside)",
        "body": "Caches data only when requested (on cache miss). Prevents caching unused data; requires TTL to avoid stale records."
      },
      {
        "id": "cs-2",
        "title": "Write-Through",
        "body": "Writes to database and cache simultaneously. Ensures data is never stale; adds write latency."
      },
      {
        "id": "cs-3",
        "title": "Offloading RDS Read Pressure",
        "body": "Deploying ElastiCache in front of Amazon RDS drastically reduces read latency to sub-milliseconds and lowers RDS CPU utilization."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Connection Timeout to ElastiCache Endpoint",
        "body": "Ensure application servers reside in the same VPC and that `saa-elasticache-sg` allows inbound TCP port 6379."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Stale Cache Trap",
        "body": "If a scenario states that updated database records are displaying stale data to users, combine Lazy Loading with Time-To-Live (TTL) or implement Write-Through."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon ElastiCache concepts and multi-AZ / replication design in Amazon ElastiCache."
      }
    ],
    "memoryHook": "Lazy Loading = Read miss populates RAM | Write-Through = Simultaneous DB + RAM write",
    "flashcardSetId": null
  }
];
