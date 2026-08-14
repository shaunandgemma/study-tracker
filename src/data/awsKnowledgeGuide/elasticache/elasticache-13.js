import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-13',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Subnet Groups',
  status: 'ready',
  plainEnglish: 'An ElastiCache Subnet Group is a collection of subnets within your Virtual Private Cloud (VPC) designated for launching ElastiCache nodes. Subnet groups should span at least two or three Availability Zones within the region to allow ElastiCache to deploy primary and replica cache nodes across separate physical datacenters.',
  whyItMatters: 'Using Subnet Groups guarantees that cache nodes are deployed into secure private subnets rather than public internet-facing subnets, protecting memory contents from public exposure.',
  workplaceExample: 'A system administrator creates a Subnet Group `cache-subnet-group` containing three private subnets across `us-east-1a`, `us-east-1b`, and `us-east-1c`. When creating a Redis replication group, ElastiCache automatically distributes primary and replica nodes across these subnets.',
  examFocus: 'SAA-C03 Subnet Group rules:\n- Always configure Subnet Groups in PRIVATE subnets.\n- Include subnets across multiple Availability Zones to support Multi-AZ replication.\n- ElastiCache nodes in a VPC receive private IP addresses from the designated subnet CIDR range.',
  keyPoints: [
    'Collection of VPC subnets designated for launching ElastiCache nodes.',
    'Should include subnets in multiple Availability Zones for Multi-AZ support.',
    'Best practice: Place ElastiCache nodes exclusively in private VPC subnets.',
    'Controls the IP address allocation for cache node network interfaces.',
    'Required parameter when creating an ElastiCache cluster or replication group.'
  ],
  commonMistake: 'Including only 1 subnet in a Subnet Group. This prevents ElastiCache from deploying Multi-AZ read replicas across different Availability Zones.',
  example: 'Creating a Subnet Group via AWS CLI:\n`aws elasticache create-cache-subnet-group --cache-subnet-group-name prod-cache-subnets --cache-subnet-group-description "Private cache subnets" --subnet-ids subnet-11111111 subnet-22222222 subnet-33333333`',
  sources: [
    { title: 'Subnets and Subnet Groups in ElastiCache', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html' }
  ]
});
