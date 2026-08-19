export const DEMO_CONTENT_LIMITS = Object.freeze({
  examQuestions: 10,
  followAlongs: 2,
  troubleshootingChallenges: 2,
  checklistItems: 10,
  knowledgeGuidePages: 10
});

const take = (items, limit) => Array.isArray(items) ? items.slice(0, limit) : [];

export const limitDemoExamQuestions = questions => take(
  questions,
  DEMO_CONTENT_LIMITS.examQuestions
);

export const limitDemoFollowAlongs = programmes => take(
  programmes,
  DEMO_CONTENT_LIMITS.followAlongs
);

export const limitDemoTroubleshootingChallenges = challenges => take(
  challenges,
  DEMO_CONTENT_LIMITS.troubleshootingChallenges
);

function trimLegacySubtopics(subtopics, remaining) {
  const trimmed = [];

  for (const subtopic of Array.isArray(subtopics) ? subtopics : []) {
    if (remaining <= 0) break;
    const tasks = take(subtopic.tasks, remaining);
    if (tasks.length) {
      trimmed.push({ ...subtopic, tasks });
      remaining -= tasks.length;
    }
  }

  return { subtopics: trimmed, remaining };
}

export function getDemoChecklistTopics(exam, limit = DEMO_CONTENT_LIMITS.checklistItems) {
  const sourceTopics = exam?.topics || exam?.domains || [];
  const trimmedTopics = [];
  let remaining = limit;

  for (const topic of sourceTopics) {
    if (remaining <= 0) break;

    if (Array.isArray(topic.items) && topic.items.length) {
      const items = take(topic.items, remaining);
      trimmedTopics.push({ ...topic, items });
      remaining -= items.length;
      continue;
    }

    const legacy = trimLegacySubtopics(topic.subtopics, remaining);
    if (legacy.subtopics.length) {
      trimmedTopics.push({ ...topic, subtopics: legacy.subtopics });
      remaining = legacy.remaining;
    }
  }

  return trimmedTopics;
}

export function getDemoKnowledgeGuideOrder(exam) {
  return getDemoChecklistTopics(exam, DEMO_CONTENT_LIMITS.knowledgeGuidePages)
    .flatMap(topic => {
      if (Array.isArray(topic.items) && topic.items.length) {
        return topic.items.map(item => item.id);
      }
      return (topic.subtopics || []).flatMap(subtopic =>
        (subtopic.tasks || []).map(task => task.id)
      );
    });
}
