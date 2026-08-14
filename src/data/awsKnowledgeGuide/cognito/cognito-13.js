import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-13',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'User Pool App Clients',
  status: 'ready',
  plainEnglish: 'An App Client is an entity configuration within a Cognito User Pool that represents a specific application frontend (such as a React web app, iOS mobile app, Android app, or server-side microservice) requesting authentication. Each App Client receives a unique App Client ID (and an optional secret key) and defines OAuth 2.0 grant types, callback URLs, token expiration times, and allowed identity providers.',
  whyItMatters: 'App Clients allow a single Cognito User Pool to serve multiple client applications with different security rules (e.g. mobile apps vs web apps vs backend microservices) without duplicating the underlying user directory.',
  workplaceExample: 'A company configures two App Clients in one User Pool:\n1. `MobileAppClient`: No Client Secret (public client for iOS/Android), 30-day refresh token.\n2. `WebAdminClient`: Includes a Client Secret (confidential client for Node.js server), 1-day refresh token.',
  examFocus: 'SAA-C03 App Client Security rules:\n- Public Clients (Mobile apps, Single Page React Apps): MUST NOT use a Client Secret (client secret cannot be safely hidden in mobile/browser code).\n- Confidential Clients (Server-side web apps running on EC2/Fargate): SHOULD use a Client Secret.\n- Controls Allowed OAuth Flows (Authorization Code Grant, Implicit Grant, Client Credentials).',
  keyPoints: [
    'Represents an application frontend interacting with a User Pool.',
    'Provides a unique App Client ID and optional Client Secret.',
    'Public clients (mobile/SPA) must not use client secrets.',
    'Confidential clients (server-side apps) use client secrets for backend authentication.',
    'Defines token expiration durations, OAuth flows, and callback URLs.'
  ],
  commonMistake: 'Enabling a Client Secret on an App Client intended for a browser-based Single Page App (SPA) or mobile app. Browsers cannot securely hide client secrets.',
  example: 'Creating an App Client for a Web App via CLI:\n`aws cognito-idp create-user-pool-client --user-pool-id us-east-1_abc123 --client-name ReactSPAClient --no-generate-secret`',
  sources: [
    { title: 'Configuring a user pool app client', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client.html' }
  ]
});
