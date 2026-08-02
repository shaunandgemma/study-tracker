import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { 
  remapExplanationOptionLetters, 
  parseExplanationSections 
} from '../src/utils/explanationUtils.js';
import { shuffleQuestionOptions } from '../src/utils/examUtils.js';

test('1. No shuffle / identity mapping retains original letters', () => {
  const input = "Option A is correct. A. First option description.";
  const identityMap = { 0: 0, 1: 1, 2: 2, 3: 3 };
  const output = remapExplanationOptionLetters(input, identityMap);
  assert.equal(output, "Option A is correct. A. First option description.");
});

test('2. Missing mapping fallback returns original explanation unchanged', () => {
  const input = "Option B is correct. B. Description.";
  const outputNull = remapExplanationOptionLetters(input, null);
  const outputUndefined = remapExplanationOptionLetters(input, undefined);
  assert.equal(outputNull, input);
  assert.equal(outputUndefined, input);
});

test('3. Single-answer option letter remapping (Original B -> Displayed C)', () => {
  const input = "Correct answer:\nB. Allow TCP port 3306.\nWhy the other options are wrong:\nA. Subnet CIDR.\nC. Network ACL.\nD. Automation.";
  const mapping = { 0: 1, 1: 2, 2: 0, 3: 3 }; // Orig B (1) -> Disp C (2), Orig A (0) -> Disp B (1), Orig C (2) -> Disp A (0)
  const output = remapExplanationOptionLetters(input, mapping);
  
  assert.ok(output.includes("C. Allow TCP port 3306."));
  assert.ok(output.includes("B. Subnet CIDR."));
  assert.ok(output.includes("A. Network ACL."));
  assert.ok(output.includes("D. Automation."));
});

test('4. Multiple-answer option letter remapping', () => {
  const input = "Options A and C are correct because of block storage and database replication.";
  const mapping = { 0: 2, 1: 1, 2: 0, 3: 3 }; // Orig A (0) -> Disp C (2), Orig C (2) -> Disp A (0)
  const output = remapExplanationOptionLetters(input, mapping);
  assert.ok(output.includes("Options C and A") || output.includes("Options C and A are correct"));
});

test('5. Support Option A, Answer A, Choice A, Options A, B and D', () => {
  const input = "Option A is valid. Answer B is invalid. Choice C is optional. Options A, B and D cover high availability.";
  const mapping = { 0: 3, 1: 2, 2: 1, 3: 0 }; // 0->3 (D), 1->2 (C), 2->1 (B), 3->0 (A)
  const output = remapExplanationOptionLetters(input, mapping);
  
  assert.ok(output.includes("Option D is valid"));
  assert.ok(output.includes("Answer C is invalid"));
  assert.ok(output.includes("Choice B is optional"));
  assert.ok(output.includes("Options D, C and A cover high availability"));
});

test('6. Standalone A. / B. bullet lines remapping', () => {
  const input = "Why the other options are wrong:\nA. First point.\nB. Second point.";
  const mapping = { 0: 1, 1: 0, 2: 2, 3: 3 };
  const output = remapExplanationOptionLetters(input, mapping);
  assert.ok(output.includes("B. First point."));
  assert.ok(output.includes("A. Second point."));
});

test('7. Explanation with no letter references remains intact', () => {
  const input = "AWS MGN performs continuous block-level replication for server lift-and-shift migration.";
  const mapping = { 0: 2, 1: 0, 2: 1, 3: 3 };
  const output = remapExplanationOptionLetters(input, mapping);
  assert.equal(output, input);
});

test('8. Explanation with no recognised headings parses into a single general section', () => {
  const input = "This is a simple unstructured explanation text describing S3 lifecycle policies.";
  const sections = parseExplanationSections(input);
  assert.equal(sections.length, 1);
  assert.equal(sections[0].type, 'general');
  assert.equal(sections[0].content, input);
});

test('9. 4-option, 5-option, and 6-option questions remap correctly', () => {
  const input = "Option A, Option E, and Option F apply.";
  const mapping6 = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1, 5: 0 }; // A(0)->F(5), E(4)->B(1), F(5)->A(0)
  const output = remapExplanationOptionLetters(input, mapping6);
  assert.ok(output.includes("Option F"));
  assert.ok(output.includes("Option B"));
  assert.ok(output.includes("Option A"));
});

test('10. No accidental replacement inside ordinary words or AWS terms', () => {
  const input = "A company uses AWS API Gateway, Amazon EC2 AMIs, and CIDR blocks. Automatic failover is required.";
  const mapping = { 0: 3, 1: 2, 2: 1, 3: 0 };
  const output = remapExplanationOptionLetters(input, mapping);
  assert.equal(output, input);
});

test('11. shuffleQuestionOptions remaps correctAnswer, correctAnswers, and exposes optionMapping', () => {
  const q = {
    id: 'q-test-1',
    options: ['Opt0', 'Opt1', 'Opt2', 'Opt3'],
    correctAnswer: 1,
    correctAnswers: [1],
    explanation: 'Option B is correct.'
  };

  const seedRandom = () => 0.2; // Fixed pseudo-random seed
  const shuffled = shuffleQuestionOptions(q, seedRandom);

  assert.ok(shuffled.optionMapping, 'optionMapping property must exist on shuffled question');
  assert.equal(typeof shuffled.correctAnswer, 'number');
  assert.ok(Array.isArray(shuffled.correctAnswers));
  assert.equal(shuffled.options[shuffled.correctAnswer], 'Opt1');
});

test('12. Test letter remapping on real canonical question q-saa-1', () => {
  const bankPath = path.resolve('data/SAA-C03-question-bank-upgraded-250.json');
  const bank = JSON.parse(fs.readFileSync(bankPath, 'utf-8'));
  const q1 = bank.find(q => q.id === 'q-saa-1');
  assert.ok(q1, 'q-saa-1 must exist in bank');

  const pseudoRandom = () => 0.7;
  const shuffledQ1 = shuffleQuestionOptions(q1, pseudoRandom);

  const remappedExplanation = remapExplanationOptionLetters(shuffledQ1.explanation, shuffledQ1.optionMapping);
  
  const correctDisplayedIndex = shuffledQ1.correctAnswer;
  const expectedLetter = String.fromCharCode(65 + correctDisplayedIndex);

  assert.ok(remappedExplanation.includes(`${expectedLetter}. Allow TCP port 3306`), `Remapped explanation must state ${expectedLetter}. Allow TCP port 3306`);
});
