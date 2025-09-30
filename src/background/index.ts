// Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('🎯 Stolen Titles extension installed!');
});

// 未来可以添加：
// - 定时清理旧数据
// - 每日统计报告
// - 通知功能等