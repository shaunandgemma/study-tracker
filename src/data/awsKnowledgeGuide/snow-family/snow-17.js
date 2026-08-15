import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-17",
  "title": "DataSync on Snowcone",
  "plainEnglish": "AWS DataSync on Snowcone is a hybrid data-transfer capability that combines the physical mobility of an AWS Snowcone device with the automated, high-speed online synchronization of AWS DataSync. Every AWS Snowcone device comes with the AWS DataSync agent pre-installed on the hardware, enabling you to collect data offline at the tactical edge and automatically stream that data online directly into Amazon S3, Amazon EFS, or Amazon FSx whenever network or Wi-Fi connectivity becomes available.",
  "whyItMatters": "Edge teams often operate in mobile environments (like mobile research vans or emergency response vehicles) that move between disconnected field locations and bases with network uplinks. Instead of manually packing and shipping the device every time new data is collected, DataSync on Snowcone allows automated online data transfer over available networks, saving shipping costs and accelerating cloud data availability.",
  "workplaceExample": "A utility company deploys an inspection team with an AWS Snowcone in a mobile field truck to inspect high-voltage electrical towers. During the day, the team records 500 GB of high-resolution thermal imaging and drone video onto the Snowcone offline. When the truck returns to the regional depot each evening and connects to the depot's Wi-Fi network, the pre-installed AWS DataSync agent activates automatically, securely syncing the day's inspection footage to Amazon S3 overnight.",
  "examFocus": "Understand DataSync integration on Snowcone: (1) Pre-installed Agent: AWS DataSync agent is embedded directly in the Snowcone microcode. (2) Dual Transfer Mode: Snowcone is the ONLY Snow device that supports both offline physical shipping AND automated online data synchronization via DataSync. (3) Target Services: Can sync online directly to Amazon S3 buckets, Amazon EFS file systems, and Amazon FSx file systems. (4) Benefits: Eliminates shipping fees, reduces turnaround time, and provides end-to-end data integrity validation.",
  "keyPoints": [
    "AWS DataSync agent is pre-installed directly on all AWS Snowcone physical devices.",
    "Enables automated online data synchronization to Amazon S3, EFS, and FSx over WAN or Wi-Fi.",
    "Provides unique dual-mode capability: collect data offline, synchronize online when network is available.",
    "Eliminates physical shipping delays and courier costs for connected field operations.",
    "Automatically manages network throttling, error retries, and cryptographic data validation.",
    "Configured and activated seamlessly through AWS OpsHub or the AWS DataSync console."
  ],
  "commonMistake": "Assuming that Snowball Edge also comes with a pre-installed AWS DataSync agent. The pre-installed DataSync agent feature is uniquely built into AWS Snowcone; on Snowball Edge, online sync requires running custom EC2 instances or using standard S3 API tools.",
  "example": "Activate the pre-installed AWS DataSync agent on an AWS Snowcone connected to your local network via AWS OpsHub: Navigate to the DataSync tab in AWS OpsHub, copy the activation key, and configure an AWS DataSync Task in the AWS Console.",
  "sources": [
    {
      "title": "Transferring Data Online with AWS DataSync on Snowcone",
      "url": "https://docs.aws.amazon.com/snowball/latest/snowcone-guide/snowcone-transfer-datasync.html"
    },
    {
      "title": "Deploying the AWS DataSync Agent on AWS Snowcone",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/deploy-snowcone.html"
    }
  ]
});
