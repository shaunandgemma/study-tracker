import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-25',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR with AWS Lambda',
  status: 'ready',
  plainEnglish: 'AWS Lambda allows developers to package and deploy serverless functions as container images (up to 10 GB in size) stored in Amazon ECR. When deploying containerized Lambda functions, AWS Lambda pulls the function container image directly from your ECR repository.',
  whyItMatters: 'Standard Lambda deployment zip files are limited to 250 MB (unzipped). Container image deployment to Lambda increases this limit to 10 GB, enabling heavy machine learning, data processing, and complex dependency packages (like PyTorch or TensorFlow) in serverless functions.',
  workplaceExample: 'A data science team packages a Python machine learning model (2.5 GB with dependencies) into a Docker container image. They push the image to ECR and deploy it as a serverless AWS Lambda function triggered by API Gateway.',
  examFocus: 'SAA-C03 Lambda Container Image rules:\n- Lambda supports container images up to 10 GB stored in Amazon ECR.\n- Container image must be in an ECR repository within the SAME AWS account as the Lambda function.\n- Lambda function execution role requires permissions to pull images from ECR.',
  keyPoints: [
    'Enables packaging serverless Lambda functions as Docker container images up to 10 GB.',
    'Overcomes standard 250 MB Lambda deployment package zip size limits.',
    'Images must be stored in an ECR repository in the same account as the Lambda function.',
    'Ideal for serverless machine learning inference, data science, and heavy dependencies.',
    'Integrates with ECR Image Scanning for security vulnerability compliance.'
  ],
  commonMistake: 'Attempting to deploy a containerized Lambda function using a container image stored in a public Docker Hub repository or an ECR repository in a different AWS account. Lambda container images MUST reside in an ECR repository within the same AWS account.',
  example: 'Creating Lambda Function from ECR Container Image:\n`aws lambda create-function --function-name ml-inference --package-type Image --code ImageUri=123456789012.dkr.ecr.us-east-1.amazonaws.com/ml-inference:v1 --role arn:aws:iam::123456789012:role/lambda-role`',
  sources: [
    { title: 'Deploying Lambda functions as container images', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html' }
  ]
});
