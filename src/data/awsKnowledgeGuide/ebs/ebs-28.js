import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-28",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Modify Volume without Detaching",
  "status": "ready",
  "plainEnglish": "EBS Modify Volume without Detaching is the built-in capability of Amazon EBS Elastic Volumes that allows you to change volume configuration parameters—including volume type (e.g. converting gp2 to gp3, or gp3 to io2), volume size (expanding disk space), and provisioned IOPS/throughput—while the volume remains actively mounted, online, and attached to a running EC2 instance.",
  "whyItMatters": "Before Elastic Volumes, modifying disk parameters required taking production instances offline, unmounting the file system, detaching the volume, creating a snapshot, restoring to a new volume type, re-attaching, and rebooting. Modifying volumes without detaching eliminates maintenance windows and allows infrastructure to adapt instantly to dynamic load changes.",
  "workplaceExample": "During a flash sale, an e-commerce platform's inventory service experiences unexpected I/O throttling on its 500 GB gp3 volume. Without restarting the server or interrupting shopping carts, an engineer issues a command to boost provisioned IOPS from 3,000 to 12,000 and throughput to 500 MB/s. The modifications take effect immediately while live transactions continue.",
  "examFocus": "For SAA-C03, know that EBS volumes can be modified on the fly without stopping instances, unmounting filesystems, or detaching volumes. Note the operational rule: once a volume modification request is initiated, the volume enters the 'optimizing' state, and you must wait at least 6 hours before issuing another modification to the same volume.",
  "keyPoints": [
    "Modifies volume size, IOPS, throughput, and volume type on live attached volumes.",
    "Zero downtime: no instance stop, reboot, or volume detachment required.",
    "Modifications progress through states: 'modifying' -> 'optimizing' -> 'completed'.",
    "Performance changes take effect immediately; background optimization continues.",
    "A cooldown period of at least 6 hours applies between consecutive volume modifications."
  ],
  "commonMistake": "Attempting to issue multiple volume modification commands in rapid succession. AWS enforces a 6-hour rate limit between modification requests per volume; plan your sizing and IOPS adjustments accurately.",
  "example": "# Upgrade an active gp2 volume to gp3 with 5000 IOPS and 250 MB/s throughput:\naws ec2 modify-volume \\\n  --volume-id vol-0123456789abcdef0 \\\n  --volume-type gp3 \\\n  --iops 5000 \\\n  --throughput 250",
  "sources": [
    {
      "title": "Modifying an Amazon EBS Volume Using Elastic Volumes",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html"
    },
    {
      "title": "Monitoring the Progress of Volume Modifications",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/monitoring-volume-modifications.html"
    }
  ]
});
