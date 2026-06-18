---
name: Match Day Pulse
colors:
  surface: '#111417'
  surface-dim: '#111417'
  surface-bright: '#37393d'
  surface-container-lowest: '#0b0e11'
  surface-container-low: '#191c1f'
  surface-container: '#1d2023'
  surface-container-high: '#272a2e'
  surface-container-highest: '#323538'
  on-surface: '#e1e2e7'
  on-surface-variant: '#ebbbb4'
  inverse-surface: '#e1e2e7'
  inverse-on-surface: '#2e3134'
  outline: '#b18780'
  outline-variant: '#603e39'
  surface-tint: '#ffb4a8'
  primary: '#ffb4a8'
  on-primary: '#690100'
  primary-container: '#ff5540'
  on-primary-container: '#5c0000'
  inverse-primary: '#c00100'
  secondary: '#d3fbff'
  on-secondary: '#00363a'
  secondary-container: '#00eefc'
  on-secondary-container: '#00686f'
  tertiary: '#c2c7d0'
  on-tertiary: '#2c3138'
  tertiary-container: '#8c919a'
  on-tertiary-container: '#252a31'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#930100'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#00dbe9'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#dee2ec'
  tertiary-fixed-dim: '#c2c7d0'
  on-tertiary-fixed: '#171c23'
  on-tertiary-fixed-variant: '#42474f'
  background: '#111417'
  on-background: '#e1e2e7'
  surface-variant: '#323538'
typography:
  display-lg:
    fontFamily: sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: sora
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: plusJakartaSans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: plusJakartaSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: plusJakartaSans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: plusJakartaSans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 16px
  gutter-mobile: 12px
---

## Brand & Style

This design system is engineered to capture the electric atmosphere of a live stadium and translate it into a premium, high-energy digital experience. The brand personality is aggressive yet intuitive—marrying the adrenaline of sports with the refined usability of modern social platforms.

The visual style is a hybrid of **Glassmorphism** and **High-Contrast Modernism**. It leverages deep, atmospheric backgrounds to make "moments" (digital collectibles) feel like they are glowing under stadium floodlights. The emotional goal is to make the user feel like a VIP fan with an "all-access pass" to the game’s most iconic highlights. 

Key principles:
- **Energy over Staticity:** Use of vibrant accents and subtle glows to imply movement.
- **Web2 Intuition:** Layouts and patterns follow familiar social media mental models (vertical feeds, stories, quick-action overlays).
- **Premium Utility:** A clean, systematic approach that ensures "trading" and "collecting" feels as effortless as "liking" a photo.

## Colors

The color palette is built on a "Stadium Dark" foundation. The core experience lives in a deep, nocturnal environment to allow the vibrant brand colors to pop with maximum intensity.

- **Primary (Chiliz Red):** Used exclusively for high-priority actions, critical UI states, and brand-identifying elements. It represents the heart of the sport.
- **Secondary (Stadium Cyan):** Used for technical highlights, active states of collectibles, and "Web3" interaction cues. It mimics the cool glow of stadium LED screens.
- **Surface Layers:** 
    - `#0B0E11` (Deep Navy) is the base background.
    - `#161B22` (Slate) is used for container backgrounds and elevated cards.
- **Semantic Accents:** Use high-saturation greens for "Success/Trade Complete" and pure white for primary text to ensure extreme legibility against dark backgrounds.

## Typography

The typographic hierarchy balances "Athletic Boldness" with "Digital Precision." 

- **Sora** is the display typeface. It should be used in heavy weights (700-800) for headers and titles to evoke the feel of a digital scoreboard. Use tight letter-spacing for large headlines to increase impact.
- **Plus Jakarta Sans** provides a friendly, approachable contrast for all functional and long-form text. It keeps the "Web2" promise of high readability and familiarity.
- **Labels:** Use uppercase styling for labels and metadata (e.g., "MINT #402") to provide a technical, collectible-item aesthetic.

## Layout & Spacing

The layout philosophy is mobile-first, utilizing a **Fluid Grid** that prioritizes thumb-friendly interaction zones. 

- **Grid:** Use a 4-column grid for mobile with 16px outer margins. Gutters are kept tight (12px) to allow content like "Moment Cards" to feel expansive and immersive.
- **Rhythm:** All spacing is based on an 8px baseline. Use 16px (md) for standard padding within containers and 24px (lg) to separate distinct sections (e.g., between "Live Now" and "Marketplace").
- **Safe Areas:** Ensure bottom-anchored CTA buttons account for mobile home indicators with a minimum 32px bottom clearance.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Glassmorphism**, rather than traditional heavy shadows.

- **Background (Level 0):** Pure `#0B0E11`.
- **Containers (Level 1):** `#161B22` with a subtle 1px border of `#ffffff10` (10% white) to define edges.
- **Glass Overlays (Level 2):** For modals and navigation bars, use a backdrop blur (20px) with a semi-transparent fill of `#161B22CC`. This maintains the "Stadium Dark" feel while showing the energy of the content beneath.
- **Glow Effects:** Critical components like "Rare Moments" or "Active Trades" should utilize a soft, 20% opacity drop shadow tinted with the Secondary Cyan or Primary Red to simulate light emission.

## Shapes

The shape language is "Soft-Modern." Despite the high-energy athletic theme, corners are kept generously rounded to maintain the premium, friendly Web2 feel.

- **Base Radius:** 16px (1rem) for all standard cards and containers.
- **Button Radius:** Use fully rounded (pill-shaped) corners for main action buttons to maximize clickability perception.
- **Inputs:** 12px roundedness to differentiate from large structural cards.
- **Visual Continuity:** Every interactive element should avoid sharp 90-degree angles to ensure the UI feels "tactile" and safe.

## Components

### Buttons
- **Primary:** High-impact Chiliz Red fill with white text. Pill-shaped.
- **Secondary:** Transparent with a 1.5px Cyan border or a glass-blur background.
- **Action Size:** Minimum height of 56px for main mobile CTAs.

### Moment Cards
The hero component of the app.
- **Structure:** 16px rounded corners, full-bleed imagery/video.
- **Overlay:** A bottom-aligned gradient (Black to Transparent) to house the "Moment Title" and "Serial Number."
- **Glass Header:** Small, semi-transparent chips at the top of the card indicating "Rarity" or "Team."

### Chips & Tags
- **Style:** Small, uppercase labels with a 1px border.
- **Function:** Used for categories like "Goal," "Save," or "Epic."

### Input Fields
- **Style:** Dark slate backgrounds (`#161B22`) with a subtle border. On focus, the border transitions to Stadium Cyan with a soft outer glow.
- **Placeholder:** Mid-grey text for clear contrast without distracting from the main content.

### Lists & Feeds
- **Structure:** Use "Gapless" lists for data-heavy views, separated by 1px slate dividers. For the "Moment Feed," use 16px vertical spacing between cards to allow each item to breathe.