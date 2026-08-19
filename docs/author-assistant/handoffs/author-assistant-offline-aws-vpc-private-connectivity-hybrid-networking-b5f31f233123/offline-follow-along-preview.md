# VPC, Private Connectivity and Hybrid Networking Follow Along

> **Status:** Offline authoring manuscript only — not locally validated, imported, accepted, approved, published or fingerprinted.

- **Learner level:** Intermediate
- **Exam workspace:** AWS SAA-C03
- **AWS Region:** eu-west-2
- **Training prefix:** `fa-vpc`

## Required outcome

Build a two-AZ VPC with public, private and isolated subnet tiers; configure route tables, security groups, a network ACL, a public NAT gateway, S3 gateway and SSM interface VPC endpoints; connect a second VPC first with peering and then Transit Gateway; design PrivateLink, Site-to-Site VPN and Direct Connect architectures; enable VPC Flow Logs; and safely remove only the resources created by the lab.

## Completion definition

- fa-vpc-core contains public, private and isolated subnet tiers across eu-west-2a and eu-west-2b.
- Only public subnets route directly to the internet gateway; private subnets use fa-vpc-nat-a; isolated subnets have no default internet route.
- Stateful security groups and a stateless isolated-subnet NACL are configured and compared.
- An S3 gateway endpoint modifies selected route tables while an SSM interface endpoint creates private ENIs in isolated subnets.
- fa-vpc-peer is first connected through direct VPC peering, then that path is replaced by Transit Gateway routing.
- Complete PrivateLink, Site-to-Site VPN and Direct Connect architecture plans are produced without creating unnecessary NLB/VPN/Direct Connect costs.
- VPC Flow Logs are Active and target the private account-derived S3 bucket.
- All chargeable NAT, interface-endpoint and Transit Gateway resources are deleted before the temporary IAM identity and local files.

## Warnings

### Cost

This lab creates a public NAT gateway, Elastic IP, an SSM interface endpoint, a Transit Gateway with two VPC attachments and S3/Flow Logs storage. These can incur charges. PrivateLink custom service, Site-to-Site VPN and Direct Connect remain architecture-only specifically to avoid unnecessary NLB, VPN and physical-connectivity cost.

### Safety

Delete only exact fa-vpc resources and generated IDs rebuilt from those names. Never force VPC deletion or delete unrelated default/main resources.

### Credentials

Never create root access keys and never put fa-vpc-admin access-key values in architecture files, screenshots, chat or Study Tracker. Enter them only through protected aws configure prompts.

### Region

Every hands-on cloud resource is created in eu-west-2. Core and peer subnet pairs use eu-west-2a and eu-west-2b.

# Phase 1: Prepare the networking lab

Create identity, CLI profile and exact architecture files.

## task-01-prerequisites — Verify account, Region and networking scope

- **Feature:** Prerequisites
- **Difficulty:** Easy
- **Goal:** Confirm a clean training account, AWS CLI and eu-west-2 before any resource exists.
- **Why it matters:** Known identity and Region reduce false troubleshooting signals.
- **Exam relevance:** Networking questions combine routing, isolation, endpoints and hybrid patterns.
- **Prerequisites:** None
- **Sources:** src-vpc-create, src-routes

### Console / browser route

1. Sign in to the disposable AWS training account.
2. Confirm no resource beginning fa-vpc already exists.
3. Open Windows PowerShell and run aws --version.
4. Confirm the console Region is Europe (London) eu-west-2.
5. Do not create or use root access keys; root is used only for Task 2 bootstrap and Task 18 final IAM-user deletion.

### CLI route

#### PowerShell - verify CLI

```text
aws --version
```

#### Bash - verify CLI

```text
aws --version
```

### Expected results

- AWS CLI prints a version.
- No fa-vpc resource exists.

### Verification checks

- [ ] **task-01-prerequisites-verify-01** — The CLI works.
- [ ] **task-01-prerequisites-verify-02** — The console Region is eu-west-2.

## task-02-bootstrap-user — Create the temporary VPC networking IAM user

- **Feature:** IAM bootstrap
- **Difficulty:** Hard
- **Goal:** Use root only to create fa-vpc-admin, one temporary access key and the complete lab policy.
- **Why it matters:** The lab needs controlled rights for VPC, NAT, endpoints, peering, TGW, Flow Logs and one S3 bucket.
- **Exam relevance:** Least-privilege still matters in networking labs.
- **Prerequisites:** task-01-prerequisites
- **Sources:** src-vpc-create, src-nat-work, src-if-endpoint, src-peering, src-tgw, src-flow-s3

### Console / browser route

1. Sign in as root only for this bootstrap task.
2. Open IAM > Users > Create user.
3. User name: fa-vpc-admin; enable console access.
4. Create the user.
5. Open IAM > Policies > Create policy > JSON.
6. Paste the complete fa-vpc-admin-policy block below.
7. Create policy fa-vpc-admin-policy and attach it directly to fa-vpc-admin.
8. Open Security credentials and create exactly one access key for CLI use.
9. Copy the access key only to a temporary secure location.
10. Sign out of root and sign in as fa-vpc-admin.

### CLI route

#### No root CLI command

```text
# Complete this one-time bootstrap in the IAM console. Do not create root access keys.
```

### Complete editable files / policies

