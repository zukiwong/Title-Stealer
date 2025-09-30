// Content Script - 在每个网页中运行，收集标题信息
import { PageRecord } from '../types';
import { addRecord } from '../utils/storage';
import { getCurrentTime } from '../utils/date';

(async function collectPageInfo() {
  const title = document.title;
  const url = window.location.href;
  const time = getCurrentTime();

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
    console.error('❌ Failed to steal title:', error);
  }
})();