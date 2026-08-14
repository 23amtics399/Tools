import { ToolDefinition, CategoryInfo, ToolCategory } from '../types/tool';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Compress, resize, crop, and convert images directly in your browser.',
    icon: '🖼️',
    color: '#6366f1'
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    description: 'Edit, merge, split, and convert PDF documents securely.',
    icon: '📄',
    color: '#ef4444'
  },
  {
    id: 'other',
    name: 'Other Tools',
    description: 'Miscellaneous utilities and helpful tools.',
    icon: '🛠️',
    color: '#10b981'
  }
];

export const TOOLS: ToolDefinition[] = [
  // IMAGE TOOLS
  {
    id: 'image-compress',
    name: 'Image Compressor',
    slug: 'compress',
    category: 'image',
    path: '/image/compress',
    description: 'Compress images without losing quality in your browser.',
    shortDescription: 'Compress images instantly',
    icon: '🗜️',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 50,
    maxFiles: 20,
    status: 'active',
    popular: true,
    supportsMultipleFiles: true,
    options: [
      {
        id: 'quality',
        label: 'Quality',
        type: 'slider',
        defaultValue: 80,
        min: 1,
        max: 100,
        step: 1
      }
    ],
    seo: {
      title: 'Compress Images Online Free | No Server Upload',
      description: 'Compress JPEG, PNG, and WebP images directly in your browser. Fast, secure, and free image compressor without server uploads.',
      keywords: ['image compressor', 'compress image', 'reduce image size', 'compress jpeg']
    },
    faq: [
      { question: 'Is my data secure?', answer: 'Yes, all processing happens locally in your browser. Your images are never uploaded to any server.' },
      { question: 'What formats are supported?', answer: 'We support JPEG, PNG, and WebP images.' },
      { question: 'How much can I compress?', answer: 'You can adjust the quality slider to find the right balance between file size and image quality.' }
    ],
    howToUse: [
      'Click or drag & drop images into the upload area.',
      'Adjust the quality slider to your desired compression level.',
      'Wait for the processing to finish.',
      'Download individual images or all of them as a ZIP file.'
    ],
    relatedToolIds: ['image-resize', 'webp-converter']
  },
  {
    id: 'image-resize',
    name: 'Image Resizer',
    slug: 'resize',
    category: 'image',
    path: '/image/resize',
    description: 'Resize images to exact dimensions quickly and securely.',
    shortDescription: 'Resize images to exact dimensions',
    icon: '📏',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 50,
    maxFiles: 20,
    status: 'active',
    popular: true,
    supportsMultipleFiles: true,
    options: [
      { id: 'width', label: 'Width (px)', type: 'number', defaultValue: 800 },
      { id: 'height', label: 'Height (px)', type: 'number', defaultValue: 600 },
      { id: 'maintainAspectRatio', label: 'Maintain Aspect Ratio', type: 'toggle', defaultValue: true }
    ],
    seo: {
      title: 'Resize Images Online Free | Tools',
      description: 'Quickly resize your images to specific dimensions right in your browser.',
      keywords: ['image resizer', 'resize image', 'change image dimensions']
    },
    faq: [
      { question: 'Does resizing lose quality?', answer: 'Resizing can reduce clarity if you increase the dimensions significantly, but making an image smaller usually retains good quality.' },
      { question: 'Can I resize multiple images at once?', answer: 'Yes, you can upload up to 20 images and resize them all to the same dimensions simultaneously.' },
      { question: 'Is my data safe?', answer: 'Absolutely. Everything is processed directly in your browser.' }
    ],
    howToUse: [
      'Upload the images you want to resize.',
      'Enter the target width and/or height.',
      'Choose whether to maintain the aspect ratio.',
      'Click process and download your resized images.'
    ],
    relatedToolIds: ['image-compress', 'image-crop']
  },
  {
    id: 'image-crop',
    name: 'Image Cropper',
    slug: 'crop',
    category: 'image',
    path: '/image/crop',
    description: 'Crop images to perfection with customizable aspect ratios.',
    shortDescription: 'Crop images visually',
    icon: '✂️',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    status: 'active',
    popular: false,
    supportsMultipleFiles: false,
    options: [
      {
        id: 'aspectRatio',
        label: 'Aspect Ratio',
        type: 'select',
        defaultValue: 'free',
        options: [
          { label: 'Free', value: 'free' },
          { label: '1:1 (Square)', value: '1:1' },
          { label: '4:3', value: '4:3' },
          { label: '16:9', value: '16:9' },
          { label: '3:2', value: '3:2' }
        ]
      }
    ],
    seo: {
      title: 'Crop Images Online Free | Tools',
      description: 'Easily crop images and photos online with custom aspect ratios.',
      keywords: ['image cropper', 'crop image online', 'photo cropper']
    },
    faq: [
      { question: 'Can I crop to a specific ratio like 16:9?', answer: 'Yes! Select your desired ratio from the options menu before cropping.' },
      { question: 'Are my images uploaded to a server?', answer: 'No, the cropping happens entirely on your device.' },
      { question: 'What formats can I crop?', answer: 'JPEG, PNG, and WebP are fully supported.' }
    ],
    howToUse: [
      'Upload a single image.',
      'Select an aspect ratio or leave it freeform.',
      'Drag the handles to select the area you want to keep.',
      'Click apply and download your cropped image.'
    ],
    relatedToolIds: ['image-resize']
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    slug: 'jpg-to-png',
    category: 'image',
    path: '/image/jpg-to-png',
    description: 'Convert JPG images to PNG format instantly.',
    shortDescription: 'Convert JPG to PNG',
    icon: '🔄',
    acceptedTypes: ['image/jpeg'],
    maxFileSizeMB: 50,
    maxFiles: 20,
    status: 'active',
    popular: false,
    supportsMultipleFiles: true,
    seo: {
      title: 'Convert JPG to PNG Online Free | Tools',
      description: 'Convert your JPEG images to PNG format instantly and securely in your browser.',
      keywords: ['jpg to png', 'convert jpg to png', 'image converter']
    },
    faq: [
      { question: 'Why convert JPG to PNG?', answer: 'PNG supports lossless compression, which is better for graphics and text.' },
      { question: 'Is it free?', answer: 'Yes, it is completely free to use without limitations.' },
      { question: 'How long does it take?', answer: 'It is nearly instantaneous since it happens locally.' }
    ],
    howToUse: [
      'Select one or more JPG images.',
      'The images will be converted automatically.',
      'Download your new PNG files.'
    ],
    relatedToolIds: ['png-to-jpg', 'webp-converter']
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    slug: 'png-to-jpg',
    category: 'image',
    path: '/image/png-to-jpg',
    description: 'Convert PNG images to JPG format to save space.',
    shortDescription: 'Convert PNG to JPG',
    icon: '🔄',
    acceptedTypes: ['image/png'],
    maxFileSizeMB: 50,
    maxFiles: 20,
    status: 'active',
    popular: false,
    supportsMultipleFiles: true,
    options: [
      { id: 'quality', label: 'Quality', type: 'slider', defaultValue: 92, min: 1, max: 100, step: 1 }
    ],
    seo: {
      title: 'Convert PNG to JPG Online Free | Tools',
      description: 'Easily convert PNG images to JPG format for smaller file sizes.',
      keywords: ['png to jpg', 'convert png to jpg', 'image converter']
    },
    faq: [
      { question: 'Will I lose transparency?', answer: 'Yes, JPG does not support transparency. Transparent areas will become white.' },
      { question: 'Is the conversion fast?', answer: 'Yes, it takes less than a second per image directly in your browser.' },
      { question: 'Can I convert multiple files?', answer: 'Yes, you can upload up to 20 files at once.' }
    ],
    howToUse: [
      'Select one or more PNG images.',
      'Adjust the quality slider if needed.',
      'Download your converted JPG files.'
    ],
    relatedToolIds: ['jpg-to-png', 'webp-converter']
  },
  {
    id: 'webp-converter',
    name: 'WebP Converter',
    slug: 'webp-converter',
    category: 'image',
    path: '/image/webp-converter',
    description: 'Convert images to WebP format for superior web performance.',
    shortDescription: 'Convert images to WebP',
    icon: '⚡',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'],
    maxFileSizeMB: 50,
    maxFiles: 20,
    status: 'active',
    popular: false,
    supportsMultipleFiles: true,
    options: [
      { id: 'quality', label: 'Quality', type: 'slider', defaultValue: 80, min: 1, max: 100, step: 1 }
    ],
    seo: {
      title: 'Convert Images to WebP Online Free | Tools',
      description: 'Convert your JPG and PNG files to WebP format for faster website loading speeds.',
      keywords: ['webp converter', 'convert to webp', 'image to webp']
    },
    faq: [
      { question: 'Why use WebP?', answer: 'WebP provides superior lossless and lossy compression for images on the web, making your site load faster.' },
      { question: 'What formats can I convert to WebP?', answer: 'You can convert JPEG, PNG, and BMP files.' },
      { question: 'Is my data private?', answer: 'Yes, conversion happens entirely on your device.' }
    ],
    howToUse: [
      'Upload images you want to convert.',
      'Set the desired compression quality.',
      'Download the WebP files individually or as a ZIP.'
    ],
    relatedToolIds: ['image-compress', 'jpg-to-png']
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    slug: 'image-to-pdf',
    category: 'image',
    path: '/image/image-to-pdf',
    description: 'Convert multiple images into a single PDF document.',
    shortDescription: 'Convert images to PDF',
    icon: '📑',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 50,
    maxFiles: 50,
    status: 'active',
    popular: false,
    supportsMultipleFiles: true,
    options: [
      {
        id: 'pageSize',
        label: 'Page Size',
        type: 'select',
        defaultValue: 'A4',
        options: [
          { label: 'A4', value: 'A4' },
          { label: 'Letter', value: 'Letter' },
          { label: 'Original Size', value: 'Original' }
        ]
      },
      {
        id: 'orientation',
        label: 'Orientation',
        type: 'select',
        defaultValue: 'auto',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Portrait', value: 'portrait' },
          { label: 'Landscape', value: 'landscape' }
        ]
      },
      { id: 'margin', label: 'Margin (px)', type: 'slider', defaultValue: 10, min: 0, max: 50, step: 1 }
    ],
    seo: {
      title: 'Convert Images to PDF Online Free | Tools',
      description: 'Combine multiple images into a single PDF document quickly and securely.',
      keywords: ['image to pdf', 'convert image to pdf', 'images to pdf converter']
    },
    faq: [
      { question: 'Can I arrange the order of images?', answer: 'Yes, you will be able to arrange the order of images before generating the PDF.' },
      { question: 'Is there a limit on how many images I can add?', answer: 'You can add up to 50 images per PDF generation session.' },
      { question: 'Does this compress the images?', answer: 'No, it places the images into a PDF container without recompressing them unless they are very large.' }
    ],
    howToUse: [
      'Upload all the images you want to include in the PDF.',
      'Choose page size, orientation, and margins.',
      'Click convert and download your compiled PDF file.'
    ],
    relatedToolIds: ['pdf-to-images']
  },

  // PDF TOOLS
  {
    id: 'pdf-to-images',
    name: 'PDF to Images',
    slug: 'pdf-to-image',
    category: 'pdf',
    path: '/pdf/pdf-to-image',
    description: 'Extract pages from a PDF document as high-quality images.',
    shortDescription: 'Extract PDF pages as images',
    icon: '🖼️',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 1,
    status: 'active',
    popular: true,
    supportsMultipleFiles: false,
    options: [
      {
        id: 'format',
        label: 'Image Format',
        type: 'select',
        defaultValue: 'jpg',
        options: [
          { label: 'JPG', value: 'jpg' },
          { label: 'PNG', value: 'png' }
        ]
      },
      { id: 'quality', label: 'Quality', type: 'slider', defaultValue: 90, min: 1, max: 100, step: 1 },
      {
        id: 'scale',
        label: 'Scale / Resolution',
        type: 'select',
        defaultValue: '2x',
        options: [
          { label: '1x (Standard)', value: '1x' },
          { label: '2x (High)', value: '2x' },
          { label: '3x (Highest)', value: '3x' }
        ]
      }
    ],
    seo: {
      title: 'Convert PDF to Images Online Free | Tools',
      description: 'Easily convert PDF pages into high-quality JPG or PNG images securely in your browser.',
      keywords: ['pdf to image', 'pdf to jpg', 'pdf to png', 'extract images from pdf']
    },
    faq: [
      { question: 'How is this secure?', answer: 'The conversion happens entirely in your browser using local processing. Your PDF is never uploaded.' },
      { question: 'Can I choose the image format?', answer: 'Yes, you can choose between JPG and PNG formats.' },
      { question: 'Will I get all pages?', answer: 'Yes, it processes all pages and lets you download them all in a single ZIP file.' }
    ],
    howToUse: [
      'Select a PDF file from your device.',
      'Choose output format, quality, and resolution scale.',
      'Click convert to extract the pages.',
      'Download all pages as a ZIP archive.'
    ],
    relatedToolIds: ['image-to-pdf']
  },
  {
    id: 'pdf-merge',
    name: 'Merge PDF',
    slug: 'merge',
    category: 'pdf',
    path: '/pdf/merge',
    description: 'Combine multiple PDF files into one single document.',
    shortDescription: 'Combine multiple PDFs',
    icon: '🔗',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 50,
    status: 'coming-soon',
    popular: true,
    seo: {
      title: 'Merge PDF Files Online | Tools',
      description: 'Combine and merge multiple PDF documents into a single file easily.',
      keywords: ['merge pdf', 'combine pdf', 'join pdf files']
    },
    faq: [
      { question: 'Is it free?', answer: 'Yes, all our tools are completely free to use.' },
      { question: 'Is my data secure?', answer: 'Yes, processing will happen securely in your browser.' }
    ],
    howToUse: [],
    relatedToolIds: ['pdf-split']
  },
  {
    id: 'pdf-split',
    name: 'Split PDF',
    slug: 'split',
    category: 'pdf',
    path: '/pdf/split',
    description: 'Extract or split pages from a PDF into multiple files.',
    shortDescription: 'Split PDFs into multiple files',
    icon: '✂️',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 1,
    status: 'coming-soon',
    seo: {
      title: 'Split PDF Files Online | Tools',
      description: 'Separate one page or a whole set of pages from a PDF document easily.',
      keywords: ['split pdf', 'extract pdf pages', 'separate pdf']
    },
    faq: [],
    howToUse: [],
    relatedToolIds: ['pdf-merge']
  },
  {
    id: 'pdf-rotate',
    name: 'Rotate PDF',
    slug: 'rotate',
    category: 'pdf',
    path: '/pdf/rotate',
    description: 'Rotate PDF pages to exactly how you want them.',
    shortDescription: 'Rotate PDF pages',
    icon: '🔄',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 1,
    status: 'coming-soon',
    seo: {
      title: 'Rotate PDF Pages Online | Tools',
      description: 'Rotate individual pages or entire PDF documents easily.',
      keywords: ['rotate pdf', 'turn pdf pages']
    },
    faq: [],
    howToUse: [],
    relatedToolIds: []
  },
  {
    id: 'pdf-compress',
    name: 'Compress PDF',
    slug: 'compress',
    category: 'pdf',
    path: '/pdf/compress',
    description: 'Reduce the file size of your PDF documents.',
    shortDescription: 'Reduce PDF file size',
    icon: '🗜️',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 1,
    status: 'coming-soon',
    seo: {
      title: 'Compress PDF Files Online | Tools',
      description: 'Reduce the size of your PDF files securely in your browser.',
      keywords: ['compress pdf', 'reduce pdf size']
    },
    faq: [],
    howToUse: [],
    relatedToolIds: []
  },
  {
    id: 'pdf-remove-pages',
    name: 'Remove PDF Pages',
    slug: 'remove-pages',
    category: 'pdf',
    path: '/pdf/remove-pages',
    description: 'Delete unwanted pages from a PDF document.',
    shortDescription: 'Delete pages from PDF',
    icon: '🗑️',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 1,
    status: 'coming-soon',
    seo: {
      title: 'Remove Pages from PDF Online | Tools',
      description: 'Quickly remove unwanted pages from your PDF files.',
      keywords: ['remove pdf pages', 'delete pdf pages']
    },
    faq: [],
    howToUse: [],
    relatedToolIds: ['pdf-split']
  },
  {
    id: 'pdf-page-numbering',
    name: 'PDF Page Numbering',
    slug: 'page-numbering',
    category: 'pdf',
    path: '/pdf/page-numbering',
    description: 'Add page numbers to your PDF documents.',
    shortDescription: 'Add numbers to PDF pages',
    icon: '🔢',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 1,
    status: 'coming-soon',
    seo: {
      title: 'Add Page Numbers to PDF Online | Tools',
      description: 'Insert page numbers into your PDF document easily.',
      keywords: ['pdf page numbers', 'add numbers to pdf']
    },
    faq: [],
    howToUse: [],
    relatedToolIds: []
  },

  // OTHER TOOLS
  {
    id: 'heic-converter',
    name: 'HEIC Converter',
    slug: 'heic-converter',
    category: 'other',
    path: '/image/heic-converter',
    description: 'Convert iPhone HEIC photos to JPG or PNG.',
    shortDescription: 'Convert HEIC to JPG/PNG',
    icon: '📱',
    acceptedTypes: ['image/heic', 'image/heif'],
    maxFileSizeMB: 50,
    maxFiles: 20,
    status: 'coming-soon',
    seo: {
      title: 'Convert HEIC to JPG Online | Tools',
      description: 'Convert your HEIC images from iPhone to standard JPG or PNG formats.',
      keywords: ['heic to jpg', 'heic converter', 'iphone photo converter']
    },
    faq: [],
    howToUse: [],
    relatedToolIds: []
  },
  {
    id: 'passport-photo',
    name: 'Passport Photo Maker',
    slug: 'passport-photo',
    category: 'other',
    path: '/other/passport-photo',
    description: 'Create standard passport and ID photos easily.',
    shortDescription: 'Make ID and passport photos',
    icon: '🧑‍💼',
    acceptedTypes: ['image/jpeg', 'image/png'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    status: 'coming-soon',
    seo: {
      title: 'Passport Photo Maker Online | Tools',
      description: 'Easily crop and format your photo to standard passport requirements.',
      keywords: ['passport photo maker', 'id photo creator', 'visa photo maker']
    },
    faq: [],
    howToUse: [],
    relatedToolIds: ['image-crop']
  },
  {
    id: 'signature-maker',
    name: 'Signature Maker',
    slug: 'signature-maker',
    category: 'other',
    path: '/other/signature-maker',
    description: 'Draw or type your signature and download it as an image.',
    shortDescription: 'Create digital signatures',
    icon: '✍️',
    acceptedTypes: [],
    maxFileSizeMB: 0,
    maxFiles: 0,
    status: 'coming-soon',
    seo: {
      title: 'Digital Signature Maker Online | Tools',
      description: 'Draw or type your signature and save it as a transparent PNG.',
      keywords: ['signature maker', 'digital signature', 'draw signature']
    },
    faq: [],
    howToUse: [],
    relatedToolIds: []
  }
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find(tool => tool.slug === slug);
}

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find(tool => tool.id === id);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter(tool => tool.category === category);
}

export function getActiveTools(): ToolDefinition[] {
  return TOOLS.filter(tool => tool.status === 'active');
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS.filter(tool => tool.popular);
}

export function getRelatedTools(toolId: string): ToolDefinition[] {
  const tool = getToolById(toolId);
  if (!tool) return [];
  
  return tool.relatedToolIds
    .map(id => getToolById(id))
    .filter((t): t is ToolDefinition => t !== undefined && t.status === 'active');
}

export function getAllTools(): ToolDefinition[] {
  return TOOLS;
}
