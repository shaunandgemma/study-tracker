import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'inspector-7',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'Common Vulnerabilities and Exposures - CVEs',
  status: 'ready',
  plainEnglish: 'A Common Vulnerabilities and Exposures identifier is a shared name for a publicly known security vulnerability. Inspector correlates supported resource package inventory with vulnerability and vendor advisory data and can create a package finding when the installed software is affected. The CVE identifies the issue; it does not say that a particular resource was exploited.',
  whyItMatters: 'A consistent identifier lets developers, vendors, scanners, and incident teams discuss the same weakness. Inspector adds the resource, package, version, fix, severity, and environment context needed to turn that public identifier into an organization-specific action.',
  workplaceExample: 'A vendor advisory updates the status of a CVE affecting a library used by several services. Inspector associates the issue with particular EC2 instances and ECR image digests, allowing owners to update the precise affected artifacts instead of treating every system as compromised.',
  examFocus: 'CVE is an identifier, CVSS is a scoring framework, and the Inspector score is contextual prioritization for supported EC2 package findings. Do not equate CVE presence with active exploitation. Review vendor severity, exploit intelligence, network context, affected versions, and available fixes together.',
  keyPoints: [
    'A CVE provides a standardized identifier for a publicly known vulnerability.',
    'Inspector matches vulnerability intelligence to supported package inventory on eligible resources.',
    'One CVE can affect multiple packages, versions, images, functions, or instances.',
    'The presence of a CVE does not prove that exploitation occurred in the environment.',
    'CVSS scores describe vulnerability characteristics and are not identical to the Amazon Inspector score.',
    'Vendor advisories and fixed-version information help determine the correct remediation.'
  ],
  commonMistake: 'Responding to every CVE identifier as an incident wastes investigation effort and still may not fix the package. First confirm the affected resource and installed version, prioritize with context, deploy the vendor-supported correction, and use threat telemetry separately when checking for exploitation.',
  example: 'Choose a package finding and trace its CVE reference, advisory source, affected package, installed version, fixed version, CVSS information, and Inspector context. Record why the resource is prioritized, then update it and confirm the finding closes after reevaluation.',
  sources: [
    { title: 'Amazon Inspector finding types', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-types.html' },
    { title: 'Viewing details for Amazon Inspector findings', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-understanding-details.html' },
    { title: 'Viewing the Amazon Inspector score and vulnerability intelligence', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-understanding-score.html' }
  ]
});
