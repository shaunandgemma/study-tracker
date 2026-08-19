import jsPDF from 'jspdf';
import { SAA_C03_DOMAINS, getDomainForQuestion } from '../data/saaC03DomainMapping';
import { QUESTION_BANK_VERSION } from '../services/attemptService';

/**
 * Ensures a complete, canonical attempt object for export.
 * Works with both live completed attempts and historical attempts.
 *
 * @param {Object} attemptResult - The attempt result object from App / QuizEngine
 * @param {Object} activeExam - Active exam object (for passingScore, id, etc.)
 * @param {Object} flagged - Flagged questions map from context
 * @returns {Object} Complete standardized attempt payload
 */
export function buildCompleteAttemptObject(attemptResult, activeExam, flagged = {}) {
  if (attemptResult.fullAttemptData) {
    return attemptResult.fullAttemptData;
  }

  const { config, userAnswers, durationSeconds, timestamp } = attemptResult;
  const questions = config?.questions || [];
  const rawMode = config?.mode || 'full';
  const mode = rawMode === 'full' ? 'full' : (rawMode === 'custom' ? 'custom' : 'targeted');
  const topicId = config?.domainId || null;

  // Calculate scores & domain breakdown
  let correctCount = 0;
  const domainResults = {};
  SAA_C03_DOMAINS.forEach(d => {
    domainResults[d.id] = { id: d.id, title: d.title, correct: 0, total: 0 };
  });

  questions.forEach(q => {
    const dom = getDomainForQuestion(q);
    if (!domainResults[dom.id]) {
      domainResults[dom.id] = { id: dom.id, title: dom.title, correct: 0, total: 0 };
    }
    domainResults[dom.id].total += 1;

    const correctAnswers = q.correctAnswers || (typeof q.correctAnswer === 'number' ? [q.correctAnswer] : [0]);
    const userAns = userAnswers[q.id];
    const selectedArr = Array.isArray(userAns) ? userAns : (typeof userAns === 'number' ? [userAns] : []);

    if (selectedArr.length > 0) {
      const selectedSorted = [...selectedArr].sort((a, b) => a - b);
      const correctSorted = [...correctAnswers].sort((a, b) => a - b);
      if (selectedSorted.length === correctSorted.length && selectedSorted.every((v, i) => v === correctSorted[i])) {
        correctCount += 1;
        domainResults[dom.id].correct += 1;
      }
    }
  });

  const totalQuestions = questions.length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passingScore = activeExam?.passingScore || 72;
  const passed = scorePercent >= passingScore;
  const timeAllowedSeconds = config?.timeAllowedSeconds !== undefined 
    ? config.timeAllowedSeconds 
    : (mode === 'full' ? 130 * 60 : 0);

  // Get flagged question IDs
  const examFlags = flagged[activeExam?.id] || {};
  const flaggedQuestionIds = questions.filter(q => !!examFlags[q.id]).map(q => q.id);

  return {
    id: attemptResult.id || `attempt-${Date.now()}`,
    exam_code: activeExam?.id || 'aws-saa-c03',
    exam_mode: mode,
    topic_id: topicId,
    completed_at: timestamp || new Date().toISOString(),
    score_percent: scorePercent,
    correct_count: correctCount,
    total_questions: totalQuestions,
    time_used_seconds: durationSeconds || 0,
    time_allowed_seconds: timeAllowedSeconds,
    passed,
    question_bank_version: attemptResult.question_bank_version || QUESTION_BANK_VERSION,
    question_ids: questions.map(q => q.id),
    answers: userAnswers || {},
    flagged_question_ids: flaggedQuestionIds,
    domain_results: domainResults,
    question_snapshot: questions,
    selection_type: config?.selectionType || (mode === 'custom' ? 'balanced' : null),
    requested_question_count: config?.requestedQuestionCount || totalQuestions,
    actual_question_count: config?.actualQuestionCount || totalQuestions,
    timer_type: config?.timerType || (timeAllowedSeconds > 0 ? 'timed' : 'untimed'),
    domain_allocation: config?.domainAllocation || null
  };
}

/**
 * Triggers a browser download of the full attempt JSON backup.
 *
 * @param {Object} attemptData - Complete attempt payload
 */
