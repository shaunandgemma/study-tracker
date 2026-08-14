import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-22",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Scale Out and Scale In",
  "status": "ready",
  "plainEnglish": "Scale Out and Scale In are the two directional scaling operations executed by an Amazon EC2 Auto Scaling Group. Scale Out increases the number of EC2 instances in the group (launching new compute capacity) to meet growing user demand or high metric thresholds. Scale In decreases the number of EC2 instances (gracefully terminating excess compute capacity) when demand subsides, cutting infrastructure costs while ensuring existing user connections drain cleanly.",
  "whyItMatters": "Scaling out ensures your application stays fast, responsive, and available during unexpected surges. Scaling in ensures you do not waste money running idle compute servers during the night or weekends, achieving the true cost efficiency promise of cloud computing.",
  "workplaceExample": "A SaaS application experiences peak usage from 9:00 AM to 5:00 PM. At 9:00 AM, scale-out policies increase running instances from 5 to 30 as traffic ramps up. At 6:00 PM, scale-in policies gradually terminate 25 instances over a 90-minute window, saving the company $4,000 per month in compute expenses.",
  "examFocus": "For SAA-C03, compare the two processes: (1) Scale Out: ASG launches new instances, attaches them to ELBs, and waits for health checks/grace period before routing traffic. (2) Scale In: ASG deregisters instances from ELBs (connection draining), runs Terminating Lifecycle Hooks, and terminates instances according to Termination Policies. Scale-in should always be tuned conservatively to avoid flapping (rapidly scaling in and out).",
  "keyPoints": [
    "Scale Out: Launches new EC2 instances to handle increased load or traffic spikes.",
    "Scale In: Gracefully terminates excess EC2 instances to reduce infrastructure costs.",
    "Scale Out prioritizes Availability Zones with the fewest instances to maintain balance.",
    "Scale In prioritizes Availability Zones with the most instances using Termination Policies.",
    "Connection draining ensures active in-flight requests finish before an instance is terminated."
  ],
  "commonMistake": "Configuring aggressive scale-in thresholds that trigger immediately after scale-out (flapping). Tune scale-in evaluation periods (e.g. require 15 consecutive minutes of low traffic) so you don't terminate instances during brief lulls in traffic.",
  "example": "# Scale-out policy:\naws autoscaling put-scaling-policy --auto-scaling-group-name AppASG --policy-name ScaleOut --scaling-adjustment 2 --adjustment-type ChangeInCapacity\n\n# Scale-in policy:\naws autoscaling put-scaling-policy --auto-scaling-group-name AppASG --policy-name ScaleIn --scaling-adjustment -1 --adjustment-type ChangeInCapacity",
  "sources": [
    {
      "title": "Amazon EC2 Auto Scaling Scale Out and Scale In Process",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html"
    },
    {
      "title": "Instance Termination and Scale-In Protection in Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-instance-termination.html"
    }
  ]
});
