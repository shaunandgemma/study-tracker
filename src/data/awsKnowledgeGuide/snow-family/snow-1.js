import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-1",
  "title": "Physical Offline Data Transfer Devices: Snowcone (8TB), Snowball Edge (80TB), Snowmobile (100PB)",
  "plainEnglish": "The AWS Snow Family consists of purpose-built, highly secure physical hardware devices designed to move massive volumes of data into and out of AWS without relying on public internet or slow corporate network connections. The family historically features three primary device tiers: AWS Snowcone (an ultra-portable 4.5-pound device with 8 TB to 14 TB capacity), AWS Snowball Edge (a ruggedized transportable appliance with 80 TB to 210 TB capacity), and AWS Snowmobile (a historical 45-foot ruggedized shipping container carrying up to 100 PB for exabyte migrations, which has since been retired in favor of Snowball Edge clusters and high-speed network connections).",
  "whyItMatters": "Transferring hundreds of terabytes or petabytes of data over standard internet connections (e.g., a 100 Mbps or 1 Gbps uplink) would take months or years and consume massive bandwidth. The Snow Family eliminates bandwidth bottlenecks by shipping physical, tamper-evident, hardware-encrypted storage appliances directly to your data center via courier.",
  "workplaceExample": "A scientific research institute needs to migrate 350 terabytes of genomic sequencing files from their on-premises lab to Amazon S3. Their local internet uplink is only 100 Mbps, which would take over 10 months to transfer online. Instead, the institute orders five AWS Snowball Edge Storage Optimized devices, loads the data over local 10 GbE network connections in 4 days, and ships them back to AWS, completing the entire 350 TB migration in under two weeks.",
  "examFocus": "Know the capacities and use cases for each Snow device: (1) AWS Snowcone: 8 TB usable HDD (or 14 TB SSD); ultra-portable (4.5 lbs); can run on battery; ideal for tight spaces, field expeditions, and tactical edge. (2) AWS Snowball Edge: 80 TB to 210 TB usable storage; ruggedized case; supports local EC2 compute and storage clustering; standard enterprise migration choice. (3) AWS Snowmobile: Historical 100 PB capacity per truck; used for multi-petabyte/exabyte migrations; note that AWS has retired Snowmobile for new orders in favor of Snowball Edge fleets and Direct Connect.",
  "keyPoints": [
    "Secure physical appliances for offline petabyte-scale data migration and edge computing.",
    "Bypasses slow, expensive, or non-existent WAN and internet network connections.",
    "Snowcone: 8 TB HDD / 14 TB SSD ultra-portable edge transfer device (4.5 lbs).",
    "Snowball Edge: 80 TB to 210 TB ruggedized enterprise migration and compute appliance.",
    "Snowmobile: Historical 100 PB shipping container semi-trailer (retired for new orders).",
    "All devices feature 256-bit hardware encryption, Trusted Platform Module (TPM), and E-ink shipping labels."
  ],
  "commonMistake": "Attempting to order an AWS Snowmobile for a new 10 PB migration project. AWS Snowmobile is a retired offering; modern large-scale migrations utilize fleets of AWS Snowball Edge Storage Optimized devices or 100 Gbps AWS Direct Connect links.",
  "example": "Order an 80 TB Snowball Edge import job using the AWS CLI: aws snow-device-management create-job (or via AWS Snowball API) specifying job type IMPORT, destination S3 bucket, and AWS KMS key ARN.",
  "sources": [
    {
      "title": "What is the AWS Snow Family?",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/what-is-snowball.html"
    },
    {
      "title": "AWS Snow Family Device Differences and Specs",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/device-differences.html"
    }
  ]
});
