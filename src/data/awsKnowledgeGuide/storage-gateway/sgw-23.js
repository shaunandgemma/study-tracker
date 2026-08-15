import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-23',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Storage Gateway VM Appliance',
  status: 'ready',
  plainEnglish: 'The Storage Gateway VM Appliance is a virtual machine image that runs the gateway software on supported hypervisors in an on-premises data centre. AWS provides downloadable VM images for VMware ESXi, Microsoft Hyper-V, and Linux KVM. The VM is deployed on existing virtualisation infrastructure, allocated local disks for cache and upload buffer, and activated through the AWS console.',
  whyItMatters: 'Most enterprise data centres already run virtualisation platforms. Deploying the gateway as a VM avoids purchasing additional hardware, leverages existing infrastructure management tools (vCenter, SCVMM), and allows flexible resource allocation.',
  workplaceExample: 'A data-centre team downloads the VMware OVA image for Storage Gateway, deploys it on their ESXi cluster, assigns 500 GB of SSD cache storage and 200 GB of upload buffer, and activates it through the AWS console to serve as a Volume Gateway.',
  examFocus: 'SAA-C03 VM Deployment Details:\n- Supported Hypervisors: VMware ESXi, Microsoft Hyper-V, and Linux KVM.\n- Image Format: OVA (VMware), VHD (Hyper-V), or QCOW2 (KVM).\n- Local Disk Allocation: Cache disk and upload-buffer disk must be provisioned on the VM.\n- Activation: The gateway VM is activated from the AWS console or CLI using the VM\'s IP address.',
  keyPoints: [
    'Runs as a virtual machine on VMware ESXi, Microsoft Hyper-V, or Linux KVM.',
    'Downloaded as an OVA, VHD, or QCOW2 image from the AWS Storage Gateway console.',
    'Leverages existing on-premises virtualisation infrastructure.',
    'Requires provisioned local disks for cache storage and upload buffer.',
    'Activated through the AWS Management Console using the VM\'s network address.'
  ],
  commonMistake: 'Deploying the gateway VM without allocating sufficient local disk resources for cache and upload buffer, resulting in poor performance and upload stalls.',
  example: 'VM Appliance Deployment Steps (VMware):\n1. Download the OVA from the AWS Storage Gateway console.\n2. Deploy the OVA on the ESXi host using vCenter.\n3. Attach local SSD disks for cache and upload buffer.\n4. Power on the VM and note its IP address.\n5. Activate the gateway through the AWS console.',
  sources: [
    { title: 'Setting up and activating a Storage Gateway VM', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/setting-up.html' }
  ]
});
