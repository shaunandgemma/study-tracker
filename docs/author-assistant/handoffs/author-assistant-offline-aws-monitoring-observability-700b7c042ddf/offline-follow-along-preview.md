# Monitoring & Observability Follow Along

> **Status:** Portable offline authoring manuscript only — not locally validated, imported, accepted, approved, published or fingerprinted.

- **Learner level:** Intermediate
- **Exam workspace:** AWS SAA-C03
- **AWS Region:** eu-west-2
- **Training resource prefix:** `fa-monitoring`
- **Working identity:** existing administrator account
- **CLI route:** AWS CloudShell

## Required outcome

Configure CloudWatch alarms, a custom application metric, CloudWatch Logs Insights queries, AWS X-Ray tracing and a custom Amazon EventBridge event bus; connect them through an observable Lambda workload; generate normal and controlled-error signals; verify the complete event-to-metric/log/alarm/trace flow; then safely remove only the fa-monitoring training resources.

## Completion definition

- The learner works from the existing administrator account in eu-west-2 and uses CloudShell for CLI work.
- fa-monitoring-lambda-role grants logging, X-Ray and only FA/Monitoring custom metric publication.
- fa-monitoring-observer runs with X-Ray Active tracing and logs to /aws/lambda/fa-monitoring-observer.
- fa-monitoring-bus and fa-monitoring-rule deliver matching TrainingEvent events to the Lambda function.
- Successful events publish FA/Monitoring ProcessedEvents and produce OBSERVABILITY_EVENT status=processed logs.
- CloudWatch contains one custom-metric alarm and one Lambda Errors alarm.
- One deliberate forceError event produces a Lambda error, forced_error log record and observable error signal without retries.
- Logs Insights queries return both detail and grouped status results.
- X-Ray trace summaries can be inspected for sampled Lambda invocations.
- All fa-monitoring cloud resources and CloudShell helper files are removed while the administrator account remains unchanged.

## Warnings

### Cost

CloudWatch custom metrics, alarms, Logs Insights queries, log storage, Lambda invocations, X-Ray traces and EventBridge events can incur charges. The lab uses small controlled volumes and one-day log retention, but current AWS pricing should be reviewed before starting.

### Safety

Use only the existing administrator account and the exact fa-monitoring names. The controlled error is an intentional Lambda exception in the disposable training function and EventBridge target retries are disabled.

### Credentials

The lab uses AWS CloudShell under the administrator console session and does not require creating a separate long-lived access key or local CLI profile.

### Region

All AWS resources in this Follow Along are created in eu-west-2. Keep the Console and CloudShell Region aligned to eu-west-2.

## Resource inventory

| Platform | Type | Exact name or rule | Created | Cleaned |
|---|---|---|---|---|
| AWS IAM | Lambda execution role | `fa-monitoring-lambda-role` | task-02-create-lambda-role | task-14-cloud-cleanup |
| Amazon CloudWatch Logs | log group | `/aws/lambda/fa-monitoring-observer` | task-03-create-log-group | task-14-cloud-cleanup |
| AWS Lambda | function | `fa-monitoring-observer` | task-04-create-lambda | task-14-cloud-cleanup |
| Amazon EventBridge | custom event bus | `fa-monitoring-bus` | task-05-create-event-bus | task-14-cloud-cleanup |
| Amazon EventBridge | event rule | `fa-monitoring-rule` | task-06-create-event-rule | task-14-cloud-cleanup |
| Amazon CloudWatch | custom metric | `FA/Monitoring : ProcessedEvents : FunctionName=fa-monitoring-observer` | task-07-send-normal-events | task-14-cloud-cleanup |
| Amazon CloudWatch | metric alarm | `fa-monitoring-processed-events-alarm` | task-09-create-alarms | task-14-cloud-cleanup |
| Amazon CloudWatch | metric alarm | `fa-monitoring-lambda-errors-alarm` | task-09-create-alarms | task-14-cloud-cleanup |

# Phase 1: Prepare the administrator session and permissions

Verify the existing administrator account, CloudShell and the Lambda execution role.

## task-01-admin-prerequisites — Verify the administrator account, Region and CloudShell

- **Feature:** Administrator access and safe CLI
- **Difficulty:** Easy
- **Goal:** Confirm the learner is signed in with the existing administrator account, select eu-west-2 and open AWS CloudShell.
- **Why it matters:** The lab creates IAM, Lambda, CloudWatch, X-Ray and EventBridge resources, so the working identity and Region must be known before anything is created.
- **Exam relevance:** Operational visibility depends on configuring monitoring in the same Region as the workload being observed.
- **Prerequisites:** None
- **Sources:** src-saa-domain1, src-saa-domain3, src-saa-inscope, src-cloudshell

### Task warnings

- Use the existing administrator account for this Follow Along. Do not create separate long-lived CLI credentials.

### Console / browser route

- [ ] **task-01-admin-prerequisites-browser-01** — Sign in to the AWS Management Console using the existing administrator account for the training environment.
- [ ] **task-01-admin-prerequisites-browser-02** — Open the account menu and verify this is the intended personal training account.
- [ ] **task-01-admin-prerequisites-browser-03** — Use the Region selector and choose Europe (London), eu-west-2.
- [ ] **task-01-admin-prerequisites-browser-04** — Open AWS CloudShell from the console toolbar.
- [ ] **task-01-admin-prerequisites-browser-05** — Confirm the CloudShell prompt opens successfully before continuing.

### CloudShell / CLI route

#### task-01-admin-prerequisites-cli-01 — Verify the CloudShell identity and Region

```text
aws sts get-caller-identity
aws configure get region
export AWS_REGION=eu-west-2
export AWS_DEFAULT_REGION=eu-west-2
printf 'Region: %s\n' "$AWS_REGION"
```

### Expected results

- The console is using the existing administrator account.
- The selected Region is eu-west-2.
- CloudShell is authenticated to the same AWS account without creating a separate access key.

### Verification checks

- [ ] **task-01-admin-prerequisites-verify-01** — get-caller-identity returns the expected training account.
- [ ] **task-01-admin-prerequisites-verify-02** — AWS_REGION prints eu-west-2.
- [ ] **task-01-admin-prerequisites-verify-03** — CloudShell is ready for the later CLI routes.

### Troubleshooting

- **CloudShell opens in another Region** — Switch the console Region to eu-west-2, reopen CloudShell, and export AWS_REGION and AWS_DEFAULT_REGION as shown.

---

## task-02-create-lambda-role — Create the Lambda execution role for logs, traces and custom metrics

- **Feature:** IAM execution role
- **Difficulty:** Medium
- **Goal:** Create fa-monitoring-lambda-role with Lambda trust, CloudWatch Logs access, X-Ray trace publishing and a namespace-restricted custom metric permission.
- **Why it matters:** The function needs separate permissions to write logs, publish traces and submit its own metric data.
- **Exam relevance:** SAA-C03 expects least-privilege IAM roles for AWS services rather than embedding credentials in application code.
- **Prerequisites:** task-01-admin-prerequisites
- **Sources:** src-lambda-role, src-lambda-logs, src-lambda-xray, src-putmetricdata

### Task warnings

- Do not attach broad administrator permissions to the Lambda execution role.

### Console / browser route

- [ ] **task-02-create-lambda-role-browser-01** — Open IAM > Roles > Create role.
- [ ] **task-02-create-lambda-role-browser-02** — Trusted entity type: AWS service.
- [ ] **task-02-create-lambda-role-browser-03** — Use case: Lambda.
- [ ] **task-02-create-lambda-role-browser-04** — Attach AWSLambdaBasicExecutionRole.
- [ ] **task-02-create-lambda-role-browser-05** — Attach AWSXRayDaemonWriteAccess.
- [ ] **task-02-create-lambda-role-browser-06** — Role name: fa-monitoring-lambda-role.
- [ ] **task-02-create-lambda-role-browser-07** — Create the role.
- [ ] **task-02-create-lambda-role-browser-08** — Open the new role > Permissions > Add permissions > Create inline policy.
- [ ] **task-02-create-lambda-role-browser-09** — Choose JSON and paste the supplied fa-monitoring-metric-policy.json.
- [ ] **task-02-create-lambda-role-browser-10** — Name the inline policy fa-monitoring-metric-policy and create it.
- [ ] **task-02-create-lambda-role-browser-11** — Confirm the role has the two AWS managed policies plus the one inline policy and no broad administrator policy.

