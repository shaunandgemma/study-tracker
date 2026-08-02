/** Normalize the legacy values returned by S3 GetBucketLocation. */
export function normalizeS3BucketRegion(locationConstraint) {
  if (locationConstraint == null || locationConstraint === '') return 'us-east-1';
  if (locationConstraint === 'EU') return 'eu-west-1';
  return locationConstraint;
}
