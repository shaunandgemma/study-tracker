import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-22',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Storage Gateway Hardware Appliance',
  status: 'ready',
  plainEnglish: 'The AWS Storage Gateway Hardware Appliance is a purpose-built, AWS-validated physical server that customers can order from AWS. It arrives pre-loaded with the Storage Gateway software, eliminating the need to provision a virtual machine or manage hypervisor infrastructure. The appliance is designed for environments that lack virtualisation infrastructure or prefer a turnkey hardware solution.',
  whyItMatters: 'Small offices, edge locations, or industrial sites may not have VMware, Hyper-V, or KVM hypervisors. The hardware appliance provides a plug-and-connect deployment model: rack it, cable it, activate it, and configure gateway resources.',
  workplaceExample: 'A remote oil-drilling site has no virtualisation infrastructure. The IT team orders a Storage Gateway Hardware Appliance, ships it to the site, racks it, connects power and network, and activates it through the AWS console to serve as an S3 File Gateway.',
  examFocus: 'SAA-C03 Hardware Appliance Characteristics:\n- Pre-configured: Ships with Storage Gateway software installed.\n- No Hypervisor Required: Self-contained physical server.\n- Supports All Gateway Types: Can be configured as S3 File, FSx File, Volume, or Tape Gateway.\n- Activation: Activated through the AWS Management Console using the appliance\'s IP address.',
  keyPoints: [
    'Purpose-built, AWS-validated physical server with pre-installed Storage Gateway software.',
    'No hypervisor or virtualisation infrastructure required at the deployment site.',
    'Supports configuration as any gateway type (S3 File, FSx File, Volume, or Tape).',
    'Designed for remote, edge, or small-office environments without VM infrastructure.',
    'Activated through the AWS Management Console after network connectivity is established.'
  ],
  commonMistake: 'Ordering a hardware appliance for a data centre that already runs VMware or Hyper-V. In such environments, deploying a gateway VM is typically faster and more cost-effective.',
  example: 'Hardware Appliance Deployment Steps:\n1. Order the appliance from AWS.\n2. Rack and cable it at the deployment site.\n3. Assign an IP address and ensure internet/VPN connectivity to AWS.\n4. Activate the appliance through the AWS Storage Gateway console.\n5. Configure it as the desired gateway type (e.g., S3 File Gateway).',
  sources: [
    { title: 'Using the AWS Storage Gateway Hardware Appliance', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/hardware-appliance.html' }
  ]
});