### Supplied configuration

#### fa-monitoring-lambda-trust.json — Lambda trust policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### fa-monitoring-metric-policy.json — Custom metric permission policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublishOnlyTrainingCustomMetrics",
      "Effect": "Allow",
      "Action": "cloudwatch:PutMetricData",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "cloudwatch:namespace": "FA/Monitoring"
        }
      }
    }
  ]
}
```

### CloudShell / CLI route

#### task-02-create-lambda-role-cli-01 — CLI alternative - create the execution role

```text
cat > fa-monitoring-lambda-trust.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

cat > fa-monitoring-metric-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublishOnlyTrainingCustomMetrics",
      "Effect": "Allow",
      "Action": "cloudwatch:PutMetricData",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "cloudwatch:namespace": "FA/Monitoring"
        }
      }
    }
  ]
}
EOF

aws iam create-role   --role-name fa-monitoring-lambda-role   --assume-role-policy-document file://fa-monitoring-lambda-trust.json   --tags Key=TrainingPrefix,Value=fa-monitoring

aws iam attach-role-policy   --role-name fa-monitoring-lambda-role   --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy   --role-name fa-monitoring-lambda-role   --policy-arn arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess

aws iam put-role-policy   --role-name fa-monitoring-lambda-role   --policy-name fa-monitoring-metric-policy   --policy-document file://fa-monitoring-metric-policy.json

aws iam get-role --role-name fa-monitoring-lambda-role
aws iam list-attached-role-policies --role-name fa-monitoring-lambda-role
aws iam list-role-policies --role-name fa-monitoring-lambda-role

```

### Expected results

- fa-monitoring-lambda-role exists.
- Lambda can write CloudWatch Logs and X-Ray trace data.
- cloudwatch:PutMetricData is restricted to namespace FA/Monitoring.

### Verification checks

- [ ] **task-02-create-lambda-role-verify-01** — The trust principal is lambda.amazonaws.com.
- [ ] **task-02-create-lambda-role-verify-02** — AWSLambdaBasicExecutionRole is attached.
- [ ] **task-02-create-lambda-role-verify-03** — AWSXRayDaemonWriteAccess is attached.
- [ ] **task-02-create-lambda-role-verify-04** — The inline metric policy contains cloudwatch:namespace = FA/Monitoring.

---

# Phase 2: Create the observable Lambda workload

Create logs, deploy the function and enable X-Ray Active tracing.

## task-03-create-log-group — Create the Lambda log group with one-day retention

- **Feature:** CloudWatch Logs retention
- **Difficulty:** Easy
- **Goal:** Create /aws/lambda/fa-monitoring-observer before invocation and set retention to one day.
- **Why it matters:** Explicit retention prevents temporary training logs from remaining indefinitely after the exercise.
- **Exam relevance:** CloudWatch Logs centralizes application logs and retention settings control how long log data remains.
- **Prerequisites:** task-02-create-lambda-role
- **Sources:** src-lambda-logs, src-logs-retention

### Console / browser route

- [ ] **task-03-create-log-group-browser-01** — Open CloudWatch > Logs > Log groups.
- [ ] **task-03-create-log-group-browser-02** — Choose Create log group.
- [ ] **task-03-create-log-group-browser-03** — Log group name: /aws/lambda/fa-monitoring-observer.
- [ ] **task-03-create-log-group-browser-04** — Create the log group.
- [ ] **task-03-create-log-group-browser-05** — Open the log group and change Retention setting to 1 day.
- [ ] **task-03-create-log-group-browser-06** — Confirm the exact log group name and retention period.

### CloudShell / CLI route

#### task-03-create-log-group-cli-01 — Create and verify the log group

```text
aws logs create-log-group   --log-group-name /aws/lambda/fa-monitoring-observer   --tags TrainingPrefix=fa-monitoring

aws logs put-retention-policy   --log-group-name /aws/lambda/fa-monitoring-observer   --retention-in-days 1

aws logs describe-log-groups   --log-group-name-prefix /aws/lambda/fa-monitoring-observer   --query "logGroups[0].{Name:logGroupName,RetentionDays:retentionInDays}"

```

### Expected results

- The exact Lambda log group exists.
- Retention is set to one day.

### Verification checks

- [ ] **task-03-create-log-group-verify-01** — Log group name is /aws/lambda/fa-monitoring-observer.
- [ ] **task-03-create-log-group-verify-02** — RetentionDays is 1.

---

## task-04-create-lambda — Create the observer Lambda and enable X-Ray Active tracing

- **Feature:** Lambda, CloudWatch metrics and X-Ray
- **Difficulty:** Hard
- **Goal:** Deploy fa-monitoring-observer, enable Active tracing and use the supplied Python to log events and publish ProcessedEvents.
- **Why it matters:** One small function gives the lab a single workload that emits logs, metrics, traces and controlled errors.
- **Exam relevance:** CloudWatch observes runtime behavior while X-Ray provides request traces and service-level latency/error visibility.
- **Prerequisites:** task-03-create-log-group
- **Sources:** src-lambda-role, src-lambda-logs, src-lambda-xray, src-cloudwatch-custom, src-putmetricdata

### Task warnings

- The forceError path is deliberately used later to create one controlled Lambda failure for observability testing.

### Console / browser route

- [ ] **task-04-create-lambda-browser-01** — Open Lambda > Functions > Create function.
- [ ] **task-04-create-lambda-browser-02** — Choose Author from scratch.
- [ ] **task-04-create-lambda-browser-03** — Function name: fa-monitoring-observer.
- [ ] **task-04-create-lambda-browser-04** — Runtime: Python 3.12.
- [ ] **task-04-create-lambda-browser-05** — Architecture: x86_64.
- [ ] **task-04-create-lambda-browser-06** — Under execution role choose Use an existing role and select fa-monitoring-lambda-role.
- [ ] **task-04-create-lambda-browser-07** — Create the function.
- [ ] **task-04-create-lambda-browser-08** — Replace the default code with the supplied lambda_function.py and choose Deploy.
- [ ] **task-04-create-lambda-browser-09** — Open Configuration > Monitoring and operations tools > Edit.
- [ ] **task-04-create-lambda-browser-10** — Enable Lambda service traces / AWS X-Ray Active tracing and save.
- [ ] **task-04-create-lambda-browser-11** — Open Configuration > General configuration and set Timeout to 15 seconds.
- [ ] **task-04-create-lambda-browser-12** — Confirm the function is not attached to a VPC.

### Supplied configuration

#### lambda_function.py — Lambda observer code

```text
import boto3
import json

cloudwatch = boto3.client("cloudwatch")

def lambda_handler(event, context):
    detail = event.get("detail", {})
    message = detail.get("message", "no-message")
    force_error = bool(detail.get("forceError", False))

    if force_error:
        print(
            f"OBSERVABILITY_EVENT status=forced_error "
            f"request_id={context.aws_request_id} message={message}"
        )
        raise RuntimeError("Intentional training error for observability verification")

    cloudwatch.put_metric_data(
        Namespace="FA/Monitoring",
        MetricData=[
            {
                "MetricName": "ProcessedEvents",
                "Dimensions": [
                    {
                        "Name": "FunctionName",
                        "Value": "fa-monitoring-observer"
                    }
                ],
                "Value": 1,
                "Unit": "Count"
            }
        ]
    )

    print(
        f"OBSERVABILITY_EVENT status=processed "
        f"request_id={context.aws_request_id} message={message}"
    )

    return {
        "statusCode": 200,
        "processed": True,
        "message": message
    }

```

### CloudShell / CLI route

#### task-04-create-lambda-cli-01 — CLI alternative - package and create the function

```text
cat > lambda_function.py <<'PY'
import boto3
import json

