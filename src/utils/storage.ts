import { PageRecord, StoredRecords, STORAGE_KEY } from '../types';

// 获取所有记录
export const getAllRecords = async (): Promise<StoredRecords> => {
  const data = await chrome.storage.local.get([STORAGE_KEY]);
  return data[STORAGE_KEY] || {};
};

// 获取指定日期的记录
export const getRecordsByDate = async (date: string): Promise<PageRecord[]> => {
  const allRecords = await getAllRecords();
  return allRecords[date] || [];
};

// 获取今天的记录
export const getTodayRecords = async (): Promise<PageRecord[]> => {
  const today = new Date().toISOString().split('T')[0];
  return getRecordsByDate(today);
};

// 添加一条记录
export const addRecord = async (record: PageRecord): Promise<void> => {
  const date = new Date().toISOString().split('T')[0];
  const allRecords = await getAllRecords();

  if (!allRecords[date]) {
    allRecords[date] = [];
  }

  // 避免重复记录相同 URL
  const exists = allRecords[date].some(item => item.url === record.url);
  if (!exists) {
    allRecords[date].push(record);
    await chrome.storage.local.set({ [STORAGE_KEY]: allRecords });
  }
};

// 删除一条记录
export const deleteRecord = async (date: string, url: string): Promise<void> => {
  const allRecords = await getAllRecords();
  if (allRecords[date]) {
    allRecords[date] = allRecords[date].filter(item => item.url !== url);
    await chrome.storage.local.set({ [STORAGE_KEY]: allRecords });
  }
};

// 清空指定日期的记录
export const clearDate = async (date: string): Promise<void> => {
  const allRecords = await getAllRecords();
  delete allRecords[date];
  await chrome.storage.local.set({ [STORAGE_KEY]: allRecords });
};

// 获取所有日期列表（降序）
export const getAllDates = async (): Promise<string[]> => {
  const allRecords = await getAllRecords();
  return Object.keys(allRecords).sort().reverse();
};

// 屏蔽词相关
const IGNORED_KEYWORDS_KEY = 'ignored_keywords';

// 获取屏蔽词列表
export const getIgnoredKeywords = async (): Promise<string[]> => {
  const data = await chrome.storage.local.get([IGNORED_KEYWORDS_KEY]);
  return data[IGNORED_KEYWORDS_KEY] || [];
};

// 保存屏蔽词列表
export const saveIgnoredKeywords = async (keywords: string[]): Promise<void> => {
  await chrome.storage.local.set({ [IGNORED_KEYWORDS_KEY]: keywords });
};

// 清空所有记录
export const clearAllRecords = async (): Promise<void> => {
  await chrome.storage.local.set({ [STORAGE_KEY]: {} });
};