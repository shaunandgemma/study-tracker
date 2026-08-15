import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rel-1',
  topicId: 'topic-reliability',
  topicTitle: 'AWS Reliability & Resiliency',
  objectiveCode: 'Architecture',
  title: 'Exponential Backoff & Randomized Jitter',
  status: 'ready',
  plainEnglish: 'Exponential Backoff with Randomized Jitter is an essential retry strategy for distributed cloud applications. When a call to an AWS service or API fails due to a transient error or rate limit, Exponential Backoff increases the delay exponentially between consecutive retries (e.g., 1s, 2s, 4s, 8s). Randomized Jitter adds random noise to the backoff interval, preventing thousands of failed clients from retrying at the exact same instant (the "thundering herd" problem).',
  whyItMatters: 'Retrying failed API requests immediately or at fixed regular intervals causes client requests to synchronize in lockstep. This floods impaired downstream dependencies with massive retry waves, preventing backend services from recovering and worsening outages.',
  workplaceExample: 'During a traffic spike, 5,000 Lambda functions experience transient DynamoDB throttling. By applying Exponential Backoff with Full Jitter, Lambda executions stagger their retries randomly over a 15-second window, allowing DynamoDB auto-scaling to catch up without backend overload.',
  examFocus: 'SAA-C03 Resilient Retry Mechanics:\n- Thundering Herd Problem: Thousands of clients retrying simultaneously at identical fixed intervals.\n- Exponential Backoff Formula: `sleep = min(cap, base * 2^attempt)`.\n- Full Jitter Formula: `sleep = random(0, min(cap, base * 2^attempt))`.\n- AWS SDK Default: AWS SDKs implement automatic retries with exponential backoff for transient 5xx server errors and throttling responses (HTTP 429 / 503).\n- Bounded Retries: Retries MUST be bounded by a maximum retry count and maximum operation timeout.',
  keyPoints: [
    'Exponential Backoff doubles the wait delay between consecutive failed API retries.',
    'Randomized Jitter introduces random timing variance to de-synchronize client retries.',
    'Prevents the "thundering herd" effect where synchronized retries crash recovering backends.',
    'AWS SDKs enable exponential backoff and jitter by default for transient 5xx / 429 errors.',
    'Retries must be capped with maximum attempt limits and overall operation timeouts.'
  ],
  commonMistake: 'Retrying failed API requests in a tight `while(true)` loop without any backoff or jitter, instantly consuming CPU and causing catastrophic downstream service throttling.',
  example: 'JavaScript Implementation of Exponential Backoff with Full Jitter:\nasync function fetchWithRetry(apiCall, maxRetries = 5, baseDelay = 100, maxCap = 5000) {\n  for (let attempt = 0; attempt < maxRetries; attempt++) {\n    try {\n      return await apiCall();\n    } catch (error) {\n      if (attempt === maxRetries - 1) throw error;\n      const calculatedBackoff = Math.min(maxCap, baseDelay * Math.pow(2, attempt));\n      const jitteredDelay = Math.floor(Math.random() * calculatedBackoff);\n      await new Promise(resolve => setTimeout(resolve, jitteredDelay));\n    }\n  }\n}',
  sources: [
    { title: 'Exponential Backoff and Jitter in AWS', url: 'https://docs.aws.amazon.com/general/latest/gr/api-retries.html' }
  ]
});
