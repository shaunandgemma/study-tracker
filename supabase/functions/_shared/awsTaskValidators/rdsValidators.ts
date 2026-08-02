import { RDSClient, DescribeDBInstancesCommand } from 'npm:@aws-sdk/client-rds@3';

export async function validateRDSTask(credentials: any, region: string, type: string, resourceInput: string) {
  const rdsClient = new RDSClient({ region, credentials });
  const input = (resourceInput || '').trim();

  try {
    if (type === 'rds.instance-available') {
      const res = await rdsClient.send(new DescribeDBInstancesCommand({
        DBInstanceIdentifier: input || undefined
      }));
      const instances = res.DBInstances || [];
      const available = instances.filter(i => i.DBInstanceStatus === 'available');
      if (available.length > 0) {
        return { passed: true, message: `Live AWS Verified: RDS DB instance '${available[0].DBInstanceIdentifier}' status is AVAILABLE.` };
      }
      return { passed: false, message: `No available RDS DB instances found matching '${input || 'any'}'.` };
    }
    if (type === 'rds.encryption-enabled') {
      const res = await rdsClient.send(new DescribeDBInstancesCommand({
        DBInstanceIdentifier: input || undefined
      }));
      const instances = res.DBInstances || [];
      if (instances.length === 0) {
        return { passed: false, message: `RDS DB instance '${input}' not found.` };
      }
      if (instances[0].StorageEncrypted === true) {
        return { passed: true, message: `Live AWS Verified: RDS DB instance '${instances[0].DBInstanceIdentifier}' storage encryption is enabled.` };
      }
      return { passed: false, message: `RDS DB instance '${instances[0].DBInstanceIdentifier}' storage encryption is not enabled.` };
    }
    return { passed: false, message: `Unsupported RDS validation type '${type}'.` };
  } catch (err: any) {
    return { passed: false, message: `RDS Resource Check Failed: ${err.message || String(err)}` };
  }
}
