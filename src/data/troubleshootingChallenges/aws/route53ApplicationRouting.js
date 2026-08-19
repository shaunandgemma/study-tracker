export default Object.freeze({
  id: 'aws-route53-application-routing',
  examId: 'aws-saa-c03',
  order: 5,
  category: 'Amazon Route 53',
  title: 'Restore Route 53 Application Routing',
  difficulty: 'Intermediate',
  summary: 'Find an incorrect alias target that sends application traffic to the wrong load balancer.',
  scenario: 'After a blue-to-green application cutover, app.training.example.com still reaches the old rollback environment even though the new Application Load Balancer and its targets are healthy. The rollback load balancer must remain available, and the application and load balancers must not be rebuilt or reconfigured.',
  task: 'Use the supplied DNS and load-balancer evidence to identify the routing fault, make the smallest DNS correction, and verify that the application hostname reaches the approved active load balancer.',
  evidence: [
    {
      id: 'route53-record',
      title: 'Route 53 record',
      kind: 'code',
      content: `Hosted zone: training.example.com
Record name: app.training.example.com
Record type: A
Routing policy: Simple
Alias: Yes
Alias target: dualstack.fa-app-alb-blue-111111111.eu-west-2.elb.amazonaws.com.
Evaluate target health: Yes`
    },
    {
      id: 'load-balancers',
      title: 'Application Load Balancer inventory',
      kind: 'code',
      content: `Rollback ALB
Name: fa-app-alb-blue
DNS name: fa-app-alb-blue-111111111.eu-west-2.elb.amazonaws.com
State: active
Targets: 2 healthy
GET /: HTTP 404 - rollback site

Approved active ALB
Name: fa-app-alb-green
DNS name: fa-app-alb-green-222222222.eu-west-2.elb.amazonaws.com
State: active
Targets: 2 healthy
GET /: HTTP 200 - training application`
    },
    {
      id: 'change-boundary',
      title: 'Approved change boundary',
      kind: 'text',
      content: 'The approved production entry point is fa-app-alb-green. Keep fa-app-alb-blue online for rollback. Change DNS only; do not modify listeners, target groups, security groups, health checks, or application code.'
    }
  ],
  successCriteria: [
    'The learner identifies that the Route 53 alias still targets fa-app-alb-blue instead of the approved active load balancer.',
    'app.training.example.com remains an A alias record and targets dualstack.fa-app-alb-green-222222222.eu-west-2.elb.amazonaws.com.',
    'The rollback load balancer and both load-balancer configurations remain unchanged.',
    'A final request to app.training.example.com returns HTTP 200 from the active training application.'
  ],
  hints: [
    'Compare the alias target in Route 53 with the DNS names of the two load balancers.',
    'An alias record sends DNS traffic to the AWS resource named as its alias target; healthy targets do not help if the record points to the wrong load balancer.',
    'Keep the A alias record but change its target from fa-app-alb-blue to fa-app-alb-green, then test the application hostname again.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What is the root cause of the application routing failure?',
      options: [
        { id: 'wrong-alias-target', text: 'The Route 53 A alias still points to the rollback ALB instead of the approved active ALB.' },
        { id: 'unhealthy-green', text: 'The active ALB has no healthy targets.' },
        { id: 'missing-listener', text: 'The active ALB has no listener configured.' },
        { id: 'dns-type', text: 'Route 53 cannot use an A alias record with an Application Load Balancer.' }
      ],
      correctOptionId: 'wrong-alias-target',
      explanation: 'The record names fa-app-alb-blue as its alias target, while the deployment evidence identifies fa-app-alb-green as the approved healthy entry point.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'change-alias', text: 'Update the existing A alias target to fa-app-alb-green and verify the application hostname.' },
        { id: 'delete-blue', text: 'Delete the rollback ALB so Route 53 cannot reach it.' },
        { id: 'rebuild-green', text: 'Rebuild the healthy active ALB and its target group.' },
        { id: 'fixed-ip', text: 'Replace the alias with a fixed IP address copied from one load-balancer node.' }
      ],
      correctOptionId: 'change-alias',
      explanation: 'Changing only the incorrect alias target restores the intended route while preserving the approved rollback environment and managed load-balancer DNS behaviour.'
    }
  ],
  solution: {
    rootCause: 'The Route 53 A alias for app.training.example.com still targeted fa-app-alb-blue after the cutover, so users were sent to the rollback environment instead of fa-app-alb-green.',
    fix: 'Update the existing A alias record so its target is dualstack.fa-app-alb-green-222222222.eu-west-2.elb.amazonaws.com, leave the load balancers unchanged, and verify that app.training.example.com returns HTTP 200 from the active application.',
    prevention: 'Include Route 53 alias verification in cutover checklists and compare the deployed record target with the approved load-balancer DNS name before completing a release.'
  }
});
