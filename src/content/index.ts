// Content Script - 在每个网页中运行，收集标题信息
import { PageRecord } from '../types';
import { addRecord } from '../utils/storage';

// 获取当前时间
function getCurrentTime(): string {
  return new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 从域名提取网站名
function extractSiteName(url: string): string {
  const hostname = new URL(url).hostname.toLowerCase();

  // 常见网站映射 - 优先匹配
  const siteMap: { [key: string]: string } = {
    'github.com': 'GitHub',
    'stackoverflow.com': 'Stack Overflow',
    'twitter.com': 'Twitter',
    'x.com': 'X',
    'youtube.com': 'YouTube',
    'reddit.com': 'Reddit',
    'linkedin.com': 'LinkedIn',
    'medium.com': 'Medium',
    'facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'netflix.com': 'Netflix',
    'amazon.com': 'Amazon',
    'wikipedia.org': 'Wikipedia',
    'openai.com': 'OpenAI',
    'chatgpt.com': 'ChatGPT',
    'google.com': 'Google',
    'docs.google.com': 'Google Docs',
    'drive.google.com': 'Google Drive',
    'mail.google.com': 'Gmail',
    'notion.so': 'Notion',
    'figma.com': 'Figma',
    'discord.com': 'Discord',
    'slack.com': 'Slack',
    'zoom.us': 'Zoom',
    'twitch.tv': 'Twitch',
    'spotify.com': 'Spotify',
    'pinterest.com': 'Pinterest',
    'tiktok.com': 'TikTok',
    'quora.com': 'Quora',
    'bing.com': 'Bing',
    'yahoo.com': 'Yahoo',
    'dropbox.com': 'Dropbox',
    'trello.com': 'Trello',
    'gitlab.com': 'GitLab',
    'bitbucket.org': 'Bitbucket',
    'npmjs.com': 'npm',
    'producthunt.com': 'Product Hunt',
    'dribbble.com': 'Dribbble',
    'behance.net': 'Behance',
    'news.ycombinator.com': 'Hacker News',
    'trademe.co.nz': 'Trade Me',
    'airbnb.com': 'Airbnb',
    'booking.com': 'Booking',
    'ebay.com': 'eBay',
    'etsy.com': 'Etsy',
  };

  // 检查是否在映射表中
  // 优先精确匹配完整域名
  if (siteMap[hostname]) {
    return siteMap[hostname];
  }

  // 再匹配主域名（处理子域名情况）
  // 例如：space.bilibili.com -> bilibili.com
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    const mainDomain = parts.slice(-2).join('.'); // 取最后两部分
    if (siteMap[mainDomain]) {
      return siteMap[mainDomain];
    }
  }

  // 最后检查是否有任何域名匹配
  for (const [domain, siteName] of Object.entries(siteMap)) {
    if (hostname.endsWith('.' + domain)) {
      return siteName;
    }
  }

  // 通用域名提取：去掉 www. 和顶级域名，格式化主域名
  // 例如：www.trademe.co.nz -> trademe -> Trademe
  const parts = hostname.replace(/^www\./, '').split('.');
  if (parts.length > 0) {
    const mainDomain = parts[0];

    // 特殊处理：如果是常见的驼峰命名或连字符，进行分割
    let formatted = mainDomain
      // 处理驼峰：userName -> User Name
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // 处理连字符和下划线：user-name -> User Name
      .replace(/[-_]/g, ' ')
      // 首字母大写
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // 如果格式化后合理（不是纯数字，长度合适），返回
    if (formatted.length > 1 && !/^\d+$/.test(formatted)) {
      return formatted;
    }
  }

  // 兜底：返回主域名（首字母大写）
  return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
}

(async function collectPageInfo() {
  const url = window.location.href;
  const time = getCurrentTime();
  const title = extractSiteName(url);

  // 获取网站 favicon
  const favicon =
    (document.querySelector('link[rel="icon"]') as HTMLLinkElement)?.href ||
    (document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement)?.href ||
    `${new URL(url).origin}/favicon.ico`;

  const record: PageRecord = {
    title,
    url,
    time,
    favicon
  };

  try {
    await addRecord(record);
    console.log('✅ Stolen title:', title);
  } catch (error) {
    // Silent error
  }
})();