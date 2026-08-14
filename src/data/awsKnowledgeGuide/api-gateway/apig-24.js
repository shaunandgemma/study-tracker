import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-24',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'Request and Response Transformations',
  status: 'ready',
  plainEnglish: 'A transformation changes a client request before the integration receives it or changes an integration response before the client receives it. REST API non-proxy integrations can use mapping templates written in Velocity Template Language (VTL), with JSONPath expressions to reshape payloads, plus parameter mappings for headers, paths, and query strings. HTTP APIs offer parameter mapping for supported request and response properties.',
  whyItMatters: 'Transformations let an API keep a stable, clean public contract while adapting to backend formats. They can add required service parameters, rename fields, remove internal headers, or translate legacy response codes without changing every client or backend.',
  workplaceExample: 'A mobile client sends {"quantity":2}, while a legacy backend expects {"item_count":2,"source":"mobile"}. A REST mapping template creates the backend shape and maps the legacy success response to the public status and headers.',
  examFocus: 'Choose a REST non-proxy integration when the scenario requires body transformation with VTL and explicit integration responses. Lambda proxy or HTTP proxy integrations put more contract logic in the backend and do not use the same integration-response mapping layer. HTTP API parameter mapping can modify documented headers, query strings, paths, and response status or headers but is not identical to REST VTL body mapping.',
  keyPoints: [
    'Request mappings adapt the public contract to the backend contract.',
    'Response mappings adapt backend output to the client contract.',
    'REST mapping templates use VTL and JSONPath for payload transformation.',
    'Mappings are selected in relation to content type and integration configuration.',
    'HTTP API parameter mapping supports a defined set of parameter and response changes.'
  ],
  commonMistake: 'Putting large amounts of business logic into VTL makes an API hard to test and maintain. Keep mappings focused on protocol adaptation; use Lambda or application code when logic needs complex validation, branching, data access, or independent testing.',
  example: `A small REST request template can produce a stable backend body:\n\n{\n  "itemCount": $input.json('$.quantity'),\n  "requestId": "$context.requestId"\n}\n\nSend a test body with quantity 2 and expect itemCount 2 plus the generated request ID. Verify the integration request in a safe test environment and ensure malformed input is rejected appropriately.`,
  sources: [
    { title: 'Mapping template transformations for REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/models-mappings.html' },
    { title: 'Transform requests and responses for HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-parameter-mapping.html' },
    { title: 'Integrations for REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-integration-settings.html' }
  ]
});
