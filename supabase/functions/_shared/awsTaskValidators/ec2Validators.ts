import {
  EC2Client,
  DescribeInstancesCommand,
  DescribeVpcsCommand,
  DescribeSubnetsCommand,
  DescribeSecurityGroupsCommand,
  DescribeNatGatewaysCommand,
  DescribeVpcPeeringConnectionsCommand,
  DescribeTransitGatewaysCommand,
  DescribeVpcEndpointsCommand
} from 'npm:@aws-sdk/client-ec2@3';

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

    if (type === 'ec2.nat-gateway-available') {
      const res = await ec2Client.send(new DescribeNatGatewaysCommand({
        NatGatewayIds: input ? [input] : undefined
      }));
      const nats = (res.NatGateways || []).filter(n => n.State === 'available');
      if (nats.length > 0) {
        return { passed: true, message: `Live AWS Verified: NAT Gateway '${nats[0].NatGatewayId}' is available.` };
      }
      return { passed: false, message: `No available NAT Gateway found matching '${input || 'any'}'.` };
    }

    if (type === 'ec2.peering-active') {
      const res = await ec2Client.send(new DescribeVpcPeeringConnectionsCommand({
        VpcPeeringConnectionIds: input ? [input] : undefined
      }));
      const peerings = (res.VpcPeeringConnections || []).filter(p => p.Status?.Code === 'active');
      if (peerings.length > 0) {
        return { passed: true, message: `Live AWS Verified: VPC Peering Connection '${peerings[0].VpcPeeringConnectionId}' is active.` };
      }
      return { passed: false, message: `No active VPC Peering connection found matching '${input || 'any'}'.` };
    }

    if (type === 'ec2.transit-gateway-available') {
      const res = await ec2Client.send(new DescribeTransitGatewaysCommand({
        TransitGatewayIds: input ? [input] : undefined
      }));
      const tgws = (res.TransitGateways || []).filter(t => t.State === 'available');
      if (tgws.length > 0) {
        return { passed: true, message: `Live AWS Verified: Transit Gateway '${tgws[0].TransitGatewayId}' is available.` };
      }
      return { passed: false, message: `No available Transit Gateway found matching '${input || 'any'}'.` };
    }

    if (type === 'vpce.interface-endpoint-available' || type === 'vpce.gateway-endpoint-exists') {
      const res = await ec2Client.send(new DescribeVpcEndpointsCommand({
        VpcEndpointIds: input ? [input] : undefined
      }));
      const vpces = (res.VpcEndpoints || []).filter(v => v.State === 'available' || v.State === 'associated');
      if (vpces.length > 0) {
        return { passed: true, message: `Live AWS Verified: VPC Endpoint '${vpces[0].VpcEndpointId}' is available.` };
      }
      return { passed: false, message: `No active VPC Endpoint found matching '${input || 'any'}'.` };
    }

    return { passed: false, message: `Unsupported EC2 validation type '${type}'.` };
  } catch (err: any) {
    return { passed: false, message: `EC2 Resource Check Failed: ${err.message || String(err)}` };
  }
}
