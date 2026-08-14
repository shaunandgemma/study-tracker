import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-24',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 User Data',
  status: 'ready',
  plainEnglish: 'EC2 User Data is a shell script or configuration script (such as a cloud-init script) that you specify when launching an EC2 instance. By default, User Data scripts run automatically with root/administrator privileges ONE TIME during the initial boot cycle of the instance. It is commonly used to install updates, configure web servers, pull application code, or register instances with a cluster.',
  whyItMatters: 'User Data enables automated instance bootstrap configuration without creating hundreds of custom AMIs. A single base Linux AMI can be customized dynamically at launch time for different application roles using different User Data scripts.',
  workplaceExample: 'A system admin passes a bash script in User Data when launching an EC2 instance: `#!/bin/bash\nyum update -y\nyum install -y httpd\nsystemctl start httpd\necho "Hello World" > /var/www/html/index.html`. The instance boots and turns into a fully functioning web server automatically.',
  examFocus: 'SAA-C03 User Data rules:\n- Runs ONLY ONCE during the first boot of the instance (unless configured with custom cloud-init scripts to run on every reboot).\n- Runs with root privileges.\n- User Data is NOT encrypted by default; NEVER hardcode plain-text database credentials, API keys, or passwords in User Data. Fetch secrets from AWS Secrets Manager or Parameter Store instead.',
  keyPoints: [
    'Automates instance bootstrapping during initial boot.',
    'Executes automatically with root/administrator privileges.',
    'Runs only once during initial launch by default.',
    'Accessible inside the instance via Instance Metadata Service (IMDS).',
    'Do NOT hardcode sensitive passwords or secrets in User Data.'
  ],
  commonMistake: 'Expecting User Data scripts to run automatically every time an EC2 instance is stopped and restarted. User Data executes only on the initial instance launch by default.',
  example: 'User Data Script Example:\n`#!/bin/bash\nyum update -y\nyum install -y aws-cli docker\nsystemctl enable --now docker`',
  sources: [
    { title: 'Work with instance user data', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html' }
  ]
});
