export interface WordFrequency {
  text: string;
  value: number;
}

// 统计网站名出现次数（不再拆分成单词）
export const extractKeywords = (titles: string[], customIgnoredKeywords: string[] = []): WordFrequency[] => {
  // 直接统计每个网站名的出现次数
  const frequency = new Map<string, number>();

  titles.forEach(title => {
    // 过滤掉屏蔽词
    if (!customIgnoredKeywords.includes(title.toLowerCase())) {
      frequency.set(title, (frequency.get(title) || 0) + 1);
    }
  });

  // 转换为数组并排序
  return Array.from(frequency.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 100); // 最多返回100个网站
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