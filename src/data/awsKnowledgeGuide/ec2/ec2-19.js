import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-19',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Capacity Reservations',
  status: 'ready',
  plainEnglish: 'EC2 On-Demand Capacity Reservations allow you to reserve EC2 compute capacity in a specific Availability Zone for any duration. When created, AWS guarantees that the specified instance capacity (e.g. 10 x c6i.2xlarge in us-east-1a) is physically available for you to launch at any time, eliminating the risk of `InsufficientInstanceCapacity` errors during traffic spikes or regional events.',
  whyItMatters: 'During major business events (like Black Friday sales, election reporting, or disaster recovery drills), launching instances might fail if AWS runs low on specific instance types in an AZ. Capacity Reservations guarantee hardware availability when you need it most.',
  workplaceExample: 'A ticketing vendor prepares for a major concert ticket sale. They create a Capacity Reservation for 50 c6i.4xlarge instances in us-east-1a 3 days before the sale. On ticket launch day, all 50 instances launch immediately without capacity errors.',
  examFocus: 'SAA-C03 key points for Capacity Reservations:\n- Guarantees EC2 compute capacity in a specific Availability Zone.\n- Can be created for any duration (no 1-year/3-year contract required).\n- Charged at On-Demand rates whether instances are running or idle.\n- Can be combined with Savings Plans or Regional RIs to receive billing discounts on top of the capacity guarantee.',
  keyPoints: [
    'Reserves physical EC2 compute capacity in a specific Availability Zone.',
    'Prevents InsufficientInstanceCapacity errors during critical events.',
    'No term commitment required (can be created and canceled anytime).',
    'Charged at standard On-Demand rates while active, even if un-utilized.',
    'Pairs with Savings Plans or Reserved Instances for cost optimization.'
  ],
  commonMistake: 'Assuming Reserved Instances automatically reserve physical capacity everywhere. Standard Regional RIs provide billing discounts ONLY. To guarantee physical capacity in an AZ, you must use Zonal RIs or On-Demand Capacity Reservations.',
  example: 'Creating a Capacity Reservation:\n`aws ec2 create-capacity-reservation --instance-type c6i.2xlarge --instance-platform Linux/UNIX --availability-zone us-east-1a --instance-count 10`',
  sources: [
    { title: 'On-Demand Capacity Reservations', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservations-using.html' }
  ]
});
