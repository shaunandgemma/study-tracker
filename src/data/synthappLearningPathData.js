// Generated canonical Follow Along configuration. Canonical task content remains authoritative.
import { SYNTHAPP_TASKS } from '../features/followAlongs/catalogues/synthappFollowAlongTasks.js';

const TASK_METADATA = {
  "task-synthapp-architecture-001": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-synthapp-dynamodb-002": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-synthapp-frontend-003": {
    "phaseId": "phase-1",
    "prerequisites": [],
    "isOptional": false
  },
  "task-synthapp-lambda-role-004": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-synthapp-lambda-api-005": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-synthapp-http-api-006": {
    "phaseId": "phase-2",
    "prerequisites": [],
    "isOptional": false
  },
  "task-synthapp-cognito-007": {
    "phaseId": "phase-3",
    "prerequisites": [],
    "isOptional": false
  },
  "task-synthapp-observability-008": {
    "phaseId": "phase-3",
    "prerequisites": [],
    "isOptional": false
  },
  "task-synthapp-cleanup-009": {
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

export const SYNTHAPP_FOLLOW_ALONG_CONFIG = {
  template: {
  "profile": "canonical-follow-along",
  "version": "1.0.0",
  "sharedContractHash": "a269ef5dbd03108cb8bc86082ca60a850e7ffdd1cb537942bfe2d7d04a7ff836"
},
  identity: {
  "serviceSlug": "synthapp",
  "serviceName": "SYNTHAPP",
  "displayName": "SYNTHAPP Follow Along",
  "description": "A connected SYNTHAPP learning programme.",
  "programmeId": "synthapp-learning-path",
  "pathId": "synthapp-learning-path",
  "componentNamespace": "Synthapp"
},
  presentation: {
  "accentColor": "#0891b2",
  "iconLabel": "SY"
},
  storage: {
  "storageNamespace": "studytracker_synthapp",
  "guestProgressKey": "studytracker_synthapp_progress",
  "guestResourcesKey": "studytracker_synthapp_resources",
  "remoteProgressTable": "user_learning_path_progress",
  "remoteResourcesTable": "user_learning_path_resources"
},
  progress: {
  "initialTaskId": "task-synthapp-architecture-001",
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
    "title": "SYNTHAPP Phase 1: Foundation & Core Setup",
    "description": "Heuristic grouping of 3 canonical tasks based on catalogue sequence.",
    "taskIds": [
      "task-synthapp-architecture-001",
      "task-synthapp-dynamodb-002",
      "task-synthapp-frontend-003"
    ]
  },
  {
    "id": "phase-2",
    "title": "SYNTHAPP Phase 2: Security & Permissions",
    "description": "Heuristic grouping of 3 canonical tasks based on catalogue sequence.",
    "taskIds": [
      "task-synthapp-lambda-role-004",
      "task-synthapp-lambda-api-005",
      "task-synthapp-http-api-006"
    ]
  },
  {
    "id": "phase-3",
    "title": "SYNTHAPP Phase 3: Access Control & Policies",
    "description": "Heuristic grouping of 3 canonical tasks based on catalogue sequence.",
    "taskIds": [
      "task-synthapp-cognito-007",
      "task-synthapp-observability-008",
      "task-synthapp-cleanup-009"
    ]
  }
],
  tasks: [...SYNTHAPP_TASKS.map(withCanonicalMetadata), ...PATH_ONLY_TASKS.map(withCanonicalMetadata)],
  resources: {
  "schema": [
    {
      "key": "dynamodbTableName",
      "type": "dynamodb-table",
      "label": "DynamoDB table name",
      "validator": { "kind": "identifier" }
    },
    {
      "key": "frontendBucketName",
      "type": "s3-bucket",
      "label": "Frontend S3 bucket name",
      "validator": { "kind": "identifier" }
    },
    {
      "key": "lambdaRoleName",
      "type": "iam-role",
      "label": "Lambda execution role name",
      "validator": { "kind": "identifier" }
    },
    {
      "key": "lambdaFunctionName",
      "type": "lambda-function",
      "label": "Lambda function name",
      "validator": { "kind": "identifier" }
    },
    {
      "key": "httpApiId",
      "type": "api-gateway-http-api",
      "label": "HTTP API ID",
      "validator": { "kind": "identifier" }
    },
    {
      "key": "httpApiEndpoint",
      "type": "api-endpoint",
      "label": "HTTP API endpoint",
      "validator": { "kind": "identifier" }
    },
    {
      "key": "cognitoUserPoolId",
      "type": "cognito-user-pool",
      "label": "Cognito user pool ID",
      "validator": { "kind": "identifier" }
    },
    {
      "key": "cognitoAppClientId",
      "type": "cognito-app-client",
      "label": "Cognito app client ID",
      "validator": { "kind": "identifier" }
    },
    {
      "key": "apiAuthorizerId",
      "type": "api-gateway-authorizer",
      "label": "API authorizer ID",
      "validator": { "kind": "identifier" }
    },
    {
      "key": "cloudWatchAlarmName",
      "type": "cloudwatch-alarm",
      "label": "CloudWatch alarm name",
      "validator": { "kind": "identifier" }
    }
  ],
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
export const SYNTHAPP_LEARNING_PATH_PHASES = SYNTHAPP_FOLLOW_ALONG_CONFIG.phases;

export function getSynthappPathTasks() {
  return SYNTHAPP_FOLLOW_ALONG_CONFIG.tasks;
}
