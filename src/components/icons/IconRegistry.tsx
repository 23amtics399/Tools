import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

function BaseIcon({ children, size = 24, className = '', style, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
      {...props}
    >
      {children}
    </svg>
  );
}

export function ImageCategoryIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M5 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H5Zm3 3.5A1.5 1.5 0 1 1 8 10.5a1.5 1.5 0 0 1 0-3Zm11 9.5H5l4.2-4.2a1 1 0 0 1 1.4 0l1.9 1.9 2.8-3a1 1 0 0 1 1.46.02L19 17Z"/></BaseIcon>;
}

export function PdfCategoryIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm6 1.5V8h4.5L13 3.5ZM8 12h8v1.5H8V12Zm0 3h8v1.5H8V15Z"/></BaseIcon>;
}

export function OtherCategoryIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M3 7a2 2 0 0 1 2-2h3l1-1h6l1 1h3a2 2 0 0 1 2 2v2H3V7Zm0 4h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7Z"/></BaseIcon>;
}

export function CompressImageIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M4 4h6v2H6v4H4V4Zm10 0h6v6h-2V6h-4V4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4ZM9 9h6v6H9V9Z"/></BaseIcon>;
}

export function ResizeImageIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M4 4h7v2H6v5H4V4Zm16 0v7h-2V6h-5V4h7ZM4 20v-7h2v5h5v2H4Zm16-7v7h-7v-2h5v-5h2Z"/></BaseIcon>;
}

export function CropImageIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M7 2h2v13a2 2 0 0 0 2 2h11v2H11a4 4 0 0 1-4-4V2Zm4 4h11v11h-2V8h-9V6Z"/></BaseIcon>;
}

export function ConvertImageIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M7 7h8V4l5 4-5 4V9H7V7Zm10 10H9v3l-5-4 5-4v3h8v2Z"/></BaseIcon>;
}

export function WebpIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z"/></BaseIcon>;
}

export function ImageToPdfIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M4 6a2 2 0 0 1 2-2h5v6h6v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm9-2 4 4h-4V4Zm-6 8 2-2 2 2 1-1 3 4H7v-3Z"/></BaseIcon>;
}

export function PdfToImagesIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M5 3h8l4 4v4h-2V8h-3a2 2 0 0 1-2-2V3H5v18h6v2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm8 10a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-8Zm1 6 2-2 1.5 1.5L19 16l2 3h-7Z"/></BaseIcon>;
}

export function MergePdfIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M4 5a2 2 0 0 1 2-2h5v2H6v10h5v2H6a2 2 0 0 1-2-2V5Zm14 2a2 2 0 0 0-2-2h-5v2h5v10h-5v2h5a2 2 0 0 0 2-2V7Zm-7 1 4 4-4 4v-3H8v-2h3V8Z"/></BaseIcon>;
}

export function SplitPdfIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M3 4a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4Zm3 2v12h3V6H6Z"/>
            <path d="M14 4a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V4Zm3 2v12h3V6h-3Z"/></BaseIcon>;
}

export function RotatePdfIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}>
            <path d="M6 3h8l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/>
            <path d="M13 3v5h5"/>
            
            <path d="M12 10a4 4 0 1 1 0 8" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M12 18l-1.5 1.5L12 21" fill="rgba(0,0,0,0.4)" stroke="none"/></BaseIcon>;
}

export function CompressPdfIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><rect x="8" y="8" width="8" height="8" rx="1"/>
            
            <path d="M12 2v3M10 3l2-1 2 1"/>
            
            <path d="M12 22v-3M10 21l2 1 2-1"/>
            
            <path d="M2 12h3M3 10l-1 2 1 2"/>
            
            <path d="M22 12h-3M21 10l1 2-1 2"/></BaseIcon>;
}

export function RemovePdfPagesIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}>
            <rect x="2" y="4" width="4" height="6" rx="0.5"/>
            
            <rect x="7" y="4" width="4" height="6" rx="0.5"/>
            
            <rect x="12" y="4" width="4" height="6" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1.5 1.5"/>
            
            <rect x="17" y="4" width="4" height="6" rx="0.5"/>
            
            <path d="M13 5.5l2 2m0-2l-2 2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            
            <rect x="2" y="13" width="4" height="6" rx="0.5"/>
            <rect x="7" y="13" width="4" height="6" rx="0.5"/>
            <rect x="12" y="13" width="4" height="6" rx="0.5"/>
            <rect x="17" y="13" width="4" height="6" rx="0.5"/></BaseIcon>;
}

export function PdfNumberingIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm6 1.5V8h4.5L13 3.5Z"/>
            <path d="M9 11h6v1.5H9V11Zm0 3h6v1.5H9V14Z"/>
            
            <text x="15" y="20" fontSize="4" fontWeight="bold" fill="currentColor">n</text></BaseIcon>;
}

