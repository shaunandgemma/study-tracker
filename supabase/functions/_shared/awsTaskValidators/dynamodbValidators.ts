import { DynamoDBClient, DescribeTableCommand } from 'npm:@aws-sdk/client-dynamodb@3';

export async function validateDynamoDBTask(credentials: any, region: string, type: string, resourceInput: string) {
  const dynamoClient = new DynamoDBClient({ region, credentials });
  const tableName = (resourceInput || '').trim();

  if (!tableName) {
    return { passed: false, message: 'Table name resource input is required for DynamoDB validation.' };
  }

  try {
    if (type === 'dynamodb.table-active') {
      const res = await dynamoClient.send(new DescribeTableCommand({ TableName: tableName }));
      const status = res.Table?.TableStatus;
      if (status === 'ACTIVE') {
        return { passed: true, message: `Live AWS Verified: DynamoDB table '${tableName}' status is ACTIVE.` };
      }
      return { passed: false, message: `DynamoDB table '${tableName}' status is '${status}'. Expected 'ACTIVE'.` };
    }
    return { passed: false, message: `Unsupported DynamoDB validation type '${type}'.` };
  } catch (err: any) {
    return { passed: false, message: `DynamoDB Resource Check Failed: ${err.message || String(err)}` };
  }
}
