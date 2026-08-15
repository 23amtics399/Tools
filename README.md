# Tools by sji.one

A production-ready, client-side web platform for image and PDF processing utilities.

## Features

- **100% Client-Side Processing**: Files never leave the browser. Faster, secure, and cost-effective.
- **Privacy First**: Strong privacy messaging integrated throughout the site. No data collection.
- **Modern Tech Stack**: React 18, TypeScript, Vite.
- **Dynamic Module Loading**: Heavy processor libraries (like `pdfjs-dist` and `browser-image-compression`) are loaded lazily.
- **Custom Design System**: Bespoke, reusable Vanilla CSS with CSS Modules, no generic Tailwind defaults.
- **SEO Ready**: Tool-specific meta tags, structured data (JSON-LD), and canonical URLs.

## Available Tools

### Image Tools
- Image Compressor
- Image Resizer
- Image Cropper
- JPG to PNG
- PNG to JPG
- WebP Converter
- Image to PDF

### PDF Tools
- PDF to Images
- Merge PDF
- Split PDF
- Rotate PDF
- Compress PDF
- Remove PDF Pages

*(More tools marked as "Coming Soon" in the registry)*

## Architecture

- `src/config/tools.ts`: The central registry defining every tool, its options, constraints, and SEO data.
- `src/components/tool/ToolPageLayout.tsx`: The unified UI wrapper managing uploads, processing lifecycle, and results.
- `src/processors/*`: Pure TypeScript modules that handle the actual file transformation logic.
- `src/styles/global.css`: Centralized design tokens (CSS variables) for consistent theming.

## Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

## Privacy & Security
Because this application runs entirely in the browser using WebAssembly and HTML5 Canvas, user files are never uploaded to any server. This provides inherent data privacy and eliminates cloud storage/processing costs.
