# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Title Stealer 是一个 Chrome 浏览器扩展插件（Manifest V3），自动收集用户浏览的每个网页标题，类似 Button Stealer 的设计理念。用户可以在精美的界面中查看、搜索和管理收集的标题。

## 技术栈

- **构建工具**: Vite + TypeScript
- **UI 框架**: React 19 + TailwindCSS v4
- **类型系统**: TypeScript (strict mode)
- **Chrome API**: Manifest V3

## 项目结构

```
src/
├── types/           # TypeScript 类型定义
│   └── index.ts     # PageRecord, StoredRecords 等核心类型
├── utils/           # 工具函数
│   ├── storage.ts   # Chrome Storage API 封装
│   └── date.ts      # 日期格式化工具
├── components/      # React 可复用组件
│   ├── TitleCard.tsx        # 单个标题卡片
│   └── DateSection.tsx      # 日期分组展示
├── pages/           # 页面级组件
│   ├── Popup.tsx           # 弹出窗口（显示今日标题）
│   └── StolenTitles.tsx    # 完整收藏页面
├── content/         # Content Script
│   └── index.ts     # 自动收集网页标题
├── background/      # Background Service Worker
│   └── index.ts     # 后台任务
├── popup.tsx        # Popup 入口
├── stolen-titles.tsx # 全页面入口
└── index.css        # 全局样式（TailwindCSS）

public/
├── manifest.json    # Chrome Extension 配置
└── icon*.png        # 插件图标
```

## 核心功能

### 1. 自动收集标题
- **位置**: [src/content/index.ts](src/content/index.ts)
- 在每个网页自动运行，提取标题、URL、时间和 favicon
- 使用 `chrome.storage.local` 按日期存储
- 自动去重（同一天同一 URL 不重复记录）

### 2. 弹出界面
- **位置**: [src/pages/Popup.tsx](src/pages/Popup.tsx)
- 显示今日收集的标题列表
- 点击"View All Stolen Titles"打开完整页面

### 3. 完整收藏页面
- **位置**: [src/pages/StolenTitles.tsx](src/pages/StolenTitles.tsx)
- 按日期分组展示所有收集的标题
- 搜索功能（标题和 URL）
- 删除功能（悬停显示删除按钮）
- 点击标题卡片跳转到原网页

### 4. 数据管理
- **位置**: [src/utils/storage.ts](src/utils/storage.ts)
- 提供统一的 Storage API 封装
- 核心函数：`getAllRecords()`, `getTodayRecords()`, `addRecord()`, `deleteRecord()`

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建生产版本
npm run build

# 构建输出位置
dist/
```

## 加载到 Chrome

1. 运行 `npm run build` 构建项目
2. 打开 `chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist/` 目录

## 调试

- **Content Script**: 在任意网页打开 DevTools → Console，查看 "✅ Stolen title" 日志
- **Popup**: 右键插件图标 → "检查弹出内容"
- **Background**: 在 `chrome://extensions/` 点击"Service Worker"
- **Full Page**: 打开 `chrome-extension://[id]/stolen-titles.html`，使用 DevTools

## 数据结构

```typescript
// 单条记录
interface PageRecord {
  title: string;
  url: string;
  time: string;      // HH:MM 格式
  favicon?: string;  // 网站图标 URL
}

// 存储格式
interface StoredRecords {
  "2025-10-01": PageRecord[];
  "2025-09-30": PageRecord[];
  // ...
}
```

## 设计理念（参考 Button Stealer）

- ✅ **自动收集** - 无需用户手动操作
- ✅ **可视化展示** - 精美的卡片式布局
- ✅ **可交互** - 点击跳转、悬停删除
- ✅ **本地隐私** - 所有数据仅存储在用户浏览器
- ✅ **组件化架构** - 易于扩展和维护

## 扩展方向

- [ ] 关键词提取和标签系统
- [ ] 导出功能（JSON/CSV/PDF）
- [ ] 统计图表（Chart.js）
- [ ] 网站白名单/黑名单
- [ ] 搜索历史记录
- [ ] 数据备份和同步