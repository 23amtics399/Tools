---
name: Obsidian Utility Suite
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#ffb3ad'
  on-secondary: '#68000a'
  secondary-container: '#a40217'
  on-secondary-container: '#ffaea8'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3ad'
  on-secondary-fixed: '#410004'
  on-secondary-fixed-variant: '#930013'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
  surface-deep: '#020617'
  surface-card: '#1E293B'
  image-accent: '#60A5FA'
  pdf-accent: '#F87171'
  other-accent: '#A855F7'
  success-accent: '#10B981'
  text-primary: '#F8FAFC'
  text-secondary: '#94A3B8'
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
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

The design system is engineered for a professional, developer-grade productivity environment. It transforms a simple utility site into a sophisticated workspace that feels reliable, fast, and secure.

The aesthetic follows a **Corporate / Modern** approach with a lean toward **Minimalism**. It prioritizes high-contrast content against deep backgrounds to reduce eye strain during prolonged use. Visual interest is generated through vibrant, functional accent colors that categorize tools, rather than decorative elements. The overall mood is precise, utilitarian, and premium.

## Colors

This design system utilizes a deep, multi-layered dark palette to create hierarchy. 

- **Primary & Secondary:** Used for global actions and high-priority states.
- **Surface Strategy:** The background uses `surface-deep`. Interactive elements and tool containers use `surface-card` to create a subtle lift.
- **Categorical Accents:** Use specific colors to provide instant visual recognition for tool types:
    - **Blue (Image Tools):** Represents clarity and digital processing.
    - **Red (PDF Tools):** Aligns with industry standards for document management.
    - **Purple (Other/New Tools):** Signals versatility and experimentation.
- **Typography Contrast:** Pure white or near-white (`text-primary`) is reserved for titles, while `text-secondary` handles descriptions to maintain a clear information hierarchy.

## Typography

The typography system relies exclusively on **Inter** for its neutral, highly legible, and technical character. 

- **Hierarchy:** Dramatic scale differences between `display` and `body` text ensure the page remains scannable. 
- **Tracking:** Headings use tight letter-spacing (`-0.02em`) to feel modern and "locked-in," while labels use increased tracking for readability at small sizes.
- **Mobile Adaptation:** Large display titles scale down aggressively on mobile to ensure tool categories remain above the fold.

## Layout & Spacing

The layout uses a **fixed grid** approach for desktop to maintain the "suite" feel, centering the workspace within a 1200px container.

- **Grid:** A 12-column system is used. Tool cards typically span 3 columns on desktop, 6 on tablet, and 12 on mobile.
- **Whitespace:** Generous `section-gap` measurements ensure that different tool categories (PDF vs Image) feel like distinct modules rather than a continuous list.
- **Rhythm:** An 8px base unit governs all padding and margins to ensure mathematical consistency across the UI.

## Elevation & Depth

Hierarchy is established through **tonal layers** and **low-contrast outlines** rather than heavy shadows.

- **Level 0 (Background):** `surface-deep`.
- **Level 1 (Cards/Inputs):** `surface-card`. These elements feature a subtle 1px border using a slightly lighter shade of the surface color (or the category accent color at 20% opacity) to define edges without adding visual noise.
- **Interactions:** On hover, cards should "glow" subtly. This is achieved by increasing the border-opacity of the category accent color and adding a very soft, high-spread ambient shadow tinted with the same accent.

## Shapes

The design system uses a **Rounded** shape language to soften the "pro" aesthetic, making the tools feel accessible and modern.

- **Standard Elements:** Buttons, cards, and input fields use a `0.5rem` radius.
- **Large Elements:** Featured tool containers or promotional banners use `rounded-xl` (`1.5rem`) to create a distinct visual "island" effect.
- **Icons:** Should be housed in `rounded-lg` containers with a background tint matching their category accent.

## Components

- **Tool Cards:** The core component. Features a category-colored icon (top-left), a `title-sm` heading, and `body-sm` description. The entire card is interactive, with a subtle background shift on hover.
- **Category Headers:** Uses `label-caps` for the super-title and `headline-md` for the main category name. A thick, 4px horizontal bar in the category accent color should precede the text.
- **Primary Buttons:** Solid fills using the category accent color. Text is high-contrast (dark on light).
- **Search Input:** A large, `rounded-xl` field with a translucent background and a clear "blur" backdrop effect (Glassmorphism) to keep the focus on the search experience.
- **Chips/Badges:** Used for "New" or "Pro" labels. These use a 10% opacity fill of the accent color with 100% opacity text, placed in the top-right of cards.
- **Progress Bars:** Thin, high-vibrancy lines that move across the top of the card or container during file processing.