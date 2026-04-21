# Design Brief: Ganpati Idol Marketplace

## Tone
Ceremonial luxury — reverent yet celebratory. Premium marketplace for Hindu spiritual devotional idols. Warm, auspicious, trustworthy.

## Differentiation
Festival-appropriate saffron/gold palette + regal serif display typography create immediate spiritual/celebratory recognition. Not generic e-commerce.

## Color Palette

| Token | OKLCH | Usage | Visual |
| --- | --- | --- | --- |
| Primary (Burnt Orange) | `0.65 0.22 45` | CTAs, highlights, hero accents | 🧡 Deep saffron |
| Secondary (Gold) | `0.75 0.18 65` | Secondary highlights, borders, icons | ⭐ Warm gold |
| Accent (Rich Red) | `0.50 0.20 25` | Destructive/critical, emphasis | 🔴 Regal red |
| Background | `0.98 0.01 60` | Page base | Cream with subtle warmth |
| Card | `0.995 0 0` | Card surfaces, modals, popovers | Pure white |
| Foreground | `0.2 0.05 25` | Body text, primary content | Deep charcoal |
| Border | `0.88 0.02 60` | Dividers, subtle separations | Light warm grey |

## Typography

| Tier | Font | Usage | Notes |
| --- | --- | --- | --- |
| Display | Fraunces (serif) | Headings, hero headlines, hero CTA | Elegant, classical, ceremony |
| Body | GeneralSans (sans-serif) | Body text, UI labels, nav | Modern, legible, 16px base |
| Mono | GeistMono | Code, admin tables, status badges | Technical clarity |

## Elevation & Depth

| Surface | Shadow | Background | Border | Context |
| --- | --- | --- | --- | --- |
| Page | none | `bg-background` | none | Subtle cream base |
| Header | `shadow-subtle` | `bg-card` | `border-b border-border` | Navigation and branding |
| Hero Section | none | `gradient-subtle` | none | Full-width showcase |
| Content Sections | alternate `bg-muted/20` | `bg-background` or `bg-muted/20` | none | Breathing room |
| Cards (Idols) | `shadow-elevated` | `bg-card` | none | Featured listings |
| Footer | `shadow-subtle` | `bg-muted/30` | `border-t border-border` | Contact, links |

## Structural Zones

| Zone | Treatment | Purpose |
| --- | --- | --- |
| Header/Nav | Fixed or sticky, `bg-card` with subtle bottom border, logo + nav links in serif display font small caps | Always visible, branding anchor |
| Hero | Full-width image + overlay text, serif display headline "Shop Premium Ganpati Idols", warm gradient accent, golden CTA button | Immediate spiritual/celebratory impact |
| Featured Catalog | Grid of 6–8 idol cards (3 col desktop, 2 col tablet, 1 col mobile), each with image, title, category tag, price, "View Details" link | Showcase premium offerings |
| Category Quick Links | Horizontal scrollable or flex row, secondary buttons (Material/Size/Style), gold accent hover state | Accessible filtering entry |
| Trust Section | 3–4 trust signals (Heritage, Quality, Service, Community), icons + descriptive text, subtle backgrounds | Credibility reinforcement |
| Admin Sidebar | `bg-sidebar`, vertical nav with serif display section headers, active state in primary saffron | Role separation visual |
| Footer | Multiple columns: Quick Links, About, Contact, Social | Closing engagement |

## Spacing & Rhythm

- Base unit: 8px grid
- Heading margin-bottom: 24px
- Paragraph line-height: 1.6
- Card padding: 24px (desktop), 16px (mobile)
- Grid gaps: 24px (featured catalog), 12px (tight layouts)
- Container max-width: 1200px, center with 2rem padding

## Component Patterns

- **Buttons**: Primary (saffron bg, white text), Secondary (outline saffron border), Ghost (text only)
- **Inputs**: Warm border on focus (`border-primary`), no box-shadow default
- **Modals**: Elevated shadow, card background, serif display title
- **Status**: Green for active, red for inactive, gold for pending
- **Icons**: Outline style, 24px base, inherit color from text
- **Tags**: Pill-shaped (rounded-full), muted background + foreground text, 12px font

## Motion

- **Transition smooth** (0.3s ease-out): All interactive elements (hover, focus, active states)
- **Entrance**: Fade-in 0.2s on page load, stagger for catalog cards
- **Micro**: Subtle shadow lift on button hover, icon rotation (90deg) for expand/collapse
- No bounce or elastic animations — maintains reverent tone

## Custom Utilities
- `.gradient-primary`: Saffron-to-gold gradient for hero CTA
- `.gradient-subtle`: Cream-to-white subtle gradient for section backgrounds
- `.shadow-elevated`: 20px blur for featured cards
- `.shadow-subtle`: 12px blur for headers/footers

## Constraints & Anti-Patterns
- ✅ Use warm color palette consistently across both user and admin interfaces
- ✅ Serif display font for all headings and navigation text (not body)
- ✅ Token-only color styling (no hex literals, no arbitrary Tailwind classes)
- ❌ No full-page color backgrounds (use background + card layering)
- ❌ No purple, cool blue, or cool green (breaks festival theme)
- ❌ No sans-serif for display headings (breaks regal tone)

## Signature Detail
Saffron-gold gradient on all primary CTAs with subtle shadow-elevated lift on hover, creating a "blessed" or "auspicious" feel appropriate to Hindu festival context while maintaining premium marketplace aesthetic.
