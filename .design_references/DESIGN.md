---
name: Obsidian Utility Suite (Light)
colors:
  surface: '#fcf8f8'
  surface-dim: '#ddd9d9'
  surface-bright: '#fcf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c8'
  surface-tint: '#5d5f5f'
  primary: '#5d5f5f'
  on-primary: '#ffffff'
  primary-container: '#ffffff'
  on-primary-container: '#747676'
  inverse-primary: '#c6c6c7'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffffff'
  on-tertiary-container: '#747676'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fcf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  image-blue: '#3B82F6'
  pdf-red: '#EF4444'
  other-purple: '#A855F7'
  success-green: '#10B981'
  text-main: '#0F172A'
  text-muted: '#64748B'
  border-subtle: '#E2E8F0'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  unit: 8px
  section-gap: 80px
---

## Brand & Style

The design system is a professional, high-utility workspace tailored for peak productivity. By pivoting to a clean, light-mode aesthetic, the design shifts from a "dark mode laboratory" to a "crisp, executive suite." It emphasizes clarity, precision, and a "breathable" interface that minimizes cognitive load during complex tasks.

The style is a blend of **Minimalism** and **Modern Corporate**. It leverages heavy whitespace and a restricted neutral palette to allow vibrant functional accents (Image Blue and PDF Red) to serve as wayfinding signals. The aesthetic is "developer-grade" yet approachable, utilizing sharp typography and subtle container definitions to create a sense of organized efficiency.

## Colors

The palette is anchored by a pure white (`#FFFFFF`) surface to maximize brightness and a secondary light gray (`#F8FAFC`) for structural containers.

- **Primary & Secondary:** These are neutral-focused. The primary color is the base surface, while the secondary color provides subtle contrast for backgrounds of inactive cards or sidebars.
- **Vibrant Accents:** The suite uses categorical coloring to differentiate toolsets. These colors must remain high-saturation to stand out against the white background:
    - **Image Tools:** Bright Blue (`#3B82F6`) for digital clarity.
    - **PDF Tools:** Bold Red (`#EF4444`) for document authority.
    - **Utility/Other:** Vibrant Purple (`#A855F7`).
- **Functional Contrast:** Typography uses a deep navy-slate (`#0F172A`) for maximum readability, ensuring the interface meets high accessibility standards.

## Typography

This design system uses **Inter** exclusively, capitalizing on its neutral, systematic nature. 

The type hierarchy is designed for rapid scanning. Large headings use a slightly negative letter spacing to feel compact and "engineered." Label text, particularly when used for tool categories, is set in all-caps with generous letter spacing to provide a clear stylistic distinction from body content. For mobile devices, display sizes are reduced by approximately 33% to prevent excessive scrolling while maintaining a bold visual presence.

## Layout & Spacing

The layout follows a **fixed grid** philosophy, centering the tool suite in a 1200px max-width container on desktop to maintain the feeling of a focused workstation.

- **Grid System:** A 12-column grid is used. Typical tool cards span 3 columns on desktop (4 per row), 6 columns on tablet, and 12 columns on mobile.
- **Rhythm:** An 8px base unit (the `unit` variable) is applied to all padding, margins, and component heights to ensure mathematical harmony.
- **Whitespace:** Large `section-gap` values are used between different tool categories (e.g., separating PDF tools from Image tools) to allow the eye to reset.

## Elevation & Depth

Depth is conveyed through **low-contrast outlines** and **tonal layers** rather than shadows, keeping the UI feeling "flat" and modern.

- **Surface Tiers:** The main background is white. Secondary containers (like card backgrounds or sidebar tracks) use the light gray `secondary_color_hex`.
- **Borders:** A 1px border using `border-subtle` is the primary method of separation.
- **Interaction States:** On hover, elements should not lift with shadows. Instead, the border should transition to the categorical accent color (Blue/Red), and the background may shift from white to a very faint 5% tint of that same accent color.

## Shapes

The shape language is **Rounded**, balancing the technical nature of the tools with a friendly, modern user experience.

- **Standard Elements:** Buttons and Tool Cards use a 0.5rem (8px) radius.
- **Contextual Elements:** Form inputs and search bars use 1rem (16px) for a softer, more inviting appearance.
- **Full Rounding:** Status badges and "New" tags should use a pill-shape (full rounding) to differentiate them from functional buttons.

## Components

- **Tool Cards:** The primary component. Built with a `secondary_color` background and a 1px subtle border. On hover, the border changes to the tool’s category color (e.g., Blue for images).
- **Category Headers:** Features a `label-caps` super-title followed by a `headline-md`. A 4px vertical "accent bar" should sit to the left of the header group, colored by category.
- **Action Buttons:** Use high-vibrancy fills for the category color with white text. Secondary buttons should use a ghost style (outline only) using the `text-muted` color.
- **Search Input:** A large, centered component using a 1rem corner radius. It should have a subtle `border-subtle` and a magnifying glass icon in the `text-muted` color.
- **Utility Chips:** Small labels for "Beta" or "New" status. Use a 10% opacity background of the accent color with 100% opacity bold text.
- **Progress Indicators:** When a file is processing, a thin 2px linear progress bar should appear at the very top of the card or the global header, using the active category color.