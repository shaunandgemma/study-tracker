export default Object.freeze({
  id: 'terraform-hcp-remote-state-permission-failure',
  examId: 'terraform-associate-004',
  order: 32,
  category: 'HCP Terraform',
  title: 'Repair an HCP Terraform Remote-State Permission Failure',
  difficulty: 'Advanced',
  summary: 'Diagnose an HCP Terraform run blocked from reading outputs from another workspace.',
  scenario: 'The fa-hcp-app workspace needs the VPC ID produced by fa-hcp-network. Both workspaces are in the same HCP Terraform organization, but the application run fails when it attempts to read the network workspace state. The network state must not be opened globally to every workspace.',
  task: 'Use the remote-state configuration and HCP Terraform state-sharing evidence to identify why the application workspace cannot read the network outputs, grant only the required workspace-to-workspace access, and verify the application plan succeeds.',
  evidence: [
    {
      id: 'remote-state-config',
      title: 'Application Workspace Configuration',
      kind: 'code',
      content: `data "terraform_remote_state" "network" {
  backend = "remote"

  config = {
    organization = "training-org"

    workspaces = {
      name = "fa-hcp-network"
    }
  }
}

locals {
  vpc_id = data.terraform_remote_state.network.outputs.vpc_id
}

Current workspace:
fa-hcp-app`
    },
    {
      id: 'run-error',
      title: 'fa-hcp-app Plan Run',
      kind: 'code',
      content: `data.terraform_remote_state.network: Reading...

Planning failed.

Error: Failed to load remote state

Unable to read state for workspace "fa-hcp-network".
The current workspace is not authorized to access this workspace's state.

Organization:
training-org

Source workspace:
fa-hcp-network

Consumer workspace:
fa-hcp-app`
    },
    {
      id: 'state-sharing-settings',
      title: 'fa-hcp-network Remote State Sharing',
      kind: 'code',
      content: `Workspace: fa-hcp-network

Remote state sharing:
Share state globally: Disabled

Workspaces allowed to access state:
<none>

Available output:
vpc_id = "vpc-0training123"

Approved access boundary:
Allow fa-hcp-app to read fa-hcp-network state outputs.
Do not enable global remote-state sharing for the organization.
Do not grant unrelated workspaces access.`
    }
  ],
  successCriteria: [
    'The learner identifies that fa-hcp-network does not currently allow fa-hcp-app to access its remote state.',
    'Remote-state sharing is updated to allow only fa-hcp-app to consume the network workspace state.',
    'Global state sharing remains disabled and unrelated workspaces receive no new access.',
    'A final fa-hcp-app plan reads the vpc_id output successfully and proceeds without the remote-state authorization failure.'
  ],
  hints: [
    'The source workspace exists and contains the required output, so inspect who that workspace currently permits to read its state.',
    'HCP Terraform can restrict remote-state access between workspaces; being in the same organization does not automatically grant every workspace access to another workspace state.',
    'Add fa-hcp-app to the allowed remote-state consumers for fa-hcp-network while leaving global sharing disabled, then rerun the application plan.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why can fa-hcp-app not read the network workspace output?',
      options: [
        { id: 'state-sharing-not-authorized', text: 'fa-hcp-network has global state sharing disabled and does not list fa-hcp-app as an allowed remote-state consumer.' },
        { id: 'output-missing', text: 'fa-hcp-network does not expose a vpc_id output.' },
        { id: 'different-org', text: 'The two workspaces belong to different HCP Terraform organizations.' },
        { id: 'remote-state-unsupported', text: 'HCP Terraform never allows one workspace to consume state from another workspace.' }
      ],
      correctOptionId: 'state-sharing-not-authorized',
      explanation: 'The source workspace contains vpc_id and both workspaces are in training-org, but the state-sharing settings allow no consuming workspaces.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective permission change?',
      options: [
        { id: 'allow-app-workspace', text: 'Add fa-hcp-app to the workspaces allowed to access fa-hcp-network remote state and keep global sharing disabled.' },
        { id: 'enable-global', text: 'Enable global remote-state sharing so every workspace in the organization can read the network state.' },
        { id: 'copy-state', text: 'Download the network state file and commit a copy into the application repository.' },
        { id: 'duplicate-vpc', text: 'Create a second VPC in fa-hcp-app so no remote-state access is required.' }
      ],
      correctOptionId: 'allow-app-workspace',
      explanation: 'Allowing only the required consumer workspace restores the integration while preserving the narrow state-sharing boundary.'
    }
  ],
  solution: {
    rootCause: 'The fa-hcp-network workspace has global remote-state sharing disabled and has no workspace-specific consumers configured, so fa-hcp-app is not authorized to read its state outputs.',
    fix: 'Add fa-hcp-app to the allowed remote-state consumers for fa-hcp-network, leave global sharing disabled, and rerun the fa-hcp-app plan to verify it can read vpc_id successfully.',
    prevention: 'Treat cross-workspace state access as an explicit dependency: grant only required consumer workspaces, review remote-state sharing when new integrations are added, and avoid organization-wide sharing unless it is genuinely required.'
  }
});
