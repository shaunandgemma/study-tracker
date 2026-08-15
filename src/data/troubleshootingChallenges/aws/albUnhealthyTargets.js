export default Object.freeze({
  id: 'aws-alb-unhealthy-targets',
  examId: 'aws-saa-c03',
  order: 2,
  category: 'Elastic Load Balancing',
  title: 'Recover unhealthy ALB targets',
  difficulty: 'Intermediate',
  summary: 'Use target health evidence to repair an Application Load Balancer path.',
  scenario: 'The public ALB responds with HTTP 503 because both registered EC2 targets are unhealthy. The web service itself is running.',
  task: 'Identify the fault preventing successful health checks, correct it, and tighten the target security-group rule to the intended ALB source.',
  evidence: [
    {
      id: 'health-check',
      title: 'Target group health check',
      kind: 'code',
      content: `Protocol: HTTP
Port: traffic port (80)
Path: /health
Success codes: 200
Target status: unhealthy
Reason: Health checks failed with these codes: [404]`
    },
    {
      id: 'application',
      title: 'Application test from the instance',
      kind: 'code',
      content: `$ curl -i http://localhost/
HTTP/1.1 200 OK

$ curl -i http://localhost/health
HTTP/1.1 404 Not Found`
    },
    {
      id: 'security',
      title: 'Target security group inbound rule',
      kind: 'code',
      content: `Type: HTTP
Port: 80
Source: 10.20.0.0/16

ALB security group: sg-0alb123`
    }
  ],
  successCriteria: [
    'The health-check path returns an allowed success code.',
    'The target security group allows port 80 specifically from sg-0alb123.',
    'Both registered targets become healthy.',
    'The ALB returns the application instead of HTTP 503.'
  ],
  hints: [
    'The target-health reason includes the HTTP response received by the load balancer.',
    'Test the configured path directly on a target and compare the result.',
    'Use the ALB security group as the target rule source and either create /health or change the health-check path to /.'
  ],
  validationQuestions: [
    {
      id: 'path',
      prompt: 'What does the recorded HTTP 404 prove?',
      options: [
        { id: 'wrong-path', text: 'The load balancer reached the target, but the configured /health path does not exist.' },
        { id: 'timeout', text: 'The target could not be reached on port 80.' },
        { id: 'dns', text: 'The ALB DNS name does not resolve.' },
        { id: 'certificate', text: 'The HTTPS certificate has expired.' }
      ],
      correctOptionId: 'wrong-path',
      explanation: 'A 404 response means the request reached an HTTP server, but that server did not have the requested path.'
    },
    {
      id: 'security',
      prompt: 'Which target security-group source is the clearest least-privilege choice?',
      options: [
        { id: 'alb-sg', text: 'The ALB security group sg-0alb123' },
        { id: 'world', text: '0.0.0.0/0' },
        { id: 'instance', text: 'The target instance ID' },
        { id: 'nat', text: 'The NAT gateway public IP address' }
      ],
      correctOptionId: 'alb-sg',
      explanation: 'Referencing the ALB security group permits target traffic originating through the load balancer without opening the targets to the entire network or internet.'
    }
  ],
  solution: {
    rootCause: 'The target group checked a path that returned 404, and the target ingress rule was broader and less explicit than the intended ALB-to-target trust relationship.',
    fix: 'Create a working /health endpoint or change the health-check path to /, and allow TCP port 80 from sg-0alb123 on the target security group.',
    prevention: 'Test health endpoints during deployment and express ALB-to-target access with security-group references.'
  }
});
