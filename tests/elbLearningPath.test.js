import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ELB_FOLLOW_ALONG_CONFIG } from '../src/data/elbLearningPathData.js';
import { validateFollowAlongConfig } from '../src/components/FollowAlongs/shared/followAlongContract.js';

test('elb uses the approved canonical Follow Along contract', () => {
  const canonicalIds = new Set([
  "task-saa-elb-create-an-alb-in-front-of-an-auto-scaling-group-001",
  "task-saa-elb-create-a-network-load-balancer-002",
  "task-saa-elb-create-a-gateway-load-balancer-style-architecture-003",
  "task-saa-elb-configure-alb-path-based-listener-rules-004",
  "task-saa-elb-add-https-to-an-alb-and-redirect-http-008",
  "task-saa-elb-sticky-sessions-on-an-alb-target-group-009",
  "task-saa-elb-cross-zone-load-balancing-traffic-distribution-010",
  "task-saa-elb-deregistration-delay-and-connection-draining-011",
  "task-saa-elb-alb-websockets-017",
  "task-saa-elb-compare-internal-and-internet-facing-load-balancers-018",
  "task-saa-elb-enable-alb-access-logs-019",
  "task-saa-elb-test-alb-deletion-protection-020",
  "task-saa-elb-integrate-ec2-with-alb-and-nlb-026"
]);
  assert.deepEqual(ELB_FOLLOW_ALONG_CONFIG.tasks.filter(task => canonicalIds.has(task.id)).map(task => task.id), [
  "task-saa-elb-create-an-alb-in-front-of-an-auto-scaling-group-001",
  "task-saa-elb-create-a-network-load-balancer-002",
  "task-saa-elb-create-a-gateway-load-balancer-style-architecture-003",
  "task-saa-elb-configure-alb-path-based-listener-rules-004",
  "task-saa-elb-add-https-to-an-alb-and-redirect-http-008",
  "task-saa-elb-sticky-sessions-on-an-alb-target-group-009",
  "task-saa-elb-cross-zone-load-balancing-traffic-distribution-010",
  "task-saa-elb-deregistration-delay-and-connection-draining-011",
  "task-saa-elb-alb-websockets-017",
  "task-saa-elb-compare-internal-and-internet-facing-load-balancers-018",
  "task-saa-elb-enable-alb-access-logs-019",
  "task-saa-elb-test-alb-deletion-protection-020",
  "task-saa-elb-integrate-ec2-with-alb-and-nlb-026"
]);
  assert.deepEqual(validateFollowAlongConfig(ELB_FOLLOW_ALONG_CONFIG), { valid: true, errors: [], warnings: [] });
});
