import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'macie-6',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'Custom Data Identifiers',
  status: 'ready',
  plainEnglish: 'A custom data identifier is learner-defined detection criteria for sensitive text in S3 objects. Its regular expression defines the text pattern; optional keywords require relevant words nearby within the configured proximity; optional ignore words exclude otherwise matching text. Custom identifiers supplement managed identifiers and need careful testing for both missed matches and unwanted matches.',
  whyItMatters: 'Organizations often have proprietary labels, project codes, or record identifiers that no general detector knows. A well-designed custom identifier can locate that data, but a loose expression can flood analysts with false positives and a narrow expression can miss real variations.',
  workplaceExample: 'A laboratory wants to detect fictional internal specimen codes. It builds a custom identifier in a test environment, evaluates representative positive, negative, and ignored examples, reviews unexpected matches with the data owner, and only then adds the identifier to a production discovery job.',
  examFocus: 'Custom identifiers use a required regular expression plus optional keywords, a keyword proximity setting, and ignore words. Keywords add contextual evidence; ignore words remove defined matches. They do not alter the source object. Contrast them with AWS-maintained managed identifiers and with allow lists that ignore approved text or patterns more broadly.',
  keyPoints: [
    'The regular expression defines the core text pattern that Macie attempts to match.',
    'Keywords can require business context near a regex match within the configured proximity.',
    'Ignore words exclude matching text associated with defined non-sensitive contexts.',
    'Positive tests show intended matches and negative tests show text that must not match.',
    'False positives and false negatives should be reviewed before production use.',
    'Only harmless fictional values should be used in examples and integration tests.'
  ],
  commonMistake: 'Testing only one matching string hides boundary, capitalization, context, and exclusion errors. Build a small test matrix with valid variants, malformed values, unrelated lookalikes, missing keywords, and ignore-word cases before enabling the identifier broadly.',
  example: 'Use the fictional regex `\\bLAB-[A-Z]{3}-\\d{4}\\b`: it matches `LAB-`, three uppercase letters, a hyphen, and four digits at word boundaries. Require the keyword `specimen` nearby using the configured proximity, and use `DEMO` as an ignore word. `specimen LAB-ABC-2048` is positive; `LAB-ab-12` and a valid code without the keyword are negative; `DEMO specimen LAB-ABC-2048` is ignored. A document discussing real-looking lab codes could still create false positives, so test varied safe samples.',
  sources: [
    { title: 'Creating a custom data identifier', url: 'https://docs.aws.amazon.com/macie/latest/user/cdis-create.html' },
    { title: 'Creating an allow list', url: 'https://docs.aws.amazon.com/macie/latest/user/allow-lists-create.html' },
    { title: 'Configuration options and requirements for allow lists', url: 'https://docs.aws.amazon.com/macie/latest/user/allow-lists-options.html' },
    { title: 'Supported storage classes and formats', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-supported-storage.html' }
  ]
});
