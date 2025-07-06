# Request Indexing - Next.js Implementation

A Next.js implementation of the Request Indexing app using Hero UI components, inspired by the original Nuxt.js version.

## Features

- 🏠 **Landing Page**: Beautiful hero section with gradient background
- 📊 **Dashboard**: View all your sites with analytics data
- 📈 **Site Cards**: Individual site performance metrics with charts
- 🎨 **Hero UI Components**: Modern, accessible UI components
- 🌙 **Dark Mode**: Full dark mode support
- 📱 **Responsive**: Works on all device sizes

## Setup Instructions

### 1. Install Missing Hero UI Packages

You need to install the additional Hero UI packages that aren't already in your project:

```bash
npm install @heroui/card @heroui/dropdown @heroui/spinner @heroui/chip @heroui/tooltip
```

### 2. Install Heroicons

For the icons used throughout the app:

```bash
npm install @heroicons/react
```

### 3. Update Tailwind Config

Make sure your `tailwind.config.js` includes the Hero UI theme and the new component paths:

```js
import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ... existing paths
    "./components/request-indexing/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}
```

## File Structure

```
components/request-indexing/
├── site-card.tsx           # Individual site performance card
├── trend-percentage.tsx    # Trend indicator component
├── metric-gauge.tsx        # Circular progress gauge
├── graph-clicks.tsx        # Simple chart component
├── gradient-background.tsx # Hero section background
├── hero-section.tsx        # Main landing page hero
└── index.ts               # Component exports

types/
└── request-indexing.ts     # TypeScript interfaces

app/
├── page.tsx               # Landing page
└── dashboard/
    └── page.tsx           # Dashboard page
```

## Components Overview

### SiteCard
Displays individual site metrics including:
- Site URL and favicon
- Indexed percentage
- Clicks and impressions with trend indicators
- Performance graph
- Permission level indicators

### Dashboard
Shows all sites in a grid layout with:
- Total metrics across all sites
- Individual site cards
- Add new site option
- Refresh functionality

### Landing Page
Features:
- Hero section with call-to-action
- Demo site cards
- Feature highlights
- Responsive design

## Usage

1. **Landing Page**: Visit `/` to see the main landing page
2. **Dashboard**: Visit `/dashboard` to see the site management dashboard
3. **Mock Data**: Currently uses mock data for demonstration

## Customization

- **Colors**: Modify the Hero UI theme in `tailwind.config.js`
- **Mock Data**: Update the mock data in the components to match your needs
- **API Integration**: Replace mock data with real API calls to Google Search Console
- **Authentication**: Add authentication flow for Google OAuth

## Next Steps

To make this a fully functional app, you would need to:

1. Set up Google Search Console API integration
2. Add authentication (Google OAuth)
3. Create backend API routes
4. Add database for storing user data
5. Implement real-time data fetching
6. Add URL submission functionality

## Dependencies

The app uses these main dependencies:
- Next.js 15+
- React 18+
- Hero UI v2+
- Heroicons
- TypeScript
- Tailwind CSS

## Notes

This implementation focuses on the UI/UX and component structure. The original Nuxt.js app includes full backend functionality with Google APIs, authentication, and data persistence that would need to be implemented separately for a production version.