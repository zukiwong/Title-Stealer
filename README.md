# Title Stealer

A minimalist Chrome extension that transforms your browsing history into beautiful word clouds.

## Overview

Title Stealer automatically collects webpage titles as you browse, extracting keywords to create stunning immersive visualizations. Inspired by [Button Stealer](https://chromewebstore.google.com/detail/button-stealer/iiikidmnimlpahbeknmkeonmemajpccj), but focused on text and visual artistry.

All data is stored locally in your browser. Nothing is uploaded to any server.

## Features

- **Automatic Collection** - Captures page titles, URLs, and timestamps from every website you visit
- **Immersive Word Cloud** - Full-screen black background with floating white words
  - Keywords sized by frequency
  - Smooth floating animations
  - Background image with artistic text fill
  - Time-based filtering (today, week, month, all time)
- **Beautiful Popup** - Dark themed with floating word effects
  - Quick access to your collection
  - Settings page for keyword management
  - Word count statistics
- **Keyword Extraction** - Intelligent keyword extraction supporting both English and Chinese
  - Automatic stopword filtering
  - Frequency analysis
  - Customizable ignored keywords
- **Privacy-First** - All data stored locally, nothing sent to servers

## Design Philosophy

- **Minimalist** - Clean, distraction-free interface
- **Immersive** - Full-screen experiences
- **Artistic** - Transform browsing data into visual art
- **Fast** - Smooth animations and instant loading

## Installation

### For Development

   Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` directory

### For Users

The extension will be available on the Chrome Web Store soon.

## Technology

Built with React, TypeScript, TailwindCSS, and Framer Motion.

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

- Inspired by [Button Stealer](https://github.com/anatolyzenkov/button-stealer) by Anatoly Zenkov
- Built with fonts from [Google Fonts](https://fonts.google.com/) (Poppins)
- Background images from [Unsplash](https://unsplash.com/)


