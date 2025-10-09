# Title Stealer

I steal your titles and turn them into something meaningful. Or not.

A Chrome extension that captures website names as you browse and visualizes them as floating text art.

Inspired by [Button Stealer](https://chromewebstore.google.com/detail/button-stealer/iiikidmnimlpahbeknmkeonmemajpccj). Everything stays local in your browser.

## Screenshots

![Statistics Page](screenshots/statistics.png)

## Features

- Automatically captures website names as you browse
- Visualizes your browsing patterns with floating text animations
- Filter by time range (today, week, month, all time)
- Upload custom background and text images
- Block specific websites from tracking
- All data stored locally in your browser

## Design Philosophy

- **Minimalist** - Clean, distraction-free interface
- **Immersive** - Full-screen experiences
- **Artistic** - Transform browsing data into visual art
- **Fast** - Smooth animations and instant loading

## Installation

Search for "Title Stealer" in the [Chrome Web Store](https://chromewebstore.google.com/detail/title-stealer/ihcfgpeojochpkncecmaifpdmobcclmi). 
Currently under review...

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

## Credits

- Inspired by [Button Stealer](https://github.com/anatolyzenkov/button-stealer) by Anatoly Zenkov
- Built with fonts from [Google Fonts](https://fonts.google.com/) (Poppins)
- Background images from [Unsplash](https://unsplash.com/)


