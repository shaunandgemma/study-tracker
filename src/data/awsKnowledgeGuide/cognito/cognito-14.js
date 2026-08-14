import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-14',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'Social Identity Provider Federation',
  status: 'ready',
  plainEnglish: 'Social Identity Provider Federation allows users to sign in to your application using their existing social network accounts (such as Google, Facebook, Amazon, or Apple). Cognito User Pools act as an identity broker: when a user clicks "Sign in with Google", Cognito redirects them to Google for authentication, receives the social token, maps social attributes (name, email) to a Cognito user profile, and returns Cognito JWT tokens to your app.',
  whyItMatters: 'Social federation eliminates sign-up friction. Users do not need to create or remember a new password for your application, leading to significantly higher user registration rates.',
  workplaceExample: 'A consumer fitness app enables Social Federation with Google and Apple. Users sign in with 1 click using FaceID on Apple or their Google account. Cognito creates a mapped user record in the User Pool without storing a local password.',
  examFocus: 'SAA-C03 Social Federation key points:\n- Supported Social IdPs: Google, Facebook, Amazon, Apple.\n- Cognito handles OAuth 2.0 token exchange and user attribute mapping automatically.\n- Returns standard Cognito JWT tokens to the client app regardless of which social provider was used.\n- Seamlessly pairs with Cognito Identity Pools for temporary AWS IAM credentials.',
  keyPoints: [
    'Allows users to sign in using Google, Facebook, Amazon, or Apple accounts.',
    'Cognito acts as the identity broker, mapping social claims to User Pool attributes.',
    'Eliminates password creation and reduces registration friction.',
    'Client application receives standard Cognito JWT tokens upon successful sign-in.',
    'Configured via App Client supported identity providers settings.'
  ],
  commonMistake: 'Writing custom backend code for Google and Facebook OAuth integration when Cognito User Pools native Social Federation handles provider token verification and profile creation out of the box.',
  example: 'Social Provider Mapping in Cognito:\nGoogle Claim `email` -> Mapped to Cognito Attribute `email`.\nGoogle Claim `sub` -> Mapped to Cognito Attribute `username`.',
  sources: [
    { title: 'Adding social identity providers to a user pool', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html' }
  ]
});
