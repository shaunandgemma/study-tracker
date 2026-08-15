import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-7",
  "title": "AWS Snowmobile",
  "plainEnglish": "AWS Snowmobile is a historical, exabyte-scale physical data migration service designed to move massive volumes of data (up to 100 PB per truck) to AWS. Housed in a tamper-resistant 45-foot ruggedized shipping container pulled by a dedicated semi-trailer truck, Snowmobile was designed for massive corporate data center shutdowns, satellite imagery archives, and Hollywood movie studio digitizations. AWS has retired Snowmobile for new customer orders, recommending fleets of AWS Snowball Edge devices or high-bandwidth AWS Direct Connect connections for modern multi-petabyte migrations.",
  "whyItMatters": "Before high-speed 100 Gbps AWS Direct Connect links and high-density NVMe Snowball fleets were widely accessible, migrating 100 petabytes over typical corporate networks would have taken decades. Snowmobile provided a mobile data center with 1 Tbps high-speed optical connections and on-site physical security personnel, proving the feasibility of exabyte-scale physical cloud migrations.",
  "workplaceExample": "A national satellite earth observation agency digitized 50 years of historical planetary radar imagery totaling 70 petabytes. In 2019, an AWS Snowmobile arrived at the agency's primary data center, connecting to local storage via multiple 40 Gbps fiber links. The 70 PB dataset was loaded onto the vehicle in just a few weeks and driven under 24/7 security escort directly to an AWS Region for S3 ingestion.",
  "examFocus": "Understand AWS Snowmobile concepts and current status for AWS certification exams: (1) Capacity: 100 PB per Snowmobile container. (2) Form Factor: 45-foot ruggedized shipping container pulled by a semi-truck; required on-site power and high-speed fiber connectivity. (3) Historical / Retired Status: AWS retired Snowmobile in 2024; it is no longer orderable for new projects. (4) Modern Alternatives: For large multi-petabyte/exabyte migrations today, AWS recommends fleets of AWS Snowball Edge Storage Optimized devices, AWS DataSync, or 10 Gbps / 100 Gbps AWS Direct Connect connections.",
  "keyPoints": [
    "Historical exabyte-scale data migration service providing up to 100 PB per vehicle.",
    "Comprised a 45-foot ruggedized shipping container hauled by a dedicated semi-trailer truck.",
    "Featured 24/7 video surveillance, armed security escorts, tamper detection, and 256-bit encryption.",
    "Connected to customer data centers via high-speed optical fiber interfaces providing up to 1 Tbps throughput.",
    "Officially retired by AWS for new customer orders in 2024.",
    "Modern multi-petabyte migrations use fleets of AWS Snowball Edge devices or AWS Direct Connect."
  ],
  "commonMistake": "Recommending AWS Snowmobile as an active solution for a new cloud migration proposal. Snowmobile has been retired by AWS; modern enterprise designs must specify clusters/fleets of AWS Snowball Edge Storage Optimized devices or AWS Direct Connect.",
  "example": "Architecture migration plan: For an active 10 PB migration today, provision a 10 Gbps AWS Direct Connect connection with AWS DataSync, or deploy a fleet of AWS Snowball Edge Storage Optimized devices in parallel waves instead of requesting a retired Snowmobile.",
  "sources": [
    {
      "title": "AWS Snowmobile Historical Overview and Specs",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/what-is-snowball.html"
    },
    {
      "title": "AWS Snow Family Product Capabilities and Evolution",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/device-differences.html"
    }
  ]
});
