import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-19",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Scheduled Scaling",
  "status": "ready",
  "plainEnglish": "Scheduled Scaling in Amazon EC2 Auto Scaling allows you to scale instance capacity based on predictable, known date and time schedules using cron expressions or specific timestamps. Instead of waiting for CloudWatch metric alarms to detect high CPU or request volume, Scheduled Scaling pre-scales your Auto Scaling Group in advance of anticipated traffic changes, adjusting MinSize, MaxSize, and DesiredCapacity at scheduled times.",
  "whyItMatters": "Many business workloads have regular, 100% predictable traffic schedules (e.g. corporate apps accessed Monday through Friday from 8:00 AM to 6:00 PM, or tax software traffic surging every April 15). Pre-provisioning instances ahead of scheduled surges ensures zero warm-up lag or user latency at opening bell, while scaling down on weekends saves up to 60% in compute costs.",
  "workplaceExample": "A stock trading platform schedules its ASG to scale from 4 instances up to 40 instances every weekday morning at 08:30 AM EST (30 minutes prior to NYSE market open) using a recurring cron schedule. At 17:00 EST after market close, another scheduled action scales capacity back down to 4 instances.",
  "examFocus": "For SAA-C03, remember: Choose Scheduled Scaling when traffic patterns are PREDICTABLE and KNOWN in advance (e.g. weekly business hours, recurring batch processing, seasonal marketing events). Scheduled actions set new values for `MinSize`, `MaxSize`, and `DesiredCapacity` based on cron syntax or UTC timestamps.",
  "keyPoints": [
    "Scales capacity based on predictable date and time schedules.",
    "Uses standard cron expressions or one-time UTC timestamp schedules.",
    "Pre-warms and scales instances in advance of anticipated peak traffic.",
    "Updates MinSize, MaxSize, and DesiredCapacity automatically at trigger time.",
    "Can be combined with Dynamic Scaling for unexpected surges on top of schedules."
  ],
  "commonMistake": "Relying strictly on reactive dynamic scaling when you know traffic surges instantly at 9:00 AM every Monday. Reactive dynamic scaling takes several minutes to boot new instances; use Scheduled Scaling to pre-warm instances 15 minutes before the surge.",
  "example": "# Schedule ASG scale-out every weekday at 8:00 AM UTC:\naws autoscaling put-scheduled-update-group-action \\\n  --auto-scaling-group-name Trading-ASG \\\n  --scheduled-action-name WeekdayMorningScaleOut \\\n  --recurrence \"0 8 * * 1-5\" \\\n  --min-size 10 \\\n  --desired-capacity 20 \\\n  --max-size 50",
  "sources": [
    {
      "title": "Scheduled Scaling for Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scheduled-scaling.html"
    },
    {
      "title": "Recurring Scheduled Actions in Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/schedule_time.html"
    }
  ]
});
