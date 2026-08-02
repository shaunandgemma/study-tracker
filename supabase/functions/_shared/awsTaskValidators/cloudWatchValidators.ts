import { CloudWatchClient, DescribeAlarmsCommand } from 'npm:@aws-sdk/client-cloudwatch@3';

export async function validateCloudWatchTask(credentials: any, region: string, type: string, resourceInput: string) {
  const cwClient = new CloudWatchClient({ region, credentials });
  const alarmName = (resourceInput || '').trim();

  try {
    if (type === 'cloudwatch.alarm-exists') {
      const res = await cwClient.send(new DescribeAlarmsCommand({
        AlarmNames: alarmName ? [alarmName] : undefined
      }));
      const alarms = res.MetricAlarms || [];
      if (alarms.length > 0) {
        return { passed: true, message: `Live AWS Verified: CloudWatch metric alarm '${alarms[0].AlarmName}' exists.` };
      }
      return { passed: false, message: `CloudWatch alarm '${alarmName}' not found.` };
    }
    return { passed: false, message: `Unsupported CloudWatch validation type '${type}'.` };
  } catch (err: any) {
    return { passed: false, message: `CloudWatch Resource Check Failed: ${err.message || String(err)}` };
  }
}
