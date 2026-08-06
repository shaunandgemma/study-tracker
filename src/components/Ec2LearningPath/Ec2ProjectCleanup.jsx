import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Terminal,
  ExternalLink,
  ShieldAlert,
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react';
import { EC2_RESOURCE_TAGS } from '../../data/ec2LearningPathData.js';

export const Ec2ProjectCleanup = ({
  retainedResources = {},
  onCancel = () => {},
  onCompleteCleanup = () => {}
}) => {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [copiedCmd, setCopiedCmd] = useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  const toggleStep = (stepId) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  const steps = [
    {
      id: 'step-1-disposable-instances',
      title: '1. Terminate Disposable EC2 Instances',
      targetResource: 'secondaryInstanceId, hibernateInstanceId, cliInstanceId, spotInstanceId',
      consoleGuide: 'Go to EC2 Console -> Instances. Select secondary/disposable instances (saa-ec2-disposable-stop, saa-ec2-disposable-hibernate, saa-ec2-cli-instance) and click Instance State -> Terminate Instance.',
      cliCommand: 'aws ec2 terminate-instances --instance-ids {{secondaryInstanceId}} {{hibernateInstanceId}} {{cliInstanceId}} {{spotInstanceId}}',
      dependencyWarning: 'Must terminate instances before detaching ENIs or deleting Security Groups.'
    },
    {
      id: 'step-2-primary-instance',
      title: '2. Terminate Primary & Private EC2 Instances',
      targetResource: 'primaryInstanceId, privateEc2InstanceId',
      consoleGuide: 'Select primary Linux instance (saa-ec2-primary) and private instance (saa-ec2-private). Click Instance State -> Terminate Instance.',
      cliCommand: 'aws ec2 terminate-instances --instance-ids {{primaryInstanceId}} {{privateEc2InstanceId}}',
      dependencyWarning: 'Check DeleteOnTermination setting before terminating if EBS volumes need explicit cleanup.'
    },
    {
      id: 'step-3-ami-snapshots',
      title: '3. Deregister Custom AMIs & Delete EBS Snapshots',
      targetResource: 'customAmiId',
      consoleGuide: 'Go to EC2 Console -> AMIs. Select custom AMI (saa-ami-custom), click Actions -> Deregister AMI. Then go to EBS Snapshots and delete backing snapshot.',
      cliCommand: 'aws ec2 deregister-image --image-id {{customAmiId}}',
      dependencyWarning: 'AMIs must be deregistered before their backing EBS snapshots can be deleted.'
    },
    {
      id: 'step-4-capacity-reservations',
      title: '4. Cancel Capacity Reservations',
      targetResource: 'capacityReservationId',
      consoleGuide: 'Go to EC2 Console -> Capacity Reservations. Select active reservation, click Actions -> Cancel Capacity Reservation.',
      cliCommand: 'aws ec2 cancel-capacity-reservation --capacity-reservation-id {{capacityReservationId}}',
      dependencyWarning: 'Cancelling stops hourly reservation charges.'
    },
    {
      id: 'step-5-launch-templates-imagebuilder',
      title: '5. Delete Launch Templates & Image Builder Pipelines',
      targetResource: 'launchTemplateId, imageBuilderPipelineId',
      consoleGuide: 'Go to EC2 Console -> Launch Templates. Select template (saa-ec2-template), click Actions -> Delete template.',
      cliCommand: 'aws ec2 delete-launch-template --launch-template-id {{launchTemplateId}}',
      dependencyWarning: 'Must delete launch templates referencing the lab VPC.'
    },
    {
      id: 'step-6-placement-groups',
      title: '6. Delete Placement Groups',
      targetResource: 'placementGroupId',
      consoleGuide: 'Go to EC2 Console -> Placement Groups. Select group (saa-ec2-placement-group), click Actions -> Delete.',
      cliCommand: 'aws ec2 delete-placement-group --group-name saa-ec2-placement-group',
      dependencyWarning: 'All instances in the placement group must be terminated first.'
    },
    {
      id: 'step-7-ebs-volumes',
      title: '7. Detach and Delete EBS Volumes',
      targetResource: 'ebsVolumeId',
      consoleGuide: 'Go to EC2 Console -> Volumes. Select unattached volume (saa-ec2-vol), click Actions -> Delete Volume.',
      cliCommand: 'aws ec2 delete-volume --volume-id {{ebsVolumeId}}',
      dependencyWarning: 'Volumes must be in available state before deletion.'
    },
    {
      id: 'step-8-eip-eni',
      title: '8. Detach ENIs & Release Elastic IPs',
      targetResource: 'secondaryEniId, elasticIpAllocId',
      consoleGuide: 'Go to EC2 Console -> Elastic IPs. Select EIP, click Actions -> Release Elastic IP address. Go to Network Interfaces and delete secondary ENI.',
      cliCommand: 'aws ec2 release-address --allocation-id {{elasticIpAllocId}}',
      dependencyWarning: 'Unattached Elastic IPs incur hourly penalty charges until released.'
    },
    {
      id: 'step-9-ssm-endpoints',
      title: '9. Delete SSM VPC Endpoints & Endpoint Security Group',
      targetResource: 'ssmEndpointId, ec2SsmVpceSgId',
      consoleGuide: 'Go to VPC Console -> Endpoints. Select SSM interface endpoints (ssm, ssmmessages, ec2messages) and click Actions -> Delete VPC Endpoints.',
      cliCommand: 'aws ec2 delete-vpc-endpoints --vpc-endpoint-ids {{ssmEndpointId}}',
      dependencyWarning: 'Must delete VPC endpoints before security groups can be removed.'
    },
    {
      id: 'step-10-key-pairs',
      title: '10. Delete EC2 Key Pair',
      targetResource: 'ec2KeyPairName',
      consoleGuide: 'Go to EC2 Console -> Key Pairs. Select key pair (saa-ec2-keypair), click Actions -> Delete.',
      cliCommand: 'aws ec2 delete-key-pair --key-name saa-ec2-keypair',
      dependencyWarning: 'Safe to delete after instance termination.'
    },
    {
      id: 'step-11-iam-roles',
      title: '11. Detach IAM Managed Policies & Delete Instance Profile / Role',
      targetResource: 'ec2IamRoleArn',
      consoleGuide: 'Go to IAM Console -> Roles. Select role (saa-ec2-iam-role-ssm). Remove role from instance profile, detach AmazonSSMManagedInstanceCore policy, and delete role.',
      cliCommand: 'aws iam detach-role-policy --role-name saa-ec2-iam-role-ssm --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore && aws iam delete-role --role-name saa-ec2-iam-role-ssm',
      dependencyWarning: 'Instance profiles and attached managed policies must be detached before role deletion.'
    },
    {
      id: 'step-12-vpc-subnets-igw',
      title: '12. Delete Security Groups, Subnets, Internet Gateway & VPC',
      targetResource: 'ec2VpcId, ec2PublicSubnetId, ec2PrivateSubnetId, ec2SecurityGroupId',
      consoleGuide: 'Go to VPC Console. Delete security group saa-ec2-sg-web, detach and delete IGW saa-ec2-igw, delete public/private subnets, and delete VPC saa-ec2-vpc.',
      cliCommand: 'aws ec2 delete-vpc --vpc-id {{ec2VpcId}}',
      dependencyWarning: 'VPC deletion requires all subnets, ENIs, and gateways to be deleted first.'
    }
  ];

  const totalStepsCount = steps.length;
  const isFullyCleaned = completedSteps.size === totalStepsCount;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-amber-400" />
              <span>EC2 Follow Along Teardown Wizard</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Follow step-by-step Console & CLI instructions to clean your AWS environment manually.
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
          Cleanup Progress: <span className="text-amber-400 font-bold">{completedSteps.size} / {totalStepsCount}</span>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Manual Read-Only Teardown Notice</span>
        </div>
        <p className="leading-relaxed">
          Study Tracker <strong>never</strong> automatically deletes resources from your AWS account. You perform cleanup manually in AWS using the exact Console steps or copyable CLI commands below.
        </p>
        <div className="text-[11px] text-slate-400 font-mono">
          Target Scope: path_id = 'ec2-learning-path' | Tags: StudyTrackerFollowAlong = ec2-learning-path
        </div>
      </div>

      {/* Teardown Steps List */}
      <div className="space-y-4">
        {steps.map(step => {
          const isDone = completedSteps.has(step.id);

          return (
            <div
              key={step.id}
              className={`border rounded-xl p-4 transition-all ${
                isDone ? 'bg-slate-950/40 border-emerald-800/50' : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleStep(step.id)}
                    className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <h3 className={`text-sm font-bold ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {step.consoleGuide}
                    </p>
                  </div>
                </div>
              </div>

              {step.dependencyWarning && (
                <div className="mt-3 text-[11px] text-amber-400/90 bg-amber-950/20 px-3 py-1.5 rounded-lg border border-amber-900/30 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{step.dependencyWarning}</span>
                </div>
              )}

              {step.cliCommand && (
                <div className="mt-3 bg-slate-900 rounded-lg p-2.5 border border-slate-800/80 flex items-center justify-between gap-2">
                  <code className="text-xs font-mono text-cyan-300 truncate">
                    {step.cliCommand}
                  </code>
                  <button
                    onClick={() => handleCopy(step.cliCommand)}
                    className="p-1.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                    title="Copy CLI command"
                  >
                    {copiedCmd === step.cliCommand ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status Selection & Completion Controls */}
      <div className="pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onCompleteCleanup('resources-retained')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            Completed — Resources Retained
          </button>

          <button
            onClick={() => onCompleteCleanup('cleanup-pending')}
            className="px-4 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800 text-xs font-semibold transition-colors"
          >
            Cleanup Pending
          </button>

          <button
            onClick={() => onCompleteCleanup('completed')}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
              isFullyCleaned
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
            }`}
          >
            Completed — All Resources Cleaned
          </button>
        </div>
      </div>
    </div>
  );
};
