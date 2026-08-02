/**
 * Safely remaps explicit option-letter references (e.g. "A. Subnet CIDR...", "Option A", "Options A and C")
 * to match their current displayed option position using a two-pass placeholder strategy.
 *
 * @param {string} explanationText - Original explanation text
 * @param {Object} optionMapping - Mapping of original index -> displayed index (e.g. {0: 2, 1: 0, 2: 3, 3: 1})
 * @returns {string} Explanation text with option-letter references remapped to match displayed option positions
 */
export function remapExplanationOptionLetters(explanationText, optionMapping) {
  if (!explanationText || !optionMapping || typeof optionMapping !== 'object') {
    return explanationText || '';
  }

  let text = explanationText;

  // Pass 1: Convert explicit original letter references into unique intermediate placeholders
  
  // 1a. Standalone option lines at the start of a line or paragraph: e.g. "A. Some text", "B. Text"
  text = text.replace(/^\s*([A-F])\.\s+/gm, (match, letter) => {
    const origIdx = letter.toUpperCase().charCodeAt(0) - 65;
    return `\n__OPT_BULLET_${origIdx}__ `;
  });

  // 1b. Compound phrases like "Options A and C", "Options A, B and D", "Answers A and B"
  text = text.replace(/\b(Options|Answers|Choices)\s+([A-F](?:\s*(?:,|and|or)\s*[A-F])+)\b/gi, (match, prefix, letterList) => {
    const remappedList = letterList.replace(/\b[A-F]\b/gi, (letter) => {
      const origIdx = letter.toUpperCase().charCodeAt(0) - 65;
      return `__OPT_REF_${origIdx}__`;
    });
    return `${prefix} ${remappedList}`;
  });

  // 1c. Single option references: "Option A", "Answer B", "Choice C"
  text = text.replace(/\b(Option|Answer|Choice)\s+([A-F])\b/gi, (match, prefix, letter) => {
    const origIdx = letter.toUpperCase().charCodeAt(0) - 65;
    return `${prefix} __OPT_REF_${origIdx}__`;
  });

  // Pass 2: Replace placeholders with newly displayed letters
  for (let origIdx = 0; origIdx < 10; origIdx++) {
    if (optionMapping[origIdx] !== undefined) {
      const newDisplayIdx = optionMapping[origIdx];
      const newLetter = String.fromCharCode(65 + newDisplayIdx);

      text = text.replaceAll(`__OPT_BULLET_${origIdx}__`, `${newLetter}.`);
      text = text.replaceAll(`__OPT_REF_${origIdx}__`, newLetter);
    }
  }

  return text;
}

/**
 * Parses recognized explanation headings and splits unstructured text into visual section blocks.
 *
 * @param {string} text - Remapped explanation text
 * @returns {Array} List of section objects with type, title, and content
 */
export function parseExplanationSections(text) {
  if (!text) return [];

  const rawBlocks = text.split(/\n\s*\n/);
  const parsedSections = [];

  for (const block of rawBlocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (/^(Correct answer|Correct answers|Correct):\s*/i.test(trimmed)) {
      parsedSections.push({
        type: 'correct',
        title: 'Correct Answer Rationale',
        content: trimmed.replace(/^(Correct answer|Correct answers|Correct):\s*/i, '')
      });
    } else if (/^(Why this is correct):\s*/i.test(trimmed)) {
      parsedSections.push({
        type: 'why_correct',
        title: 'Why This Choice Is Correct',
        content: trimmed.replace(/^(Why this is correct):\s*/i, '')
      });
    } else if (/^(Why the other options are wrong|Why the others are wrong):\s*/i.test(trimmed)) {
      parsedSections.push({
        type: 'distractors',
        title: 'Distractor Rationale',
        content: trimmed.replace(/^(Why the other options are wrong|Why the others are wrong):\s*/i, '')
      });
    } else if (/^(Exam trigger):\s*/i.test(trimmed)) {
      parsedSections.push({
        type: 'trigger',
        title: 'Exam Trigger Keyword',
        content: trimmed.replace(/^(Exam trigger):\s*/i, '')
      });
    } else if (/^(Exam trap):\s*/i.test(trimmed)) {
      parsedSections.push({
        type: 'trap',
        title: 'Exam Trap & Distractor Pitfall',
        content: trimmed.replace(/^(Exam trap):\s*/i, '')
      });
    } else if (/^(Memory hook):\s*/i.test(trimmed)) {
      parsedSections.push({
        type: 'memory',
        title: 'Memory Hook & Core Takeaway',
        content: trimmed.replace(/^(Memory hook):\s*/i, '')
      });
    } else if (/^(Current AWS correction|Exam point):\s*/i.test(trimmed)) {
      parsedSections.push({
        type: 'aws_note',
        title: 'Current AWS Guidance & Exam Point',
        content: trimmed.replace(/^(Current AWS correction|Exam point):\s*/i, '')
      });
    } else {
      parsedSections.push({
        type: 'general',
        title: 'Explanation Rationale',
        content: trimmed
      });
    }
  }

  return parsedSections;
}
