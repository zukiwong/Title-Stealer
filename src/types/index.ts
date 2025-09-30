// 网页记录类型
export interface PageRecord {
  title: string;
  url: string;
  time: string;
  favicon?: string; // 网站图标
  keywords?: string[]; // 关键词（未来扩展）
}

// 按日期组织的记录
export interface StoredRecords {
  [date: string]: PageRecord[];
}

// Storage key 常量
export const STORAGE_KEY = 'stolen_titles' as const;