const lessonModules = import.meta.glob('./awsKnowledgeGuide/*/*.js', {
  eager: true,
  import: 'default'
});

export const AWS_KNOWLEDGE_GUIDES = Object.freeze(Object.fromEntries(
  Object.values(lessonModules).map(guide => [guide.id, guide])
));

export function getAwsKnowledgeGuide(itemId) {
  return AWS_KNOWLEDGE_GUIDES[itemId] || null;
}
