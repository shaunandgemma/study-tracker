import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-shared-responsibility",
  "topicTitle": "AWS Shared Responsibility Model",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "srm-2",
  "title": "Guest OS Patching vs Infrastructure Security",
  "plainEnglish": "For an Amazon Elastic Compute Cloud (Amazon EC2) instance, AWS secures the data center, physical host, foundational network, and hypervisor. The customer controls the guest operating system inside the virtual machine and therefore normally owns its security updates, patch policy, installed packages, application dependencies, host firewall, user access, testing, and reboot planning.",
  "whyItMatters": "An EC2 instance can run on fully patched AWS infrastructure while its customer-controlled operating system remains vulnerable. Separating host infrastructure from the guest prevents teams from waiting for AWS to correct software that only they can inventory, test, schedule, and update.",
  "workplaceExample": "A healthcare operations team enrolls its EC2 fleet as Systems Manager managed nodes, defines approved patch baselines and maintenance schedules, rolls changes through a test group, permits controlled reboots, reviews compliance results, and retains an exception process for systems that cannot yet accept a patch.",
  "examFocus": "On EC2, AWS patches and protects the infrastructure and hypervisor; the customer patches the guest operating system and applications. Systems Manager Patch Manager can automate customer patching work, but AWS does not select the organization's risk policy, targets, maintenance windows, testing, or response merely because the tool is available.",
  "keyPoints": [
    "AWS manages EC2 physical servers, storage hardware, foundational networking, host infrastructure, and hypervisor isolation.",
    "The customer manages guest operating-system accounts, configuration, updates, security patches, and installed software.",
    "The customer also configures instance roles, security groups, subnet controls, host firewalls, credentials, and workload data protection.",
    "Patch Manager uses the managed node's operating-system package mechanisms and repositories to scan or install approved updates.",
    "A customer must configure targets, patch policies or baselines, schedules, IAM permissions, concurrency, error thresholds, and reboot behavior.",
    "Patches need application testing, staged rollout, monitoring, rollback planning, and documented exceptions because installation can affect availability.",
    "Patch compliance output reports managed-node state; it does not prove that every application dependency or unsupported package is secure.",
    "Choosing a more managed compute service can shift operating-system work to AWS, but code, data, permissions, and configuration remain customer concerns."
  ],
  "commonMistake": "Believing AWS automatically patches every EC2 guest operating system leaves customer-managed vulnerabilities open. Configure and govern a patch process, verify that nodes are managed and in scope, and investigate noncompliant or failed installations rather than treating tool availability as completed remediation.",
  "example": "For an internet-facing EC2 service: 1. AWS manages the facility, hardware, hypervisor, and underlying EC2 platform. 2. The customer manages the guest OS, application packages, role, security-group rules, data, and backups. 3. Patch supply and automation involve AWS tools and software publishers, while approval and safe deployment remain customer decisions. 4. On premises the customer would additionally maintain physical hosts and virtualization. 5. A server is compromised after its team assumes AWS installed an available guest patch. 6. Prevent this with inventory, a tested Patch Manager policy, staged maintenance windows, compliance alerts, vulnerability review, and a rollback runbook.",
  "sources": [
    {
      "title": "Security in Amazon EC2",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security.html"
    },
    {
      "title": "Infrastructure security in Amazon EC2",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/infrastructure-security.html"
    },
    {
      "title": "AWS Systems Manager Patch Manager",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager.html"
    }
  ]
});
