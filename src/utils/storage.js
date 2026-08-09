import { DEFAULT_EXAMS } from '../data/examData';
import {
  readLocalHandsOnProgressArchive,
  restoreLocalHandsOnProgressArchiveFromBackup
} from '../services/handsOnProgressArchiveService.js';

const KEYS = {
  EXAMS: 'exampulse_exams_v1',
  CHECKLIST: 'exampulse_checklist_v1',
  FLAGGED: 'exampulse_flagged_v1',
  HISTORY: 'exampulse_history_v1',
  ACTIVE_EXAM: 'exampulse_active_exam_v1',
  THEME: 'exampulse_theme_v1'
};

export const getStoredTheme = () => {
  try {
    return localStorage.getItem(KEYS.THEME) || 'dark';
  } catch (e) {
    return 'dark';
  }
};

export const saveStoredTheme = (theme) => {
  try {
    localStorage.setItem(KEYS.THEME, theme);
  } catch (e) {
    console.error('Error saving theme:', e);
  }
};

export const loadExams = () => {
  try {
    const customExams = localStorage.getItem(KEYS.EXAMS);
    if (!customExams) return DEFAULT_EXAMS;
    const parsed = JSON.parse(customExams);
    // Merge defaults with custom exams to ensure updates are present
    const defaultIds = new Set(DEFAULT_EXAMS.map(e => e.id));
    const customOnly = parsed.filter(e => !defaultIds.has(e.id));
    return [...DEFAULT_EXAMS, ...customOnly];
  } catch (e) {
    console.error('Error loading exams from storage:', e);
    return DEFAULT_EXAMS;
  }
};

export const saveExams = (exams) => {
  try {
    localStorage.setItem(KEYS.EXAMS, JSON.stringify(exams));
  } catch (e) {
    console.error('Error saving exams to storage:', e);
  }
};

export const loadChecklistState = () => {
  try {
    const data = localStorage.getItem(KEYS.CHECKLIST);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const saveChecklistState = (state) => {
  try {
    localStorage.setItem(KEYS.CHECKLIST, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving checklist state:', e);
  }
};

export const loadFlaggedState = () => {
  try {
    const data = localStorage.getItem(KEYS.FLAGGED);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const saveFlaggedState = (state) => {
  try {
    localStorage.setItem(KEYS.FLAGGED, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving flagged state:', e);
  }
};

export const loadExamHistory = () => {
  try {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveExamHistory = (history) => {
  try {
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving exam history:', e);
  }
};

export const loadActiveExamId = () => {
  try {
    return localStorage.getItem(KEYS.ACTIVE_EXAM) || 'aws-saa-c03';
  } catch (e) {
    return 'aws-saa-c03';
  }
};

export const saveActiveExamId = (examId) => {
  try {
    localStorage.setItem(KEYS.ACTIVE_EXAM, examId);
  } catch (e) {
    console.error('Error saving active exam ID:', e);
  }
};

// Export all user data as a JSON file
export const exportBackupJSON = () => {
  const backup = {
    version: '1.1',
    exportDate: new Date().toISOString(),
    exams: loadExams(),
    checklist: loadChecklistState(),
    flagged: loadFlaggedState(),
    history: loadExamHistory(),
    taskProgress: readLocalHandsOnProgressArchive()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `ExamPulse_Backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// Import backup JSON data
export const importBackupJSON = (jsonData) => {
  try {
    const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (parsed.exams) saveExams(parsed.exams);
    if (parsed.checklist) saveChecklistState(parsed.checklist);
    if (parsed.flagged) saveFlaggedState(parsed.flagged);
    if (parsed.history) saveExamHistory(parsed.history);
    if (parsed.taskProgress) restoreLocalHandsOnProgressArchiveFromBackup(parsed.taskProgress);
    return { success: true, message: 'Backup successfully imported!' };
  } catch (e) {
    return { success: false, message: 'Invalid backup JSON file.' };
  }
};
