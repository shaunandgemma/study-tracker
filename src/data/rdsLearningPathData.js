// Generated canonical Follow Along configuration. Canonical task content remains authoritative.
import { RDS_TASKS } from '../features/followAlongs/catalogues/rdsFollowAlongTasks.js';

const TASK_METADATA = {
  "task-saa-rds-create-rds-and-connect-from-ec2-001": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-rds-create-a-multi-az-rds-database-002": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-rds-create-an-rds-read-replica-and-explain-read-scaling-003": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-rds-take-an-rds-snapshot-and-restore-a-new-database-004": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-rds-enable-rds-encryption-with-kms-005": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-rds-compare-rds-backup-snapshot-and-pitr-006": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-rds-choose-the-best-database-for-exam-scenarios-025": {
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

export const RDS_FOLLOW_ALONG_CONFIG = {
  template: {
  "profile": "canonical-follow-along",
  "version": "1.0.0",
  "sharedContractHash": "a269ef5dbd03108cb8bc86082ca60a850e7ffdd1cb537942bfe2d7d04a7ff836"
},
  identity: {
  "serviceSlug": "rds",
  "serviceName": "RDS",
  "displayName": "RDS Follow Along",
  "description": "A connected RDS learning programme.",
  "programmeId": "rds-learning-path",
  "pathId": "rds-learning-path",
  "componentNamespace": "Rds"
},
  presentation: {
  "accentColor": "#0891b2",
  "iconLabel": "RD"
},
  storage: {
  "storageNamespace": "studytracker_rds",
  "guestProgressKey": "studytracker_rds_progress",
  "guestResourcesKey": "studytracker_rds_resources",
  "remoteProgressTable": "user_learning_path_progress",
  "remoteResourcesTable": "user_learning_path_resources"
},
  progress: {
  "initialTaskId": "task-saa-rds-create-rds-and-connect-from-ec2-001",
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
    "title": "RDS Phase 1: Foundation & Core Setup",
    "description": "",
    "taskIds": [
      "task-saa-rds-create-rds-and-connect-from-ec2-001",
      "task-saa-rds-create-a-multi-az-rds-database-002",
      "task-saa-rds-create-an-rds-read-replica-and-explain-read-scaling-003"
    ]
  },
  {
    "id": "phase-2",
    "title": "RDS Phase 2: Security & Permissions",
    "description": "",
    "taskIds": [
      "task-saa-rds-take-an-rds-snapshot-and-restore-a-new-database-004",
      "task-saa-rds-enable-rds-encryption-with-kms-005",
      "task-saa-rds-compare-rds-backup-snapshot-and-pitr-006"
    ]
  },
  {
    "id": "phase-3",
    "title": "RDS Phase 3: Access Control & Policies",
    "description": "",
    "taskIds": [
      "task-saa-rds-choose-the-best-database-for-exam-scenarios-025"
    ]
  }
],
  tasks: [...RDS_TASKS.map(withCanonicalMetadata), ...PATH_ONLY_TASKS.map(withCanonicalMetadata)],
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
export const RDS_LEARNING_PATH_PHASES = RDS_FOLLOW_ALONG_CONFIG.phases;

export function getRdsPathTasks() {
  return RDS_FOLLOW_ALONG_CONFIG.tasks;
}
