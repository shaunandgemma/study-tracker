import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-13',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Sort Keys',
  status: 'ready',
  plainEnglish: 'Sort Keys define the physical order in which table rows are sorted and stored within Redshift columnar disk blocks. Redshift tracks minimum and maximum values for each disk block using in-memory Zone Maps. When a query filters by the sort key column (e.g. `WHERE order_date >= \'2026-01-01\'`), Redshift uses Zone Maps to skip scanning unneeded disk blocks entirely.',
  whyItMatters: 'Scanning terabytes of unneeded disk blocks slows down SQL queries. Properly configured Sort Keys allow Redshift to prune 90%+ of disk block reads, turning minutes-long table scans into sub-second range queries.',
  workplaceExample: 'A time-series analytics table stores 1 billion web click events. Setting `COMPOUND SORTKEY(click_date, customer_id)` allows daily queries filtering by date range to skip scanning 99% of historical disk blocks.',
  examFocus: 'SAA-C03 Sort Key Types & Optimization:\n- Compound Sort Keys: Primary sort key type; best for hierarchical range filters (e.g. `WHERE date = X AND region = Y`). Most efficient for time-series data.\n- Interleaved Sort Keys: Gives equal weight to every column in the key; best when queries filter by different combinations of columns (e.g. search by date OR customer OR region).\n- AUTO Sort Keys: Redshift automatically manages sort ordering based on actual query workload patterns.',
  keyPoints: [
    'Physically orders table rows on disk to enable fast block skipping via Zone Maps.',
    'Compound Sort Keys are best for hierarchical date/range filtering queries.',
    'Interleaved Sort Keys give equal weight to multiple independent query filter columns.',
    'Zone Maps store MIN/MAX values per disk block to skip irrelevant data reads.',
    'Distribution Keys handle slice placement; Sort Keys handle row ordering on disk.'
  ],
  commonMistake: 'Confusing Distribution Keys with Sort Keys. Distribution Keys determine which node slice gets the row; Sort Keys determine row order inside that slice disk block.',
  example: 'Creating a Table with Compound Sort Key in DDL:\nCREATE TABLE web_clicks (\n  click_id BIGINT,\n  click_date DATE,\n  user_id INT\n) COMPOUND SORTKEY(click_date, user_id);',
  sources: [
    { title: 'Choosing sort keys in Amazon Redshift', url: 'https://docs.aws.amazon.com/redshift/latest/dg/t_Sorting_data.html' }
  ]
});
