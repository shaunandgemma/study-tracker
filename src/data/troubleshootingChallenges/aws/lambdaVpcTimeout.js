export default Object.freeze({
  id: 'aws-lambda-vpc-timeout',
  examId: 'aws-saa-c03',
  order: 15,
  category: 'AWS Lambda',
  title: 'Recover a Lambda Function Timing Out Inside a VPC',
  difficulty: 'Intermediate',
  summary: 'Diagnose why a VPC-connected Lambda function cannot reach an external HTTPS service.',
  scenario: 'The fa-training-payment Lambda function was moved into private subnets so it can reach an internal database. Database calls work, but every HTTPS request to the approved external payment API now times out until the Lambda invocation reaches its configured timeout. The function must remain in private subnets and the external API must continue to be reached over HTTPS.',
  task: 'Use the supplied Lambda, route-table, and network evidence to find the missing outbound path, apply the smallest safe network correction, and verify both database and external HTTPS connectivity without placing the function in a public subnet.',
  evidence: [
    {
      id: 'lambda-error',
      title: 'Lambda Invocation Log',
      kind: 'code',
      content: `Function: fa-training-payment
VPC: vpc-0training123
Subnets:
- subnet-0lambdaa123
- subnet-0lambdab456
Security group: sg-0lambda123

Log:
INFO Connected to internal database 10.60.21.40:5432
INFO Calling https://api.training-payments.example/v1/authorize
Task timed out after 30.00 seconds`
    },
    {
      id: 'lambda-route-table',
      title: 'Lambda Private Subnet Route Table',
      kind: 'code',
      content: `Route table: rtb-0lambda-private123
Associated subnets:
- subnet-0lambdaa123
- subnet-0lambdab456

Routes:
10.60.0.0/16 -> local

Security group sg-0lambda123 outbound:
HTTPS | TCP | 443 | 0.0.0.0/0`
    },
    {
      id: 'nat-status',
      title: 'Existing NAT Path',
      kind: 'code',
      content: `NAT gateway: nat-0training123
State: Available
Subnet: subnet-0public123

Public subnet route table:
10.60.0.0/16 -> local
0.0.0.0/0 -> igw-0training123

Adjacent application private route table:
10.60.0.0/16 -> local
0.0.0.0/0 -> nat-0training123

Approved boundary:
Lambda must remain in subnet-0lambdaa123 and subnet-0lambdab456.
Do not assign public IP addresses or move the function to a public subnet.`
    }
  ],
  successCriteria: [
    'The learner identifies the missing default route from the Lambda private subnets to the existing NAT gateway.',
    'The Lambda private route table sends 0.0.0.0/0 to nat-0training123.',
    'The function remains attached to its approved private subnets and security group.',
    'A final invocation successfully reaches both the internal database and the approved external HTTPS API without timing out.'
  ],
  hints: [
    'The security group already permits outbound HTTPS, so compare the Lambda subnet route table with the working adjacent private subnet route table.',
    'A VPC-connected Lambda function in a private subnet needs a valid outbound route, such as through a NAT gateway, to reach public internet endpoints.',
    'Add the missing 0.0.0.0/0 route in rtb-0lambda-private123 to the existing available NAT gateway nat-0training123, then retest the function.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What is causing the external HTTPS request from the Lambda function to time out?',
      options: [
        { id: 'missing-nat-route', text: 'The Lambda private subnet route table has no default route to the existing NAT gateway.' },
        { id: 'missing-https-egress', text: 'The Lambda security group blocks outbound TCP port 443.' },
        { id: 'database-route', text: 'The VPC local route prevents the Lambda function from reaching its database.' },
        { id: 'needs-public-subnet', text: 'Lambda functions can reach the internet only when attached directly to a public subnet.' }
      ],
      correctOptionId: 'missing-nat-route',
      explanation: 'The function can reach the local database and its security group allows HTTPS, but its private route table contains only the VPC local route and therefore has no path to the public API.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'route-to-nat', text: 'Add 0.0.0.0/0 to rtb-0lambda-private123 with nat-0training123 as the target and keep the Lambda function in its private subnets.' },
        { id: 'move-public', text: 'Move the Lambda function into the public subnet and rely on the internet gateway.' },
        { id: 'open-ingress', text: 'Allow inbound TCP port 443 from 0.0.0.0/0 on the Lambda security group.' },
        { id: 'remove-vpc', text: 'Remove the function from the VPC even though it still needs the private database.' }
      ],
      correctOptionId: 'route-to-nat',
      explanation: 'The NAT gateway is already available and the function must stay private, so adding the missing default route restores outbound internet connectivity without changing the approved placement.'
    }
  ],
  solution: {
    rootCause: 'The route table associated with the Lambda private subnets contains only the VPC local route and lacks a 0.0.0.0/0 route to the existing NAT gateway, so public HTTPS traffic has no outbound path.',
    fix: 'Add 0.0.0.0/0 -> nat-0training123 to rtb-0lambda-private123, leave the Lambda function in the approved private subnets, and invoke it again to verify successful database access and external HTTPS communication.',
    prevention: 'Use a standard private-subnet routing pattern for VPC-connected Lambda functions that need internet egress and validate required external endpoints as part of deployment testing.'
  }
});
