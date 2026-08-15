import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-12',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Distribution Styles and Distribution Keys',
  status: 'ready',
  plainEnglish: 'Distribution Styles define how data rows of a Redshift table are distributed across compute node slices in a cluster:\n- KEY (`DISTSTYLE KEY`): Rows with matching distribution key values (e.g. `customer_id`) are placed on the same compute slice, collocating table joins.\n- EVEN (`DISTSTYLE EVEN`): Rows are distributed round-robin across all slices to ensure uniform storage.\n- ALL (`DISTSTYLE ALL`): A full copy of the entire table is duplicated onto every compute node.\n- AUTO (`DISTSTYLE AUTO`): Redshift automatically selects and transitions the optimal distribution style.',
  whyItMatters: 'If two large tables are frequently joined together, setting a matching `DISTKEY` on both tables collocates matching rows on the same physical slice. This eliminates network data redistribution (broadcast/hash joins) during SQL queries, accelerating join performance by up to 10x.',
  workplaceExample: 'An analytics team joins an `orders` table (500 million rows) with an `order_items` table (2 billion rows) on `order_id`. Setting `DISTSTYLE KEY` with `DISTKEY(order_id)` on both tables collocates matching order records on identical slices, speeding up joins.',
  examFocus: 'SAA-C03 Distribution Style Rules:\n- KEY: Best for large fact/dimension tables frequently joined together on a specific column.\n- ALL: Best for small, slowly changing dimension tables (< 3 million rows) to avoid join broadcasts.\n- EVEN: Best for tables not frequently joined or when no clear join key exists.\n- Data Skew Danger: Selecting a low-cardinality distribution key (e.g. `gender` or `status`) causes severe data skew where one slice gets 90% of data while others sit idle.',
  keyPoints: [
    'Controls physical row distribution across compute node slices in a cluster.',
    'KEY distribution collocates matching join rows on the same physical slice.',
    'ALL distribution copies small tables onto every node to speed up joins.',
    'EVEN distribution uses round-robin placement to prevent data skew.',
    'Selecting a poor KEY creates data skew, saturating one slice while others sit idle.'
  ],
  commonMistake: 'Choosing a distribution key with low cardinality (like `state` or `is_active`), which places almost all table rows onto a single node slice while other slices remain underutilized.',
  example: 'Creating a Table with KEY Distribution in DDL:\nCREATE TABLE customer_orders (\n  order_id INT,\n  customer_id INT,\n  order_date DATE\n) DISTSTYLE KEY DISTKEY(customer_id);',
  sources: [
    { title: 'Amazon Redshift distribution styles', url: 'https://docs.aws.amazon.com/redshift/latest/dg/c_choice_of_dist_style.html' }
  ]
});
