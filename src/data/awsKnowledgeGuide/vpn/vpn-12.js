import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-12',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'VPN Tunnel Monitoring',
  status: 'ready',
  plainEnglish: 'VPN Tunnel Monitoring involves tracking the operational state, throughput, and health of your AWS Site-to-Site VPN connections using Amazon CloudWatch metrics, CloudWatch Alarms, and AWS VPN connection logs. CloudWatch captures metrics such as whether individual IPsec tunnels are UP (1) or DOWN (0), the volume of bytes transmitted/received, and packet counts, while VPN connection logs capture detailed IKE and IPsec negotiation activity to assist in troubleshooting.',
  whyItMatters: 'If one tunnel of a dual-tunnel VPN connection goes down, traffic may continue flowing over the secondary tunnel without anyone noticing until a secondary failure causes a total outage. Monitoring tunnel health with automated CloudWatch alarms alerts network teams immediately so they can investigate tunnel status before a full service disruption occurs.',
  workplaceExample: 'An enterprise Network Operations Center (NOC) creates a CloudWatch Alarm on metric `TunnelState` with a threshold of `< 1` for 3 consecutive data points. When a telecom fibre cut drops Tunnel 1 to AWS, the alarm triggers an Amazon SNS notification that sends an urgent incident ticket to the network on-call engineer while traffic seamlessly runs on Tunnel 2.',
  examFocus: 'SAA-C03 VPN Monitoring & Troubleshooting:\n- Key CloudWatch Metrics (Namespace: `AWS/VPN`):\n  * `TunnelState`: 1 = UP, 0 = DOWN (essential for alerting on tunnel drops).\n  * `TunnelDataIn` / `TunnelDataOut`: Bytes transferred across each individual tunnel.\n- VPN Connection Logs: Exports Phase 1 (IKE) and Phase 2 (IPsec) security association negotiation events directly to Amazon CloudWatch Logs for debugging handshake failures.\n- AWS Health Events: AWS sends notifications to the AWS Health Dashboard and EventBridge when an AWS VPN endpoint undergoes scheduled maintenance.',
  keyPoints: [
    'Uses Amazon CloudWatch metrics under namespace `AWS/VPN` to monitor tunnel health and throughput.',
    '`TunnelState` metric reports 1 when the IPsec tunnel is UP and 0 when DOWN.',
    'CloudWatch Alarms can notify on-call engineers via Amazon SNS when a tunnel state drops.',
    'VPN Connection Logs record detailed IKE and IPsec negotiation messages in CloudWatch Logs.',
    'AWS Health Dashboard alerts organizations prior to scheduled AWS VPN endpoint maintenance.'
  ],
  commonMistake: 'Failing to set up alerts on single-tunnel failures because "both tunnels provide redundancy." If Tunnel 1 silently fails, the connection runs without redundancy until Tunnel 2 drops, causing an unexpected total outage.',
  example: 'Creating a CloudWatch Alarm for VPN Tunnel State:\naws cloudwatch put-metric-alarm \\\n  --alarm-name "VPN-Tunnel-1-Down" \\\n  --metric-name TunnelState \\\n  --namespace AWS/VPN \\\n  --statistic Maximum \\\n  --period 300 \\\n  --threshold 1 \\\n  --comparison-operator LessThanThreshold \\\n  --dimensions Name=VpnId,Value=vpn-0123456789abcdef0 Name=TunnelIpAddress,Value=198.51.100.1 \\\n  --evaluation-periods 2 \\\n  --alarm-actions arn:aws:sns:us-east-1:123456789012:Network-Alerts',
  sources: [
    { title: 'Monitoring Site-to-Site VPN connections using CloudWatch', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/monitoring-cloudwatch-vpn.html' },
    { title: 'Site-to-Site VPN tunnel endpoint lifecycle', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/vpn-tunnel-lifecycle.html' }
  ]
});
