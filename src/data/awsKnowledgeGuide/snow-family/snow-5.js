import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-5",
  "title": "AWS Snowcone",
  "plainEnglish": "AWS Snowcone is the smallest, most portable member of the AWS Snow Family. Weighing just 4.5 pounds (2.1 kg) and fitting inside a standard backpack, Snowcone is a ruggedized edge computing and data transfer device that provides 8 TB of usable HDD storage (or 14 TB of SSD storage), 2 vCPUs, and 4 GB of memory. It can run on battery power (via optional mobile power banks), connects via Wi-Fi or wired Ethernet, and comes pre-installed with the AWS DataSync agent for hybrid offline or online data transfer.",
  "whyItMatters": "Standard server racks or 50-pound Snowball Edge appliances are too heavy and bulky for tight, mobile, or airborne environments like drone ground control stations, wildlife research backpacks, autonomous delivery vans, and first-responder ambulances. AWS Snowcone provides military-grade ruggedness and cloud computing capabilities in a compact form factor that can be carried anywhere in the field.",
  "workplaceExample": "A wildlife conservation team conducts aerial drone mapping of Amazon rainforest deforestation. Field researchers carry an AWS Snowcone SSD (14 TB) in a backpack, powered by a portable USB-C power pack. After each drone flight, high-resolution aerial imagery is transferred to the Snowcone over local Wi-Fi. In the evening, an onboard EC2 micro-instance stitches the images together offline. At the end of the expedition, the Snowcone is mailed to AWS for cloud ingestion.",
  "examFocus": "Understand AWS Snowcone specifications and key features: (1) Storage Capacity: 8 TB usable HDD or 14 TB usable SSD. (2) Form Factor: Ultra-portable (4.5 lbs / 2.1 kg), small dimensions (9x6x3 inches). (3) Power: AC power adapter or standard USB-C battery pack (can operate untethered). (4) Connectivity: Wired Ethernet (RJ45) and local Wi-Fi. (5) Compute: 2 vCPUs, 4 GB RAM (runs EC2 `snc1.micro` instances and AWS IoT Greengrass). (6) DataSync: Built-in AWS DataSync agent for online data transmission when network connectivity becomes available.",
  "keyPoints": [
    "Smallest and lightest AWS Snow Family device (4.5 lbs / 2.1 kg).",
    "Provides 8 TB usable HDD or 14 TB usable SSD storage capacity.",
    "Features 2 vCPUs and 4 GB RAM to run local Amazon EC2 and AWS IoT Greengrass workloads.",
    "Supports untethered battery operation using compatible USB-C power delivery banks.",
    "Offers both wired Ethernet (RJ45) and wireless Wi-Fi local connectivity.",
    "Includes pre-installed AWS DataSync agent for automated online data synchronization when connected."
  ],
  "commonMistake": "Thinking AWS Snowcone only supports offline shipping. Snowcone includes an integrated AWS DataSync agent, allowing you to connect it to an internet or VPN uplink in the field to stream data directly into Amazon S3 online, or ship it physically if bandwidth is insufficient.",
  "example": "View the system health and network configuration of an AWS Snowcone device using AWS OpsHub or the Snowball CLI: snowballEdge describe-device --endpoint https://192.168.1.20.",
  "sources": [
    {
      "title": "AWS Snowcone Overview and Technical Specifications",
      "url": "https://docs.aws.amazon.com/snowball/latest/snowcone-guide/snowcone-what-is.html"
    },
    {
      "title": "Transferring Data with AWS Snowcone",
      "url": "https://docs.aws.amazon.com/snowball/latest/snowcone-guide/snowcone-transfer-data.html"
    }
  ]
});
