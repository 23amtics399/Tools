import React from 'react';
import * as Icons from './IconRegistry';

interface ToolIconProps extends Icons.IconProps {
  name: string;
}

export function ToolIcon({ name, ...props }: ToolIconProps) {
  switch (name) {
    case 'image-category': return <Icons.ImageCategoryIcon {...props} />;
    case 'pdf-category': return <Icons.PdfCategoryIcon {...props} />;
    case 'other-category': return <Icons.OtherCategoryIcon {...props} />;
    
    case 'image-compress': return <Icons.CompressImageIcon {...props} />;
    case 'image-resize': return <Icons.ResizeImageIcon {...props} />;
    case 'image-crop': return <Icons.CropImageIcon {...props} />;
    case 'jpg-to-png': 
    case 'png-to-jpg': return <Icons.ConvertImageIcon {...props} />;
    case 'webp-converter': return <Icons.WebpIcon {...props} />;
    case 'image-to-pdf': return <Icons.ImageToPdfIcon {...props} />;
    
    case 'pdf-to-images': return <Icons.PdfToImagesIcon {...props} />;
    case 'pdf-merge': return <Icons.MergePdfIcon {...props} />;
    case 'pdf-split': return <Icons.SplitPdfIcon {...props} />;
    case 'pdf-rotate': return <Icons.RotatePdfIcon {...props} />;
    case 'pdf-compress': return <Icons.CompressPdfIcon {...props} />;
    case 'pdf-remove-pages': return <Icons.RemovePdfPagesIcon {...props} />;
    case 'pdf-page-numbering': return <Icons.PdfNumberingIcon {...props} />;
    
    case 'heic-converter': return <Icons.HeicIcon {...props} />;
    case 'passport-photo': return <Icons.PassportIcon {...props} />;
    case 'signature-maker': return <Icons.SignatureIcon {...props} />;
    
    // Fallback UI Icons for general mapping if needed
    case 'Home': return <Icons.HomeIcon {...props} />;
    case 'Search': return <Icons.SearchIcon {...props} />;
    case 'Menu': return <Icons.MenuIcon {...props} />;
    case 'Settings': return <Icons.SettingsIcon {...props} />;
    
    default:
      console.warn(`ToolIcon: Unknown icon name '${name}'`);
      return <Icons.FileIcon {...props} />;
  }
}
