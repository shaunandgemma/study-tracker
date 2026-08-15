import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-5',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Integration with AWS Glue Data Catalog',
  status: 'ready',
  plainEnglish: 'AWS Lake Formation builds directly on top of the AWS Glue Data Catalog. The Glue Data Catalog stores technical metadata (database names, table schemas, partition structures, and S3 file locations), while Lake Formation provides the security and access control engine that determines which principals can see, query, or modify those Data Catalog objects.',
  whyItMatters: 'Separating metadata storage (Glue Data Catalog) from security governance (Lake Formation) allows organizations to maintain a single central metastore for all analytics tools (Athena, EMR, Redshift Spectrum, Glue ETL) while enforcing centralized access controls.',
  workplaceExample: 'An AWS Glue Crawler crawls an S3 bucket and registers a new table `clickstream_logs` in the Glue Data Catalog. Lake Formation intercepts access requests: Athena users see the table in their schema list ONLY if Lake Formation permissions allow it.',
  examFocus: 'SAA-C03 Glue Data Catalog & Lake Formation Relationship:\n- Data Catalog: Central metastore storing database definitions, table schemas, and S3 location URIs.\n- Governance Layer: Lake Formation layer wraps the Glue Data Catalog, replacing Glue IAM policies with fine-grained grants.\n- Upgrading: Existing Glue Data Catalog resources are migrated to Lake Formation governance by revoking `IAMAllowedPrincipals` permissions.',
  keyPoints: [
    'Lake Formation wraps the AWS Glue Data Catalog to provide fine-grained access control.',
    'Glue Data Catalog stores metadata (schemas, partitions); Lake Formation enforces access rules.',
    'Works seamlessly with Glue Crawlers, Glue ETL jobs, Athena, EMR, and Redshift Spectrum.',
    'Migrating existing Glue resources requires revoking `IAMAllowedPrincipals` defaults.',
    'Underlying S3 data files remain untouched in Amazon S3.'
  ],
  commonMistake: 'Confusing Glue Data Catalog with Lake Formation. Glue Data Catalog is the metadata repository; Lake Formation is the security and governance engine.',
  example: 'Describing Lake Formation Catalog Settings via AWS CLI:\naws lakeformation get-data-lake-settings',
  sources: [
    { title: 'Lake Formation and Glue Data Catalog', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/architecture.html' }
  ]
});
