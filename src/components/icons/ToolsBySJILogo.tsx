import React from 'react';

export function ToolsBySJILogo({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 240 40" 
      className={className} 
      style={{ height: '32px', width: 'auto', ...style }}
    >
      <defs>
        <linearGradient id="sji-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4d8eff" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      
      {/* Brand Icon */}
      <g transform="translate(4, 4)">
        <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#sji-gradient)" opacity="0.15" />
        <path d="M12 10l-4 4 4 4" stroke="url(#sji-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M20 10l4 4-4 4" stroke="url(#sji-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M17 6l-6 20" stroke="url(#sji-gradient)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>
      
      {/* Text "Tools by SJI" */}
      <text x="48" y="27" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="22" fill="currentColor" letterSpacing="-0.5">
        Tools <tspan fontWeight="400" fill="#94A3B8">by</tspan> SJI
      </text>
    </svg>
  );
}
