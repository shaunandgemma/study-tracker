import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-7',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'API Gateway WebSocket APIs',
  status: 'ready',
  plainEnglish: 'A WebSocket API maintains a stateful, full-duplex connection between a client and API Gateway. Full-duplex means either side can send a message without waiting for a new request. API Gateway selects a route from message content and invokes a Lambda, HTTP, or supported AWS service integration. Special routes handle connection, disconnection, and unmatched messages, and a backend can use the connection identifier to send a callback to a connected client.',
  whyItMatters: 'WebSocket APIs avoid repeated polling when applications need near-real-time, two-way communication. API Gateway manages connection handling and routing so teams can build chat, live dashboards, collaboration, and notification systems without operating a WebSocket fleet.',
  workplaceExample: 'A delivery dashboard opens one WebSocket connection per dispatcher. Location messages route to a Lambda integration, and backend workers push status updates to the correct connection IDs as deliveries change.',
  examFocus: 'Choose WebSocket when a server must push data to connected clients or both sides exchange messages continuously. Choose REST or HTTP API for stateless request-response calls. Expect route-selection expressions, $connect, $disconnect, $default, connection IDs, and callback management to be relevant clues. Connections are stateful even if integrations such as Lambda remain stateless.',
  keyPoints: [
    'WebSocket APIs support persistent, bidirectional communication.',
    'Route-selection expressions map incoming messages to route keys.',
    '$connect and $disconnect handle connection lifecycle events.',
    '$default handles messages that do not match another route.',
    'Backends use the management API and connection ID to push callbacks.'
  ],
  commonMistake: 'Treating a connection ID as permanent causes failed callbacks after a client reconnects. Store current connection state with suitable expiration and remove stale records when disconnects occur or callback delivery reports that a connection is gone.',
  example: 'A JSON message with an action field set to sendMessage can select a sendMessage route and invoke its integration. After connecting a test client, send that message and expect the route response or callback; verify the route’s CloudWatch metrics and remove the recorded connection when the client disconnects.',
  sources: [
    { title: 'API Gateway WebSocket APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html' },
    { title: 'Overview of WebSocket APIs in API Gateway', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html' }
  ]
});
