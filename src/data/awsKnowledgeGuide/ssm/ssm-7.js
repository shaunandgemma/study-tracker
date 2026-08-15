import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-7",
  "title": "Run Command",
  "plainEnglish": "AWS Systems Manager Run Command allows you to remotely and securely execute scripts, administrative commands, software installations, and configuration changes across large fleets of Amazon EC2 instances and on-premises servers at scale without logging into each machine individually. Using SSM Command Documents (such as `AWS-RunShellScript` for Linux or `AWS-RunPowerShellScript` for Windows), Run Command executes the instructions in parallel across targeted nodes, captures standard output and error logs, and enforces concurrency limits and error stop thresholds.",
  "whyItMatters": "Manually logging into dozens or hundreds of servers via SSH or RDP to install security hotfixes or collect log bundles is slow, error-prone, and presents a security risk. Run Command automates fleet-wide maintenance from a central API, enforces rate limiting so you do not overwhelm backend services, and automatically stops execution if an unacceptable number of nodes return errors.",
  "workplaceExample": "A critical zero-day vulnerability is announced in the `openssl` package. The systems administrator uses AWS Systems Manager Run Command to run `yum update -y openssl` across 500 EC2 production web servers selected by the tag `Environment=Production`. The admin configures a concurrency limit of 50 instances at a time and an error threshold of 5 failed instances. Run Command updates all 500 servers in parallel across 10 batches in under 8 minutes with full execution audit logs delivered to Amazon S3.",
  "examFocus": "Understand Run Command execution controls and targeting: (1) Rate Control - Max Concurrency: Specifies how many managed nodes can execute the command simultaneously (defined as absolute count or percentage, e.g., `25%` or `10`). (2) Rate Control - Error Threshold: Specifies how many errors can occur before Systems Manager automatically cancels execution across the remaining fleet. (3) Target Selection: Target instances by EC2 Tags (e.g., `Role=WebServer`), Resource Groups, or explicit Instance IDs. (4) Output Storage: Stores stdout and stderr in Amazon S3 and Amazon CloudWatch Logs.",
  "keyPoints": [
    "Executes remote scripts and administrative commands across fleets of managed nodes at scale.",
    "Eliminates the need to log into individual instances via SSH or RDP.",
    "Uses SSM Command Documents (e.g., `AWS-RunShellScript`, `AWS-RunPowerShellScript`).",
    "Targets nodes flexibly by Amazon EC2 tags, AWS Resource Groups, or explicit instance IDs.",
    "Provides granular rate controls: Max Concurrency and Error Threshold to limit blast radius.",
    "Captures complete execution command output (stdout/stderr) into Amazon S3 and CloudWatch Logs."
  ],
  "commonMistake": "Executing a Run Command script across a large production fleet with 100% concurrency and no error threshold. If the script contains a syntax error or breaks an application dependency, all 100% of production servers will fail at once; always configure conservative concurrency and error thresholds.",
  "example": "Execute a shell command across all production web servers with 20% concurrency and an error threshold of 2 using the AWS CLI: aws ssm send-command --document-name 'AWS-RunShellScript' --targets 'Key=tag:Role,Values=WebServer' --parameters 'commands=[\"systemctl restart nginx\"]' --max-concurrency '20%' --max-errors '2'.",
  "sources": [
    {
      "title": "AWS Systems Manager Run Command Overview",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html"
    },
    {
      "title": "Executing Remote Commands Using AWS Systems Manager Run Command",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html"
    }
  ]
});
