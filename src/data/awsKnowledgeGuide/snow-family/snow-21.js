import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-21",
  "title": "Snow Family for Limited or No Network Connectivity",
  "plainEnglish": "AWS Snow Family for Limited or No Network Connectivity is designed specifically for harsh, remote, mobile, and completely air-gapped operating environments where traditional internet, WAN, or cellular connections are slow, expensive, intermittent, or physically non-existent. Physical Snowcone and Snowball Edge devices provide local storage and local compute power directly in the field, allowing organizations to collect data, run local applications, and physically transport the information back to AWS.",
  "whyItMatters": "Critical industries—such as maritime shipping, offshore oil and gas, commercial aviation, wilderness disaster response, and defense operations—generate vast amounts of high-value data in locations with zero network connectivity. Without ruggedized edge appliances, field personnel cannot process telemetry or preserve mission data without relying on unreliable, low-bandwidth satellite links.",
  "workplaceExample": "A humanitarian disaster relief organization deploys to a remote island following a major hurricane that destroyed all power and telecommunications infrastructure. The team carries two AWS Snowcone devices in backpacks. Powered by solar-charged battery banks, the Snowcones host local mapping software and drone aerial damage survey databases. Relief workers query and update island damage maps completely offline. When a supply plane returns to the mainland, the Snowcones are sent to AWS for cloud synchronization.",
  "examFocus": "Understand edge computing in zero-connectivity environments: (1) True Offline Operation: Snow devices DO NOT require an internet connection to boot, run EC2-compatible instances, or read/write local storage. (2) Local Services: Provides local Amazon S3-compatible REST API endpoints and local Amazon EBS-compatible block storage. (3) Rugged Specifications: Snow devices meet strict military standards (MIL-STD-810G) for shock, vibration, and water/dust resistance (IP65). (4) Transportable Security: Data remains encrypted with 256-bit AES even during complete power loss.",
  "keyPoints": [
    "Built for air-gapped, remote, and bandwidth-constrained environments with zero internet access.",
    "Runs local Amazon EC2 compute instances and local S3/EBS storage APIs fully offline.",
    "Ruggedized design meets MIL-STD-810G standards for extreme shock, vibration, and dust/water exposure.",
    "Operates in mobile environments: ships, aircraft, mining vehicles, and disaster response trailers.",
    "Hardware encryption ensures data security even when devices are disconnected from power and network.",
    "Physical shipping replaces fragile satellite uplinks to transport terabytes of data to AWS."
  ],
  "commonMistake": "Assuming that a Snow device must connect back to AWS cloud endpoints periodically to refresh software licenses or validate operational status. Snow devices are specifically engineered to function indefinitely in 100% disconnected, air-gapped environments.",
  "example": "Configure a local network interface on a Snowball Edge in a disconnected field environment via the Snowball CLI: snowballEdge configure-device-ip --endpoint https://192.168.1.10 --ip-address-allocation-policy STATIC --static-ip-address-configuration Ip=192.168.1.50,Netmask=255.255.255.0,DefaultGateway=192.168.1.1.",
  "sources": [
    {
      "title": "AWS Snow Family for Edge Computing and Disconnected Environments",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/edge-computing.html"
    },
    {
      "title": "Using AWS Snowball Edge in Remote Field Locations",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/what-is-snowball.html"
    }
  ]
});
