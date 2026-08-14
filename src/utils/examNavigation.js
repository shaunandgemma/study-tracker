export function getExamTopics(exam) {
  return exam?.topics || exam?.domains || [];
}

export function getExamChecklistItemCount(exam) {
  return getExamTopics(exam).reduce((total, topic) => {
    if (Array.isArray(topic.items)) return total + topic.items.length;
    return total + (topic.subtopics || []).reduce(
      (subTotal, subtopic) => subTotal + (subtopic.tasks || []).length,
      0
    );
  }, 0);
}

export function getExamLandingDetails(exam) {
  return {
    audience: exam?.audience || `Learners preparing for ${exam?.title || exam?.code || 'this certification exam'}.`,
    benefits: Array.isArray(exam?.benefits) && exam.benefits.length
      ? exam.benefits
      : [
          'Organise learning with a dedicated checklist.',
          'Practise questions and review previous attempts.',
          'Use only the Follow Alongs assigned to this exam.'
        ]
  };
}
