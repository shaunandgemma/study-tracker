import {
  S3Client,
  HeadBucketCommand,
  GetBucketLocationCommand,
  GetBucketVersioningCommand,
  GetBucketEncryptionCommand
} from 'npm:@aws-sdk/client-s3@3';
import { normalizeS3BucketRegion } from './s3Region.js';

export async function validateS3Task(credentials: any, region: string, type: string, resourceInput: string) {
  const bucketName = (resourceInput || '').trim();

  if (!bucketName) {
    return { passed: false, message: 'Bucket name resource input is required for S3 validation.' };
  }

  let s3Client = new S3Client({ region, credentials });
  let actualRegion = region;

  // 1. HeadBucket check for bucket existence & access
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
  } catch (err: any) {
    const errName = err.name || err.code || 'UnknownError';
    const statusCode = err.$metadata?.httpStatusCode || 500;
    console.error(`[s3Validators] STAGE FAILED: head_bucket - Type: ${type}, Bucket: ${bucketName}, Region: ${region}, Code: ${errName}, Status: ${statusCode}`);
    return { passed: false, message: parseS3Error(err, bucketName) };
  }

  // 2. Discover actual bucket region via GetBucketLocation
  try {
    const locationRes = await s3Client.send(new GetBucketLocationCommand({ Bucket: bucketName }));
    actualRegion = normalizeS3BucketRegion(locationRes.LocationConstraint);

    if (actualRegion !== region) {
      console.log(`[s3Validators] Recreating S3Client for bucket ${bucketName} in region: ${actualRegion}`);
      s3Client = new S3Client({ region: actualRegion, credentials });
    }
  } catch (locErr: any) {
    const errName = locErr.name || locErr.code || 'UnknownError';
    console.warn(`[s3Validators] GetBucketLocation failed for ${bucketName}: ${errName}`);
    if (type === 's3.bucket-region') {
      return {
        passed: false,
        message: `Unable to retrieve the AWS Region for S3 Bucket '${bucketName}' (${errName}).`
      };
    }
  }

  // 3. Dispatch validation by contract type
  try {
    if (type === 's3.bucket-exists') {
      return {
        passed: true,
        message: `Live AWS Verified: S3 Bucket '${bucketName}' exists and is accessible in region ${actualRegion}.`
      };
    }

    if (type === 's3.bucket-region') {
      return {
        passed: true,
        message: `Live AWS Verified: S3 Bucket '${bucketName}' exists in region ${actualRegion}.`
      };
    }

    if (type === 's3.versioning-enabled') {
      const verRes = await s3Client.send(new GetBucketVersioningCommand({ Bucket: bucketName }));
      const status = verRes.Status;
      if (status === 'Enabled') {
        return {
          passed: true,
          message: `Live AWS Verified: S3 Bucket '${bucketName}' versioning status is ENABLED.`
        };
      }
      return {
        passed: false,
        message: `S3 Bucket '${bucketName}' versioning status is '${status || 'Disabled'}'. Expected 'Enabled'.`
      };
    }

    if (type === 's3.default-encryption-enabled') {
      try {
        const encRes = await s3Client.send(new GetBucketEncryptionCommand({ Bucket: bucketName }));
        if (encRes.ServerSideEncryptionConfiguration?.Rules?.length) {
          const algo = encRes.ServerSideEncryptionConfiguration.Rules[0]?.ApplyServerSideEncryptionByDefault?.SSEAlgorithm || 'SSE-S3';
          return {
            passed: true,
            message: `Live AWS Verified: S3 Bucket '${bucketName}' default server-side encryption is CONFIGURED (${algo}).`
          };
        }
        return {
          passed: false,
          message: `S3 Bucket '${bucketName}' does not have default server-side encryption rules configured.`
        };
      } catch (encErr: any) {
        const errName = encErr.name || encErr.code || '';
        const statusCode = encErr.$metadata?.httpStatusCode || 500;
        if (errName === 'ServerSideEncryptionConfigurationNotFoundError' || statusCode === 404) {
          return {
            passed: false,
            message: `S3 Bucket '${bucketName}' does not have default server-side encryption enabled.`
          };
        }
        throw encErr;
      }
    }

    return { passed: false, message: `Unsupported S3 validation type '${type}'.` };

  } catch (err: any) {
    const errName = err.name || err.code || 'UnknownError';
    const statusCode = err.$metadata?.httpStatusCode || 500;
    console.error(`[s3Validators] STAGE FAILED: s3_command - Type: ${type}, Bucket: ${bucketName}, Region: ${actualRegion}, Code: ${errName}, Status: ${statusCode}`);
    return { passed: false, message: parseS3Error(err, bucketName) };
  }
}

function parseS3Error(err: any, bucketName: string): string {
  const name = err?.name || err?.code || '';
  const message = err?.message || String(err);
  const statusCode = err?.$metadata?.httpStatusCode;

  if (name === 'ServerSideEncryptionConfigurationNotFoundError' || message.includes('ServerSideEncryptionConfigurationNotFoundError')) {
    return `Default server-side encryption is not enabled on S3 Bucket '${bucketName}'.`;
  }
  if (name === 'NotFound' || name === 'NoSuchBucket' || statusCode === 404 || message.includes('NoSuchBucket')) {
    return `S3 Bucket '${bucketName}' does not exist in account.`;
  }
  if (name === 'AccessDenied' || name === 'Forbidden' || statusCode === 403 || message.includes('AccessDenied')) {
    return `Access denied inspecting S3 Bucket '${bucketName}'. Ensure IAM role has s3:ListBucket permission.`;
  }
  if (name === 'PermanentRedirect' || statusCode === 301 || message.includes('PermanentRedirect')) {
    return `S3 Bucket '${bucketName}' is located in a different AWS region.`;
  }
  if (name === 'InvalidBucketName') {
    return `Invalid S3 bucket name format: '${bucketName}'.`;
  }

  return `S3 inspection check failed (${name}): ${message}`;
}
