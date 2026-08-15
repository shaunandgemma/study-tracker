import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-20",
  "title": "Snow Family vs DataSync",
  "plainEnglish": "AWS Snow Family and AWS DataSync are two complementary data migration services that solve data transfer challenges across different network connectivity and volume profiles. AWS Snow Family is an offline, physical hardware migration service that physically ships storage appliances to bypass slow, expensive, or non-existent internet connections. AWS DataSync is an online, network-based automated data transfer service that accelerates data movement over existing network connections (AWS Direct Connect, VPN, or public internet) using a purpose-built network protocol.",
  "whyItMatters": "Choosing the wrong migration mechanism can result in massive network congestion, exorbitant bandwidth bills, or unnecessary weeks of shipping delays. Understanding the decision threshold between online transfers (AWS DataSync) and offline physical appliances (AWS Snow Family) is essential for designing cost-effective, time-sensitive cloud migrations.",
  "workplaceExample": "An enterprise plans to migrate two distinct datasets: (1) Dataset A: A 400 TB legacy archive located in a remote manufacturing plant with only a 50 Mbps DSL line. The team selects AWS Snowball Edge (offline physical shipping) because a network transfer would take over 2 years. (2) Dataset B: A 20 TB active database backup in the main data center with a 10 Gbps AWS Direct Connect link. The team deploys AWS DataSync (online transfer), syncing all 20 TB over the existing network in under 6 hours.",
  "examFocus": "Compare AWS Snow Family vs AWS DataSync on certification exams: (1) Core Mechanism: Snow Family = Physical, offline shipping of hardware devices; DataSync = Online, network-based data transfer over WAN/Direct Connect/VPN. (2) Decision Rule of Thumb: If transferring data over available network bandwidth will take MORE than 1 to 2 weeks, use AWS Snow Family; if it takes LESS than 1 week, use AWS DataSync. (3) Continuous Sync: DataSync supports ongoing, recurring scheduled transfers; Snow Family is primarily for one-time bulk migrations. (4) Snowcone Hybrid: AWS Snowcone uniquely supports both offline shipping and online DataSync transfers.",
  "keyPoints": [
    "Snow Family: Offline physical hardware data transfer for petabyte-scale migrations without network dependency.",
    "AWS DataSync: Online network-based automated data transfer service over Direct Connect, VPN, or internet.",
    "Rule of Thumb: If network transfer takes > 1-2 weeks, choose Snow Family; if < 1 week, choose DataSync.",
    "DataSync supports ongoing, scheduled, incremental file and object synchronizations.",
    "Snow Family is optimized for one-time bulk migrations and disconnected edge computing.",
    "AWS Snowcone bridges both services by including a pre-installed DataSync agent for online sync."
  ],
  "commonMistake": "Attempting to use AWS Snow Family for daily, incremental file synchronization. Snow Family involves physical shipping and is designed for one-time bulk transfers; use AWS DataSync for continuous, automated, recurring file sync over a network.",
  "example": "Architecture decision logic: If DatasetSize_TB / (Bandwidth_Mbps * 0.000108) > 14 days, order AWS Snowball Edge; otherwise, deploy an AWS DataSync agent VM on-premises to sync online to S3.",
  "sources": [
    {
      "title": "AWS Snow Family Overview and Migration Guidance",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/what-is-snowball.html"
    },
    {
      "title": "What is AWS DataSync?",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html"
    }
  ]
});
