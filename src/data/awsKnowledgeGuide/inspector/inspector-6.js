import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'inspector-6',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'AWS Lambda Function Scanning',
  status: 'ready',
  plainEnglish: 'Inspector offers two Lambda scan types for eligible functions and layers. Lambda standard scanning examines supported application dependencies that are uploaded with the function or inherited from layers and produces package vulnerability findings. Lambda code scanning, when available and activated, examines supported custom application code for code vulnerabilities; it requires Lambda standard scanning to be active.',
  whyItMatters: 'Serverless removes server administration but not dependency or application-code risk. Separating the scan types helps developers understand whether to upgrade a library, change their own code, or investigate a coverage limitation.',
  workplaceExample: 'A Python Lambda function receives a standard-scanning finding for an uploaded dependency and a code-scanning finding for unsafe data handling. The team updates its dependency lock file for the first issue, changes and tests its handler for the second, and deploys a new function version.',
  examFocus: 'Lambda standard scanning is dependency scanning; Lambda code scanning is custom-code analysis. Code scanning depends on standard scanning and has its own supported runtimes and availability. Eligibility and coverage matter, so avoid assuming every function, runtime, version, or dependency is scanned.',
  keyPoints: [
    'Lambda standard scanning checks supported third-party dependencies in function packages and layers.',
    'The AWS SDK supplied by the Lambda runtime is not treated like a dependency uploaded with the function.',
    'Lambda code scanning analyzes supported custom application code where available.',
    'Lambda standard scanning must be active before Lambda code scanning can be activated.',
    'Supported runtimes and eligible-function conditions differ and must be checked in current documentation.',
    'Deploying corrected code or dependencies lets Inspector reevaluate the eligible function.'
  ],
  commonMistake: 'Treating standard scanning as a review of the handler\'s source code can send a code defect to the dependency-upgrade queue. Check the finding type and scan type, then remediate either the packaged component or the custom code and redeploy.',
  example: 'Open the Lambda coverage page and compare standard and code scanning for one eligible function. For a package finding, update the declared dependency and deploy; for a code finding, correct the cited code path, run tests, deploy, and verify the corresponding finding state.',
  sources: [
    { title: 'Scanning AWS Lambda functions with Amazon Inspector', url: 'https://docs.aws.amazon.com/inspector/latest/user/scanning-lambda.html' },
    { title: 'Amazon Inspector Lambda standard scanning', url: 'https://docs.aws.amazon.com/inspector/latest/user/scanning_resources_lambda.html' },
    { title: 'Supported operating systems and programming languages', url: 'https://docs.aws.amazon.com/inspector/latest/user/supported.html' },
    { title: 'Activating a scan type', url: 'https://docs.aws.amazon.com/inspector/latest/user/activate-scans.html' }
  ]
});
