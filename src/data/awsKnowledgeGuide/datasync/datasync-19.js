import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-19",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "Encryption in Transit",
  "status": "ready",
  "plainEnglish": "Encryption in Transit in AWS DataSync ensures that all data transferred between on-premises storage systems, DataSync agents, other cloud platforms, and AWS cloud storage services is fully encrypted using Transport Layer Security (TLS 1.2 or TLS 1.3) with 256-bit AES cryptographic ciphers. All network communication between the DataSync agent and AWS endpoints is secured by default with no unencrypted fallback.",
  "whyItMatters": "Transferring sensitive enterprise datasets (such as customer PII, financial ledgers, or healthcare records) over public internet backbones or shared WAN links without encryption exposes organizations to man-in-the-middle attacks and regulatory non-compliance (such as HIPAA or PCI-DSS). DataSync enforces end-to-end encryption automatically.",
  "workplaceExample": "A fintech startup migrates transaction databases from a co-located data center to Amazon S3. Because DataSync mandates TLS 1.2+ encryption for all network transmissions, their security compliance team approves the migration over the public internet without needing to wait for a physical leased line.",
  "examFocus": "For SAA-C03, remember that AWS DataSync encrypts all data in transit by default using TLS 1.2/1.3. For maximum privacy and security, DataSync can connect through AWS PrivateLink (VPC Interface Endpoints), which keeps traffic entirely on the private AWS network without traversing the public Internet.",
  "keyPoints": [
    "All data in transit is encrypted by default using TLS (Transport Layer Security) with AES-256.",
    "Data remains encrypted from the DataSync agent until it reaches the target AWS storage service.",
    "Supports AWS PrivateLink / VPC Interface Endpoints for isolated, private transfers.",
    "Complies with strict security standards including HIPAA, PCI-DSS, and SOC.",
    "Integrates with AWS KMS for automatic encryption at rest on destination storage (S3, EFS, FSx)."
  ],
  "commonMistake": "Thinking you need to set up complex IPsec VPN tunnels just to get encryption in transit. While VPN/Direct Connect is useful for private IP routing, DataSync's native TLS stream already provides 256-bit encryption in transit across any network route.",
  "example": "# Create a VPC Endpoint for DataSync to keep TLS traffic within your private VPC:\naws ec2 create-vpc-endpoint \\\n  --vpc-id vpc-0123456789abcdef0 \\\n  --vpc-endpoint-type Interface \\\n  --service-name com.amazonaws.us-east-1.datasync \\\n  --subnet-ids subnet-0123456789abcdef0 \\\n  --security-group-ids sg-0123456789abcdef0",
  "sources": [
    {
      "title": "Data Protection and Encryption in AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/data-protection.html"
    },
    {
      "title": "Using AWS DataSync with VPC Endpoints",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/datasync-in-vpc.html"
    }
  ]
});
