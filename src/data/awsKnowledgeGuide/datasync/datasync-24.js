import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-24",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "DataSync vs AWS Snow Family",
  "status": "ready",
  "plainEnglish": "AWS DataSync and the AWS Snow Family (Snowcone, Snowball Edge, and Snowmobile) are both data transfer solutions, but DataSync is an ONLINE network transfer service, while the Snow Family provides OFFLINE physical storage appliances shipped by courier. DataSync transfers data over your active network connection (Direct Connect, VPN, or Internet). The AWS Snow Family is used when network bandwidth is non-existent, too slow, or too expensive to transfer petabytes or exabytes of data within a reasonable timeframe.",
  "whyItMatters": "Calculating transfer time based on bandwidth and data volume is critical. For example, transferring 1 Petabyte over a standard 100 Mbps internet connection would take over 3 years; shipping two AWS Snowball Edge appliances takes less than a week. Conversely, transferring 50 TB over a 10 Gbps Direct Connect connection takes only 12 hours with DataSync, making an online transfer faster and cheaper than physical shipping.",
  "workplaceExample": "An oil exploration ship with limited satellite connectivity (10 Mbps) collects 80 TB of seismic data; they order an AWS Snowball Edge device, load the data locally, and ship it back to AWS. Their corporate headquarters in Houston with a 10 Gbps Direct Connect connection uses AWS DataSync to continuously sync 20 TB of daily operational data online.",
  "examFocus": "For SAA-C03, know the decision criteria between DataSync and Snow Family: (1) Choose AWS DataSync if you have sufficient, fast network bandwidth (Direct Connect or high-speed internet), need continuous/scheduled incremental synchronization, or require automated verification. (2) Choose AWS Snow Family (Snowball Edge / Snowcone) if network connectivity is limited, slow, expensive, or completely unavailable, or if transferring massive datasets (tens of terabytes to petabytes) would take weeks/months over the wire.",
  "keyPoints": [
    "DataSync: Online data transfer over network (Direct Connect, VPN, Internet).",
    "Snow Family: Offline physical data transfer via ruggedized appliances shipped by courier.",
    "DataSync supports continuous, recurring, automated incremental syncs.",
    "Snow Family is designed for one-time massive bulk migrations or remote edge compute.",
    "Rule of thumb: If network transfer takes more than 1–2 weeks, consider Snowball Edge.",
    "DataSync Agent can also be installed on AWS Snowcone for online sync from edge locations."
  ],
  "commonMistake": "Recommending an online DataSync transfer for 500 TB of data over a saturated 50 Mbps internet connection. That transfer would take over 3 years to complete over the wire; choose AWS Snowball Edge.",
  "example": "# Calculation example:\n# Data Volume: 100 TB (800,000,000 Megabits)\n# Network: 10 Gbps Direct Connect -> ~18 hours -> Use AWS DataSync (Online)\n# Network: 20 Mbps Internet -> ~460 days -> Use AWS Snowball Edge (Offline)",
  "sources": [
    {
      "title": "Choosing an AWS Data Transfer Service",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html"
    },
    {
      "title": "AWS Snow Family Overview and Migration Guide",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/what-is-snowball.html"
    }
  ]
});
