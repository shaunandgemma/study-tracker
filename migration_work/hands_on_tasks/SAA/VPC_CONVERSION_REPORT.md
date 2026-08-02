# SAA / VPC Hands-On Tasks Batch Conversion Report

Generated: 2026-08-01T18:10:08.021Z

## Executive Summary

* **Total VPC Source Records**: 36
* **Eligible Records**: 36 (all marked `needs-minor-source-cleanup`)
* **Converted & Approved**: 34
* **Integrated into Application**: 34 (in `src/data/tasks/vpcTasks.js`)
* **Duplicates Excluded**: 0
* **Review Required / Flagged**: 2
* **Recommended for Another Topic**: 2
* **Console-only Tasks**: 0
* **CLI-only Tasks**: 0
* **Both Console & CLI Modes**: 36
* **Tasks with Linked Flashcards**: 36

---

## Technical & Security Corrections Applied

1. **Step 1 Login Instruction Sanitization**: Sanitized Step 1 instructions across all tasks to specify IAM user or lab role with VPC permissions instead of root user / broad AdministratorAccess.
2. **NAT Gateway & Elastic IP Cost Warnings**: Added explicit cost warnings regarding hourly NAT Gateway charges (~$0.045/hr), data processing fees, and idle Elastic IP charges.
3. **NAT Gateway & Elastic IP Teardown**: Ensured explicit teardown steps exist in the cleanup section for NAT Gateways and Elastic IPs.
4. **SSH / RDP Security Warning**: Added security warnings for any task involving SSH (port 22) or RDP (port 3389) rules, recommending restricted source IP ranges (/32) or Systems Manager Session Manager.
5. **Destructive Commands Warning**: Flagged destructive commands (`delete-vpc`, `delete-subnet`, `delete-route-table`, `delete-nat-gateway`, `delete-internet-gateway`, `delete-vpc-peering-connection`, etc.).
6. **Obsolete Exam Tips Filtered**: Filtered out SOA-C02 and DVA-C02 specific exam tips; retained SAA-C03 exam tips.
7. **HTML Sanitization**: Converted all HTML tags and decoded HTML entities into plain text.

---

## Task Conversion Audit Table

