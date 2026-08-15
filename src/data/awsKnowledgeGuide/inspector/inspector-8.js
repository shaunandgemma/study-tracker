import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'inspector-8',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'Software Package Vulnerability Detection',
  status: 'ready',
  plainEnglish: 'Software package vulnerability detection compares the package names and installed versions found on a supported resource with security advisories and CVE intelligence. A package finding can identify the affected package, package manager, installed version, whether a fix is available, and a fixed version when the source provides one. Detection accuracy depends on supported resource coverage and inventory visibility.',
  whyItMatters: 'Knowing that a resource is vulnerable is more useful when the owner can see exactly which component must change. Package-level evidence supports targeted upgrades, controlled testing, exception decisions, and proof that the replacement artifact no longer contains the affected version.',
  workplaceExample: 'An ECR image finding points to a vulnerable application library rather than an operating-system RPM. The team updates its lock file, rebuilds the image, reviews the new digest in Inspector, and redeploys it instead of trying to patch a disposable running container.',
  examFocus: 'Package scanning scope differs by resource and method. EC2 inventory can come from agent-based or agentless scanning; ECR enhanced scanning can examine supported OS and language packages; Lambda standard scanning examines supported uploaded dependencies. A listed fixed version is guidance, not an automatic update.',
  keyPoints: [
    'Inspector package findings connect vulnerability intelligence to an installed component on a covered resource.',
    'Affected-package details can include package name, package manager, installed version, and fixed version.',
    'Fix available can indicate complete, partial, or unavailable remediation information depending on affected packages.',
    'Inventory visibility and supported package ecosystems influence what Inspector can evaluate.',
    'EC2, ECR, and Lambda obtain and interpret package inventory through different scanning paths.',
    'The resource owner must test and deploy an appropriate supported update or replacement artifact.'
  ],
  commonMistake: 'Upgrading only the first package named in a finding can leave another affected component unresolved, especially when fix availability is partial. Review every affected-package entry and rebuild or update all applicable components before validating the new inventory.',
  example: 'For a package finding, compare every installed-version/fixed-version pair and identify whether the component came from the OS, application dependencies, an image layer, or a Lambda layer. Change the authoritative build or patch source, deploy through the normal pipeline, and verify the resulting resource inventory.',
  sources: [
    { title: 'Viewing details for Amazon Inspector findings', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-understanding-details.html' },
    { title: 'Amazon Inspector finding types', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-types.html' },
    { title: 'Amazon Inspector SBOM Generator', url: 'https://docs.aws.amazon.com/inspector/latest/user/sbom-generator.html' },
    { title: 'Exporting SBOMs with Amazon Inspector', url: 'https://docs.aws.amazon.com/inspector/latest/user/sbom-export.html' }
  ]
});
