// Generated canonical Follow Along configuration. Canonical task content remains authoritative.
import { ELB_TASKS } from '../features/followAlongs/catalogues/elbFollowAlongTasks.js';

const TASK_METADATA = {
  "task-saa-elb-create-an-alb-in-front-of-an-auto-scaling-group-001": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-elb-create-a-network-load-balancer-002": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-elb-create-a-gateway-load-balancer-style-architecture-003": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-elb-configure-alb-path-based-listener-rules-004": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-elb-add-https-to-an-alb-and-redirect-http-008": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-elb-sticky-sessions-on-an-alb-target-group-009": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-elb-cross-zone-load-balancing-traffic-distribution-010": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-elb-deregistration-delay-and-connection-draining-011": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-elb-alb-websockets-017": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-elb-compare-internal-and-internet-facing-load-balancers-018": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-elb-enable-alb-access-logs-019": {
    "phaseId": "phase-3",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-elb-test-alb-deletion-protection-020": {
    "phaseId": "phase-3",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-elb-integrate-ec2-with-alb-and-nlb-026": {
    "phaseId": "phase-3",
    "prerequisites": [],
    "isOptional": false
  }
};
const PATH_ONLY_TASKS = [];

const withCanonicalMetadata = task => {
  const metadata = TASK_METADATA[task.id] || {};
  return {
    ...task,
    ...metadata,
    modeAvailability: task.modeAvailability || {
      console: task.consoleSteps?.length ? { status: 'supported' } : { status: 'not_applicable', reason: 'No approved Console instructions exist for this task.' },
      cli: task.cliSteps?.length ? { status: 'supported' } : { status: 'not_applicable', reason: 'No approved CLI instructions exist for this task.' }
    }
  };
};

export const ELB_FOLLOW_ALONG_CONFIG = {
  template: {
  "profile": "canonical-follow-along",
  "version": "1.0.0",
  "sharedContractHash": "a269ef5dbd03108cb8bc86082ca60a850e7ffdd1cb537942bfe2d7d04a7ff836"
},
  identity: {
  "serviceSlug": "elb",
  "serviceName": "ELB",
  "displayName": "ELB Follow Along",
  "description": "A connected ELB learning programme.",
  "programmeId": "elb-learning-path",
  "pathId": "elb-learning-path",
  "componentNamespace": "Elb"
},
  presentation: {
  "accentColor": "#0891b2",
  "iconLabel": "EL"
},
  storage: {
  "storageNamespace": "studytracker_elb",
  "guestProgressKey": "studytracker_elb_progress",
  "guestResourcesKey": "studytracker_elb_resources",
  "remoteProgressTable": "user_learning_path_progress",
  "remoteResourcesTable": "user_learning_path_resources"
},
  progress: {
  "initialTaskId": "task-saa-elb-create-an-alb-in-front-of-an-auto-scaling-group-001",
  "supportedModes": [
    "console",
    "cli",
    "both"
  ],
  "optionalTasksCountTowardsProgress": false,
  "completionStatuses": [
    "in_progress",
    "completed_retained",
    "completed_cleaned"
  ]
},
  capabilities: {
  "regionScope": {
    "status": "not_applicable",
    "reason": "The canonical source declares no regional scope."
  },
  "resourceCapture": {
    "status": "not_applicable",
    "reason": "The canonical source declares no resource bindings to capture."
  },
  "chargeableResources": {
    "status": "not_applicable",
    "reason": "No approved chargeable resource keys are declared."
  },
  "cleanup": {
    "status": "not_applicable",
    "reason": "The canonical source declares no cleanup manifest."
  },
  "serviceValidation": {
    "status": "not_applicable",
    "reason": "The canonical source declares no service-specific validation panel."
  },
  "taskModes": {
    "status": "supported"
  },
  "optionalPanels": {
    "status": "not_applicable",
    "reason": "No optional service panel has been approved."
  }
},
  phases: [
  {
    "id": "phase-1",
    "title": "ELB Phase 1: Foundation & Core Setup",
    "description": "Heuristic grouping of 5 canonical tasks based on catalogue sequence.",
    "taskIds": [
      "task-saa-elb-create-an-alb-in-front-of-an-auto-scaling-group-001",
      "task-saa-elb-create-a-network-load-balancer-002",
      "task-saa-elb-create-a-gateway-load-balancer-style-architecture-003",
      "task-saa-elb-configure-alb-path-based-listener-rules-004",
      "task-saa-elb-add-https-to-an-alb-and-redirect-http-008"
    ]
  },
  {
    "id": "phase-2",
    "title": "ELB Phase 2: Security & Permissions",
    "description": "Heuristic grouping of 5 canonical tasks based on catalogue sequence.",
    "taskIds": [
      "task-saa-elb-sticky-sessions-on-an-alb-target-group-009",
      "task-saa-elb-cross-zone-load-balancing-traffic-distribution-010",
      "task-saa-elb-deregistration-delay-and-connection-draining-011",
      "task-saa-elb-alb-websockets-017",
      "task-saa-elb-compare-internal-and-internet-facing-load-balancers-018"
    ]
  },
  {
    "id": "phase-3",
    "title": "ELB Phase 3: Access Control & Policies",
    "description": "Heuristic grouping of 3 canonical tasks based on catalogue sequence.",
    "taskIds": [
      "task-saa-elb-enable-alb-access-logs-019",
      "task-saa-elb-test-alb-deletion-protection-020",
      "task-saa-elb-integrate-ec2-with-alb-and-nlb-026"
    ]
  }
],
  tasks: [...ELB_TASKS.map(withCanonicalMetadata), ...PATH_ONLY_TASKS.map(withCanonicalMetadata)],
  resources: {
  "schema": [],
  "interpolationAliases": {},
  "chargeableResourceKeys": [],
  "variables": {}
},
  warnings: {
  "cost": "Captured resources may continue to incur provider charges until manually removed.",
  "safety": "Cleanup is manual only."
},
  cleanup: {
  "steps": [],
  "completionGate": "acknowledgement",
  "manualOnly": true,
  "ordering": "reverse_dependency"
},
  extensions: {
  "registrations": []
},
  implementationRequirements: []
};

// Compatibility exports for established service-local catalogue consumers.
// Both remain projections of the canonical schema3 configuration above.
export const ELB_LEARNING_PATH_PHASES = ELB_FOLLOW_ALONG_CONFIG.phases;

export function getElbPathTasks() {
  return ELB_FOLLOW_ALONG_CONFIG.tasks;
}