cloudwatch = boto3.client("cloudwatch")

def lambda_handler(event, context):
    detail = event.get("detail", {})
    message = detail.get("message", "no-message")
    force_error = bool(detail.get("forceError", False))

    if force_error:
        print(
            f"OBSERVABILITY_EVENT status=forced_error "
            f"request_id={context.aws_request_id} message={message}"
        )
        raise RuntimeError("Intentional training error for observability verification")

    cloudwatch.put_metric_data(
        Namespace="FA/Monitoring",
        MetricData=[
            {
                "MetricName": "ProcessedEvents",
                "Dimensions": [
                    {
                        "Name": "FunctionName",
                        "Value": "fa-monitoring-observer"
                    }
                ],
                "Value": 1,
                "Unit": "Count"
            }
        ]
    )

    print(
        f"OBSERVABILITY_EVENT status=processed "
        f"request_id={context.aws_request_id} message={message}"
    )

    return {
        "statusCode": 200,
        "processed": True,
        "message": message
    }

PY

zip -q fa-monitoring-observer.zip lambda_function.py
ROLE_ARN=$(aws iam get-role   --role-name fa-monitoring-lambda-role   --query 'Role.Arn'   --output text)

sleep 10

aws lambda create-function   --function-name fa-monitoring-observer   --runtime python3.12   --handler lambda_function.lambda_handler   --role "$ROLE_ARN"   --zip-file fileb://fa-monitoring-observer.zip   --timeout 15   --memory-size 128   --tracing-config Mode=Active   --tags TrainingPrefix=fa-monitoring

aws lambda get-function-configuration   --function-name fa-monitoring-observer   --query '{FunctionName:FunctionName,Runtime:Runtime,Tracing:TracingConfig.Mode,Timeout:Timeout,Role:Role}'

```

### Expected results

- fa-monitoring-observer is Active.
- Tracing mode is Active.
- The function writes OBSERVABILITY_EVENT log lines and publishes FA/Monitoring ProcessedEvents for successful events.

### Verification checks

- [ ] **task-04-create-lambda-verify-01** — Function name is fa-monitoring-observer.
- [ ] **task-04-create-lambda-verify-02** — Runtime is Python 3.12.
- [ ] **task-04-create-lambda-verify-03** — TracingConfig.Mode is Active.
- [ ] **task-04-create-lambda-verify-04** — Execution role is fa-monitoring-lambda-role.

### Troubleshooting

- **CreateFunction reports that the role cannot be assumed** — Confirm the role trust is for lambda.amazonaws.com, wait briefly for IAM propagation, then retry.

---

# Phase 3: Build the custom EventBridge flow

Create the bus, matching rule and Lambda target, then send normal events.

## task-05-create-event-bus — Create the custom EventBridge event bus

- **Feature:** EventBridge custom event bus
- **Difficulty:** Medium
- **Goal:** Create fa-monitoring-bus in eu-west-2 as the dedicated application event bus for the lab.
- **Why it matters:** A custom event bus separates application events from the default bus and gives the lab a clear event-driven boundary.
- **Exam relevance:** EventBridge routes events using event buses, rules and targets.
- **Prerequisites:** task-04-create-lambda
- **Sources:** src-eventbridge-bus, src-eventbridge-putevents, src-saa-inscope

### Console / browser route

- [ ] **task-05-create-event-bus-browser-01** — Open Amazon EventBridge in eu-west-2.
- [ ] **task-05-create-event-bus-browser-02** — Choose Event buses > Create event bus.
- [ ] **task-05-create-event-bus-browser-03** — Name: fa-monitoring-bus.
- [ ] **task-05-create-event-bus-browser-04** — Keep the default encryption choice for this observability lab.
- [ ] **task-05-create-event-bus-browser-05** — Add tag TrainingPrefix = fa-monitoring.
- [ ] **task-05-create-event-bus-browser-06** — Create the event bus.
- [ ] **task-05-create-event-bus-browser-07** — Open it and confirm the exact name and ARN.

### CloudShell / CLI route

#### task-05-create-event-bus-cli-01 — Create and verify the event bus

```text
aws events create-event-bus   --name fa-monitoring-bus   --tags Key=TrainingPrefix,Value=fa-monitoring

aws events describe-event-bus --name fa-monitoring-bus

```

### Expected results

- fa-monitoring-bus exists in eu-west-2.
- Its ARN contains event-bus/fa-monitoring-bus.

### Verification checks

- [ ] **task-05-create-event-bus-verify-01** — The event bus name is exactly fa-monitoring-bus.
- [ ] **task-05-create-event-bus-verify-02** — The event bus is in eu-west-2.

---

## task-06-create-event-rule — Create the EventBridge rule and Lambda target

- **Feature:** Event pattern and target routing
- **Difficulty:** Hard
- **Goal:** Create fa-monitoring-rule on the custom bus, match only the training source/detail type and route matching events to fa-monitoring-observer.
- **Why it matters:** EventBridge rules filter events before targets are invoked, so only the intended event shape reaches the workload.
- **Exam relevance:** Rules use event patterns to route selected events to targets such as Lambda.
- **Prerequisites:** task-05-create-event-bus
- **Sources:** src-eventbridge-targets, src-eventbridge-resource-policy, src-eventbridge-putevents

### Task warnings

- The target retry count is deliberately set to zero so the later controlled error creates one failure rather than repeated training failures.

### Console / browser route

- [ ] **task-06-create-event-rule-browser-01** — Open EventBridge > Rules > Create rule.
- [ ] **task-06-create-event-rule-browser-02** — Name: fa-monitoring-rule.
- [ ] **task-06-create-event-rule-browser-03** — Event bus: fa-monitoring-bus.
- [ ] **task-06-create-event-rule-browser-04** — Rule type: Rule with an event pattern.
- [ ] **task-06-create-event-rule-browser-05** — Event source: Other.
- [ ] **task-06-create-event-rule-browser-06** — Choose Custom pattern and paste the supplied fa-monitoring-event-pattern.json.
- [ ] **task-06-create-event-rule-browser-07** — Select target AWS service > Lambda function.
- [ ] **task-06-create-event-rule-browser-08** — Function: fa-monitoring-observer.
- [ ] **task-06-create-event-rule-browser-09** — Configure retry policy so Maximum retry attempts is 0 and Maximum event age is 1 minute where the console exposes these values.
- [ ] **task-06-create-event-rule-browser-10** — Create the rule.
- [ ] **task-06-create-event-rule-browser-11** — Confirm the rule is Enabled and the Lambda function is listed as its target.

### Supplied configuration

#### fa-monitoring-event-pattern.json — Event pattern

```json
{
  "source": [
    "fa.monitoring.demo"
  ],
  "detail-type": [
    "TrainingEvent"
  ]
}
```

### CloudShell / CLI route

#### task-06-create-event-rule-cli-01 — Create the rule, permission and target

```text
cat > fa-monitoring-event-pattern.json <<'EOF'
{
  "source": [
    "fa.monitoring.demo"
  ],
  "detail-type": [
    "TrainingEvent"
  ]
}
EOF

