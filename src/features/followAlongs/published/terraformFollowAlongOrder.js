export const TERRAFORM_FOLLOW_ALONG_ORDER = [
  'terraform-configuration-foundations-learning-path',
  'terraform-beginner-learning-path',
  'terraform-state-backend-learning-path'
];

export function getTerraformFollowAlongNumber(programmeId, programmes = []) {
  const fixedNumber = TERRAFORM_FOLLOW_ALONG_ORDER.indexOf(programmeId);
  if (fixedNumber >= 0) return fixedNumber;
  const additionalIds = programmes
    .map(programme => programme.id)
    .filter(id => !TERRAFORM_FOLLOW_ALONG_ORDER.includes(id));
  const additionalIndex = additionalIds.indexOf(programmeId);
  return additionalIndex >= 0 ? TERRAFORM_FOLLOW_ALONG_ORDER.length + additionalIndex : null;
}

export function sortTerraformFollowAlongs(programmes = []) {
  const rank = new Map(TERRAFORM_FOLLOW_ALONG_ORDER.map((id, index) => [id, index]));
  return programmes
    .map((programme, originalIndex) => ({ programme, originalIndex }))
    .sort((left, right) => {
      const leftRank = rank.has(left.programme.id) ? rank.get(left.programme.id) : Number.MAX_SAFE_INTEGER;
      const rightRank = rank.has(right.programme.id) ? rank.get(right.programme.id) : Number.MAX_SAFE_INTEGER;
      return leftRank - rightRank || left.originalIndex - right.originalIndex;
    })
    .map(({ programme }) => programme);
}
