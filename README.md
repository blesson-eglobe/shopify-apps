# AppStoreHub

Marketing site for **AppStoreHub** — a suite of Shopify apps built for merchants.

## Apps Featured

| App | Description | Page |
|-----|-------------|------|
| **Mealbot** | AI-powered meal planning & subscription management | `mealbot.html` |
| **QuoteBuilder** | Custom quotes & discount negotiation workflows | `quotebuilder.html` |

## Tech Stack

- **HTML** — Semantic, multi-page static site
- **LESS → CSS** — Modular styles (`variables.less`, `base.less`, `styles.less`)
- **Vanilla JS** — Counters, mobile drawer, animations (`script/index.js`)
- **Inter** (Google Fonts) + **BoxIcons** for typography & icons

## Project Structure

```
├── index.html            # Landing page (hero, apps grid, features, CTA)
├── mealbot.html          # Mealbot app detail page
├── quotebuilder.html     # QuoteBuilder app detail page
├── css/
│   ├── variables.less    # Design tokens (colors, spacing, etc.)
│   ├── base.less         # Resets & base styles
│   ├── styles.less       # Main stylesheet (source)
│   └── styles.css        # Compiled output (linked in HTML)
├── script/
│   └── index.js          # DOM interactions & animations
└── images/
    ├── meal_bot.svg      # Mealbot logo
    └── quill_qoute.svg   # QuoteBuilder logo
```

## Getting Started

1. Clone the repo
2. Open `index.html` in a browser — no build step needed for the static site
3. To edit styles, modify the `.less` files

## Responsive

Fully responsive with a mobile hamburger drawer, fluid typography (`clamp()`), and breakpoints for tablet/mobile layouts.

