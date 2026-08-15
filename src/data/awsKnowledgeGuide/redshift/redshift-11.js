import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-11',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Leader Node and Compute Nodes',
  status: 'ready',
  plainEnglish: 'A provisioned Amazon Redshift cluster consists of two distinct node roles:\n1. Leader Node: The gateway node that manages client SQL connections, authenticates users, parses incoming queries, compiles C++ execution code, and coordinates parallel execution plans.\n2. Compute Nodes: Worker instances (each partitioned into memory/disk Slices) that execute compiled query steps in parallel, process local data, and send final results back to the Leader Node.',
  whyItMatters: 'Understanding node roles explains query execution flow. Because the Leader Node compiles and coordinates queries while Compute Nodes perform raw data scans, client applications only communicate with the Leader Node endpoint.',
  workplaceExample: 'A Business Intelligence tool connects via JDBC to a Redshift cluster. The Leader Node accepts the JDBC connection, receives the complex SQL query, compiles query code, and instructs 4 Compute Nodes to scan their respective slices in parallel.',
  examFocus: 'SAA-C03 Node Topology & Billing Rules:\n- Leader Node Capabilities: Manages SQL connections, system tables, query parsing/compilation, and result aggregation. You are NOT charged for the Leader Node in multi-node clusters.\n- Compute Nodes Billing: You pay strictly for the provisioned Compute Nodes.\n- Node Slices: Compute node CPU and memory are partitioned into Slices (e.g. 2 to 16 slices per compute node). Each slice executes query portions independently.',
  keyPoints: [
    'Leader Node handles client SQL connections, query parsing, and code compilation.',
    'Compute Nodes execute parallel query processing across assigned node Slices.',
    'Leader Node is free of charge in multi-node Redshift provisioned clusters.',
    'Compute node CPU, memory, and disk are divided into independent working Slices.',
    'Client applications connect exclusively to the Leader Node endpoint URI.'
  ],
  commonMistake: 'Attempting to open direct SQL database connections to individual Redshift Compute Nodes instead of the Leader Node endpoint.',
  example: 'Querying Cluster Node Roles via System Catalog:\nSELECT node, role, cpu, disk_usage FROM stv_node_storage_capacity;',
  sources: [
    { title: 'Leader node and compute node architecture', url: 'https://docs.aws.amazon.com/redshift/latest/dg/c_high_level_system_architecture.html' }
  ]
});