| Source ID | Task ID | Title | Difficulty (Inferred) | Duration (Inferred) | Modes | Flashcards | Status |
|---|---|---|---|---|---|---|---|
| 1 | `task-saa-vpc-design-a-vpc-cidr-plan-001` | Design a VPC CIDR plan | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 2 | `task-saa-vpc-create-a-2-az-vpc-002` | Create a 2-AZ VPC | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 3 | `task-saa-vpc-attach-an-internet-gateway-003` | Attach an Internet Gateway | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 4 | `task-saa-vpc-configure-a-nat-gateway-004` | Configure a NAT Gateway | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 5 | `task-saa-vpc-create-a-nat-instance-alternative-005` | Create a NAT Instance alternative | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 6 | `task-saa-vpc-configure-route-tables-for-igw-and-nat-006` | Configure route tables for IGW and NAT | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 7 | `task-saa-vpc-create-security-groups-for-bastion-ssh-and-app-ports-007` | Create security groups for bastion SSH and app ports | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 8 | `task-saa-vpc-implement-a-network-acl-rule-to-block-an-ip-range-008` | Implement a network ACL rule to block an IP range | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 9 | `task-saa-vpc-configure-vpc-flow-logs-for-an-eni-009` | Configure VPC Flow Logs for an ENI | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 10 | `task-saa-vpc-set-up-vpc-peering-and-verify-private-connectivity-010` | Set up VPC peering and verify private connectivity | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 11 | `task-saa-vpc-add-peering-routes-and-prove-no-transitive-routing-011` | Add peering routes and prove no transitive routing | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 12 | `task-saa-vpc-configure-aws-transit-gateway-with-multiple-vpcs-012` | Configure AWS Transit Gateway with multiple VPCs | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 13 | `task-saa-vpc-create-an-s3-gateway-vpc-endpoint-013` | Create an S3 Gateway VPC Endpoint | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 14 | `task-saa-vpc-create-an-interface-vpc-endpoint-for-secrets-manager-014` | Create an Interface VPC Endpoint for Secrets Manager | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 15 | `task-saa-vpc-restrict-access-with-a-vpc-endpoint-policy-015` | Restrict access with a VPC endpoint policy | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 16 | `task-saa-vpc-configure-vpc-dns-options-and-test-private-dns-for-endpoints-016` | Configure VPC DNS options and test private DNS for endpoints | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 17 | `task-saa-vpc-set-up-aws-site-to-site-vpn-and-verify-routes-017` | Set up AWS Site-to-Site VPN and verify routes | Medium | 30 mins | Console + CLI | Yes | Review Required (topic-migration) |
| 18 | `task-saa-vpc-configure-customer-gateway-and-virtual-private-gateway-018` | Configure Customer Gateway and Virtual Private Gateway | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 19 | `task-saa-vpc-create-a-direct-connect-private-vif-and-test-vpc-routing-019` | Create a Direct Connect private VIF and test VPC routing | Easy | 20 mins | Console + CLI | Yes | Review Required (topic-migration) |
| 20 | `task-saa-vpc-configure-vpc-sharing-with-aws-ram-020` | Configure VPC sharing with AWS RAM | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 21 | `task-saa-vpc-implement-an-asymmetric-routing-scenario-021` | Implement an asymmetric routing scenario | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 22 | `task-saa-vpc-configure-elastic-ips-and-test-eni-association-022` | Configure Elastic IPs and test ENI association | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 23 | `task-saa-vpc-create-multiple-enis-and-bind-services-023` | Create multiple ENIs and bind services | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 24 | `task-saa-vpc-implement-vpc-multi-region-design-patterns-024` | Implement VPC multi-region design patterns | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 25 | `task-saa-vpc-create-a-dynamodb-gateway-endpoint-with-policy-restrictions-025` | Create a DynamoDB gateway endpoint with policy restrictions | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 26 | `task-saa-vpc-enable-ipv6-in-a-vpc-and-test-ipv6-routing-026` | Enable IPv6 in a VPC and test IPv6 routing | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 27 | `task-saa-vpc-configure-dhcp-options-set-for-custom-dns-and-domain-resolution-027` | Configure DHCP options set for custom DNS and domain resolution | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 28 | `task-saa-vpc-set-up-aws-network-firewall-and-block-outbound-traffic-028` | Set up AWS Network Firewall and block outbound traffic | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 29 | `task-saa-vpc-compare-security-groups-and-nacls-using-ephemeral-return-traffic-029` | Compare Security Groups and NACLs using ephemeral return traffic | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 30 | `task-saa-vpc-use-aws-privatelink-to-expose-a-service-privately-between-accounts-030` | Use AWS PrivateLink to expose a service privately between accounts | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 31 | `task-saa-vpc-configure-endpoint-services-and-consumer-endpoints-031` | Configure endpoint services and consumer endpoints | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 32 | `task-saa-vpc-troubleshoot-connectivity-with-reachability-analyzer-and-traceroute-032` | Troubleshoot connectivity with Reachability Analyzer and traceroute | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 33 | `task-saa-vpc-plan-high-availability-for-nats-and-transit-gateway-attachments-033` | Plan high availability for NATs and Transit Gateway attachments | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 34 | `task-saa-vpc-create-least-privilege-iam-for-vpc-endpoint-management-034` | Create least privilege IAM for VPC endpoint management | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 35 | `task-saa-vpc-compare-vpc-sharing-vpc-peering-and-privatelink-035` | Compare VPC sharing, VPC peering, and PrivateLink | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 36 | `task-saa-vpc-review-and-implement-vpc-security-best-practices-036` | Review and implement VPC security best practices | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |

---

## Review Required Output Details

- **Task 17 (Set up AWS Site-to-Site VPN and verify routes)**: Primary objective belongs to topic 'topic-migration' rather than 'topic-vpc'
- **Task 19 (Create a Direct Connect private VIF and test VPC routing)**: Primary objective belongs to topic 'topic-migration' rather than 'topic-vpc'
