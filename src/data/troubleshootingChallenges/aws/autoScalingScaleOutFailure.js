export default Object.freeze({
  id: 'aws-auto-scaling-scale-out-failure',
  examId: 'aws-saa-c03',
  order: 10,
  category: 'Auto Scaling',
  title: 'Diagnose an Auto Scaling Group That Will Not Scale Out',
  difficulty: 'Intermediate',
  summary: 'Find why a healthy Auto Scaling group ignores sustained high application load.',
  scenario: 'The fa-training-api-asg Auto Scaling group runs two healthy instances and is allowed to grow to six. During a load test, average CPU remains above 80 percent for more than fifteen minutes, but the group never adds an instance. No launch failures appear in activity history, and manually increasing desired capacity successfully launches another instance.',
  task: 'Use the monitoring and scaling evidence to identify why automatic scale-out is not triggered, correct the configuration without changing the workload or maximum capacity, and verify that sustained high CPU starts a scale-out action.',
  evidence: [
    {
      id: 'asg-state',
      title: 'Auto Scaling Group State',
      kind: 'code',
      content: `Auto Scaling group: fa-training-api-asg
Min size: 2
Desired capacity: 2
Max size: 6
Healthy instances: 2
Manual desired-capacity change to 3: Successful
Recent launch failures: None`
    },
    {
      id: 'alarm-config',
      title: 'CloudWatch Alarm Configuration',
      kind: 'code',
      content: `Alarm name: fa-training-api-high-cpu
Metric namespace: AWS/EC2
Metric name: CPUUtilization
Statistic: Average
Period: 300 seconds
Evaluation periods: 2
Threshold: GreaterThanThreshold 80

Dimension:
AutoScalingGroupName = fa-training-api-asg-prod

Current alarm state: INSUFFICIENT_DATA`
    },
    {
      id: 'observed-metrics',
      title: 'Observed Group Metrics',
      kind: 'code',
      content: `Expected Auto Scaling group name: fa-training-api-asg

Observed instance CPU:
i-0trainingapi01: 84%
i-0trainingapi02: 87%

Duration above 80%: 15 minutes

Scale-out policy:
fa-training-api-add-one
Action: add 1 instance
Attached alarm: fa-training-api-high-cpu`
    }
  ],
  successCriteria: [
    'The learner identifies why the high-CPU alarm never evaluates the intended Auto Scaling group.',
    'The alarm dimension is corrected to reference fa-training-api-asg.',
    'The existing scaling policy and group capacity limits remain unchanged.',
    'A final verification shows the alarm enter ALARM during sustained high CPU and the Auto Scaling group launch an additional instance.'
  ],
  hints: [
    'Compare the exact Auto Scaling group name in the group state with the dimension configured on the CloudWatch alarm.',
    'CloudWatch metric dimensions select which time series the alarm evaluates; a wrong dimension value can leave an otherwise valid alarm with no matching data.',
    'Correct the AutoScalingGroupName dimension so the alarm watches fa-training-api-asg, then repeat the load condition and observe the scaling policy.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does the Auto Scaling group fail to scale out automatically?',
      options: [
        { id: 'wrong-dimension', text: 'The CloudWatch alarm uses the wrong AutoScalingGroupName dimension, so it is not evaluating metrics for the real group.' },
        { id: 'max-capacity', text: 'The Auto Scaling group is already at its maximum capacity.' },
        { id: 'launch-failure', text: 'EC2 cannot launch any additional instances from the current launch template.' },
        { id: 'cpu-too-low', text: 'The observed CPU level never reaches the configured threshold.' }
      ],
      correctOptionId: 'wrong-dimension',
      explanation: 'The group is named fa-training-api-asg, but the alarm watches fa-training-api-asg-prod and remains INSUFFICIENT_DATA despite sustained CPU above the threshold.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'fix-dimension', text: 'Change the alarm dimension to AutoScalingGroupName = fa-training-api-asg and verify the alarm triggers the existing scale-out policy.' },
        { id: 'raise-max', text: 'Increase maximum capacity from 6 to 20.' },
        { id: 'lower-threshold', text: 'Lower the CPU threshold from 80 percent to 20 percent without changing the dimension.' },
        { id: 'manual-scale', text: 'Keep changing desired capacity manually whenever load rises.' }
      ],
      correctOptionId: 'fix-dimension',
      explanation: 'The scaling policy and capacity limits already work; the alarm simply needs to monitor the correct metric time series.'
    }
  ],
  solution: {
    rootCause: 'The CloudWatch high-CPU alarm is configured with AutoScalingGroupName = fa-training-api-asg-prod instead of the real group name fa-training-api-asg, so the alarm sees no matching metric data and never enters ALARM.',
    fix: 'Correct the alarm dimension to AutoScalingGroupName = fa-training-api-asg, keep the existing threshold and scaling policy, reproduce sustained CPU above 80 percent, and verify the alarm enters ALARM and the group launches an additional instance.',
    prevention: 'Create alarms and scaling policies from shared variables or infrastructure-as-code references so the Auto Scaling group name cannot drift between the workload and its monitoring configuration.'
  }
});