export function exportAttemptJSON(attemptData) {
  let modePart = 'Mock';
  if (attemptData.exam_mode === 'targeted') {
    modePart = 'Targeted';
    if (attemptData.topic_id) {
      const cleanTopic = attemptData.topic_id.replace(/^topic-/, '').toUpperCase();
      modePart = `Targeted_${cleanTopic}`;
    }
  } else if (attemptData.exam_mode === 'custom') {
    modePart = `Custom_${attemptData.total_questions}Q`;
  }

  const dateStr = new Date(attemptData.completed_at || Date.now()).toISOString().split('T')[0];
  const filename = `SAA-C03_${modePart}_${dateStr}.json`;

  const jsonStr = JSON.stringify(attemptData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats duration seconds into readable string (e.g. 1h 15m or 42m 10s)
 */
function formatTime(secs) {
  if (!secs || secs <= 0) return '0s';
  const hours = Math.floor(secs / 3600);
  const mins = Math.floor((secs % 3600) / 60);
  const remainingSecs = secs % 60;
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m ${remainingSecs}s`;
  return `${remainingSecs}s`;
}

/**
 * Generates and downloads a clean, multi-page PDF report of the attempt.
 *
 * @param {Object} attemptData - Complete attempt object
 * @param {Object} activeExam - Active exam metadata
 */
export function generateAttemptPDF(attemptData, activeExam) {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  const pageMargin = 14;
  const pageWidth = 210;
  const pageHeight = 297;
  const printableWidth = pageWidth - (pageMargin * 2);
  const maxY = pageHeight - 15;

  let y = pageMargin;

  function checkPageBreak(neededHeight) {
    if (y + neededHeight > maxY) {
      doc.addPage();
      y = pageMargin;
      return true;
    }
    return false;
  }

  // ==========================================
  // 1. HEADER BANNER
  // ==========================================
  doc.setFillColor(15, 23, 42); // Slate-950
  doc.roundedRect(pageMargin, y, printableWidth, 26, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('AWS Certified Solutions Architect - Associate (SAA-C03)', pageMargin + 5, y + 8);

  const isFull = attemptData.exam_mode === 'full';
  const isCustom = attemptData.exam_mode === 'custom';
  let modeTitle = 'Targeted Topic Quiz';
  if (isFull) {
    modeTitle = 'Full Mock Exam (65 Questions)';
  } else if (isCustom) {
    const selLabel = attemptData.selection_type === 'all' ? 'All Available' : (attemptData.selection_type === 'random' ? 'Random' : 'Balanced');
    const timerLabel = attemptData.timer_type === 'timed' || attemptData.time_allowed_seconds > 0 ? 'Timed' : 'Untimed';
    modeTitle = `Custom Exam (${attemptData.total_questions} Qs | ${selLabel} | ${timerLabel})`;
  } else if (attemptData.topic_id) {
    const topicClean = attemptData.topic_id.replace(/^topic-/, '').toUpperCase();
    modeTitle += `: ${topicClean}`;
  }

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(165, 180, 252); // Indigo-300
  doc.text(modeTitle, pageMargin + 5, y + 14);

  const compDate = new Date(attemptData.completed_at || Date.now());
  const dateFormatted = compDate.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  const versionStr = attemptData.question_bank_version || QUESTION_BANK_VERSION || 'saa-c03-v1';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // Slate-300
  doc.text(`Date Completed: ${dateFormatted}   |   Bank Version: ${versionStr}`, pageMargin + 5, y + 21);

  y += 32;

  // ==========================================
  // 2. OVERALL SCORE SUMMARY CARD
  // ==========================================
  const passed = attemptData.passed;
  const scorePct = attemptData.score_percent;

  // Border box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(passed ? 240 : 254, passed ? 253 : 242, passed ? 244 : 242); // Soft green / soft red
  doc.roundedRect(pageMargin, y, printableWidth, 22, 2, 2, 'FD');

  // Status Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  if (passed) {
    doc.setTextColor(4, 120, 87); // Emerald-700
    doc.text('PASSED EXAM', pageMargin + 5, y + 9);
  } else {
    doc.setTextColor(190, 18, 60); // Rose-700
    doc.text('NEEDS REVIEW', pageMargin + 5, y + 9);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Passing Target: ${activeExam?.passingScore || 72}%`, pageMargin + 5, y + 16);

  // Big Score %
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(passed ? 4 : 190, passed ? 120 : 18, passed ? 87 : 60);
  doc.text(`${scorePct}%`, pageMargin + 75, y + 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`${attemptData.correct_count} of ${attemptData.total_questions} Correct`, pageMargin + 75, y + 17);

  // Time Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Time Used: ${formatTime(attemptData.time_used_seconds)}`, pageMargin + 130, y + 9);

  doc.setFont('helvetica', 'normal');
  const allowedStr = attemptData.time_allowed_seconds > 0 ? formatTime(attemptData.time_allowed_seconds) : 'N/A';
  doc.text(`Time Allowed: ${allowedStr}`, pageMargin + 130, y + 16);

  y += 28;

  // ==========================================
  // 3. AWS SAA-C03 DOMAIN BREAKDOWN
  // ==========================================
  checkPageBreak(40);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('AWS SAA-C03 Domain Performance Breakdown', pageMargin, y);
  y += 4;

  // Domain Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(pageMargin, y, printableWidth, 6, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Domain', pageMargin + 3, y + 4.2);
  doc.text('Correct / Total', pageMargin + 125, y + 4.2);
  doc.text('Score', pageMargin + 165, y + 4.2);
  y += 6;

  // Domain Rows
  const domainRes = attemptData.domain_results || {};
  SAA_C03_DOMAINS.forEach(d => {
    checkPageBreak(7);
    const stat = domainRes[d.id] || { correct: 0, total: 0 };
    const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    const isWeak = pct < (activeExam?.passingScore || 72);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(d.title, pageMargin + 3, y + 4.5);

    doc.text(`${stat.correct} / ${stat.total}`, pageMargin + 125, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isWeak ? 225 : 4, isWeak ? 29 : 120, isWeak ? 72 : 87);
    doc.text(`${pct}%`, pageMargin + 165, y + 4.5);

    doc.setDrawColor(241, 245, 249);
    doc.line(pageMargin, y + 6, pageMargin + printableWidth, y + 6);
    y += 6.5;
  });

  y += 6;

  // ==========================================
  // 4. DETAILED QUESTION REVIEW
  // ==========================================
  checkPageBreak(25);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Full Question & Answer Review', pageMargin, y);
  y += 6;

  const questions = attemptData.question_snapshot || [];
  const userAnswers = attemptData.answers || {};
  const flaggedSet = new Set(attemptData.flagged_question_ids || []);

  questions.forEach((q, qIdx) => {
    const correctAnswers = q.correctAnswers || (typeof q.correctAnswer === 'number' ? [q.correctAnswer] : [0]);
    const userAns = userAnswers[q.id];
    const selectedArr = Array.isArray(userAns) ? userAns : (typeof userAns === 'number' ? [userAns] : []);
    const isAnswered = selectedArr.length > 0;

    let isCorrect = false;
    if (isAnswered) {
      const selectedSorted = [...selectedArr].sort((a, b) => a - b);
      const correctSorted = [...correctAnswers].sort((a, b) => a - b);
      isCorrect = selectedSorted.length === correctSorted.length && selectedSorted.every((v, i) => v === correctSorted[i]);
    }

    const isFlagged = flaggedSet.has(q.id);

    // Calculate height required for this question block
    const options = Array.isArray(q.options) ? q.options : [];
    const qTextLines = doc.splitTextToSize(q.question || '', printableWidth - 6);
    const expLines = doc.splitTextToSize(q.explanation || 'No explanation provided.', printableWidth - 10);
    const estimatedHeight = 14 + (qTextLines.length * 4) + (options.length * 5) + (expLines.length * 3.5) + 12;

    checkPageBreak(Math.min(estimatedHeight, 80));

    // Question Header Box
    doc.setFillColor(248, 250, 252);
    doc.rect(pageMargin, y, printableWidth, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`Question ${qIdx + 1} of ${questions.length}`, pageMargin + 3, y + 4.2);

    // Correct/Incorrect Badge
    doc.setFontSize(8);
    if (isCorrect) {
      doc.setTextColor(4, 120, 87);
      doc.text('✓ CORRECT', pageMargin + 130, y + 4.2);
    } else {
      doc.setTextColor(225, 29, 72);
      doc.text('✗ INCORRECT', pageMargin + 130, y + 4.2);
    }

    // Flagged Badge
    if (isFlagged) {
      doc.setTextColor(217, 119, 6); // Amber-600
      doc.text('★ FLAGGED', pageMargin + 160, y + 4.2);
    }

    y += 8;

    // Question Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);

    qTextLines.forEach(line => {
      checkPageBreak(5);
      doc.text(line, pageMargin + 3, y);
      y += 4.2;
    });

    y += 1.5;

    // Options List
    options.forEach((optText, optIdx) => {
      checkPageBreak(6);

      const letter = String.fromCharCode(65 + optIdx);
      const isUserChoice = selectedArr.includes(optIdx);
      const isCorrectOpt = correctAnswers.includes(optIdx);

      let tag = '';
      if (isUserChoice && isCorrectOpt) {
        doc.setTextColor(4, 120, 87); // Emerald
        tag = ' (Your Choice ✓ / Correct)';
      } else if (isUserChoice && !isCorrectOpt) {
        doc.setTextColor(225, 29, 72); // Rose
        tag = ' (Your Selection ✗)';
      } else if (!isUserChoice && isCorrectOpt) {
        doc.setTextColor(13, 148, 136); // Teal
        tag = ' (Correct Answer ★)';
      } else {
        doc.setTextColor(71, 85, 105);
      }

      doc.setFont('helvetica', isUserChoice || isCorrectOpt ? 'bold' : 'normal');
      doc.setFontSize(8);

      const optLine = `${letter}.  ${optText}${tag}`;
      const optWrapped = doc.splitTextToSize(optLine, printableWidth - 8);
      optWrapped.forEach(line => {
        doc.text(line, pageMargin + 5, y);
        y += 4;
      });
    });

    y += 2;

    // Selection Summary
    const userSelectedLetters = [...selectedArr].sort((a, b) => a - b).map(idx => String.fromCharCode(65 + idx)).join(', ') || 'None';
    const correctLetters = [...correctAnswers].sort((a, b) => a - b).map(idx => String.fromCharCode(65 + idx)).join(', ');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Your Choice: `, pageMargin + 5, y);

    doc.setTextColor(isCorrect ? 4 : 225, isCorrect ? 120 : 29, isCorrect ? 87 : 72);
    doc.text(userSelectedLetters, pageMargin + 25, y);

    doc.setTextColor(100, 116, 139);
    doc.text(`  |  Correct Answer(s): `, pageMargin + 45, y);
    doc.setTextColor(4, 120, 87);
    doc.text(correctLetters, pageMargin + 85, y);

    y += 5;

    // Rationale Box
    checkPageBreak(12);
    doc.setFillColor(241, 245, 249); // Soft slate box
    doc.rect(pageMargin + 3, y, printableWidth - 6, (expLines.length * 3.5) + 5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(79, 70, 229); // Indigo
    doc.text('Explanation Rationale:', pageMargin + 5, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);

    let expY = y + 7.5;
    expLines.forEach(line => {
      doc.text(line, pageMargin + 5, expY);
      expY += 3.5;
    });

    y = expY + 4;

    // Separator line between questions
    doc.setDrawColor(226, 232, 240);
    doc.line(pageMargin, y, pageMargin + printableWidth, y);
    y += 6;
  });

  // ==========================================
  // 5. FOOTERS & PAGE NUMBERING
  // ==========================================
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.line(pageMargin, pageHeight - 10, pageMargin + printableWidth, pageHeight - 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('LATT — Official Exam Results Report', pageMargin, pageHeight - 6);
    doc.text(`Page ${p} of ${totalPages}`, pageMargin + printableWidth - 15, pageHeight - 6);
  }

  // ==========================================
  // 6. SAVE PDF
  // ==========================================
  let modePart = 'Mock';
  if (attemptData.exam_mode === 'targeted') {
    modePart = 'Targeted';
    if (attemptData.topic_id) {
      const cleanTopic = attemptData.topic_id.replace(/^topic-/, '').toUpperCase();
      modePart = `Targeted_${cleanTopic}`;
    }
  }

  const dateStr = new Date(attemptData.completed_at || Date.now()).toISOString().split('T')[0];
  const filename = `SAA-C03_${modePart}_${attemptData.score_percent}pct_${dateStr}.pdf`;

  doc.save(filename);
}
