export function getTerraformFollowAlongNumber(programmeId, programmes = []) {
  const index = programmes.findIndex(programme => programme?.id === programmeId);
  return index >= 0 ? index : null;
}

export function sortTerraformFollowAlongs(programmes = []) {
  // Protected delivery already returns the exact server-managed sort_order.
  // Preserve that order without embedding private programme IDs in the bundle.
  return [...programmes];
}
