import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-12",
  "title": "Global Accelerator Traffic Dials",
  "plainEnglish": "A traffic dial is an endpoint-group percentage that limits how much of the traffic already selected for that Region the group accepts. The remaining new traffic is sent to eligible endpoint groups in other Regions.",
  "whyItMatters": "Operations teams can reduce or stop new Regional traffic for maintenance, staged releases, performance tests, and active-passive disaster-recovery designs without changing client addresses.",
  "workplaceExample": "Before upgrading the Singapore stack, engineers set its traffic dial to zero, wait for existing sessions according to application policy, perform the change, and gradually dial new traffic back up.",
  "examFocus": "Traffic dials act at endpoint-group or Region level, not endpoint level. The percentage is not a promised share of all global traffic, changes affect new connections, and health checks continue regardless of dial value.",
  "keyPoints": [
    "Every standard endpoint group has a traffic dial.",
    "The default traffic dial is 100 percent.",
    "The percentage applies only to traffic already directed to that endpoint group.",
    "Lowering a dial shifts eligible new traffic to other Regional groups.",
    "Existing connections are not terminated when the dial changes.",
    "Health checks continue even when an endpoint group's traffic dial is zero."
  ],
  "commonMistake": "Setting two Regions to 50 percent does not guarantee an even global split because proximity first influences which endpoint group traffic would have used.",
  "example": "Set a secondary Region's dial to 10 for a controlled release, monitor new-connection and application metrics, then raise it in stages while leaving endpoint weights to handle distribution inside each Region.",
  "sources": [
    {
      "title": "Use traffic dials to adjust traffic flow to Regions",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoint-groups-traffic-dial.html"
    }
  ]
});
