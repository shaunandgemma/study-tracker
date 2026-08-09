export const HANDS_ON_PROGRESS_ARCHIVE_POLICY = Object.freeze({
  mode: 'read-only',
  retention: 'indefinite-until-separately-approved',
  allowHistoricalReads: true,
  allowProgressWrites: false,
  allowGuestProgressMerge: false,
  allowFollowAlongConversion: false,
  allowExplicitBackupRestore: true
});
