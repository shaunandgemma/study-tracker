import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-31",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Warm Pools",
  "status": "ready",
  "plainEnglish": "Amazon EC2 Auto Scaling Warm Pools provide a pool of pre-initialized, pre-booted EC2 instances that sit ready alongside your active Auto Scaling Group. When your application needs to scale out, instead of launching an instance from scratch (which could take 5 to 15 minutes to run OS setup, compile binaries, and warm caches), the ASG immediately pulls a pre-warmed instance from the warm pool and puts it into active service in seconds.",
  "whyItMatters": "Applications with long initialization times (e.g. multi-gigabyte machine learning models, complex Windows applications, or legacy Java enterprise suites) struggle with dynamic scaling because traffic spikes overwhelm servers long before new instances finish bootstrapping. Warm Pools allow instances to sit in a `Stopped` or `Hibernated` state, reducing startup times from 10 minutes to under 30 seconds while saving on compute costs.",
  "workplaceExample": "A gaming server takes 8 minutes to download 20 GB of assets and compile shaders at launch. By configuring an ASG Warm Pool with instances kept in the `Stopped` state, the gaming company only pays for EBS storage while instances are idle, and can bring 10 pre-warmed instances into active gameplay in 25 seconds when a streamer goes live.",
  "examFocus": "For SAA-C03, know when to choose Warm Pools: (1) Ideal for workloads with very LONG bootstrap/initialization times (5–15+ minutes). (2) Warm pool instances can sit in three states: `Stopped` (cost-efficient, pay only for EBS storage), `Hibernated` (RAM state preserved), or `Running` (instant, pay EC2 compute). (3) Scales out in seconds to absorb sudden traffic surges.",
  "keyPoints": [
    "Pool of pre-initialized EC2 instances ready for immediate scale-out attachment.",
    "Drastically reduces scale-out latency for applications with long bootstrap times (from minutes to seconds).",
    "Warm pool instance states: `Stopped` (saves compute costs, pay only EBS), `Running`, or `Hibernated`.",
    "Pre-executes User Data scripts and application setup before entering the pool.",
    "Automatically replenishes the warm pool in the background as instances are drawn into service."
  ],
  "commonMistake": "Leaving instances in the `Running` state inside the warm pool when `Stopped` state would achieve sub-minute startup times at a fraction of the cost. Use `Stopped` state for optimal cost efficiency.",
  "example": "# CloudFormation configuration for an ASG Warm Pool in Stopped state:\nType: AWS::AutoScaling::WarmPool\nProperties:\n  AutoScalingGroupName: !Ref GamingASG\n  PoolState: Stopped\n  MinSize: 5\n  MaxGroupPreparedCapacity: 10\n  InstanceReusePolicy:\n    ReuseOnScaleIn: true",
  "sources": [
    {
      "title": "Warm Pools for Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html"
    },
    {
      "title": "Configuring Warm Pool Instance States",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/warm-pools-instance-state.html"
    }
  ]
});
