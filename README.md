# Title Stealer

A Chrome extension that automatically collects and organizes webpage titles from your browsing history.

## Overview

Title Stealer is inspired by [Button Stealer](https://chromewebstore.google.com/detail/button-stealer/iiikidmnimlpahbeknmkeonmemajpccj) - instead of collecting buttons, it collects webpage titles. The extension automatically captures the title, URL, timestamp, and favicon of every page you visit, organizing them in a beautiful, searchable interface.

All data is stored locally in your browser. Nothing is uploaded to any server.

## Features

### Current Features

- **Automatic Collection** - Captures page title, URL, time, and favicon from every website you visit
- **Daily Organization** - Automatically groups collected titles by date
- **Quick Access Popup** - Click the extension icon to see today's collected titles
- **Full Collection View** - Dedicated page showing all your collected titles with rich UI
- **Search & Filter** - Search across titles and URLs
- **Delete Unwanted Items** - Hover over any title card to delete it
- **Click to Revisit** - Click any title card to reopen that webpage
- **Privacy-First** - All data stored locally, nothing sent to servers

### Planned Features

- Keyword extraction and tagging
- Export functionality (JSON/CSV/PDF)
- Statistics and visualizations (Chart.js)
- Whitelist/blacklist for specific websites
- Data backup and sync options

## Technology Stack

- **Build Tool**: Vite
- **Language**: TypeScript (strict mode)
- **UI Framework**: React 19
- **Styling**: TailwindCSS v4
- **Extension API**: Chrome Manifest V3

## Project Structure

```
src/
├── types/              Type definitions
├── utils/              Utility functions (storage, date)
├── components/         Reusable React components
├── pages/              Page-level components (Popup, StolenTitles)
├── content/            Content script (runs on every webpage)
└── background/         Background service worker

public/
├── manifest.json       Extension configuration
└── icon*.png          Extension icons
```

## Installation

### For Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` directory

### For Users

The extension will be available on the Chrome Web Store soon.

## Development

### Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode (watch mode)
npm run dev
```

### Debugging

- **Content Script**: Open DevTools on any webpage, check Console for "Stolen title" logs
- **Popup**: Right-click extension icon → "Inspect popup"
- **Background Worker**: Go to `chrome://extensions/` → Click "Service Worker"
- **Full Page**: Open the stolen-titles page and use DevTools normally

## Data Structure

All data is stored in `chrome.storage.local` under the key `stolen_titles`:

```typescript
{
  "2025-10-01": [
    {
      "title": "Example Page Title",
      "url": "https://example.com",
      "time": "14:30",
      "favicon": "https://example.com/favicon.ico"
    }
  ],
  "2025-09-30": [ ... ]
}
```

## Privacy

- All data is stored locally in your browser using `chrome.storage.local`
- No analytics, tracking, or data collection
- No external network requests
- No permissions beyond what's needed for basic functionality

## Permissions

The extension requires:

- `storage` - To save collected titles locally
- `tabs` - To access page information
- `<all_urls>` - To run on all websites and collect titles

## License

ISC

## Credits

Inspired by [Button Stealer](https://github.com/anatolyzenkov/button-stealer) by Anatoly Zenkov.

## Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.