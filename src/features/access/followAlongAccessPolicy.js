const cleanText = value => typeof value === 'string' ? value.trim() : '';

function belongsToExactExam(programme, examId) {
  const assignedExamIds = Array.isArray(programme?.examIds)
    ? programme.examIds.map(cleanText).filter(Boolean)
    : [];
  if (assignedExamIds.length) return assignedExamIds.includes(examId);
  return cleanText(programme?.examId) === examId;
}

export function evaluateFollowAlongRouteAccess({
  programmeId,
  programme,
  selectedExamId,
  selectedFromExamCatalogue = false
} = {}) {
  const cleanProgrammeId = cleanText(programmeId);
  const cleanExamId = cleanText(selectedExamId);

  if (!cleanProgrammeId || !cleanExamId) {
    return Object.freeze({ allowed: false, reason: 'A current exam and Follow Along selection are required.' });
  }
  if (!selectedFromExamCatalogue) {
    return Object.freeze({ allowed: false, reason: 'Choose the Follow Along from the current exam catalogue.' });
  }
  if (!programme || cleanText(programme.id) !== cleanProgrammeId) {
    return Object.freeze({ allowed: false, reason: 'The loaded Follow Along did not match the selected programme.' });
  }
  if (!belongsToExactExam(programme, cleanExamId)) {
    return Object.freeze({ allowed: false, reason: 'This Follow Along belongs to a different exam workspace.' });
  }

  return Object.freeze({ allowed: true, reason: '' });
}
