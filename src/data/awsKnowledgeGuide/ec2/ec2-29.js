import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-29',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Key Pairs',
  status: 'ready',
  plainEnglish: 'An EC2 Key Pair consists of a Public Key (stored by AWS on the instance) and a Private Key file (`.pem` or `.ppk` stored locally on your machine). Key pairs use public-key cryptography to authenticate your identity when connecting securely to your EC2 instance over SSH (for Linux) or retrieving the decrypted Administrator password (for Windows).',
  whyItMatters: 'Key pairs eliminate password-based SSH authentication, preventing brute-force password guessing attacks. Because AWS does not keep a copy of your private key, losing your private key file prevents standard SSH access.',
  workplaceExample: 'A system admin creates an SSH key pair named `prod-keypair`. When launching a Linux EC2 instance, AWS embeds the public key in `~/.ssh/authorized_keys`. The admin connects securely via terminal: `ssh -i prod-keypair.pem ec2-user@54.210.10.20`.',
  examFocus: 'SAA-C03 Key Pair management:\n- Private key is downloaded ONCE when created; AWS NEVER stores the private key.\n- For modern secure access without managing SSH key files, AWS recommends using AWS Systems Manager Session Manager or EC2 Instance Connect.',
  keyPoints: [
    'Public-key cryptography for authenticating SSH (Linux) or RDP password decryption (Windows).',
    'AWS stores the Public Key; user stores the Private Key file (.pem/.ppk).',
    'Private key cannot be re-downloaded from AWS after initial creation.',
    'EC2 Instance Connect and SSM Session Manager are modern alternatives to static key pairs.',
    'Key pairs are region-specific but public keys can be imported across regions.'
  ],
  commonMistake: 'Storing the private `.pem` key file in a public GitHub repository. Anyone with the private key can gain SSH root access to your EC2 instance if SSH port 22 is open.',
  example: 'Connecting via SSH using Key Pair:\n`chmod 400 my-key.pem`\n`ssh -i my-key.pem ec2-user@198.51.100.45`',
  sources: [
    { title: 'Amazon EC2 key pairs and Linux instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html' }
  ]
});
