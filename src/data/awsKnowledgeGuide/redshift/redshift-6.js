import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-6',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Massively Parallel Processing - MPP',
  status: 'ready',
  plainEnglish: 'Massively Parallel Processing (MPP) is the distributed architecture used by Amazon Redshift to divide and execute complex analytical SQL queries simultaneously across multiple compute nodes and node slices in a cluster. The Leader Node compiles the query, partitions the execution plan, and distributes workload chunks to Compute Nodes for parallel execution.',
  whyItMatters: 'Single-server databases process queries sequentially, creating bottlenecks when scanning billion-row tables. MPP allows Redshift to distribute execution across dozens of compute nodes, processing terabytes of data concurrently.',
  workplaceExample: 'A logistics firm runs an analytical query calculating total shipping delays across 2 billion shipments. Redshift splits the table across 8 compute nodes (32 slices). Each slice processes its portion in parallel, returning results in 2 seconds.',
  examFocus: 'SAA-C03 MPP Mechanics:\n- Leader Node Role: Coordinates client SQL connections, compiles query plans, and aggregates results.\n- Compute Nodes Role: Execute compiled query steps in parallel across dedicated disk/memory partitions called "Slices".\n- Data Distribution: Distribution keys (`DISTKEY`) determine how table rows are divided across compute node slices to optimize parallel execution.',
  keyPoints: [
    'Divides and executes analytical queries in parallel across multiple compute nodes.',
    'Leader node parses SQL, compiles execution code, and coordinates worker nodes.',
    'Compute nodes execute query steps concurrently across dedicated node slices.',
    'Delivers linear performance scaling as additional compute nodes are added.',
    'Optimized by selecting appropriate Distribution Styles (`KEY`, `EVEN`, `ALL`).'
  ],
  commonMistake: 'Assuming a 1-node Redshift cluster utilizes MPP parallel distribution. MPP performance gains require multi-node clusters with multiple compute slices.',
  example: 'Checking Cluster Node Slice Status via Redshift System Table:\nSELECT node, slice, status FROM stv_slices ORDER BY node, slice;',
  sources: [
    { title: 'Amazon Redshift system architecture and MPP', url: 'https://docs.aws.amazon.com/redshift/latest/dg/c_high_level_system_architecture.html' }
  ]
});
