// @ts-ignore
import { removeStopwords } from 'stopword';

// 常见的英文停用词补充
const additionalStopwords = [
  'http', 'https', 'www', 'com', 'org', 'net', 'html', 'php',
  'page', 'site', 'website', 'web', 'home', 'index',
  'and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were',
  'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'should', 'could', 'may', 'might', 'must',
  'can', 'this', 'that', 'these', 'those', 'it', 'its',
  'about', 'into', 'through', 'during', 'before', 'after',
  'how', 'what', 'when', 'where', 'who', 'which', 'why',
  'more', 'most', 'other', 'some', 'such', 'no', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'but', 'if', 'because', 'while', 'there', 'their'
];

// 中文停用词
const chineseStopwords = [
  '的', '了', '和', '是', '在', '我', '有', '个', '人', '这', '中', '大',
  '来', '上', '国', '们', '到', '说', '时', '要', '就', '出', '会', '可',
  '也', '你', '对', '生', '能', '而', '子', '那', '得', '于', '着', '下',
  '自', '之', '年', '过', '发', '后', '作', '里', '用', '道', '行', '所',
  '然', '家', '种', '事', '成', '方', '多', '经', '么', '去', '法', '学',
  '如', '她', '所以', '但是', '因为', '什么', '怎么', '这个', '那个',
  '不是', '没有', '可以', '知道', '看到', '觉得', '已经', '还是', '或者'
];

export interface WordFrequency {
  text: string;
  value: number;
}

// 从标题中提取关键词
export const extractKeywords = (titles: string[]): WordFrequency[] => {
  // 合并所有标题
  const allText = titles.join(' ');

  // 分词：同时处理英文（按空格）和中文（按字符）
  const words = allText
    .toLowerCase()
    // 移除特殊字符，保留中英文、数字
    .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
    // 分割成词
    .split(/\s+/)
    .filter(word => word.length > 0);

  // 分离英文词和中文词
  const englishWords = words.filter(word => /^[a-z0-9]+$/.test(word));
  const chineseWords = words.filter(word => /[\u4e00-\u9fa5]/.test(word));

  // 移除英文停用词
  const filteredEnglish = removeStopwords(englishWords)
    .filter((word: string) =>
      word.length > 2 && // 至少3个字符
      !additionalStopwords.includes(word) &&
      !/^\d+$/.test(word) // 排除纯数字
    );

  // 移除中文停用词
  const filteredChinese = chineseWords
    .filter(word =>
      word.length > 1 && // 至少2个汉字
      !chineseStopwords.includes(word)
    );

  // 合并并计算词频
  const allWords = [...filteredEnglish, ...filteredChinese];
  const frequency = new Map<string, number>();

  allWords.forEach((word: string) => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });

  // 转换为数组并排序
  return Array.from(frequency.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 100); // 最多返回100个关键词
};

// 根据日期范围筛选标题
export const getTitlesByDateRange = (
  records: { [date: string]: Array<{ title: string }> },
  startDate?: string,
  endDate?: string
): string[] => {
  const dates = Object.keys(records).sort();

  const filteredDates = dates.filter(date => {
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  });

  return filteredDates.flatMap(date =>
    records[date].map(record => record.title)
  );
};