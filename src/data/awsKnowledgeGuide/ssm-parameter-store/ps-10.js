import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-10',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'Parameter Versions',
  status: 'ready',
  plainEnglish: 'Parameter Versions are automatically incremented version numbers (v1, v2, v3...) created by Parameter Store whenever an existing parameter value is updated. Every update preserves historical versions in parameter history, allowing developers to inspect previous values, rollback configurations, or attach movable version Labels (such as `current` or `staging`).',
  whyItMatters: 'Accidental parameter edits or bad configuration updates can crash production microservices. Parameter versioning records an immutable history of changes and allows applications to pin to specific versions or roll back instantly.',
  workplaceExample: 'A developer updates `/app/prod/api-endpoint` from version 1 to version 2. The new endpoint causes errors. The engineering team immediately updates their application reference to explicitly fetch `/app/prod/api-endpoint:1` while debugging version 2.',
  examFocus: 'SAA-C03 Parameter Versioning & Labels:\n- Auto-Increment: Every `put-parameter` call with `--overwrite` automatically increments the version counter.\n- Immutable History: Previous versions cannot be modified or re-ordered.\n- Version Referencing: Request specific versions using `:version` syntax (e.g. `/my-param:2` or `/my-param:current`).\n- Labels: Movable string aliases (up to 10 labels per parameter) pointing to specific version numbers.',
  keyPoints: [
    'Automatically increments version numbers (v1, v2, v3) on every parameter value update.',
    'Preserves immutable parameter history for audit compliance and rollback capability.',
    'Applications can query specific versions using the `:version` suffix notation.',
    'Supports movable parameter Labels (e.g. `current`, `previous`, `staging`) for alias referencing.',
    'Prevents configuration loss during accidental overwrites.'
  ],
  commonMistake: 'Assuming parameter versions replace formal secret rotation or external backups. Parameter history records past values but does not perform automated rotation.',
  example: 'Fetching a Specific Parameter Version via AWS CLI:\naws ssm get-parameter --name "/app/prod/db-host:1"',
  sources: [
    { title: 'Working with parameter versions and history', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-versions.html' }
  ]
});
