import React from 'react';\n\nexport function BrandMark({ className = '', style }: { className?: string, style?: React.CSSProperties }) {\n  return (\n    <svg className={className} style={{ display: 'inline-block', ...style }} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stopColor:#38bdf8;stopOpacity:1" />
              <stop offset="50%" style="stopColor:#7c3aed;stopOpacity:1" />
              <stop offset="100%" style="stopColor:#ec4899;stopOpacity:1" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" style="stopColor:#06b6d4;stopOpacity:1" />
              <stop offset="100%" style="stopColor:#8b5cf6;stopOpacity:1" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="95" fill="url(#grad1)" opacity="0.1"/>
          <circle cx="100" cy="100" r="85" fill="none" stroke="url(#grad1)" strokeWidth="2"/>
          <circle cx="100" cy="100" r="60" fill="url(#grad2)" opacity="0.95"/>
          <g transform="translate(75, 70)">
            <path d="M8 2C4.5 2 2 4.5 2 8c0 2.5 1.5 4.5 3.5 5.5L10 18c0.5 0.5 1.5 0.5 2 0l4.5-4.5c2 -1 3.5 -3 3.5 -5.5 0 -3.5 -2.5 -6 -6 -6z" fill="white" stroke="white" strokeWidth="0.5"/>
          </g>
          <g transform="translate(118, 70)">
            <rect x="0" y="0" width="12" height="12" rx="1.5" fill="none" stroke="white" strokeWidth="0.8"/>
            <line x1="0" y1="4" x2="12" y2="4" stroke="white" strokeWidth="0.6"/>
            <line x1="4" y1="0" x2="4" y2="12" stroke="white" strokeWidth="0.6"/>
            <line x1="8" y1="0" x2="8" y2="12" stroke="white" strokeWidth="0.6"/>
          </g>
          <g transform="translate(70, 118)">
            <rect x="1" y="1" width="11" height="14" rx="1" fill="none" stroke="white" strokeWidth="0.8"/>
            <line x1="1" y1="4" x2="12" y2="4" stroke="white" strokeWidth="0.6"/>
            <line x1="1" y1="7" x2="12" y2="7" stroke="white" strokeWidth="0.6"/>
            <line x1="1" y1="10" x2="12" y2="10" stroke="white" strokeWidth="0.6"/>
          </g>
          <g transform="translate(120, 118)">
            <path d="M2 1h7l3 3v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1z" fill="none" stroke="white" strokeWidth="0.8"/>
            <line x1="9" y1="1" x2="9" y2="4" stroke="white" strokeWidth="0.6"/>
          </g>
          <g transform="translate(100, 100)">
            <circle cx="0" cy="0" r="4" fill="white" opacity="0.9"/>
            <path d="M0,-8 L1.5,-2 L8,-1 L3,3 L5,9 L0,5 L-5,9 L-3,3 L-8,-1 L-1.5,-2 Z" fill="white" opacity="0.7"/>
          </g>
          <circle cx="100" cy="100" r="50" fill="none" stroke="white" strokeWidth="1" opacity="0.3"/>
          <circle cx="100" cy="100" r="35" fill="none" stroke="white" strokeWidth="0.8" opacity="0.2"/>
          <line x1="85" y1="25" x2="115" y2="25" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        </svg>\n  );\n}\n