RULE_ARN=$(aws events put-rule   --name fa-monitoring-rule   --event-bus-name fa-monitoring-bus   --event-pattern file://fa-monitoring-event-pattern.json   --state ENABLED   --tags Key=TrainingPrefix,Value=fa-monitoring   --query 'RuleArn'   --output text)

FUNCTION_ARN=$(aws lambda get-function   --function-name fa-monitoring-observer   --query 'Configuration.FunctionArn'   --output text)

aws lambda add-permission   --function-name fa-monitoring-observer   --statement-id AllowEventBridgeFaMonitoringRule   --action lambda:InvokeFunction   --principal events.amazonaws.com   --source-arn "$RULE_ARN"

cat > fa-monitoring-targets.json <<EOF
[
  {
    "Id": "fa-monitoring-lambda-target",
    "Arn": "$FUNCTION_ARN",
    "RetryPolicy": {
      "MaximumEventAgeInSeconds": 60,
      "MaximumRetryAttempts": 0
    }
  }
]
EOF

aws events put-targets   --rule fa-monitoring-rule   --event-bus-name fa-monitoring-bus   --targets file://fa-monitoring-targets.json

aws events list-targets-by-rule   --rule fa-monitoring-rule   --event-bus-name fa-monitoring-bus

```

### Expected results

- fa-monitoring-rule is Enabled on fa-monitoring-bus.
- The rule matches source fa.monitoring.demo and detail-type TrainingEvent.
- fa-monitoring-observer is the only target.
- The Lambda resource policy permits EventBridge to invoke it from the exact rule.

### Verification checks

- [ ] **task-06-create-event-rule-verify-01** — The rule uses fa-monitoring-bus.
- [ ] **task-06-create-event-rule-verify-02** — The event pattern contains only the training source and detail type.
- [ ] **task-06-create-event-rule-verify-03** — The target RetryPolicy has MaximumRetryAttempts = 0.
- [ ] **task-06-create-event-rule-verify-04** — Lambda has the AllowEventBridgeFaMonitoringRule permission statement.

---

## task-07-send-normal-events — Send three normal events and prove end-to-end delivery

- **Feature:** PutEvents and Lambda invocation
- **Difficulty:** Medium
- **Goal:** Send three matching custom events to fa-monitoring-bus and verify EventBridge invokes the observer function three times.
- **Why it matters:** The events create the log, trace and custom metric data used by the rest of the Follow Along.
- **Exam relevance:** Event-driven architectures decouple event producers from event-processing targets.
- **Prerequisites:** task-06-create-event-rule
- **Sources:** src-eventbridge-putevents, src-eventbridge-targets, src-lambda-logs

### Console / browser route

- [ ] **task-07-send-normal-events-browser-01** — Keep EventBridge and Lambda open in separate browser tabs.
- [ ] **task-07-send-normal-events-browser-02** — Use CloudShell with the supplied events file to send the three normal events; the EventBridge console does not need to be used as an event producer for this task.
- [ ] **task-07-send-normal-events-browser-03** — Open Lambda > fa-monitoring-observer > Monitor.
- [ ] **task-07-send-normal-events-browser-04** — Confirm Invocations begins to show activity.
- [ ] **task-07-send-normal-events-browser-05** — Open CloudWatch > Logs > Log groups > /aws/lambda/fa-monitoring-observer.
- [ ] **task-07-send-normal-events-browser-06** — Open the newest log stream and find three OBSERVABILITY_EVENT status=processed lines.

### Supplied configuration

#### fa-monitoring-normal-events.json — Three normal training events

```json
[
  {
    "Source": "fa.monitoring.demo",
    "DetailType": "TrainingEvent",
    "Detail": "{\"message\":\"normal-event-1\",\"forceError\":false}",
    "EventBusName": "fa-monitoring-bus"
  },
  {
    "Source": "fa.monitoring.demo",
    "DetailType": "TrainingEvent",
    "Detail": "{\"message\":\"normal-event-2\",\"forceError\":false}",
    "EventBusName": "fa-monitoring-bus"
  },
  {
    "Source": "fa.monitoring.demo",
    "DetailType": "TrainingEvent",
    "Detail": "{\"message\":\"normal-event-3\",\"forceError\":false}",
    "EventBusName": "fa-monitoring-bus"
  }
]
```

### CloudShell / CLI route

#### task-07-send-normal-events-cli-01 — Send the three matching events

```text
cat > fa-monitoring-normal-events.json <<'EOF'
[
  {
    "Source": "fa.monitoring.demo",
    "DetailType": "TrainingEvent",
    "Detail": "{\"message\":\"normal-event-1\",\"forceError\":false}",
    "EventBusName": "fa-monitoring-bus"
  },
  {
    "Source": "fa.monitoring.demo",
    "DetailType": "TrainingEvent",
    "Detail": "{\"message\":\"normal-event-2\",\"forceError\":false}",
    "EventBusName": "fa-monitoring-bus"
  },
  {
    "Source": "fa.monitoring.demo",
    "DetailType": "TrainingEvent",
    "Detail": "{\"message\":\"normal-event-3\",\"forceError\":false}",
    "EventBusName": "fa-monitoring-bus"
  }
]
EOF

aws events put-events   --entries file://fa-monitoring-normal-events.json

aws lambda get-function-configuration   --function-name fa-monitoring-observer   --query '{FunctionName:FunctionName,Tracing:TracingConfig.Mode}'

```

### Expected results

- PutEvents reports FailedEntryCount = 0.
- The Lambda is invoked for the matching events.
- CloudWatch Logs contains processed log lines.
- The function publishes custom metric data for successful events.

### Verification checks

- [ ] **task-07-send-normal-events-verify-01** — FailedEntryCount is 0.
- [ ] **task-07-send-normal-events-verify-02** — Three processed log entries can be identified.
- [ ] **task-07-send-normal-events-verify-03** — No forced_error log entry exists yet.

### Troubleshooting

- **PutEvents succeeds but Lambda is not invoked** — Compare Source, DetailType and EventBusName against the rule pattern, then verify the Lambda target and resource-based permission.

---

# Phase 4: Measure and alarm on workload behavior

Verify the custom metric, create two alarms and generate one controlled failure.

## task-08-verify-custom-metric — Find and graph the FA/Monitoring custom metric

- **Feature:** CloudWatch custom metrics
- **Difficulty:** Medium
- **Goal:** Locate ProcessedEvents with FunctionName=fa-monitoring-observer and confirm the three successful events produced metric data.
- **Why it matters:** Custom metrics let applications publish business or workload signals that built-in AWS metrics cannot know.
- **Exam relevance:** CloudWatch supports AWS service metrics and custom application metrics.
- **Prerequisites:** task-07-send-normal-events
- **Sources:** src-cloudwatch-custom, src-putmetricdata

### Task warnings

- A newly published custom metric can take a short time to become visible in the metrics browser.

### Console / browser route

- [ ] **task-08-verify-custom-metric-browser-01** — Open CloudWatch > Metrics > All metrics.
- [ ] **task-08-verify-custom-metric-browser-02** — Choose the custom namespace FA/Monitoring.
- [ ] **task-08-verify-custom-metric-browser-03** — Choose the FunctionName dimension.
- [ ] **task-08-verify-custom-metric-browser-04** — Select ProcessedEvents for fa-monitoring-observer.
- [ ] **task-08-verify-custom-metric-browser-05** — Set Statistic to Sum and Period to 1 minute.
- [ ] **task-08-verify-custom-metric-browser-06** — Use a recent time range and confirm the graph contains the processed event data.

### CloudShell / CLI route

#### task-08-verify-custom-metric-cli-01 — List and read recent custom metric data

```text
aws cloudwatch list-metrics   --namespace FA/Monitoring   --metric-name ProcessedEvents   --dimensions Name=FunctionName,Value=fa-monitoring-observer

START_TIME=$(date -u -d '15 minutes ago' +%Y-%m-%dT%H:%M:%SZ)
END_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

aws cloudwatch get-metric-statistics   --namespace FA/Monitoring   --metric-name ProcessedEvents   --dimensions Name=FunctionName,Value=fa-monitoring-observer   --statistics Sum   --period 60   --start-time "$START_TIME"   --end-time "$END_TIME"

```

### Expected results

- The namespace FA/Monitoring exists.
- ProcessedEvents exists with dimension FunctionName=fa-monitoring-observer.
- Recent Sum values reflect the successful event processing.

### Verification checks

- [ ] **task-08-verify-custom-metric-verify-01** — The metric namespace is FA/Monitoring.
- [ ] **task-08-verify-custom-metric-verify-02** — The dimension is FunctionName=fa-monitoring-observer.
- [ ] **task-08-verify-custom-metric-verify-03** — The metric contains recent non-zero data.

### Troubleshooting

- **The metric is not listed yet** — Use get-metric-statistics with the exact namespace/metric/dimension, and confirm the Lambda execution role allows cloudwatch:PutMetricData for FA/Monitoring.

---

## task-09-create-alarms — Create alarms for processed events and Lambda errors

- **Feature:** CloudWatch alarms
- **Difficulty:** Medium
- **Goal:** Create one alarm on the custom ProcessedEvents metric and one alarm on the built-in Lambda Errors metric.
- **Why it matters:** Alarms turn metric thresholds into explicit operational states that can later drive notifications or automation.
- **Exam relevance:** CloudWatch alarms evaluate metrics against thresholds and can be combined with other AWS services for automated response.
- **Prerequisites:** task-08-verify-custom-metric
- **Sources:** src-cloudwatch-alarm, src-cloudwatch-custom

### Task warnings

- No alarm actions are configured, so the lab does not create SNS topics or send notifications.

### Console / browser route

- [ ] **task-09-create-alarms-browser-01** — Open CloudWatch > Alarms > All alarms > Create alarm.
- [ ] **task-09-create-alarms-browser-02** — Select FA/Monitoring > FunctionName > ProcessedEvents for fa-monitoring-observer.
- [ ] **task-09-create-alarms-browser-03** — Statistic: Sum. Period: 1 minute.
- [ ] **task-09-create-alarms-browser-04** — Threshold type: Static. Condition: Greater/Equal than 3.
- [ ] **task-09-create-alarms-browser-05** — Evaluation periods: 1 of 1.
- [ ] **task-09-create-alarms-browser-06** — Missing data treatment: Treat missing data as good/not breaching.
- [ ] **task-09-create-alarms-browser-07** — Do not configure notification actions.
- [ ] **task-09-create-alarms-browser-08** — Name: fa-monitoring-processed-events-alarm and create it.
- [ ] **task-09-create-alarms-browser-09** — Create a second alarm using AWS/Lambda > By Function Name > Errors for fa-monitoring-observer.
- [ ] **task-09-create-alarms-browser-10** — Statistic: Sum. Period: 1 minute. Threshold: Greater/Equal than 1. Evaluation: 1 of 1. Missing data: not breaching.
- [ ] **task-09-create-alarms-browser-11** — Do not configure actions.
- [ ] **task-09-create-alarms-browser-12** — Name: fa-monitoring-lambda-errors-alarm and create it.

### CloudShell / CLI route

#### task-09-create-alarms-cli-01 — Create both alarms

```text
aws cloudwatch put-metric-alarm   --alarm-name fa-monitoring-processed-events-alarm   --alarm-description "Training alarm for three or more processed events in one minute"   --namespace FA/Monitoring   --metric-name ProcessedEvents   --dimensions Name=FunctionName,Value=fa-monitoring-observer   --statistic Sum   --period 60   --evaluation-periods 1   --datapoints-to-alarm 1   --threshold 3   --comparison-operator GreaterThanOrEqualToThreshold   --treat-missing-data notBreaching

aws cloudwatch put-metric-alarm   --alarm-name fa-monitoring-lambda-errors-alarm   --alarm-description "Training alarm for Lambda errors"   --namespace AWS/Lambda   --metric-name Errors   --dimensions Name=FunctionName,Value=fa-monitoring-observer   --statistic Sum   --period 60   --evaluation-periods 1   --datapoints-to-alarm 1   --threshold 1   --comparison-operator GreaterThanOrEqualToThreshold   --treat-missing-data notBreaching

aws cloudwatch describe-alarms   --alarm-names fa-monitoring-processed-events-alarm fa-monitoring-lambda-errors-alarm   --query 'MetricAlarms[].{Name:AlarmName,State:StateValue,Metric:MetricName,Namespace:Namespace}'

```

### Expected results

- Both alarms exist.
- The custom alarm watches FA/Monitoring ProcessedEvents.
- The error alarm watches AWS/Lambda Errors.
- Neither alarm has notification actions.

### Verification checks

- [ ] **task-09-create-alarms-verify-01** — fa-monitoring-processed-events-alarm threshold is 3.
- [ ] **task-09-create-alarms-verify-02** — fa-monitoring-lambda-errors-alarm threshold is 1.
- [ ] **task-09-create-alarms-verify-03** — Both use one-minute periods and one evaluation period.

---

## task-10-trigger-controlled-error — Send one controlled error event and observe alarm state changes

- **Feature:** Error monitoring
- **Difficulty:** Medium
- **Goal:** Send a matching event with forceError=true so Lambda records one failure and CloudWatch can evaluate the error alarm.
- **Why it matters:** Observability is most useful when you can prove that a failure becomes visible in metrics, logs, alarms and traces.
- **Exam relevance:** CloudWatch metrics and alarms expose unhealthy behavior without requiring manual log inspection alone.
- **Prerequisites:** task-09-create-alarms
- **Sources:** src-eventbridge-putevents, src-cloudwatch-alarm, src-lambda-logs, src-lambda-xray

### Task warnings

- This is a deliberate application exception in the disposable training function; EventBridge retries are disabled for the target.

### Console / browser route

- [ ] **task-10-trigger-controlled-error-browser-01** — Use CloudShell to send the supplied intentional error event.
- [ ] **task-10-trigger-controlled-error-browser-02** — Open Lambda > fa-monitoring-observer > Monitor and confirm an Errors data point appears.
- [ ] **task-10-trigger-controlled-error-browser-03** — Open CloudWatch > Alarms and watch fa-monitoring-lambda-errors-alarm evaluate the failure.
- [ ] **task-10-trigger-controlled-error-browser-04** — Open /aws/lambda/fa-monitoring-observer and find OBSERVABILITY_EVENT status=forced_error.
- [ ] **task-10-trigger-controlled-error-browser-05** — Confirm the processed-events custom metric does not increment for the forced error path.

### Supplied configuration

#### fa-monitoring-error-event.json — Controlled error event

```json
[
  {
    "Source": "fa.monitoring.demo",
    "DetailType": "TrainingEvent",
    "Detail": "{\"message\":\"intentional-error\",\"forceError\":true}",
    "EventBusName": "fa-monitoring-bus"
  }
]
```

### CloudShell / CLI route

#### task-10-trigger-controlled-error-cli-01 — Send one intentional error event and inspect alarms

```text
cat > fa-monitoring-error-event.json <<'EOF'
[
  {
    "Source": "fa.monitoring.demo",
    "DetailType": "TrainingEvent",
    "Detail": "{\"message\":\"intentional-error\",\"forceError\":true}",
    "EventBusName": "fa-monitoring-bus"
  }
]
EOF

aws events put-events   --entries file://fa-monitoring-error-event.json

sleep 75

aws cloudwatch describe-alarms   --alarm-names fa-monitoring-processed-events-alarm fa-monitoring-lambda-errors-alarm   --query 'MetricAlarms[].{Name:AlarmName,State:StateValue,Reason:StateReason}'

```

**Note:** Alarm evaluation is asynchronous; if a state has not updated yet, use the Console graph and describe-alarms again after the next evaluation.

### Expected results

- PutEvents reports no failed entries.
- Lambda records one controlled application error.
- The Lambda Errors metric increases.
- fa-monitoring-lambda-errors-alarm can enter ALARM for the failed invocation.
- A forced_error log entry exists.

### Verification checks

- [ ] **task-10-trigger-controlled-error-verify-01** — Only one controlled error event was sent.
- [ ] **task-10-trigger-controlled-error-verify-02** — A Lambda Errors data point is visible.
- [ ] **task-10-trigger-controlled-error-verify-03** — The log line contains status=forced_error.

### Troubleshooting

- **Multiple errors appear** — Confirm the EventBridge target RetryPolicy has MaximumRetryAttempts set to 0 and do not send the error event again.

---

# Phase 5: Query logs and inspect traces

Use Logs Insights and X-Ray to investigate the same workload.

## task-11-logs-insights — Query Lambda logs with CloudWatch Logs Insights

- **Feature:** CloudWatch Logs Insights
- **Difficulty:** Medium
- **Goal:** Run one detail query and one aggregate query against the Lambda log group to separate processed and forced-error events.
- **Why it matters:** Logs Insights can search and aggregate large log sets without manually opening individual log streams.
- **Exam relevance:** CloudWatch Logs supports centralized query and troubleshooting workflows.
- **Prerequisites:** task-10-trigger-controlled-error
- **Sources:** src-logs-insights, src-lambda-logs

### Task warnings

- Use the narrow 15-minute time range and only the one training log group to reduce unnecessary query scanning.

### Console / browser route

- [ ] **task-11-logs-insights-browser-01** — Open CloudWatch > Logs > Logs Insights.
- [ ] **task-11-logs-insights-browser-02** — Select only /aws/lambda/fa-monitoring-observer.
- [ ] **task-11-logs-insights-browser-03** — Set the time range to the last 15 minutes.
- [ ] **task-11-logs-insights-browser-04** — Run: fields @timestamp, @message | filter @message like /OBSERVABILITY_EVENT/ | sort @timestamp desc | limit 20
- [ ] **task-11-logs-insights-browser-05** — Confirm processed and forced_error records appear.
- [ ] **task-11-logs-insights-browser-06** — Run: filter @message like /OBSERVABILITY_EVENT/ | parse @message /status=(?<status>[^ ]+)/ | stats count(*) as events by status
- [ ] **task-11-logs-insights-browser-07** — Confirm the result groups events by processed and forced_error status.
- [ ] **task-11-logs-insights-browser-08** — Stop/cancel any still-running query before leaving the page.

### CloudShell / CLI route

#### task-11-logs-insights-cli-01 — Run the detail and aggregate queries

```text
START=$(date -d '15 minutes ago' +%s)
END=$(date +%s)

DETAIL_QUERY_ID=$(aws logs start-query \
  --log-group-name /aws/lambda/fa-monitoring-observer \
  --start-time "$START" \
  --end-time "$END" \
  --query-string 'fields @timestamp, @message | filter @message like /OBSERVABILITY_EVENT/ | sort @timestamp desc | limit 20' \
  --query queryId \
  --output text)

sleep 3
aws logs get-query-results --query-id "$DETAIL_QUERY_ID"

AGG_QUERY_ID=$(aws logs start-query \
  --log-group-name /aws/lambda/fa-monitoring-observer \
  --start-time "$START" \
  --end-time "$END" \
  --query-string 'filter @message like /OBSERVABILITY_EVENT/ | parse @message /status=(?<status>[^ ]+)/ | stats count(*) as events by status' \
  --query queryId \
  --output text)

sleep 3
aws logs get-query-results --query-id "$AGG_QUERY_ID"

```

### Expected results

- The detail query returns recent OBSERVABILITY_EVENT lines.
- The aggregate query separates processed from forced_error status values.

### Verification checks

- [ ] **task-11-logs-insights-verify-01** — The query scope includes only /aws/lambda/fa-monitoring-observer.
- [ ] **task-11-logs-insights-verify-02** — Processed events are returned.
- [ ] **task-11-logs-insights-verify-03** — The forced error is returned.
- [ ] **task-11-logs-insights-verify-04** — The stats query groups by status.

### Troubleshooting

- **get-query-results reports Running** — Run get-query-results again for the same query ID after it finishes; do not start duplicate queries unnecessarily.

---

## task-12-xray-traces — Inspect successful and failed Lambda traces in AWS X-Ray

- **Feature:** X-Ray tracing
- **Difficulty:** Medium
- **Goal:** Use the X-Ray trace view and API to find traces for fa-monitoring-observer and distinguish a successful trace from the controlled failure.
- **Why it matters:** Metrics show that something changed, logs show application messages, and traces show the execution path and timing for individual requests.
- **Exam relevance:** X-Ray is used to trace distributed requests and troubleshoot latency/errors across supported services.
- **Prerequisites:** task-11-logs-insights
- **Sources:** src-lambda-xray, src-xray-summary

### Task warnings

- X-Ray uses sampling, so not every invocation is guaranteed to produce a stored trace.

### Console / browser route

- [ ] **task-12-xray-traces-browser-01** — Open CloudWatch > X-Ray traces or the AWS X-Ray trace view for eu-west-2.
- [ ] **task-12-xray-traces-browser-02** — Set the time range to include the events sent in this Follow Along.
- [ ] **task-12-xray-traces-browser-03** — Filter for service fa-monitoring-observer where the console provides a service filter.
- [ ] **task-12-xray-traces-browser-04** — Open a successful trace and inspect duration and the Lambda segment.
- [ ] **task-12-xray-traces-browser-05** — Open a trace containing the controlled error if sampled and inspect its fault/error indicators.
- [ ] **task-12-xray-traces-browser-06** — Confirm Active tracing remains enabled on fa-monitoring-observer.

### CloudShell / CLI route

#### task-12-xray-traces-cli-01 — List recent X-Ray trace summaries for the function

```text
XRAY_START=$(date -u -d '30 minutes ago' +%Y-%m-%dT%H:%M:%SZ)
XRAY_END=$(date -u +%Y-%m-%dT%H:%M:%SZ)

aws xray get-trace-summaries   --start-time "$XRAY_START"   --end-time "$XRAY_END"   --filter-expression 'service("fa-monitoring-observer")'   --query 'TraceSummaries[].{Id:Id,Duration:Duration,HasError:HasError,HasFault:HasFault}'   --max-items 20

```

### Expected results

- Recent trace summaries can be found for the function when invocations were sampled.
- Successful traces show normal execution.
- A sampled controlled failure can show an error/fault signal.

### Verification checks

- [ ] **task-12-xray-traces-verify-01** — Lambda tracing mode is Active.
- [ ] **task-12-xray-traces-verify-02** — At least one sampled trace can be inspected after repeated normal test events if necessary.
- [ ] **task-12-xray-traces-verify-03** — You can explain the difference between metrics, logs and traces.

### Troubleshooting

- **No trace is returned** — Confirm Active tracing and AWSXRayDaemonWriteAccess, then send additional normal training events because X-Ray sampling does not store every invocation.

---

# Phase 6: Review the architecture and clean up

Connect the observability signals to exam decisions and remove training resources safely.

## task-13-integrated-review — Review the complete observability flow and exam decisions

- **Feature:** Integrated observability
- **Difficulty:** Medium
- **Goal:** Trace one event from EventBridge through Lambda into logs, custom metrics, alarms and X-Ray and identify what each service contributes.
- **Why it matters:** The value of observability comes from combining signals rather than treating logs, metrics and traces as isolated tools.
- **Exam relevance:** SAA-C03 questions often test which service or signal best solves a specific monitoring or event-routing requirement.
- **Prerequisites:** task-12-xray-traces
- **Sources:** src-saa-domain1, src-saa-domain3, src-saa-inscope, src-cloudwatch-alarm, src-logs-insights, src-lambda-xray, src-eventbridge-bus

### Console / browser route

- [ ] **task-13-integrated-review-browser-01** — Open EventBridge and confirm fa-monitoring-bus and fa-monitoring-rule route matching events to fa-monitoring-observer.
- [ ] **task-13-integrated-review-browser-02** — Open Lambda monitoring and identify Invocations and Errors.
- [ ] **task-13-integrated-review-browser-03** — Open CloudWatch custom metrics and identify FA/Monitoring ProcessedEvents.
- [ ] **task-13-integrated-review-browser-04** — Open CloudWatch alarms and identify the processed-events and Lambda-errors alarms.
- [ ] **task-13-integrated-review-browser-05** — Open Logs Insights and identify application messages for both successful and failed events.
- [ ] **task-13-integrated-review-browser-06** — Open X-Ray and identify request-level traces.
- [ ] **task-13-integrated-review-browser-07** — Review the decision map: EventBridge routes events; CloudWatch metrics quantify behavior; alarms evaluate thresholds; Logs Insights searches log events; X-Ray traces individual requests.

### CloudShell / CLI route

#### task-13-integrated-review-cli-01 — Run a non-destructive inventory

```text
aws events describe-event-bus --name fa-monitoring-bus
aws events describe-rule --name fa-monitoring-rule --event-bus-name fa-monitoring-bus
aws lambda get-function-configuration   --function-name fa-monitoring-observer   --query '{Name:FunctionName,Tracing:TracingConfig.Mode,Role:Role}'
aws cloudwatch list-metrics   --namespace FA/Monitoring   --metric-name ProcessedEvents
aws cloudwatch describe-alarms   --alarm-names fa-monitoring-processed-events-alarm fa-monitoring-lambda-errors-alarm   --query 'MetricAlarms[].{Name:AlarmName,State:StateValue}'

```

### Expected results

- The complete event-to-observability chain is visible.
- Each AWS service has a distinct role in the design.
- All resources are still present immediately before cleanup.

### Verification checks

- [ ] **task-13-integrated-review-verify-01** — You can explain EventBridge versus CloudWatch.
- [ ] **task-13-integrated-review-verify-02** — You can explain metrics versus logs versus traces.
- [ ] **task-13-integrated-review-verify-03** — You can explain why an alarm is built on a metric rather than directly on an X-Ray trace.

---

## task-14-cloud-cleanup — Delete alarms, EventBridge routing, Lambda and log resources in reverse order

- **Feature:** Cloud resource cleanup
- **Difficulty:** Hard
- **Goal:** Delete the monitoring and event-driven resources in dependency-safe order while retaining the administrator account.
- **Why it matters:** The rule must stop targeting Lambda before the function is removed, and temporary observability resources should not remain after the lab.
- **Exam relevance:** Dependency-aware cleanup reinforces how EventBridge, Lambda and CloudWatch resources relate to one another.
- **Prerequisites:** task-13-integrated-review
- **Sources:** src-eventbridge-delete, src-eventbridge-targets, src-lambda-logs, src-cloudwatch-alarm

### Task warnings

- These steps are destructive. Delete only resources with the exact fa-monitoring names from this Follow Along.

### Console / browser route

- [ ] **task-14-cloud-cleanup-browser-01** — CloudWatch: delete fa-monitoring-processed-events-alarm and fa-monitoring-lambda-errors-alarm.
- [ ] **task-14-cloud-cleanup-browser-02** — EventBridge: open fa-monitoring-rule, remove fa-monitoring-observer as its target, then delete fa-monitoring-rule.
- [ ] **task-14-cloud-cleanup-browser-03** — EventBridge: delete fa-monitoring-bus after the rule is gone.
- [ ] **task-14-cloud-cleanup-browser-04** — Lambda: delete fa-monitoring-observer.
- [ ] **task-14-cloud-cleanup-browser-05** — CloudWatch Logs: delete /aws/lambda/fa-monitoring-observer.
- [ ] **task-14-cloud-cleanup-browser-06** — IAM: open fa-monitoring-lambda-role.
- [ ] **task-14-cloud-cleanup-browser-07** — Detach AWSLambdaBasicExecutionRole and AWSXRayDaemonWriteAccess.
- [ ] **task-14-cloud-cleanup-browser-08** — Delete inline policy fa-monitoring-metric-policy.
- [ ] **task-14-cloud-cleanup-browser-09** — Delete fa-monitoring-lambda-role.
- [ ] **task-14-cloud-cleanup-browser-10** — Do not delete or modify the existing administrator account.

### CloudShell / CLI route

#### task-14-cloud-cleanup-cli-01 — Delete cloud resources in reverse dependency order

```text
aws cloudwatch delete-alarms   --alarm-names fa-monitoring-processed-events-alarm fa-monitoring-lambda-errors-alarm

aws events remove-targets   --rule fa-monitoring-rule   --event-bus-name fa-monitoring-bus   --ids fa-monitoring-lambda-target

aws lambda remove-permission   --function-name fa-monitoring-observer   --statement-id AllowEventBridgeFaMonitoringRule

aws events delete-rule   --name fa-monitoring-rule   --event-bus-name fa-monitoring-bus

aws events delete-event-bus --name fa-monitoring-bus

aws lambda delete-function --function-name fa-monitoring-observer

aws logs delete-log-group   --log-group-name /aws/lambda/fa-monitoring-observer

aws iam detach-role-policy   --role-name fa-monitoring-lambda-role   --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam detach-role-policy   --role-name fa-monitoring-lambda-role   --policy-arn arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess

aws iam delete-role-policy   --role-name fa-monitoring-lambda-role   --policy-name fa-monitoring-metric-policy

aws iam delete-role --role-name fa-monitoring-lambda-role

```

#### task-14-cloud-cleanup-cli-02 — Verify the named resources are gone

```text
aws cloudwatch describe-alarms   --alarm-names fa-monitoring-processed-events-alarm fa-monitoring-lambda-errors-alarm

aws events list-event-buses   --query "EventBuses[?Name=='fa-monitoring-bus']"

aws lambda get-function   --function-name fa-monitoring-observer

aws logs describe-log-groups   --log-group-name-prefix /aws/lambda/fa-monitoring-observer

aws iam get-role --role-name fa-monitoring-lambda-role

```

**Note:** Expected: alarm list is empty; event bus query is empty; Lambda and IAM role report not found; the exact Lambda log group is absent.

### Expected results

- Both alarms are absent.
- fa-monitoring-rule and fa-monitoring-bus are absent.
- fa-monitoring-observer is absent.
- The Lambda log group is absent.
- fa-monitoring-lambda-role is absent.
- The existing administrator account remains unchanged.

### Verification checks

- [ ] **task-14-cloud-cleanup-verify-01** — No fa-monitoring alarm remains.
- [ ] **task-14-cloud-cleanup-verify-02** — No fa-monitoring custom event bus or rule remains.
- [ ] **task-14-cloud-cleanup-verify-03** — No fa-monitoring Lambda function or log group remains.
- [ ] **task-14-cloud-cleanup-verify-04** — No fa-monitoring Lambda role remains.

### Troubleshooting

- **EventBridge rule deletion fails because targets remain** — Run remove-targets for fa-monitoring-lambda-target first, then delete the rule.
- **IAM role deletion fails** — Confirm both managed policies are detached and fa-monitoring-metric-policy is deleted before deleting the role.

---

## task-15-cloudshell-cleanup — Remove CloudShell helper files and acknowledge programme cleanup

- **Feature:** Local helper cleanup
- **Difficulty:** Easy
- **Goal:** Delete only the helper files created in CloudShell and complete the final cleanup acknowledgement.
- **Why it matters:** Temporary JSON, Python and ZIP files should be removed after the AWS resources they describe are gone.
- **Exam relevance:** Operational hygiene includes removing temporary deployment artifacts after use.
- **Prerequisites:** task-14-cloud-cleanup
- **Sources:** src-cloudshell

### Task warnings

- Delete only the exact fa-monitoring helper files listed here; do not clear unrelated CloudShell files.

### Console / browser route

- [ ] **task-15-cloudshell-cleanup-browser-01** — Return to AWS CloudShell.
- [ ] **task-15-cloudshell-cleanup-browser-02** — List the current directory and identify only files beginning with fa-monitoring plus lambda_function.py.
- [ ] **task-15-cloudshell-cleanup-browser-03** — Run the cleanup command supplied below.
- [ ] **task-15-cloudshell-cleanup-browser-04** — List the directory again and confirm the training helper files are gone.
- [ ] **task-15-cloudshell-cleanup-browser-05** — Close CloudShell when finished; the administrator account itself remains in place.

### CloudShell / CLI route

#### task-15-cloudshell-cleanup-cli-01 — Remove only the lab helper files

```text
rm -f   fa-monitoring-lambda-trust.json   fa-monitoring-metric-policy.json   lambda_function.py   fa-monitoring-observer.zip   fa-monitoring-event-pattern.json   fa-monitoring-targets.json   fa-monitoring-normal-events.json   fa-monitoring-error-event.json

ls -la | grep -E 'fa-monitoring|lambda_function.py' || true

```

### Expected results

- The exact helper files are absent from CloudShell.
- The administrator account remains available.
- The programme cleanup acknowledgement can be made truthfully.

### Verification checks

- [ ] **task-15-cloudshell-cleanup-verify-01** — No listed fa-monitoring helper file remains.
- [ ] **task-15-cloudshell-cleanup-verify-02** — All cloud cleanup checks from Task 14 passed.
- [ ] **task-15-cloudshell-cleanup-verify-03** — The administrator account was not deleted or modified.

---

# Programme cleanup

- **Completion gate:** acknowledgement
- **Manual only:** true
- **Ordering:** reverse_dependency

- [ ] **cleanup-01** — **fa-monitoring-processed-events-alarm and fa-monitoring-lambda-errors-alarm**: Delete both CloudWatch alarms. **Verify:** describe-alarms returns no named alarms.
- [ ] **cleanup-02** — **fa-monitoring-lambda-target**: Remove the Lambda target from fa-monitoring-rule. **Verify:** list-targets-by-rule returns no target.
- [ ] **cleanup-03** — **AllowEventBridgeFaMonitoringRule Lambda permission**: Remove the EventBridge invocation permission from fa-monitoring-observer. **Verify:** The named Lambda policy statement is absent.
- [ ] **cleanup-04** — **fa-monitoring-rule**: Delete the EventBridge rule from fa-monitoring-bus. **Verify:** describe-rule no longer finds the rule.
- [ ] **cleanup-05** — **fa-monitoring-bus**: Delete the custom event bus after the rule is gone. **Verify:** list-event-buses returns no fa-monitoring-bus.
- [ ] **cleanup-06** — **fa-monitoring-observer**: Delete the Lambda function. **Verify:** get-function returns ResourceNotFoundException.
- [ ] **cleanup-07** — **/aws/lambda/fa-monitoring-observer**: Delete the Lambda CloudWatch log group. **Verify:** describe-log-groups returns no exact log group.
- [ ] **cleanup-08** — **fa-monitoring-lambda-role**: Detach both managed policies, delete fa-monitoring-metric-policy and delete the role. **Verify:** iam get-role returns NoSuchEntity.
- [ ] **cleanup-09** — **CloudShell fa-monitoring helper files**: Delete only the exact JSON, Python and ZIP files created by the lab. **Verify:** A filtered ls command shows none of the listed helper files.

## Programme cleanup acknowledgement

I verified that both fa-monitoring CloudWatch alarms are absent; fa-monitoring-rule and fa-monitoring-bus are absent; fa-monitoring-observer and /aws/lambda/fa-monitoring-observer are absent; fa-monitoring-lambda-role is absent; the function no longer publishes FA/Monitoring custom metric data; all listed fa-monitoring CloudShell helper files are removed; and the existing administrator account remains unchanged.

# Official sources

## src-saa-domain1 — Content Domain 1: Design Secure Architectures

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain1.html
- **Purpose:** Exam context for monitoring, logging and operational visibility used to support secure workloads.
- **Used by:** task-01-admin-prerequisites, task-13-integrated-review

## src-saa-domain3 — Content Domain 3: Design High-Performing Architectures

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain3.html
- **Purpose:** Exam context for designing observable, scalable application architectures.
- **Used by:** task-01-admin-prerequisites, task-13-integrated-review

## src-saa-inscope — In-Scope AWS Services - AWS Certified Solutions Architect - Associate

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
- **Purpose:** Confirms CloudWatch, EventBridge, Lambda and X-Ray are relevant AWS services for SAA-C03.
- **Used by:** task-01-admin-prerequisites, task-05-create-event-bus, task-13-integrated-review

## src-cloudshell — Getting started with AWS CloudShell

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cloudshell/latest/userguide/getting-started.html
- **Purpose:** Use a browser-based authenticated shell without creating separate long-lived CLI credentials.
- **Used by:** task-01-admin-prerequisites, task-15-cloudshell-cleanup

## src-lambda-role — Defining Lambda function permissions with an execution role

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html
- **Purpose:** Create the Lambda execution role and grant only logging, X-Ray and custom-metric permissions.
- **Used by:** task-02-create-lambda-role, task-04-create-lambda

## src-lambda-logs — Sending Lambda function logs to CloudWatch Logs

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html
- **Purpose:** Explains Lambda logging to CloudWatch Logs and required permissions.
- **Used by:** task-02-create-lambda-role, task-03-create-log-group, task-04-create-lambda, task-07-send-normal-events, task-10-trigger-controlled-error, task-11-logs-insights, task-14-cloud-cleanup

## src-lambda-xray — Visualize Lambda function invocations using AWS X-Ray

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html
- **Purpose:** Enable Active tracing for Lambda and understand sampled X-Ray traces.
- **Used by:** task-02-create-lambda-role, task-04-create-lambda, task-10-trigger-controlled-error, task-12-xray-traces, task-13-integrated-review

## src-cloudwatch-custom — Publish custom metrics

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html
- **Purpose:** Publish a custom metric with namespace, metric name and dimensions.
- **Used by:** task-04-create-lambda, task-08-verify-custom-metric, task-09-create-alarms

## src-putmetricdata — PutMetricData

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricData.html
- **Purpose:** API behavior for publishing custom CloudWatch metric data.
- **Used by:** task-02-create-lambda-role, task-04-create-lambda, task-08-verify-custom-metric

## src-cloudwatch-alarm — Create a CloudWatch alarm based on a static threshold

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ConsoleAlarms.html
- **Purpose:** Create static-threshold alarms for custom and Lambda metrics.
- **Used by:** task-09-create-alarms, task-10-trigger-controlled-error, task-13-integrated-review, task-14-cloud-cleanup

## src-logs-insights — CloudWatch Logs Insights language query syntax

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html
- **Purpose:** Use fields, filter, parse, stats, sort and limit in Logs Insights queries.
- **Used by:** task-11-logs-insights, task-13-integrated-review

## src-eventbridge-bus — Creating an event bus in Amazon EventBridge

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-event-bus.html
- **Purpose:** Create the custom EventBridge event bus.
- **Used by:** task-05-create-event-bus, task-13-integrated-review

## src-eventbridge-putevents — Sending events with PutEvents in Amazon EventBridge

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-putevents.html
- **Purpose:** Send custom application events to the training event bus.
- **Used by:** task-05-create-event-bus, task-06-create-event-rule, task-07-send-normal-events, task-10-trigger-controlled-error

## src-eventbridge-targets — Event bus targets in Amazon EventBridge

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html
- **Purpose:** Configure a Lambda function as the target of an EventBridge rule.
- **Used by:** task-06-create-event-rule, task-07-send-normal-events, task-14-cloud-cleanup

## src-eventbridge-resource-policy — Using resource-based policies for Amazon EventBridge

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html
- **Purpose:** Grant EventBridge permission to invoke the Lambda target.
- **Used by:** task-06-create-event-rule

## src-xray-summary — GetTraceSummaries

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/xray/latest/api/API_GetTraceSummaries.html
- **Purpose:** Retrieve recent X-Ray trace summaries and filter by service name.
- **Used by:** task-12-xray-traces

## src-logs-retention — Change log data retention in CloudWatch Logs

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html
- **Purpose:** Set a short retention period on the training Lambda log group.
- **Used by:** task-03-create-log-group

## src-eventbridge-delete — Deleting Amazon EventBridge rules

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-delete-rule.html
- **Purpose:** Remove EventBridge targets and rules safely during cleanup.
- **Used by:** task-14-cloud-cleanup

# Quality report

- **phaseCount:** 6
- **taskCount:** 15
- **browserStepCount:** 117
- **cliBlockCount:** 16
- **verificationCheckCount:** 48
- **cleanupStepCount:** 9
- **sourceCount:** 18
- **codeBlockCount:** 6
- **reciprocalSourceLinkCount:** 48
- **Missing items:** 0
- **Deferred/placeholder items:** 0
- **Reciprocal source-link errors:** 0

# Offline conversion boundary

These two files are portable offline authoring sources only. The local Study Tracker import command performs conversion, app validation, fingerprinting and acceptance later.
