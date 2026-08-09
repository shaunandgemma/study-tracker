// Generated canonical Follow Along configuration. Canonical task content remains authoritative.
import { DYNAMODB_TASKS } from '../features/followAlongs/catalogues/dynamodbFollowAlongTasks.js';

const TASK_METADATA = {
  "task-saa-dynamodb-create-a-dynamodb-table-with-a-partition-key-010": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-dynamodb-add-a-sort-key-query-dynamodb-data-011": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-dynamodb-configure-dynamodb-on-demand-vs-provisioned-capacity-012": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-dynamodb-create-a-dynamodb-global-secondary-index-gsi-013": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-dynamodb-enable-dynamodb-streams-014": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-dynamodb-enable-dynamodb-time-to-live-ttl-015": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-dynamodb-enable-dynamodb-global-tables-016": {
    "phaseId": "phase-3",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-dynamodb-configure-dynamodb-backup-restore-017": {
    "phaseId": "phase-3",
    "prerequisites": [],
    "isOptional": false
  },
  "task-saa-dynamodb-compare-redshift-vs-rds-vs-dynamodb-022": {
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

export const DYNAMODB_FOLLOW_ALONG_CONFIG = {
  template: {
  "profile": "canonical-follow-along",
  "version": "1.0.0",
  "sharedContractHash": "a269ef5dbd03108cb8bc86082ca60a850e7ffdd1cb537942bfe2d7d04a7ff836"
},
  identity: {
  "serviceSlug": "dynamodb",
  "serviceName": "DYNAMODB",
  "displayName": "DYNAMODB Follow Along",
  "description": "A connected DYNAMODB learning programme.",
  "programmeId": "dynamodb-learning-path",
  "pathId": "dynamodb-learning-path",
  "componentNamespace": "Dynamodb"
},
  presentation: {
  "accentColor": "#0891b2",
  "iconLabel": "DY"
},
  storage: {
  "storageNamespace": "studytracker_dynamodb",
  "guestProgressKey": "studytracker_dynamodb_progress",
  "guestResourcesKey": "studytracker_dynamodb_resources",
  "remoteProgressTable": "user_learning_path_progress",
  "remoteResourcesTable": "user_learning_path_resources"
},
  progress: {
  "initialTaskId": "task-saa-dynamodb-create-a-dynamodb-table-with-a-partition-key-010",
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
    "title": "DYNAMODB Phase 1: Foundation & Core Setup",
    "description": "Heuristic grouping of 3 canonical tasks based on catalogue sequence.",
    "taskIds": [
      "task-saa-dynamodb-create-a-dynamodb-table-with-a-partition-key-010",
      "task-saa-dynamodb-add-a-sort-key-query-dynamodb-data-011",
      "task-saa-dynamodb-configure-dynamodb-on-demand-vs-provisioned-capacity-012"
    ]
  },
  {
    "id": "phase-2",
    "title": "DYNAMODB Phase 2: Security & Permissions",
    "description": "Heuristic grouping of 3 canonical tasks based on catalogue sequence.",
    "taskIds": [
      "task-saa-dynamodb-create-a-dynamodb-global-secondary-index-gsi-013",
      "task-saa-dynamodb-enable-dynamodb-streams-014",
      "task-saa-dynamodb-enable-dynamodb-time-to-live-ttl-015"
    ]
  },
  {
    "id": "phase-3",
    "title": "DYNAMODB Phase 3: Access Control & Policies",
    "description": "Heuristic grouping of 3 canonical tasks based on catalogue sequence.",
    "taskIds": [
      "task-saa-dynamodb-enable-dynamodb-global-tables-016",
      "task-saa-dynamodb-configure-dynamodb-backup-restore-017",
      "task-saa-dynamodb-compare-redshift-vs-rds-vs-dynamodb-022"
    ]
  }
],
  tasks: [...DYNAMODB_TASKS.map(withCanonicalMetadata), ...PATH_ONLY_TASKS.map(withCanonicalMetadata)],
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
export const DYNAMODB_LEARNING_PATH_PHASES = DYNAMODB_FOLLOW_ALONG_CONFIG.phases;

export function getDynamodbPathTasks() {
  return DYNAMODB_FOLLOW_ALONG_CONFIG.tasks;
}
