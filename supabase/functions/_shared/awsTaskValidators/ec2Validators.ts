import { EC2Client, DescribeInstancesCommand, DescribeVpcsCommand, DescribeSubnetsCommand, DescribeSecurityGroupsCommand } from 'npm:@aws-sdk/client-ec2@3';

export async function validateEC2Task(credentials: any, region: string, type: string, resourceInput: string) {
  const ec2Client = new EC2Client({ region, credentials });
  const input = (resourceInput || '').trim();

  try {
    if (type === 'ec2.instance-exists') {
      const res = await ec2Client.send(new DescribeInstancesCommand({
        InstanceIds: input ? [input] : undefined
      }));
      const instances = (res.Reservations || []).flatMap(r => r.Instances || []);
      if (instances.length > 0) {
        return { passed: true, message: `Live AWS Verified: EC2 instance '${instances[0].InstanceId}' exists.` };
      }
      return { passed: false, message: `EC2 instance '${input}' not found.` };
    }

    if (type === 'ec2.instance-running') {
      const res = await ec2Client.send(new DescribeInstancesCommand({
        InstanceIds: input ? [input] : undefined
      }));
      const reservations = res.Reservations || [];
      const instances = reservations.flatMap(r => r.Instances || []);
      const running = instances.filter(i => i.State?.Name === 'running');

      if (running.length > 0) {
        return { passed: true, message: `Live AWS Verified: ${running.length} EC2 instance(s) running.` };
      }
      return { passed: false, message: `No running EC2 instances found matching '${input || 'any'}'.` };
    }

    if (type === 'ec2.vpc-exists') {
      const res = await ec2Client.send(new DescribeVpcsCommand({
        VpcIds: input ? [input] : undefined
      }));
      const vpcs = res.Vpcs || [];
      if (vpcs.length > 0) {
        return { passed: true, message: `Live AWS Verified: VPC '${vpcs[0].VpcId}' exists and is available.` };
      }
      return { passed: false, message: `VPC '${input}' not found.` };
    }

    if (type === 'ec2.subnet-exists') {
      const res = await ec2Client.send(new DescribeSubnetsCommand({
        Filters: input ? [{ Name: 'vpc-id', Values: [input] }] : undefined
      }));
      const subnets = res.Subnets || [];
      if (subnets.length > 0) {
        return { passed: true, message: `Live AWS Verified: VPC '${input}' contains ${subnets.length} subnet(s).` };
      }
      return { passed: false, message: `No subnets found in VPC '${input}'.` };
    }

    if (type === 'ec2.security-group-rule-exists') {
      const res = await ec2Client.send(new DescribeSecurityGroupsCommand({
        GroupIds: input ? [input] : undefined
      }));
      const sgs = res.SecurityGroups || [];
      if (sgs.length > 0) {
        return { passed: true, message: `Live AWS Verified: Security Group '${sgs[0].GroupId}' exists.` };
      }
      return { passed: false, message: `Security Group '${input}' not found.` };
    }

    return { passed: false, message: `Unsupported EC2 validation type '${type}'.` };
  } catch (err: any) {
    return { passed: false, message: `EC2 Resource Check Failed: ${err.message || String(err)}` };
  }
}
