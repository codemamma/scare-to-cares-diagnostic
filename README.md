# CARES Leadership Diagnostic

A premium, executive-friendly diagnostic tool inspired by the SCARE to CARES framework from Saby Waraich's leadership work.

## Overview

This standalone React application helps leaders identify transformation friction in their organizations and discover actionable focus areas for strengthening their leadership capacity.

## Features

- **Multi-Step Diagnostic Journey**
  - Quick SCARE Score Assessment (1-20)
  - SCARE Index Analysis (0-100)
  - CARES Focus Area Detection
  - Focused Assessment Quiz
  - Leadership Insight Summary
  - Email Capture
  - Personalized Action Plan

- **Premium Design**
  - Black and purple color theme
  - Executive-friendly interface
  - Mobile responsive
  - Polished card-based layouts

- **Framework Integration**
  - SCARE dimensions: Stress, Confusion, Anxiety, Resistance, Ego
  - CARES principles: Communicate, Adjust, Relate, Empower, Stay Calm
  - Chapter-based recommendations

## Technology Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Modern JavaScript (ES6+)

## Getting Started

Install dependencies:
```bash
npm install
```

Start development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── Header.jsx
│   └── Footer.jsx
├── pages/          # Main page components
│   ├── Home.jsx
│   └── Diagnostic.jsx
├── data/           # Data structure and logic
│   └── diagnosticData.js
├── App.jsx         # Main application component
└── index.css       # Global styles
```

## Data Structure

The diagnostic uses placeholder data that can be easily replaced with JSON files:

- `scareQuestions` - Initial 5-question assessment
- `focusedAssessmentQuestions` - Focus-area-specific questions
- `scareDimensions` - SCARE framework dimensions
- `caresDimensions` - CARES framework principles
- `getRecommendedChapters()` - Chapter-based recommendations

## Future Enhancements

- Connect to local JSON files for questions and recommendations
- Add knowledge base integration
- Implement backend data persistence
- Add analytics and tracking
- Connect to companion app

## Design Philosophy

This application is designed as a serious leadership diagnostic tool, not a casual quiz. It targets:

- CIOs
- Transformation Leaders
- Program Managers
- Executive Teams

The user experience prioritizes clarity, trust, and actionable insights.

## License

All rights reserved.

## Inspiration

Based on the SCARE to CARES framework by Saby Waraich.
Learn more at [sabywaraich.com](https://sabywaraich.com)
