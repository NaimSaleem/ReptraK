# ReptraK - Habit Tracking App

A glossy, habit-tracking mobile app with a Frutiger Aero mood. Available as both a web app and native iOS/Android app.

## Project Structure

```
ReptraK/
├── src/                    # Web app (React + Vite)
├── mobile/                 # Native app (React Native + Expo)
├── styles/                 # Web styles (SCSS)
├── assets/                 # Shared assets
└── index.html              # Web entry point
```

## Web App Setup

The web version runs on React + Vite for fast development:

```bash
npm install
npm run dev
```

Available scripts:

- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

The web app loads GSAP and Font Awesome from CDN via [`index.html`](index.html).

## Mobile App Setup (React Native + Expo)

The mobile version builds native iOS and Android apps using React Native:

```bash
cd mobile
npm install
npm start
```

For detailed setup and Xcode integration, see [MOBILE_SETUP.md](MOBILE_SETUP.md).

### Quick Start

```bash
# Start Expo development server
cd mobile && npm start

# For iOS simulator
npm run ios

# For Android emulator
npm run android

# For web
npm run web
```

### Testing in Xcode

The easiest way to test in Xcode:

1. Open the project: `open mobile/ios/reptrak.xcworkspace`
2. Select a simulator target (iPhone 15 Pro, etc.)
3. Run with Cmd+R

Or use Expo Go:

1. Run `npm start` from `mobile/` directory
2. Press `i` for iOS simulator
3. App loads in Expo Go automatically

## Product direction

ReptraK is a glossy, habit-tracking mobile product with a Frutiger Aero mood:

- optimistic instead of austere
- glassy instead of flat
- layered instead of empty
- calm instead of hyper-gamified

The visual goal is to keep the original deep-indigo and aqua identity while upgrading structure, spacing, and polish so the interface feels premium and intentional.

## Grid system

The prototype uses a 4-column mobile grid tuned for a 402px artboard:

- outer padding: 24px
- column count: 4
- gutter: 10px
- default screen gap: 16px
- large card radius: 30px
- medium radius: 22px
- small radius: 18px

Layout rules:

- one dominant hero surface above the fold
- one primary action per screen
- metrics grouped into 2-up or 3-up rows
- dense information only after the first hero section
- bottom navigation stays visually separate from content cards

## Color and material

Core palette:

- deep indigo: `#23214D`
- softened indigo: `#302D64`
- cyan accent: `#6FD9FF`
- bright highlight cyan: `#9CF1FF`
- cool blue depth: `#49B7EA`

Material rules:

- glass surfaces use white at low opacity over dark indigo
- all premium surfaces get top highlights plus inner gloss
- glow is used selectively around CTAs, hero orbs, and progress surfaces
- avoid making every card equally bright

## Components

### Glass cards

- rounded, translucent, softly glowing
- visible edge definition with a thin high-opacity border
- top-half highlight sheen
- stronger padding than the original prototype

### Glossy buttons

- primary buttons use layered aqua-white gradients
- secondary buttons stay glassy and quiet
- both use capsule radii and subtle hover lift

### Progress ring

- conic gradient + dark center well
- inner glow for legibility
- percentage is the focal number, not the decoration

### Weekly grid

- seven compact capsules
- completed states glow brighter than empty states
- labels stay tiny and quiet

## Motion

Motion should feel buoyant and ambient:

- icons float upward with mild horizontal drift
- screen transitions blur in and settle
- no aggressive bounce or overshoot
- decorative motion must never block the reading path

## Screen priorities

Landing:

- emotional hook
- glossy hero
- immediate CTA

Onboarding:

- one task per screen
- no clutter
- clear forward progression

Dashboard:

- habit name
- completion state
- three compact metrics
- weekly map
- one log action

Insights:

- one chart hero
- two supporting insights
- one rule card to keep information architecture clean

Premium:

- concise value pitch
- four feature badges
- one subscription CTA

## Build process

### Phase 1

- define tokens
- define grid
- define reusable card/button/input/nav patterns

### Phase 2

- implement onboarding flow
- implement dashboard shell
- implement progress logic and persistence

### Phase 3

- add richer analytics
- add premium gating
- refine motion and ambient atmosphere

### Phase 4

- port to a real mobile stack
- keep this repo as visual reference or design prototype

## Notes

This repository is currently a static prototype, not a native mobile app. The cleanest long-term path is to treat this as the visual reference system and then rebuild the product on Expo + React Native once the UI language is locked.
