import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-16',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Storage Types - General Purpose SSD, Provisioned IOPS SSD and Magnetic',
  status: 'ready',
  plainEnglish: 'Amazon RDS provides three database storage volume types backed by Amazon EBS:\n1. General Purpose SSD (`gp2` / `gp3`): Cost-effective baseline performance for web apps and dev/test workloads (gp3 provides independent IOPS and throughput scaling).\n2. Provisioned IOPS SSD (`io1` / `io2`): High-performance storage with guaranteed low latency and dedicated IOPS for mission-critical OLTP workloads.\n3. Magnetic (`standard`): Legacy storage type; not recommended for modern production databases.',
  whyItMatters: 'Storage I/O performance directly dictates database query latency. Choosing `gp3` allows tuning storage IOPS independently of storage size, while `io2` provides 99.999% durability and high IOPS for massive payment databases.',
  workplaceExample: 'A bank runs its primary transactional database on `io2` Provisioned IOPS SSD with 20,000 dedicated IOPS to guarantee sub-millisecond payment processing times during peak shopping hours.',
  examFocus: 'SAA-C03 Storage Type Characteristics:\n- `gp3` (Recommended): Baseline 3,000 IOPS and 125 MB/s throughput included; scale up to 64,000 IOPS independently of storage size.\n- `gp2`: IOPS scale linearly with disk size (3 IOPS per GB; min 100 IOPS, max 16,000 IOPS).\n- `io1` / `io2`: Provision dedicated IOPS up to 256,000 IOPS for extreme IOPS requirements.\n- Dynamic Resizing: Storage volume size and IOPS can be increased dynamically without instance downtime.',
  keyPoints: [
    'General Purpose SSD (`gp3`) offers cost-effective baseline performance with independent IOPS tuning.',
    '`gp2` IOPS scale linearly at 3 IOPS per GB of provisioned storage volume size.',
    'Provisioned IOPS SSD (`io1`/`io2`) guarantees low latency for IOPS-heavy workloads.',
    'Magnetic storage is legacy and discouraged for modern database deployments.',
    'Storage capacity and IOPS can be increased dynamically without taking the database offline.'
  ],
  commonMistake: 'Selecting `gp2` for a small 20 GB database expecting high IOPS. A 20 GB `gp2` volume provides only 100 baseline IOPS. Use `gp3` or Provisioned IOPS instead.',
  example: 'Modifying RDS Storage Type to gp3 via AWS CLI:\naws rds modify-db-instance --db-instance-identifier prod-db --storage-type gp3 --iops 10000 --allocated-storage 500 --apply-immediately',
  sources: [
    { title: 'Amazon RDS storage types', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html' }
  ]
});