#### fa-vpc-admin-policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadNetworkState",
      "Effect": "Allow",
      "Action": [
        "sts:GetCallerIdentity",
        "ec2:Describe*",
        "s3:ListAllMyBuckets",
        "s3:GetBucketLocation",
        "s3:GetBucketPolicy"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageVpcCore",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVpc",
        "ec2:DeleteVpc",
        "ec2:ModifyVpcAttribute",
        "ec2:CreateSubnet",
        "ec2:DeleteSubnet",
        "ec2:ModifySubnetAttribute",
        "ec2:CreateInternetGateway",
        "ec2:AttachInternetGateway",
        "ec2:DetachInternetGateway",
        "ec2:DeleteInternetGateway",
        "ec2:CreateRouteTable",
        "ec2:DeleteRouteTable",
        "ec2:AssociateRouteTable",
        "ec2:DisassociateRouteTable",
        "ec2:CreateRoute",
        "ec2:ReplaceRoute",
        "ec2:DeleteRoute",
        "ec2:CreateTags",
        "ec2:DeleteTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageSecurity",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateSecurityGroup",
        "ec2:DeleteSecurityGroup",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:AuthorizeSecurityGroupEgress",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:RevokeSecurityGroupEgress",
        "ec2:CreateNetworkAcl",
        "ec2:DeleteNetworkAcl",
        "ec2:CreateNetworkAclEntry",
        "ec2:DeleteNetworkAclEntry",
        "ec2:ReplaceNetworkAclAssociation"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageNat",
      "Effect": "Allow",
      "Action": [
        "ec2:AllocateAddress",
        "ec2:ReleaseAddress",
        "ec2:CreateNatGateway",
        "ec2:DeleteNatGateway"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageEndpoints",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVpcEndpoint",
        "ec2:DeleteVpcEndpoints",
        "ec2:ModifyVpcEndpoint"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManagePeering",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVpcPeeringConnection",
        "ec2:AcceptVpcPeeringConnection",
        "ec2:DeleteVpcPeeringConnection",
        "ec2:ModifyVpcPeeringConnectionOptions"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageTransitGateway",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateTransitGateway",
        "ec2:DeleteTransitGateway",
        "ec2:CreateTransitGatewayVpcAttachment",
        "ec2:DeleteTransitGatewayVpcAttachment",
        "ec2:ModifyTransitGatewayVpcAttachment"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageFlowLogs",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateFlowLogs",
        "ec2:DeleteFlowLogs"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageFlowBucket",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetBucketPolicy",
        "s3:PutBucketPolicy",
        "s3:DeleteBucketPolicy"
      ],
      "Resource": "arn:aws:s3:::fa-vpc-flow-*"
    },
    {
      "Sid": "ManageFlowObjects",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::fa-vpc-flow-*/*"
    }
  ]
}
```

### Expected results

- fa-vpc-admin exists.
- fa-vpc-admin-policy is attached.
- Root is signed out.

### Verification checks

- [ ] **task-02-bootstrap-user-verify-01** — The current browser session is fa-vpc-admin.
- [ ] **task-02-bootstrap-user-verify-02** — AdministratorAccess is not attached.

## task-03-cli-design — Configure the CLI profile and create architecture files

- **Feature:** CLI and planning files
- **Difficulty:** Medium
- **Goal:** Configure fa-vpc-admin and save the exact core, PrivateLink and hybrid network designs.
- **Why it matters:** The design files keep CIDRs and non-deployed expensive services explicit.
- **Exam relevance:** Intermediate network design should start with CIDR/routing intent.
- **Prerequisites:** task-02-bootstrap-user
- **Sources:** src-routes, src-privatelink, src-vpn, src-dx-gw

### Console / browser route

1. Open PowerShell.
2. Run aws configure --profile fa-vpc-admin.
3. Enter the temporary key only in protected prompts; set Region eu-west-2 and output json.
4. Run get-caller-identity.
5. Create C:\aws-labs\fa-vpc.
6. Create network-design.json, privatelink-plan.json and hybrid-connectivity-plan.json.
7. Paste the complete blocks below and verify the 10.80.0.0/16 and 10.90.0.0/16 CIDRs do not overlap.

### CLI route

#### PowerShell - configure profile

```text
aws configure --profile fa-vpc-admin
```

#### PowerShell - verify identity

```text
aws sts get-caller-identity --profile fa-vpc-admin
```

#### PowerShell - capture account ID

```text
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-vpc-admin --query Account --output text
```

#### PowerShell - derive flow bucket

```text
$FLOW_BUCKET = "fa-vpc-flow-$AWS_ACCOUNT_ID"
```

#### PowerShell - create/enter folder

```text
New-Item -ItemType Directory -Force "C:\aws-labs\fa-vpc"
Set-Location "C:\aws-labs\fa-vpc"
```

### Complete editable files / policies

#### network-design.json

```json
{
  "programme": "VPC, Private Connectivity and Hybrid Networking Follow Along",
  "region": "eu-west-2",
  "resourcePrefix": "fa-vpc",
  "primaryVpc": {
    "name": "fa-vpc-core",
    "cidr": "10.80.0.0/16",
    "subnets": [
      {
        "name": "fa-vpc-public-a",
        "az": "eu-west-2a",
        "cidr": "10.80.0.0/24",
        "class": "public"
      },
      {
        "name": "fa-vpc-public-b",
        "az": "eu-west-2b",
        "cidr": "10.80.1.0/24",
        "class": "public"
      },
      {
        "name": "fa-vpc-private-a",
        "az": "eu-west-2a",
        "cidr": "10.80.10.0/24",
        "class": "private"
      },
      {
        "name": "fa-vpc-private-b",
        "az": "eu-west-2b",
        "cidr": "10.80.11.0/24",
        "class": "private"
      },
      {
        "name": "fa-vpc-isolated-a",
        "az": "eu-west-2a",
        "cidr": "10.80.20.0/24",
        "class": "isolated"
      },
      {
        "name": "fa-vpc-isolated-b",
        "az": "eu-west-2b",
        "cidr": "10.80.21.0/24",
        "class": "isolated"
      }
    ]
  },
  "peerVpc": {
    "name": "fa-vpc-peer",
    "cidr": "10.90.0.0/16",
    "subnets": [
      {
        "name": "fa-vpc-peer-a",
        "az": "eu-west-2a",
        "cidr": "10.90.10.0/24"
      },
      {
        "name": "fa-vpc-peer-b",
        "az": "eu-west-2b",
        "cidr": "10.90.11.0/24"
      }
    ]
  }
}
```

#### privatelink-plan.json

```json
{
  "pattern": "AWS PrivateLink endpoint service",
  "providerVpc": "fa-vpc-peer",
  "consumerVpc": "fa-vpc-core",
  "providerSequence": [
    "Deploy private service targets",
    "Create internal NLB fa-vpc-privatelink-nlb",
    "Create endpoint service fa-vpc-privatelink-service",
    "Allow only intended consumer principals",
    "Keep acceptance required when explicit approval is wanted"
  ],
  "consumerSequence": [
    "Create interface endpoint in fa-vpc-private-a and fa-vpc-private-b",
    "Attach fa-vpc-endpoint-sg",
    "Allow service port only from intended client SG",
    "Enable private DNS only after provider DNS requirements are satisfied"
  ],
  "examDecision": "Use PrivateLink for private access to one service without broad routed VPC-to-VPC connectivity.",
  "notCreatedInThisLab": [
    "Network Load Balancer",
    "Endpoint service",
    "Custom-service consumer endpoint"
  ]
}
```

#### hybrid-connectivity-plan.json

```json
{
  "onPremises": {
    "networkCidr": "192.168.100.0/24",
    "documentationOnlyPublicIp": "198.51.100.10",
    "customerBgpAsn": 65010
  },
  "siteToSiteVpn": {
    "singleVpcPattern": "Customer gateway -> two IPsec tunnels -> virtual private gateway -> VPC route tables",
    "multiVpcPattern": "Customer gateway -> two IPsec tunnels -> Transit Gateway VPN attachment -> TGW route table -> VPC attachments",
    "routing": "Use BGP when dynamic routing is supported; configure both AWS tunnels on the customer gateway device.",
    "labDecision": "Architecture-only: no real customer gateway device and an idle VPN connection would incur charges."
  },
  "directConnect": {
    "smallVpcPattern": "Direct Connect connection -> private VIF -> Direct Connect gateway -> virtual private gateway -> VPC",
    "multiVpcPattern": "Direct Connect connection -> transit VIF -> Direct Connect gateway -> Transit Gateway -> VPC attachments",
    "routing": "BGP exchanges prefixes between customer router and AWS.",
    "resilience": "Use redundant connections/locations and consider Site-to-Site VPN backup.",
    "labDecision": "Architecture-only: requires physical/partner connectivity."
  }
}
```

### Expected results

- The CLI identity is fa-vpc-admin.
- All three design files exist.
- The VPC CIDRs do not overlap.

### Verification checks

- [ ] **task-03-cli-design-verify-01** — FLOW_BUCKET begins fa-vpc-flow-.
- [ ] **task-03-cli-design-verify-02** — No design file contains credentials.

# Phase 2: Build public, private and isolated subnet tiers

Create VPC, six subnets, route tables, IGW, NAT, SGs and NACL.

## task-04-core-vpc — Create fa-vpc-core and six subnet tiers

- **Feature:** VPC and subnets
- **Difficulty:** Hard
- **Goal:** Create public, private and isolated subnets across eu-west-2a and eu-west-2b.
- **Why it matters:** Equivalent subnet tiers across AZs make resilience and routing boundaries visible.
- **Exam relevance:** Subnet purpose is ultimately determined by routes and addressing, not the subnet name.
- **Prerequisites:** task-03-cli-design
- **Sources:** src-vpc-create

### Console / browser route

1. Open VPC in eu-west-2 and create VPC only named fa-vpc-core with CIDR 10.80.0.0/16.
2. Enable DNS hostnames on fa-vpc-core.
3. Create fa-vpc-public-a in eu-west-2a: 10.80.0.0/24.
4. Create fa-vpc-public-b in eu-west-2b: 10.80.1.0/24.
5. Create fa-vpc-private-a in eu-west-2a: 10.80.10.0/24.
6. Create fa-vpc-private-b in eu-west-2b: 10.80.11.0/24.
7. Create fa-vpc-isolated-a in eu-west-2a: 10.80.20.0/24.
8. Create fa-vpc-isolated-b in eu-west-2b: 10.80.21.0/24.
9. Do not enable public IPv4 auto-assignment on private or isolated subnets.

### CLI route

#### PowerShell - create core VPC

```text
$CORE_VPC_ID = aws ec2 create-vpc --cidr-block 10.80.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=fa-vpc-core}]" --query Vpc.VpcId --output text --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - DNS hostnames

```text
aws ec2 modify-vpc-attribute --vpc-id $CORE_VPC_ID --enable-dns-hostnames "{\"Value\":true}" --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - create six subnets

```text
$PUBLIC_A_ID = aws ec2 create-subnet --vpc-id $CORE_VPC_ID --availability-zone eu-west-2a --cidr-block 10.80.0.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-vpc-public-a}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-vpc-admin
$PUBLIC_B_ID = aws ec2 create-subnet --vpc-id $CORE_VPC_ID --availability-zone eu-west-2b --cidr-block 10.80.1.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-vpc-public-b}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-vpc-admin
$PRIVATE_A_ID = aws ec2 create-subnet --vpc-id $CORE_VPC_ID --availability-zone eu-west-2a --cidr-block 10.80.10.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-vpc-private-a}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-vpc-admin
$PRIVATE_B_ID = aws ec2 create-subnet --vpc-id $CORE_VPC_ID --availability-zone eu-west-2b --cidr-block 10.80.11.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-vpc-private-b}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-vpc-admin
$ISOLATED_A_ID = aws ec2 create-subnet --vpc-id $CORE_VPC_ID --availability-zone eu-west-2a --cidr-block 10.80.20.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-vpc-isolated-a}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-vpc-admin
$ISOLATED_B_ID = aws ec2 create-subnet --vpc-id $CORE_VPC_ID --availability-zone eu-west-2b --cidr-block 10.80.21.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-vpc-isolated-b}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-vpc-admin
```

### Expected results

- fa-vpc-core has six /24 subnets across two AZs.
- Private/isolated subnets do not auto-assign public IPv4.

### Verification checks

- [ ] **task-04-core-vpc-verify-01** — All CIDRs match network-design.json.
- [ ] **task-04-core-vpc-verify-02** — Three subnet tiers exist in each AZ.

## task-05-route-tables — Create tier-specific route tables and internet gateway

- **Feature:** Route tables
- **Difficulty:** Hard
- **Goal:** Give only public subnets an IGW default route and give each private/isolated subnet an explicit route-table association.
- **Why it matters:** Routing is what makes a subnet public, private or isolated.
- **Exam relevance:** Route destination/target matching is a core SAA-C03 networking skill.
- **Prerequisites:** task-04-core-vpc
- **Sources:** src-routes, src-igw

### Console / browser route

1. Create internet gateway fa-vpc-igw and attach it to fa-vpc-core.
2. Create fa-vpc-public-rt, fa-vpc-private-a-rt, fa-vpc-private-b-rt, fa-vpc-isolated-a-rt and fa-vpc-isolated-b-rt.
3. Add 0.0.0.0/0 -> fa-vpc-igw only to fa-vpc-public-rt.
4. Associate both public subnets with fa-vpc-public-rt.
5. Associate each private subnet with its matching private route table.
6. Associate each isolated subnet with its matching isolated route table.
7. Verify neither isolated route table contains 0.0.0.0/0.

### CLI route

#### PowerShell - IGW

```text
$IGW_ID = aws ec2 create-internet-gateway --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=fa-vpc-igw}]" --query InternetGateway.InternetGatewayId --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 attach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $CORE_VPC_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - create route tables

```text
$PUBLIC_RT_ID = aws ec2 create-route-table --vpc-id $CORE_VPC_ID --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=fa-vpc-public-rt}]" --query RouteTable.RouteTableId --output text --region eu-west-2 --profile fa-vpc-admin
$PRIVATE_A_RT_ID = aws ec2 create-route-table --vpc-id $CORE_VPC_ID --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=fa-vpc-private-a-rt}]" --query RouteTable.RouteTableId --output text --region eu-west-2 --profile fa-vpc-admin
$PRIVATE_B_RT_ID = aws ec2 create-route-table --vpc-id $CORE_VPC_ID --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=fa-vpc-private-b-rt}]" --query RouteTable.RouteTableId --output text --region eu-west-2 --profile fa-vpc-admin
$ISOLATED_A_RT_ID = aws ec2 create-route-table --vpc-id $CORE_VPC_ID --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=fa-vpc-isolated-a-rt}]" --query RouteTable.RouteTableId --output text --region eu-west-2 --profile fa-vpc-admin
$ISOLATED_B_RT_ID = aws ec2 create-route-table --vpc-id $CORE_VPC_ID --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=fa-vpc-isolated-b-rt}]" --query RouteTable.RouteTableId --output text --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - route/associate

```text
aws ec2 create-route --route-table-id $PUBLIC_RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 associate-route-table --route-table-id $PUBLIC_RT_ID --subnet-id $PUBLIC_A_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 associate-route-table --route-table-id $PUBLIC_RT_ID --subnet-id $PUBLIC_B_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 associate-route-table --route-table-id $PRIVATE_A_RT_ID --subnet-id $PRIVATE_A_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 associate-route-table --route-table-id $PRIVATE_B_RT_ID --subnet-id $PRIVATE_B_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 associate-route-table --route-table-id $ISOLATED_A_RT_ID --subnet-id $ISOLATED_A_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 associate-route-table --route-table-id $ISOLATED_B_RT_ID --subnet-id $ISOLATED_B_ID --region eu-west-2 --profile fa-vpc-admin
```

### Expected results

- Only fa-vpc-public-rt has the IGW default route.
- Every non-public subnet has an explicit route-table association.

### Verification checks

- [ ] **task-05-route-tables-verify-01** — Both isolated route tables lack 0.0.0.0/0.
- [ ] **task-05-route-tables-verify-02** — Public route target is fa-vpc-igw.

## task-06-nat — Create a public NAT gateway and private egress routes

- **Feature:** NAT gateway
- **Difficulty:** Hard
- **Goal:** Create fa-vpc-nat-a in public-a and route both private subnets to it.
- **Why it matters:** NAT provides outbound IPv4 egress while private subnets avoid direct IGW routing.
- **Exam relevance:** NAT is egress, not transitive inter-VPC routing.
- **Prerequisites:** task-05-route-tables
- **Sources:** src-nat, src-nat-work

### Warnings

- NAT Gateway and Elastic IP incur charges while present.

### Console / browser route

1. Allocate Elastic IP fa-vpc-nat-eip.
2. Create public NAT gateway fa-vpc-nat-a in fa-vpc-public-a using that EIP.
3. Wait for Available.
4. Add 0.0.0.0/0 -> fa-vpc-nat-a to fa-vpc-private-a-rt and fa-vpc-private-b-rt.
5. Do not add a NAT route to isolated route tables.
6. Record the training compromise: private-b depends on a zonal NAT in eu-west-2a; production designs should address cross-AZ/failure requirements.

### CLI route

#### PowerShell - EIP/NAT

```text
$EIP_ALLOC_ID = aws ec2 allocate-address --domain vpc --tag-specifications "ResourceType=elastic-ip,Tags=[{Key=Name,Value=fa-vpc-nat-eip}]" --query AllocationId --output text --region eu-west-2 --profile fa-vpc-admin
$NAT_ID = aws ec2 create-nat-gateway --subnet-id $PUBLIC_A_ID --allocation-id $EIP_ALLOC_ID --tag-specifications "ResourceType=natgateway,Tags=[{Key=Name,Value=fa-vpc-nat-a}]" --query NatGateway.NatGatewayId --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - private NAT routes

```text
aws ec2 create-route --route-table-id $PRIVATE_A_RT_ID --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 create-route --route-table-id $PRIVATE_B_RT_ID --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_ID --region eu-west-2 --profile fa-vpc-admin
```

### Expected results

- NAT is Available.
- Both private RTs use NAT for 0.0.0.0/0.
- Isolated RTs remain without default routes.

### Verification checks

- [ ] **task-06-nat-verify-01** — NAT is in public-a and has the EIP.
- [ ] **task-06-nat-verify-02** — No isolated route targets NAT.

## task-07-security — Create endpoint security groups and an isolated-subnet NACL

- **Feature:** Security groups and NACLs
- **Difficulty:** Hard
- **Goal:** Create SG reference rules and a stateless NACL for isolated subnets.
- **Why it matters:** SGs are stateful ENI controls; NACLs are stateless subnet controls.
- **Exam relevance:** Stateful versus stateless is a frequent exam distinction.
- **Prerequisites:** task-06-nat
- **Sources:** src-sg, src-nacl

### Console / browser route

1. Create fa-vpc-client-sg in fa-vpc-core with no inbound rules.
2. Create fa-vpc-endpoint-sg in fa-vpc-core.
3. Allow inbound TCP 443 to fa-vpc-endpoint-sg only from fa-vpc-client-sg.
4. Create fa-vpc-isolated-nacl.
5. Add inbound rule 100 Allow ALL from 10.80.0.0/16.
6. Add outbound rule 100 Allow ALL to 10.80.0.0/16.
7. Leave implicit deny for other traffic.
8. Associate both isolated subnets with fa-vpc-isolated-nacl.
9. Explain that the symmetric NACL rules are needed because NACLs are stateless.

### CLI route

#### PowerShell - SGs

```text
$CLIENT_SG_ID = aws ec2 create-security-group --group-name fa-vpc-client-sg --description "Training clients" --vpc-id $CORE_VPC_ID --query GroupId --output text --region eu-west-2 --profile fa-vpc-admin
$ENDPOINT_SG_ID = aws ec2 create-security-group --group-name fa-vpc-endpoint-sg --description "Endpoint HTTPS" --vpc-id $CORE_VPC_ID --query GroupId --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 authorize-security-group-ingress --group-id $ENDPOINT_SG_ID --protocol tcp --port 443 --source-group $CLIENT_SG_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - NACL

```text
$NACL_ID = aws ec2 create-network-acl --vpc-id $CORE_VPC_ID --tag-specifications "ResourceType=network-acl,Tags=[{Key=Name,Value=fa-vpc-isolated-nacl}]" --query NetworkAcl.NetworkAclId --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 create-network-acl-entry --network-acl-id $NACL_ID --ingress --rule-number 100 --protocol -1 --cidr-block 10.80.0.0/16 --rule-action allow --region eu-west-2 --profile fa-vpc-admin
aws ec2 create-network-acl-entry --network-acl-id $NACL_ID --egress --rule-number 100 --protocol -1 --cidr-block 10.80.0.0/16 --rule-action allow --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - NACL associations

```text
$A1 = aws ec2 describe-network-acls --filters Name=association.subnet-id,Values=$ISOLATED_A_ID --query "NetworkAcls[0].Associations[0].NetworkAclAssociationId" --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 replace-network-acl-association --association-id $A1 --network-acl-id $NACL_ID --region eu-west-2 --profile fa-vpc-admin
$A2 = aws ec2 describe-network-acls --filters Name=association.subnet-id,Values=$ISOLATED_B_ID --query "NetworkAcls[0].Associations[0].NetworkAclAssociationId" --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 replace-network-acl-association --association-id $A2 --network-acl-id $NACL_ID --region eu-west-2 --profile fa-vpc-admin
```

### Expected results

- Endpoint SG accepts 443 only from client SG.
- Isolated NACL permits VPC-local traffic both directions and denies other traffic.

### Verification checks

- [ ] **task-07-security-verify-01** — Both isolated subnets use the custom NACL.
- [ ] **task-07-security-verify-02** — The learner can state SG=stateful, NACL=stateless.

# Phase 3: Add private AWS-service connectivity

Create S3 gateway and SSM interface endpoints.

## task-08-s3-endpoint — Create the Flow Logs bucket and S3 gateway endpoint

- **Feature:** Gateway VPC endpoint
- **Difficulty:** Hard
- **Goal:** Create a private S3 bucket and associate an S3 gateway endpoint with private and isolated route tables.
- **Why it matters:** Gateway endpoints are route-table based and do not create endpoint ENIs.
- **Exam relevance:** Gateway endpoints are the low-cost private path for supported services such as S3/DynamoDB.
- **Prerequisites:** task-07-security
- **Sources:** src-gw-endpoint, src-s3-endpoint, src-routes

### Console / browser route

1. Open S3 and create fa-vpc-flow-<account-id> in eu-west-2 with Block Public Access enabled.
2. Open VPC > Endpoints > Create endpoint.
3. Name: fa-vpc-s3-gateway-endpoint.
4. Service: com.amazonaws.eu-west-2.s3, Type Gateway.
5. VPC: fa-vpc-core.
6. Select fa-vpc-private-a-rt, fa-vpc-private-b-rt, fa-vpc-isolated-a-rt and fa-vpc-isolated-b-rt.
7. Use a custom endpoint policy limited to the training flow-log bucket; the CLI route replaces FLOW_LOG_BUCKET_ARN with the exact derived ARN.
8. Create the endpoint and wait for Available.
9. Inspect the four route tables and identify the S3 managed-prefix-list route.
10. Confirm no endpoint ENI/security group exists for the gateway endpoint.

### CLI route

#### PowerShell - create Flow Logs bucket

```text
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-vpc-admin --query Account --output text
$FLOW_BUCKET = "fa-vpc-flow-$AWS_ACCOUNT_ID"
aws s3api create-bucket --bucket $FLOW_BUCKET --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - build endpoint policy

```text
$POLICY = (Get-Content .\s3-endpoint-policy-template.json -Raw).Replace("FLOW_LOG_BUCKET_ARN","arn:aws:s3:::$FLOW_BUCKET")
$POLICY | Set-Content -Encoding utf8 .\s3-endpoint-policy.json
```

#### PowerShell - create gateway endpoint

```text
$S3_ENDPOINT_ID = aws ec2 create-vpc-endpoint --vpc-id $CORE_VPC_ID --service-name com.amazonaws.eu-west-2.s3 --vpc-endpoint-type Gateway --route-table-ids $PRIVATE_A_RT_ID $PRIVATE_B_RT_ID $ISOLATED_A_RT_ID $ISOLATED_B_RT_ID --policy-document file://s3-endpoint-policy.json --tag-specifications "ResourceType=vpc-endpoint,Tags=[{Key=Name,Value=fa-vpc-s3-gateway-endpoint}]" --query VpcEndpoint.VpcEndpointId --output text --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - inspect endpoint

```text
aws ec2 describe-vpc-endpoints --vpc-endpoint-ids $S3_ENDPOINT_ID --region eu-west-2 --profile fa-vpc-admin
```

### Complete editable files / policies

#### s3-endpoint-policy-template.json

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowTrainingBucketList",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetBucketLocation",
        "s3:ListBucket"
      ],
      "Resource": "FLOW_LOG_BUCKET_ARN"
    },
    {
      "Sid": "AllowTrainingObjectsRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "FLOW_LOG_BUCKET_ARN/*"
    }
  ]
}
```

### Expected results

- S3 gateway endpoint is Available.
- Selected RTs contain S3 prefix-list routes.
- The S3 bucket remains private.

### Verification checks

- [ ] **task-08-s3-endpoint-verify-01** — No endpoint ENI exists.
- [ ] **task-08-s3-endpoint-verify-02** — Policy scope is limited to the flow-log bucket.

## task-09-interface-endpoint — Create an SSM interface endpoint in isolated subnets

- **Feature:** Interface VPC endpoint
- **Difficulty:** Hard
- **Goal:** Create an interface VPC endpoint with private DNS and one ENI in each isolated subnet.
- **Why it matters:** Interface endpoints use PrivateLink, subnet ENIs and security groups instead of gateway routes.
- **Exam relevance:** Use interface endpoints when isolated/private workloads need supported AWS APIs without internet/NAT.
- **Prerequisites:** task-08-s3-endpoint
- **Sources:** src-if-endpoint, src-sg

### Warnings

- Interface endpoints incur hourly/data-processing charges until deleted.

### Console / browser route

1. Open VPC > Endpoints > Create endpoint.
2. Name: fa-vpc-ssm-interface-endpoint.
3. Service: com.amazonaws.eu-west-2.ssm.
4. VPC: fa-vpc-core.
5. Enable private DNS.
6. Select fa-vpc-isolated-a and fa-vpc-isolated-b.
7. Security group: fa-vpc-endpoint-sg.
8. Create and wait for Available.
9. Inspect Subnets and Network interfaces; confirm one endpoint ENI per selected subnet.
10. Compare with the S3 gateway endpoint: interface endpoint has ENIs/SG/private DNS; gateway endpoint has route-table entries.

### CLI route

#### PowerShell - create SSM endpoint

```text
$SSM_ENDPOINT_ID = aws ec2 create-vpc-endpoint --vpc-id $CORE_VPC_ID --vpc-endpoint-type Interface --service-name com.amazonaws.eu-west-2.ssm --subnet-ids $ISOLATED_A_ID $ISOLATED_B_ID --security-group-ids $ENDPOINT_SG_ID --private-dns-enabled --tag-specifications "ResourceType=vpc-endpoint,Tags=[{Key=Name,Value=fa-vpc-ssm-interface-endpoint}]" --query VpcEndpoint.VpcEndpointId --output text --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - inspect endpoint

```text
aws ec2 describe-vpc-endpoints --vpc-endpoint-ids $SSM_ENDPOINT_ID --region eu-west-2 --profile fa-vpc-admin
```

### Expected results

- SSM endpoint reaches Available.
- It has ENIs in isolated-a and isolated-b.
- PrivateDnsEnabled is true.

### Verification checks

- [ ] **task-09-interface-endpoint-verify-01** — Endpoint uses fa-vpc-endpoint-sg.
- [ ] **task-09-interface-endpoint-verify-02** — Isolated RTs still have no default internet route.

# Phase 4: Connect VPCs with peering then Transit Gateway

Create peer VPC, peering, then transition to TGW.

## task-10-peering — Create fa-vpc-peer and connect it with VPC peering

- **Feature:** VPC peering
- **Difficulty:** Hard
- **Goal:** Create a second non-overlapping VPC and explicit bidirectional private routes through a peering connection.
- **Why it matters:** Peering is direct one-to-one connectivity and is not transitive.
- **Exam relevance:** Peering fits simple VPC pairs; TGW fits larger hub-and-spoke designs.
- **Prerequisites:** task-09-interface-endpoint
- **Sources:** src-peering, src-peering-routes, src-peering-basics

### Console / browser route

1. Create VPC fa-vpc-peer with CIDR 10.90.0.0/16.
2. Create fa-vpc-peer-a 10.90.10.0/24 in eu-west-2a and fa-vpc-peer-b 10.90.11.0/24 in eu-west-2b.
3. Create fa-vpc-peer-rt and associate both peer subnets.
4. Create peering connection fa-vpc-peering from fa-vpc-core to fa-vpc-peer.
5. Accept the same-account request.
6. Add 10.90.0.0/16 -> fa-vpc-peering to fa-vpc-private-a-rt and fa-vpc-private-b-rt.
7. Add 10.80.0.0/16 -> fa-vpc-peering to fa-vpc-peer-rt.
8. Do not add peer routes to isolated route tables.

### CLI route

#### PowerShell - create peer VPC/subnets

```text
$PEER_VPC_ID = aws ec2 create-vpc --cidr-block 10.90.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=fa-vpc-peer}]" --query Vpc.VpcId --output text --region eu-west-2 --profile fa-vpc-admin
$PEER_A_ID = aws ec2 create-subnet --vpc-id $PEER_VPC_ID --availability-zone eu-west-2a --cidr-block 10.90.10.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-vpc-peer-a}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-vpc-admin
$PEER_B_ID = aws ec2 create-subnet --vpc-id $PEER_VPC_ID --availability-zone eu-west-2b --cidr-block 10.90.11.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-vpc-peer-b}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - peer RT

```text
$PEER_RT_ID = aws ec2 create-route-table --vpc-id $PEER_VPC_ID --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=fa-vpc-peer-rt}]" --query RouteTable.RouteTableId --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 associate-route-table --route-table-id $PEER_RT_ID --subnet-id $PEER_A_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 associate-route-table --route-table-id $PEER_RT_ID --subnet-id $PEER_B_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - peering and routes

```text
$PCX_ID = aws ec2 create-vpc-peering-connection --vpc-id $CORE_VPC_ID --peer-vpc-id $PEER_VPC_ID --tag-specifications "ResourceType=vpc-peering-connection,Tags=[{Key=Name,Value=fa-vpc-peering}]" --query VpcPeeringConnection.VpcPeeringConnectionId --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 accept-vpc-peering-connection --vpc-peering-connection-id $PCX_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 create-route --route-table-id $PRIVATE_A_RT_ID --destination-cidr-block 10.90.0.0/16 --vpc-peering-connection-id $PCX_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 create-route --route-table-id $PRIVATE_B_RT_ID --destination-cidr-block 10.90.0.0/16 --vpc-peering-connection-id $PCX_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 create-route --route-table-id $PEER_RT_ID --destination-cidr-block 10.80.0.0/16 --vpc-peering-connection-id $PCX_ID --region eu-west-2 --profile fa-vpc-admin
```

### Expected results

- Peering status is Active.
- Private core RTs route 10.90.0.0/16 via peering.
- Peer RT returns 10.80.0.0/16 via peering.

### Verification checks

- [ ] **task-10-peering-verify-01** — Isolated RTs have no peering route.
- [ ] **task-10-peering-verify-02** — Learner can explain non-transitive peering.

## task-11-tgw — Replace peering with Transit Gateway routing

- **Feature:** Transit Gateway
- **Difficulty:** Hard
- **Goal:** Remove peering routes/connection, create fa-vpc-tgw, attach both VPCs and route private tiers through it.
- **Why it matters:** The transition demonstrates mesh versus hub-and-spoke routing.
- **Exam relevance:** TGW scales connectivity across many VPC/VPN attachments and route tables.
- **Prerequisites:** task-10-peering
- **Sources:** src-tgw, src-tgw-attach, src-tgw-how, src-tgw-routes, src-peering-basics

### Warnings

- Transit Gateway and VPC attachments incur hourly charges until cleanup.

### Console / browser route

1. Delete the peering routes from both core private RTs and fa-vpc-peer-rt.
2. Delete fa-vpc-peering.
3. Create Transit Gateway fa-vpc-tgw with default association and propagation enabled.
4. Wait for Available.
5. Create attachment fa-vpc-tgw-core-attachment using fa-vpc-private-a and fa-vpc-private-b.
6. Create attachment fa-vpc-tgw-peer-attachment using fa-vpc-peer-a and fa-vpc-peer-b.
7. Wait for both attachments Available.
8. Inspect the default TGW route table and confirm both VPC CIDRs are propagated.
9. Add 10.90.0.0/16 -> fa-vpc-tgw to both core private RTs.
10. Add 10.80.0.0/16 -> fa-vpc-tgw to fa-vpc-peer-rt.
11. Do not add TGW routes to isolated RTs.

### CLI route

#### PowerShell - remove peering path

```text
aws ec2 delete-route --route-table-id $PRIVATE_A_RT_ID --destination-cidr-block 10.90.0.0/16 --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-route --route-table-id $PRIVATE_B_RT_ID --destination-cidr-block 10.90.0.0/16 --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-route --route-table-id $PEER_RT_ID --destination-cidr-block 10.80.0.0/16 --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-vpc-peering-connection --vpc-peering-connection-id $PCX_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - create TGW

```text
$TGW_ID = aws ec2 create-transit-gateway --description "fa-vpc training transit gateway" --tag-specifications "ResourceType=transit-gateway,Tags=[{Key=Name,Value=fa-vpc-tgw}]" --query TransitGateway.TransitGatewayId --output text --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - wait TGW

```text
do { Start-Sleep 10; $S = aws ec2 describe-transit-gateways --transit-gateway-ids $TGW_ID --query "TransitGateways[0].State" --output text --region eu-west-2 --profile fa-vpc-admin } until ($S -eq "available")
```

#### PowerShell - create attachments

```text
$CORE_TGW_ATTACH_ID = aws ec2 create-transit-gateway-vpc-attachment --transit-gateway-id $TGW_ID --vpc-id $CORE_VPC_ID --subnet-ids $PRIVATE_A_ID $PRIVATE_B_ID --tag-specifications "ResourceType=transit-gateway-attachment,Tags=[{Key=Name,Value=fa-vpc-tgw-core-attachment}]" --query TransitGatewayVpcAttachment.TransitGatewayAttachmentId --output text --region eu-west-2 --profile fa-vpc-admin
$PEER_TGW_ATTACH_ID = aws ec2 create-transit-gateway-vpc-attachment --transit-gateway-id $TGW_ID --vpc-id $PEER_VPC_ID --subnet-ids $PEER_A_ID $PEER_B_ID --tag-specifications "ResourceType=transit-gateway-attachment,Tags=[{Key=Name,Value=fa-vpc-tgw-peer-attachment}]" --query TransitGatewayVpcAttachment.TransitGatewayAttachmentId --output text --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - add TGW routes

```text
aws ec2 create-route --route-table-id $PRIVATE_A_RT_ID --destination-cidr-block 10.90.0.0/16 --transit-gateway-id $TGW_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 create-route --route-table-id $PRIVATE_B_RT_ID --destination-cidr-block 10.90.0.0/16 --transit-gateway-id $TGW_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 create-route --route-table-id $PEER_RT_ID --destination-cidr-block 10.80.0.0/16 --transit-gateway-id $TGW_ID --region eu-west-2 --profile fa-vpc-admin
```

### Expected results

- Peering path is removed.
- TGW and both attachments become Available.
- VPC RTs use TGW for remote VPC CIDRs.

### Verification checks

- [ ] **task-11-tgw-verify-01** — TGW route table propagates both CIDRs.
- [ ] **task-11-tgw-verify-02** — Isolated RTs remain outside the TGW path.

# Phase 5: Design PrivateLink and hybrid connectivity

Complete PrivateLink, VPN and Direct Connect plans without unnecessary billed infrastructure.

## task-12-privatelink — Complete the PrivateLink provider/consumer plan

- **Feature:** PrivateLink
- **Difficulty:** Medium
- **Goal:** Define service-level private access from fa-vpc-core to a service in fa-vpc-peer without routed whole-VPC connectivity.
- **Why it matters:** PrivateLink narrows connectivity to a service boundary instead of exchanging VPC CIDR routes.
- **Exam relevance:** Choose PrivateLink when consumers should reach a service, not the provider network.
- **Prerequisites:** task-11-tgw
- **Sources:** src-privatelink, src-pl-service, src-if-endpoint

### Console / browser route

1. Open privatelink-plan.json.
2. Review provider sequence: private targets -> internal NLB -> endpoint service -> allowed principals.
3. Review consumer sequence: interface endpoint in private subnets -> endpoint SG -> private DNS when appropriate.
4. Open VPC > Endpoint services > Create endpoint service and inspect the current NLB requirement.
5. Do not create the NLB or custom endpoint service in this lab.
6. Open VPC > Endpoints and inspect Other endpoint services for consumer connections.
7. Close the wizard without creating resources.
8. State the distinction: PrivateLink is service-level private access; peering/TGW are routed network connectivity.

### CLI route

#### PowerShell - inspect plan

```text
Get-Content .\privatelink-plan.json -Raw | ConvertFrom-Json | Format-List
```

### Complete editable files / policies

#### privatelink-plan.json

```json
{
  "pattern": "AWS PrivateLink endpoint service",
  "providerVpc": "fa-vpc-peer",
  "consumerVpc": "fa-vpc-core",
  "providerSequence": [
    "Deploy private service targets",
    "Create internal NLB fa-vpc-privatelink-nlb",
    "Create endpoint service fa-vpc-privatelink-service",
    "Allow only intended consumer principals",
    "Keep acceptance required when explicit approval is wanted"
  ],
  "consumerSequence": [
    "Create interface endpoint in fa-vpc-private-a and fa-vpc-private-b",
    "Attach fa-vpc-endpoint-sg",
    "Allow service port only from intended client SG",
    "Enable private DNS only after provider DNS requirements are satisfied"
  ],
  "examDecision": "Use PrivateLink for private access to one service without broad routed VPC-to-VPC connectivity.",
  "notCreatedInThisLab": [
    "Network Load Balancer",
    "Endpoint service",
    "Custom-service consumer endpoint"
  ]
}
```

### Expected results

- PrivateLink provider/consumer sequence is complete.
- No NLB/custom endpoint-service charge is created.

### Verification checks

- [ ] **task-12-privatelink-verify-01** — Learner can explain PrivateLink versus peering/TGW.

## task-13-vpn — Complete the Site-to-Site VPN architecture plan

- **Feature:** Site-to-Site VPN
- **Difficulty:** Medium
- **Goal:** Plan both VGW and TGW VPN patterns using two IPsec tunnels and BGP-capable routing.
- **Why it matters:** A software-only lab cannot establish a real tunnel without a customer gateway device.
- **Exam relevance:** VPN is the encrypted internet-based hybrid path; TGW is the scalable AWS routing hub option.
- **Prerequisites:** task-12-privatelink
- **Sources:** src-vpn, src-vpn-how, src-vpn-tunnels

### Console / browser route

1. Open hybrid-connectivity-plan.json.
2. Review on-premises CIDR 192.168.100.0/24, documentation-only public IP 198.51.100.10 and ASN 65010.
3. Review single-VPC path: customer gateway -> two tunnels -> VGW -> VPC routes.
4. Review multi-VPC path: customer gateway -> two tunnels -> TGW VPN attachment -> TGW/VPC routes.
5. Open VPC > Customer gateways and inspect IP/ASN fields.
6. Open Site-to-Site VPN connections and inspect target gateway choices.
7. Do not create a billed VPN connection because no real customer device exists.
8. Confirm AWS provides two tunnels and the customer device must use the downloaded configuration.

### CLI route

#### PowerShell - inspect VPN plan

```text
(Get-Content .\hybrid-connectivity-plan.json -Raw | ConvertFrom-Json).siteToSiteVpn | Format-List
```

### Complete editable files / policies

#### hybrid-connectivity-plan.json

```json
{
  "onPremises": {
    "networkCidr": "192.168.100.0/24",
    "documentationOnlyPublicIp": "198.51.100.10",
    "customerBgpAsn": 65010
  },
  "siteToSiteVpn": {
    "singleVpcPattern": "Customer gateway -> two IPsec tunnels -> virtual private gateway -> VPC route tables",
    "multiVpcPattern": "Customer gateway -> two IPsec tunnels -> Transit Gateway VPN attachment -> TGW route table -> VPC attachments",
    "routing": "Use BGP when dynamic routing is supported; configure both AWS tunnels on the customer gateway device.",
    "labDecision": "Architecture-only: no real customer gateway device and an idle VPN connection would incur charges."
  },
  "directConnect": {
    "smallVpcPattern": "Direct Connect connection -> private VIF -> Direct Connect gateway -> virtual private gateway -> VPC",
    "multiVpcPattern": "Direct Connect connection -> transit VIF -> Direct Connect gateway -> Transit Gateway -> VPC attachments",
    "routing": "BGP exchanges prefixes between customer router and AWS.",
    "resilience": "Use redundant connections/locations and consider Site-to-Site VPN backup.",
    "labDecision": "Architecture-only: requires physical/partner connectivity."
  }
}
```

### Expected results

- VPN plan contains VGW and TGW patterns.
- No billed VPN connection is created.

### Verification checks

- [ ] **task-13-vpn-verify-01** — Learner can explain customer gateway versus AWS-side gateway.
- [ ] **task-13-vpn-verify-02** — Plan contains two tunnels.

## task-14-dx — Complete the Direct Connect architecture plan

- **Feature:** AWS Direct Connect
- **Difficulty:** Medium
- **Goal:** Plan private-VIF/VGW and transit-VIF/TGW Direct Connect patterns.
- **Why it matters:** Direct Connect depends on physical/partner connectivity; architecture selection is the meaningful disposable-lab outcome.
- **Exam relevance:** Use private VIF for private VPC access and transit VIF with DX gateway/TGW for scalable multi-VPC connectivity.
- **Prerequisites:** task-13-vpn
- **Sources:** src-dx-vif, src-dx-gw

### Console / browser route

1. Open hybrid-connectivity-plan.json.
2. Review small-VPC path: connection -> private VIF -> DX gateway -> VGW -> VPC.
3. Review multi-VPC path: connection -> transit VIF -> DX gateway -> TGW -> VPC attachments.
4. Open Direct Connect console and inspect Connections and Virtual interfaces.
5. Do not order/create a connection.
6. Confirm BGP is used to exchange prefixes.
7. Record resilience: remove single connection/location dependencies and consider VPN backup.

### CLI route

#### PowerShell - inspect DX plan

```text
(Get-Content .\hybrid-connectivity-plan.json -Raw | ConvertFrom-Json).directConnect | Format-List
```

### Expected results

- Direct Connect plan distinguishes private VIF and transit VIF patterns.
- No physical/partner connection is ordered.

### Verification checks

- [ ] **task-14-dx-verify-01** — Learner can explain DX gateway and transit VIF roles.

# Phase 6: Enable Flow Logs and review exam decisions

Publish Flow Logs to S3 and consolidate SAA-C03 decisions.

## task-15-flow-logs — Enable VPC Flow Logs to the private S3 bucket

- **Feature:** VPC Flow Logs
- **Difficulty:** Hard
- **Goal:** Create an ALL-traffic VPC Flow Log targeting the private account-derived S3 bucket.
- **Why it matters:** Flow Logs provide IP-flow metadata for routing/SG/NACL troubleshooting.
- **Exam relevance:** ACCEPT/REJECT records are a common evidence source for network troubleshooting.
- **Prerequisites:** task-14-dx
- **Sources:** src-flow, src-flow-s3

### Console / browser route

1. Open VPC > Your VPCs > fa-vpc-core > Flow logs.
2. Choose Create flow log.
3. Name: fa-vpc-flow-log.
4. Filter: All.
5. Aggregation interval: 10 minutes.
6. Destination: S3.
7. Bucket ARN: arn:aws:s3:::fa-vpc-flow-<account-id>.
8. Create and wait for Active.
9. Open the S3 bucket and inspect its delivery prefix/policy.
10. Log files can take several minutes and require traffic; Active status is the required immediate success condition.

### CLI route

#### PowerShell - create Flow Log

```text
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-vpc-admin --query Account --output text
$FLOW_BUCKET = "fa-vpc-flow-$AWS_ACCOUNT_ID"
$FLOW_LOG_ID = aws ec2 create-flow-logs --resource-type VPC --resource-ids $CORE_VPC_ID --traffic-type ALL --log-destination-type s3 --log-destination "arn:aws:s3:::$FLOW_BUCKET" --max-aggregation-interval 600 --tag-specifications "ResourceType=vpc-flow-log,Tags=[{Key=Name,Value=fa-vpc-flow-log}]" --query FlowLogIds[0] --output text --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - inspect Flow Log

```text
aws ec2 describe-flow-logs --flow-log-ids $FLOW_LOG_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - inspect S3

```text
aws s3 ls "s3://$FLOW_BUCKET/" --recursive --region eu-west-2 --profile fa-vpc-admin
```

### Expected results

- Flow Log is Active and captures ALL traffic.
- Destination is the private training bucket.

### Verification checks

- [ ] **task-15-flow-logs-verify-01** — Flow Log references fa-vpc-core.
- [ ] **task-15-flow-logs-verify-02** — Learner can explain ACCEPT/REJECT metadata versus packet payload.

## task-16-exam-review — Review SAA-C03 VPC and hybrid-networking decisions

- **Feature:** Exam consolidation
- **Difficulty:** Easy
- **Goal:** Consolidate subnet routing, SG/NACL, endpoints, peering, TGW, PrivateLink, VPN, Direct Connect and Flow Logs.
- **Why it matters:** The exam is about selecting the correct connectivity boundary and routing model.
- **Exam relevance:** Each networking service solves a different scope: subnet, ENI, service, VPC mesh/hub or hybrid edge.
- **Prerequisites:** task-15-flow-logs
- **Sources:** src-routes, src-sg, src-nacl, src-nat, src-gw-endpoint, src-if-endpoint, src-peering-basics, src-tgw-how, src-privatelink, src-vpn, src-dx-gw, src-flow

### Console / browser route

1. Public subnet: route to IGW plus suitable resource addressing/security.
2. Private subnet: no direct inbound internet; this lab uses NAT for outbound IPv4.
3. Isolated subnet: no default internet/NAT route; explicit endpoints/private routes can still exist.
4. SG: stateful ENI allow rules.
5. NACL: stateless subnet allow/deny rules.
6. NAT gateway: private IPv4 egress, not transitive peering.
7. Gateway endpoint: route-table path for supported services such as S3/DynamoDB.
8. Interface endpoint: PrivateLink ENIs, SGs and private DNS.
9. Peering: direct one-to-one, non-transitive.
10. Transit Gateway: hub-and-spoke many-VPC/VPN routing.
11. PrivateLink: private access to a service without broad provider-VPC routing.
12. Site-to-Site VPN: two IPsec tunnels to a customer gateway device.
13. Direct Connect: physical/partner connectivity using private/transit VIFs and a DX gateway.
14. Flow Logs: network-flow metadata for ACCEPT/REJECT evidence.
15. Current AWS also offers Regional NAT gateways; this lab deliberately uses a zonal public NAT to keep classic subnet-route/AZ trade-offs visible.

### CLI route

#### PowerShell - route summary

```text
aws ec2 describe-route-tables --filters Name=vpc-id,Values=$CORE_VPC_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - endpoint summary

```text
aws ec2 describe-vpc-endpoints --filters Name=vpc-id,Values=$CORE_VPC_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - TGW attachments

```text
aws ec2 describe-transit-gateway-vpc-attachments --filters Name=transit-gateway-id,Values=$TGW_ID --region eu-west-2 --profile fa-vpc-admin
```

### Expected results

- Learner can distinguish subnet class from filtering controls.
- Learner can select the correct endpoint/inter-VPC/hybrid option from a requirement.

### Verification checks

- [ ] **task-16-exam-review-verify-01** — Core private RTs contain NAT default route plus TGW route to 10.90.0.0/16.
- [ ] **task-16-exam-review-verify-02** — Isolated RTs contain no default internet route.

# Phase 7: Reverse-dependency cleanup

Remove chargeable networking, VPC resources, credentials and local files safely.

## task-17-cloud-cleanup — Delete endpoints, TGW, NAT and VPC resources

- **Feature:** Cloud cleanup
- **Difficulty:** Hard
- **Goal:** Delete every active cloud resource in reverse dependency order before removing credentials.
- **Why it matters:** Network ENIs/attachments/routes block VPC deletion if removed out of order.
- **Exam relevance:** Safe teardown follows the same dependency graph as design.
- **Prerequisites:** task-16-exam-review
- **Sources:** src-flow-s3, src-if-endpoint, src-gw-endpoint, src-tgw-attach, src-nat-work, src-routes

### Warnings

- Use console or describe commands to rebuild exact fa-vpc IDs before any omitted repetitive route-table/subnet delete command; never broaden deletion to unrelated resources.

### Console / browser route

1. Delete fa-vpc-flow-log.
2. Delete fa-vpc-ssm-interface-endpoint and wait for endpoint ENIs to disappear.
3. Delete fa-vpc-s3-gateway-endpoint.
4. Delete TGW routes from both core private RTs and fa-vpc-peer-rt.
5. Delete both TGW VPC attachments and wait for deletion.
6. Delete fa-vpc-tgw.
7. Disassociate and delete fa-vpc-peer-rt; delete peer-a, peer-b and fa-vpc-peer.
8. Delete fa-vpc-nat-a, wait for Deleted, then release fa-vpc-nat-eip.
9. Delete fa-vpc-endpoint-sg then fa-vpc-client-sg.
10. Move both isolated subnets back to the default NACL, then delete fa-vpc-isolated-nacl.
11. Disassociate/delete all five custom core route tables.
12. Detach/delete fa-vpc-igw.
13. Delete all six core subnets, then fa-vpc-core.
14. Empty/delete fa-vpc-flow-<account-id>.
15. Verify no NAT, interface endpoint or TGW remains.

### CLI route

#### PowerShell - delete Flow/endpoints

```text
aws ec2 delete-flow-logs --flow-log-ids $FLOW_LOG_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-vpc-endpoints --vpc-endpoint-ids $SSM_ENDPOINT_ID $S3_ENDPOINT_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - remove TGW routes

```text
aws ec2 delete-route --route-table-id $PRIVATE_A_RT_ID --destination-cidr-block 10.90.0.0/16 --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-route --route-table-id $PRIVATE_B_RT_ID --destination-cidr-block 10.90.0.0/16 --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-route --route-table-id $PEER_RT_ID --destination-cidr-block 10.80.0.0/16 --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - delete TGW attachments/TGW

```text
aws ec2 delete-transit-gateway-vpc-attachment --transit-gateway-attachment-id $CORE_TGW_ATTACH_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-transit-gateway-vpc-attachment --transit-gateway-attachment-id $PEER_TGW_ATTACH_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - delete NAT/EIP

```text
aws ec2 delete-nat-gateway --nat-gateway-id $NAT_ID --region eu-west-2 --profile fa-vpc-admin
do { Start-Sleep 10; $N = aws ec2 describe-nat-gateways --nat-gateway-ids $NAT_ID --query "NatGateways[0].State" --output text --region eu-west-2 --profile fa-vpc-admin } until ($N -eq "deleted")
aws ec2 release-address --allocation-id $EIP_ALLOC_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - empty/delete Flow bucket

```text
aws s3 rm "s3://$FLOW_BUCKET" --recursive --region eu-west-2 --profile fa-vpc-admin
aws s3api delete-bucket --bucket $FLOW_BUCKET --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - wait for endpoint deletion

```text
do { Start-Sleep 10; $E = aws ec2 describe-vpc-endpoints --vpc-endpoint-ids $SSM_ENDPOINT_ID --query "VpcEndpoints[0].State" --output text --region eu-west-2 --profile fa-vpc-admin 2>$null } until (-not $E -or $E -eq "deleted")
```

#### PowerShell - wait/delete TGW

```text
do { Start-Sleep 10; $LEFT = aws ec2 describe-transit-gateway-vpc-attachments --filters Name=transit-gateway-id,Values=$TGW_ID --query "TransitGatewayVpcAttachments[?State!='deleted']" --output json --region eu-west-2 --profile fa-vpc-admin } until ($LEFT -eq "[]")
aws ec2 delete-transit-gateway --transit-gateway-id $TGW_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - rebuild peer RT associations

```text
$PEER_ASSOCS = aws ec2 describe-route-tables --route-table-ids $PEER_RT_ID --query "RouteTables[0].Associations[?Main==`false`].RouteTableAssociationId" --output text --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - disassociate peer RT

```text
foreach ($ID in ($PEER_ASSOCS -split "\s+")) { if ($ID) { aws ec2 disassociate-route-table --association-id $ID --region eu-west-2 --profile fa-vpc-admin } }
```

#### PowerShell - delete peer RT/subnets/VPC

```text
aws ec2 delete-route-table --route-table-id $PEER_RT_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-subnet --subnet-id $PEER_A_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-subnet --subnet-id $PEER_B_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-vpc --vpc-id $PEER_VPC_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - delete SGs

```text
aws ec2 delete-security-group --group-id $ENDPOINT_SG_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-security-group --group-id $CLIENT_SG_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - restore isolated A default NACL

```text
$DEFAULT_NACL_ID = aws ec2 describe-network-acls --filters Name=vpc-id,Values=$CORE_VPC_ID Name=default,Values=true --query "NetworkAcls[0].NetworkAclId" --output text --region eu-west-2 --profile fa-vpc-admin
$ISO_A_ASSOC = aws ec2 describe-network-acls --network-acl-ids $NACL_ID --query "NetworkAcls[0].Associations[?SubnetId=='$ISOLATED_A_ID'].NetworkAclAssociationId | [0]" --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 replace-network-acl-association --association-id $ISO_A_ASSOC --network-acl-id $DEFAULT_NACL_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - restore isolated B default NACL

```text
$ISO_B_ASSOC = aws ec2 describe-network-acls --network-acl-ids $NACL_ID --query "NetworkAcls[0].Associations[?SubnetId=='$ISOLATED_B_ID'].NetworkAclAssociationId | [0]" --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 replace-network-acl-association --association-id $ISO_B_ASSOC --network-acl-id $DEFAULT_NACL_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-network-acl --network-acl-id $NACL_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - disassociate/delete public RT

```text
$IDS = aws ec2 describe-route-tables --route-table-ids $PUBLIC_RT_ID --query "RouteTables[0].Associations[?Main==`false`].RouteTableAssociationId" --output text --region eu-west-2 --profile fa-vpc-admin
foreach ($ID in ($IDS -split "\s+")) { if ($ID) { aws ec2 disassociate-route-table --association-id $ID --region eu-west-2 --profile fa-vpc-admin } }
aws ec2 delete-route-table --route-table-id $PUBLIC_RT_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - disassociate/delete private A RT

```text
$ID = aws ec2 describe-route-tables --route-table-ids $PRIVATE_A_RT_ID --query "RouteTables[0].Associations[?Main==`false`].RouteTableAssociationId | [0]" --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 disassociate-route-table --association-id $ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-route-table --route-table-id $PRIVATE_A_RT_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - disassociate/delete private B RT

```text
$ID = aws ec2 describe-route-tables --route-table-ids $PRIVATE_B_RT_ID --query "RouteTables[0].Associations[?Main==`false`].RouteTableAssociationId | [0]" --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 disassociate-route-table --association-id $ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-route-table --route-table-id $PRIVATE_B_RT_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - disassociate/delete isolated A RT

```text
$ID = aws ec2 describe-route-tables --route-table-ids $ISOLATED_A_RT_ID --query "RouteTables[0].Associations[?Main==`false`].RouteTableAssociationId | [0]" --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 disassociate-route-table --association-id $ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-route-table --route-table-id $ISOLATED_A_RT_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - disassociate/delete isolated B RT

```text
$ID = aws ec2 describe-route-tables --route-table-ids $ISOLATED_B_RT_ID --query "RouteTables[0].Associations[?Main==`false`].RouteTableAssociationId | [0]" --output text --region eu-west-2 --profile fa-vpc-admin
aws ec2 disassociate-route-table --association-id $ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-route-table --route-table-id $ISOLATED_B_RT_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - detach/delete IGW

```text
aws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $CORE_VPC_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - delete six core subnets

```text
aws ec2 delete-subnet --subnet-id $PUBLIC_A_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-subnet --subnet-id $PUBLIC_B_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-subnet --subnet-id $PRIVATE_A_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-subnet --subnet-id $PRIVATE_B_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-subnet --subnet-id $ISOLATED_A_ID --region eu-west-2 --profile fa-vpc-admin
aws ec2 delete-subnet --subnet-id $ISOLATED_B_ID --region eu-west-2 --profile fa-vpc-admin
```

#### PowerShell - delete core VPC

```text
aws ec2 delete-vpc --vpc-id $CORE_VPC_ID --region eu-west-2 --profile fa-vpc-admin
```

### Expected results

- No Flow Log, VPC endpoint, TGW attachment/TGW, NAT gateway or EIP remains.
- Both VPCs and all subnets/routes/security resources are deleted.
- Flow bucket is deleted.

### Verification checks

- [ ] **task-17-cloud-cleanup-verify-01** — No chargeable fa-vpc networking resource remains.
- [ ] **task-17-cloud-cleanup-verify-02** — Cloud cleanup finishes before IAM cleanup.

## task-18-identity-cleanup — Delete the temporary IAM identity and local files

- **Feature:** Identity and local cleanup
- **Difficulty:** Medium
- **Goal:** Remove fa-vpc-admin credentials/policy/profile and local architecture files last.
- **Why it matters:** The training identity must stay functional until cloud absence is verified.
- **Exam relevance:** Credentials/local files are the final reverse-dependency layer.
- **Prerequisites:** task-17-cloud-cleanup
- **Sources:** src-vpc-create

### Console / browser route

1. Confirm Task 17 has removed every fa-vpc cloud resource.
2. Sign in as root only now.
3. Delete fa-vpc-admin's access key.
4. Detach and delete fa-vpc-admin-policy.
5. Delete fa-vpc-admin and sign out of root.
6. Remove only the fa-vpc-admin AWS CLI profile.
7. Delete C:\aws-labs\fa-vpc last.
8. Affirm the programme cleanup acknowledgement.

### CLI route

#### PowerShell - clear profile

```text
aws configure set aws_access_key_id "" --profile fa-vpc-admin
aws configure set aws_secret_access_key "" --profile fa-vpc-admin
aws configure set region "" --profile fa-vpc-admin
```

#### PowerShell - delete local folder

```text
Set-Location C:\
Remove-Item "C:\aws-labs\fa-vpc" -Recurse -Force
```

### Expected results

- Temporary IAM user/access key/policy/profile are removed.
- Local folder is deleted last.

### Verification checks

- [ ] **task-18-identity-cleanup-verify-01** — Unrelated identities/profiles are unchanged.
- [ ] **task-18-identity-cleanup-verify-02** — No fa-vpc local file remains.

# Troubleshooting

## trouble-01 — Private subnet has no NAT default route

- **Likely cause:** NAT not Available or route added to wrong table.
- **Fix:** Verify fa-vpc-nat-a is Available and 0.0.0.0/0 exists in both private route tables.

## trouble-02 — Isolated subnet unexpectedly has internet route

- **Likely cause:** Wrong RT association or default route was added.
- **Fix:** Verify isolated subnet associations and remove any 0.0.0.0/0 from isolated route tables.

## trouble-03 — SSM interface endpoint remains Pending

- **Likely cause:** Endpoint ENI/DNS/security configuration is invalid or still provisioning.
- **Fix:** Confirm DNS hostnames are enabled, both isolated subnet IDs are correct, and endpoint SG belongs to fa-vpc-core.

## trouble-04 — S3 gateway endpoint route missing

- **Likely cause:** Route table was not associated with endpoint.
- **Fix:** Use the endpoint Route tables tab or modify-vpc-endpoint to add the exact private/isolated RT IDs.

## trouble-05 — Peering stays Pending Acceptance

- **Likely cause:** Same-account request was not accepted.
- **Fix:** Accept fa-vpc-peering and wait for Active before routing.

## trouble-06 — TGW attachment is Available but VPC path is incomplete

- **Likely cause:** VPC route to TGW is missing even if TGW propagation exists.
- **Fix:** Check both VPC route tables and the TGW default route table propagation.

## trouble-07 — Security group cannot be deleted

- **Likely cause:** Interface endpoint ENI still uses fa-vpc-endpoint-sg.
- **Fix:** Delete the interface endpoint and wait for ENI removal before deleting SG.

## trouble-08 — VPC cannot be deleted

- **Likely cause:** Endpoint, NAT, TGW attachment, subnet, custom RT or IGW remains.
- **Fix:** Follow reverse-dependency cleanup; do not broaden deletion.

## trouble-09 — Flow Log bucket has no files yet

- **Likely cause:** Delivery is asynchronous or little traffic occurred.
- **Fix:** Verify Flow Log status Active and correct S3 destination; wait several minutes.

# Ordered manual cleanup

- **Manual only:** `true`
- **Ordering:** `reverse_dependency`
- **Completion gate:** `acknowledgement`

## Cleanup 1: fa-vpc-flow-log

- **Action:** Delete Flow Log.
- **Verification:** No fa-vpc Flow Log remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 2: fa-vpc-ssm-interface-endpoint

- **Action:** Delete interface endpoint and wait for ENIs.
- **Verification:** Endpoint/ENIs absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 3: fa-vpc-s3-gateway-endpoint

- **Action:** Delete gateway endpoint.
- **Verification:** S3 prefix-list routes disappear.
- **Task:** task-17-cloud-cleanup

## Cleanup 4: TGW VPC routes

- **Action:** Delete core/peer routes targeting fa-vpc-tgw.
- **Verification:** No VPC RT references TGW.
- **Task:** task-17-cloud-cleanup

## Cleanup 5: fa-vpc-tgw-core-attachment and fa-vpc-tgw-peer-attachment

- **Action:** Delete attachments and wait.
- **Verification:** No TGW VPC attachment remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 6: fa-vpc-tgw

- **Action:** Delete TGW.
- **Verification:** TGW absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 7: fa-vpc-peer resources

- **Action:** Delete peer RT associations/RT, peer subnets and peer VPC.
- **Verification:** No fa-vpc-peer resource remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 8: fa-vpc-nat-a and fa-vpc-nat-eip

- **Action:** Delete NAT, wait, then release EIP.
- **Verification:** No NAT/EIP remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 9: fa-vpc-endpoint-sg and fa-vpc-client-sg

- **Action:** Delete both SGs after endpoint is gone.
- **Verification:** Neither SG remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 10: fa-vpc-isolated-nacl

- **Action:** Restore default NACL associations, then delete custom NACL.
- **Verification:** Custom NACL absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 11: Five custom core route tables

- **Action:** Remove explicit associations and delete RTs.
- **Verification:** Only main RT remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 12: fa-vpc-igw

- **Action:** Detach and delete IGW.
- **Verification:** IGW absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 13: Six core subnets and fa-vpc-core

- **Action:** Delete subnets, then VPC.
- **Verification:** No core VPC resource remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 14: fa-vpc-flow-<account-id>

- **Action:** Empty and delete S3 bucket.
- **Verification:** Bucket absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 15: fa-vpc-admin access key/policy/user

- **Action:** Use root only after cloud verification to remove identity.
- **Verification:** Identity absent.
- **Task:** task-18-identity-cleanup

## Cleanup 16: AWS CLI profile fa-vpc-admin

- **Action:** Remove only training profile.
- **Verification:** Unrelated profiles unchanged.
- **Task:** task-18-identity-cleanup

## Cleanup 17: C:\aws-labs\fa-vpc

- **Action:** Delete exact local folder last.
- **Verification:** Folder absent.
- **Task:** task-18-identity-cleanup

## Programme cleanup acknowledgement

I verified that fa-vpc-flow-log, fa-vpc-ssm-interface-endpoint and fa-vpc-s3-gateway-endpoint are deleted; all routes to fa-vpc-tgw, both Transit Gateway VPC attachments and fa-vpc-tgw are deleted; the earlier fa-vpc-peering connection was removed before Transit Gateway routing was introduced; fa-vpc-peer and its route table/subnets are deleted; fa-vpc-nat-a and fa-vpc-nat-eip are deleted; fa-vpc-endpoint-sg, fa-vpc-client-sg and fa-vpc-isolated-nacl are deleted; all five custom core route tables, fa-vpc-igw, all six core subnets and fa-vpc-core are deleted; the fa-vpc-flow-<account-id> bucket is empty and deleted; no custom PrivateLink service, Site-to-Site VPN connection or Direct Connect connection was created; the temporary fa-vpc-admin access key, fa-vpc-admin-policy, IAM user and CLI profile are removed; unrelated resources and profiles are unchanged; and only then was C:\aws-labs\fa-vpc deleted.

# Official sources

## src-vpc-create — Create a VPC

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html
- **Purpose:** VPC/subnet creation.
- **Used by:** task-01-prerequisites, task-02-bootstrap-user, task-04-core-vpc, task-18-identity-cleanup

## src-routes — Configure route tables

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html
- **Purpose:** Route destinations and targets.
- **Used by:** task-01-prerequisites, task-03-cli-design, task-05-route-tables, task-08-s3-endpoint, task-16-exam-review, task-17-cloud-cleanup

## src-igw — Connect your VPC to the internet using an internet gateway

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html
- **Purpose:** Internet-gateway routing.
- **Used by:** task-05-route-tables

## src-nat — NAT gateway basics

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html
- **Purpose:** NAT gateway behavior.
- **Used by:** task-06-nat, task-16-exam-review

## src-nat-work — Work with NAT gateways

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-working-with.html
- **Purpose:** NAT creation/deletion.
- **Used by:** task-02-bootstrap-user, task-06-nat, task-17-cloud-cleanup

## src-sg — Control traffic to your AWS resources using security groups

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html
- **Purpose:** Stateful security groups.
- **Used by:** task-07-security, task-09-interface-endpoint, task-16-exam-review

## src-nacl — Control subnet traffic with network access control lists

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html
- **Purpose:** Stateless subnet filtering.
- **Used by:** task-07-security, task-16-exam-review

## src-gw-endpoint — Gateway endpoints

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html
- **Purpose:** Gateway endpoint routing.
- **Used by:** task-08-s3-endpoint, task-16-exam-review, task-17-cloud-cleanup

## src-s3-endpoint — Gateway endpoints for Amazon S3

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html
- **Purpose:** S3 endpoint route tables.
- **Used by:** task-08-s3-endpoint

## src-if-endpoint — Access an AWS service using an interface VPC endpoint

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html
- **Purpose:** Interface endpoint ENIs/SGs.
- **Used by:** task-02-bootstrap-user, task-09-interface-endpoint, task-12-privatelink, task-16-exam-review, task-17-cloud-cleanup

## src-peering — Create a VPC peering connection

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/peering/create-vpc-peering-connection.html
- **Purpose:** Peering creation.
- **Used by:** task-02-bootstrap-user, task-10-peering

## src-peering-routes — Update your route tables for a VPC peering connection

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-routing.html
- **Purpose:** Peering routes.
- **Used by:** task-10-peering

## src-peering-basics — How VPC peering connections work

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html
- **Purpose:** Peering non-transitivity.
- **Used by:** task-10-peering, task-11-tgw, task-16-exam-review

## src-tgw — Create a transit gateway in AWS Transit Gateway

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/tgw/create-tgw.html
- **Purpose:** Transit Gateway creation.
- **Used by:** task-02-bootstrap-user, task-11-tgw

## src-tgw-attach — Create a VPC attachment in AWS Transit Gateway

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/tgw/create-vpc-attachment.html
- **Purpose:** VPC attachments.
- **Used by:** task-11-tgw, task-17-cloud-cleanup

## src-tgw-how — How AWS Transit Gateway works

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html
- **Purpose:** VPC routes to TGW.
- **Used by:** task-11-tgw, task-16-exam-review

## src-tgw-routes — Transit gateway route tables in AWS Transit Gateway

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/tgw/tgw-route-tables.html
- **Purpose:** TGW association/propagation.
- **Used by:** task-11-tgw

## src-privatelink — What is AWS PrivateLink?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html
- **Purpose:** Private service access.
- **Used by:** task-03-cli-design, task-12-privatelink, task-16-exam-review

## src-pl-service — Create a service powered by AWS PrivateLink

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/privatelink/create-endpoint-service.html
- **Purpose:** Endpoint service with NLB.
- **Used by:** task-12-privatelink

## src-vpn — What is AWS Site-to-Site VPN?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html
- **Purpose:** Customer/VGW concepts.
- **Used by:** task-03-cli-design, task-13-vpn, task-16-exam-review

## src-vpn-how — How AWS Site-to-Site VPN works

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpn/latest/s2svpn/how_it_works.html
- **Purpose:** VPN routing/device responsibilities.
- **Used by:** task-13-vpn

## src-vpn-tunnels — Tunnel options for your AWS Site-to-Site VPN connection

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpn/latest/s2svpn/VPNTunnels.html
- **Purpose:** Two tunnels.
- **Used by:** task-13-vpn

## src-dx-vif — Direct Connect virtual interfaces and hosted virtual interfaces

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html
- **Purpose:** Private/transit VIFs.
- **Used by:** task-14-dx

## src-dx-gw — Direct Connect gateways

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-gateways.html
- **Purpose:** DX gateway to VGW/TGW.
- **Used by:** task-03-cli-design, task-14-dx, task-16-exam-review

## src-flow — Logging IP traffic using VPC Flow Logs

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html
- **Purpose:** Flow log destinations.
- **Used by:** task-15-flow-logs, task-16-exam-review

## src-flow-s3 — Create a flow log that publishes to Amazon S3

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/en_en/vpc/latest/userguide/flow-logs-s3-create-flow-log.html
- **Purpose:** S3 flow log.
- **Used by:** task-02-bootstrap-user, task-15-flow-logs, task-17-cloud-cleanup

# Quality report

- **Phase count:** 7
- **Task count:** 18
- **Checkbox count:** 197
- **CLI command count:** 65
- **Editable-block count:** 7
- **Verification count:** 34
- **Cleanup-item count:** 17
- **Official-source count:** 26
- **Missing items:** 0
- **Uncertain items:** 0

# Offline conversion boundary

This preview and JSON manuscript are offline educational authoring artifacts only. They have not been locally validated by Study Tracker, imported, accepted, approved, published or fingerprinted.
