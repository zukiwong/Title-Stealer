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

// 智能简化标题 - 针对常见网站
function simplifyTitle(title: string, url: string): string {
  const hostname = new URL(url).hostname.toLowerCase();

  // 常见网站映射
  const siteMap: { [key: string]: string } = {
    'github.com': 'GitHub',
    'stackoverflow.com': 'Stack Overflow',
    'twitter.com': 'Twitter',
    'x.com': 'X (Twitter)',
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
    'hackernews.ycombinator.com': 'Hacker News',
    'news.ycombinator.com': 'Hacker News',
  };

  // 检查是否是常见网站
  for (const [domain, siteName] of Object.entries(siteMap)) {
    if (hostname === domain || hostname.endsWith('.' + domain)) {
      return siteName;
    }
  }

  // ChatGPT 特殊处理
  if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) {
    return 'ChatGPT';
  }

  // Dribbble 特殊处理
  if (hostname.includes('dribbble.com')) {
    return 'Dribbble';
  }

  // 通用标题清理：去除常见的分隔符后的网站名/Slogan
  // 格式：标题 - 网站名, 标题 | 网站名, 标题 · 网站名
  const separators = [' - ', ' | ', ' · ', ' – ', ' — ', ' :: '];
  for (const sep of separators) {
    if (title.includes(sep)) {
      const parts = title.split(sep);
      // 如果第一部分不是太短，就用第一部分
      if (parts[0].trim().length > 3) {
        return parts[0].trim();
      }
    }
  }

  // 如果标题太长（超过 60 字符），尝试从域名提取网站名
  if (title.length > 60) {
    // 从域名提取：trademe.co.nz -> Trade Me
    const domainParts = hostname.replace(/^www\./, '').split('.');
    if (domainParts.length > 0) {
      const siteName = domainParts[0];
      // 将域名转换为标题格式：trademe -> Trade Me
      const formatted = siteName
        .split(/(?=[A-Z])/) // 按大写字母分割（如 trademe 不分割，但 tradMe 会分割）
        .join(' ')
        .replace(/\b\w/g, c => c.toUpperCase()); // 首字母大写

      // 如果格式化后看起来合理（不是纯数字或太短），就使用它
      if (formatted.length > 2 && !/^\d+$/.test(formatted)) {
        return formatted;
      }
    }

    // 否则截断标题
    return title.substring(0, 60) + '...';
  }

  return title;
}

(async function collectPageInfo() {
  const rawTitle = document.title;
  const url = window.location.href;
  const time = getCurrentTime();
  const title = simplifyTitle(rawTitle, url);

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