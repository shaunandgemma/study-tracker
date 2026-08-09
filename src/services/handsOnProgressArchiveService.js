import { supabase } from '../lib/supabase.js';
import { HANDS_ON_PROGRESS_ARCHIVE_POLICY } from '../data/handsOnProgressArchivePolicy.js';

export const HANDS_ON_PROGRESS_ARCHIVE_KEY = 'exampulse_task_progress_v1';

export function readLocalHandsOnProgressArchive(storage = globalThis.localStorage) {
  if (!HANDS_ON_PROGRESS_ARCHIVE_POLICY.allowHistoricalReads || !storage) return {};
  try {
    const data = storage.getItem(HANDS_ON_PROGRESS_ARCHIVE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function restoreLocalHandsOnProgressArchiveFromBackup(progress, storage = globalThis.localStorage) {
  if (!HANDS_ON_PROGRESS_ARCHIVE_POLICY.allowExplicitBackupRestore || !storage) return false;
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return false;
  try {
    storage.setItem(HANDS_ON_PROGRESS_ARCHIVE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export async function fetchHostedHandsOnProgressArchive(userId, client = supabase) {
  if (!HANDS_ON_PROGRESS_ARCHIVE_POLICY.allowHistoricalReads || !userId || !client) return [];
  const { data, error } = await client
    .from('hands_on_task_progress')
    .select('*')
    .eq('user_id', userId);
  if (error || !Array.isArray(data)) return [];
  return data.map(row => ({
    taskId: row.task_id,
    selectedMode: row.selected_mode,
    consoleCompletedItems: row.console_completed_items || [],
    cliCompletedItems: row.cli_completed_items || [],
    verificationCompletedItems: row.verification_completed_items || [],
    cleanupCompletedItems: row.cleanup_completed_items || [],
    isCompleted: row.is_completed,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    updatedAt: row.updated_at
  }));
}