export function HeicIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}>
            <rect x="7" y="2" width="10" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/>
            <circle cx="12" cy="19" r="0.8"/>
            <path d="M10 5h4"/>
            
            <rect x="9" y="8" width="6" height="6" rx="0.5"/>
            <circle cx="10.8" cy="10" r="0.6"/>
            <path d="M15 13l-1.5-1.5-1.5 1.5-1-1-2 2"/></BaseIcon>;
}

export function PassportIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}>
            <rect x="3" y="4" width="18" height="16" rx="2"/>
            
            <circle cx="9" cy="10" r="3" fill="currentColor" opacity="0.3"/>
            
            <path d="M5.5 16a4 4 0 0 1 7 0" fill="currentColor" opacity="0.3"/>
            
            <path d="M14 8h5M14 11h4M14 14h5" stroke="currentColor" opacity="0.3" strokeWidth="1.2"/></BaseIcon>;
}

export function SignatureIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M2 17c2.5 0 2.2-5 4.5-5 1.7 0 1.3 3 2.7 3 1.5 0 1.8-6 4.1-6 1.8 0 1.1 4 2.9 4 1.2 0 2-.6 5.8-3v3c-2.8 2-4 3-5.9 3-1.9 0-2.2-1.5-2.8-2.8-.8 1.7-1.9 4.8-4.3 4.8-2.2 0-2.4-1.8-3-2.8-.8 1.4-1.8 3.8-4 3.8H2v-2Zm0 3h20v2H2v-2Z"/></BaseIcon>;
}

export function HomeIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
            <path d="M9 22V12h6v10" fill="currentColor" opacity="0.3"/></BaseIcon>;
}

export function SearchIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="10" cy="10" r="6"/>
            <path d="M14 14l6 6"/></BaseIcon>;
}

export function MenuIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/></BaseIcon>;
}

export function BackIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 12H5M12 19l-7-7 7-7"/></BaseIcon>;
}

export function NextIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14M12 5l7 7-7 7"/></BaseIcon>;
}

export function SunIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></BaseIcon>;
}

export function MoonIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></BaseIcon>;
}

export function UploadIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
            <path d="M7 9l5-5 5 5"/>
            <path d="M12 4v12"/></BaseIcon>;
}

export function FolderIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></BaseIcon>;
}

export function FileIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/>
            <path d="M13 2v7h7"/></BaseIcon>;
}

export function FilesIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M15 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9Z"/>
            <path d="M15 2v5h5"/>
            <path d="M9 18v2a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V9l-5-5h-6a2 2 0 0 0-2 2v2" fill="currentColor" opacity="0.3"/></BaseIcon>;
}

export function DownloadIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
            <path d="M7 11l5 5 5-5"/>
            <path d="M12 4v12"/></BaseIcon>;
}

export function DownloadAllIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
            <path d="M7 11l5 5 5-5"/>
            <path d="M12 4v12"/>
            <path d="M8 2h8M8 1h8"/></BaseIcon>;
}

export function CloseIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6L6 18M6 6l12 12"/></BaseIcon>;
}

export function ResetIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.5 2.8"/>
            <path d="M3 4v4h4"/></BaseIcon>;
}

export function SettingsIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.18V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0-1.18-2.82H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 3.417 1.415 2 2 0 0 1-.587 1.415l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></BaseIcon>;
}

export function MoreIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><circle cx="12" cy="5" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="12" cy="19" r="1.5"/></BaseIcon>;
}

export function DeleteIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <path d="M10 11v6"/>
            <path d="M14 11v6"/></BaseIcon>;
}

export function ViewIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/></BaseIcon>;
}

export function SuccessIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4"/></BaseIcon>;
}

export function WarningIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
            <path d="M12 9v4"/>
            <path d="M12 17h.01"/></BaseIcon>;
}

export function InfoIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/></BaseIcon>;
}

export function ErrorIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/>
            <path d="M15 9l-6 6"/>
            <path d="M9 9l6 6"/></BaseIcon>;
}

export function ProcessingIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></BaseIcon>;
}

export function MoveUpIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 19V5"/>
            <path d="M5 12l7-7 7 7"/></BaseIcon>;
}

export function MoveDownIcon(props: IconProps) {
  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5v14"/>
            <path d="M19 12l-7 7-7-7"/></BaseIcon>;
}

export function DragHandleIcon(props: IconProps) {
  return <BaseIcon fill="currentColor" stroke="none" {...props}><circle cx="9" cy="5" r="1.5"/>
            <circle cx="9" cy="12" r="1.5"/>
            <circle cx="9" cy="19" r="1.5"/>
            <circle cx="15" cy="5" r="1.5"/>
            <circle cx="15" cy="12" r="1.5"/>
            <circle cx="15" cy="19" r="1.5"/></BaseIcon>;
}
