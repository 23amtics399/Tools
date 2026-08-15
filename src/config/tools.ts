import { ToolDefinition, CategoryInfo, ToolCategory } from '../types/tool';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Compress, resize, crop, and convert images directly in your browser.',
    icon: 'image-category',
    color: '#6366f1'
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    description: 'Edit, merge, split, and convert PDF documents securely.',
    icon: 'pdf-category',
    color: '#ef4444'
  },
  {
    id: 'other',
    name: 'Other Tools',
    description: 'Miscellaneous utilities and helpful tools.',
    icon: 'other-category',
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
    icon: 'image-compress',
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
    icon: 'image-resize',
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
    icon: 'image-crop',
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
    icon: 'jpg-to-png',
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
    icon: 'png-to-jpg',
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
    icon: 'webp-converter',
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
    icon: 'image-to-pdf',
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
    icon: 'pdf-to-images',
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
    description: 'Combine multiple PDFs into a single document. Drag and drop to reorder files. Processing happens securely in your browser.',
    shortDescription: 'Combine multiple PDFs into one document',
    icon: 'pdf-merge',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 50,
    seo: {
      title: 'Merge PDF Files Online Free | Combine PDFs Locally',
      description: 'Combine multiple PDF files into a single document directly in your browser. Drag and drop to reorder, completely private and free.',
      keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'pdf merger', 'browser pdf tool']
    },
    faq: [
      {
        question: 'Is my data secure?',
        answer: 'Yes. The merging process happens entirely in your web browser. Your PDF files are never uploaded to any server.'
      },
      {
        question: 'How do I change the order of the merged PDF?',
        answer: 'After selecting your files, you can simply drag and drop them in the list to rearrange their order before clicking Merge.'
      },
      {
        question: 'Is there a limit to how many PDFs I can merge?',
        answer: 'You can merge up to 50 PDF files at once, with a maximum file size of 100MB per file.'
      }
    ],
    howToUse: [
      'Select or drag and drop multiple PDF files into the upload area.',
      'Drag the files in the list to arrange them in your desired order.',
      'Click the "Merge PDFs" button.',
      'Download your combined PDF document.'
    ],
    relatedToolIds: ['pdf-split', 'pdf-to-images'],
    status: 'active',
    popular: true,
    supportsMultipleFiles: true,
    outputFormat: 'pdf'
  },
  {
    id: 'pdf-split',
    name: 'Split PDF',
    slug: 'split',
    category: 'pdf',
    path: '/pdf/split',
    description: 'Extract or split pages from a PDF into multiple files.',
    shortDescription: 'Split PDFs into multiple files',
    icon: 'pdf-split',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 1,
    status: 'active',
    options: [
      {
        id: 'ranges',
        label: 'Select pages to extract',
        type: 'text',
        defaultValue: '',
        placeholder: 'e.g., 1-3, 5, 8-10',
        description: 'Examples: 1-3 (pages 1 through 3), 5 (page 5), 1-3, 7 (multiple ranges). Type "all" or leave blank for all pages.'
      },
      {
        id: 'mode',
        label: 'Output Mode',
        type: 'select',
        defaultValue: 'combine',
        options: [
          { label: 'Extract selected pages into one PDF', value: 'combine' },
          { label: 'Extract each selected page as a separate PDF (ZIP)', value: 'separate' }
        ],
        description: 'Choose whether to merge the extracted pages into a single new PDF or keep them separate.'
      }
    ],
    seo: {
      title: 'Split PDF Files Online | Tools',
      description: 'Separate one page or a whole set of pages from a PDF document easily. Fast, free, and completely secure.',
      keywords: ['split pdf', 'extract pdf pages', 'separate pdf']
    },
    faq: [
      {
        question: 'What does Split PDF do?',
        answer: 'Split PDF allows you to extract selected pages from a PDF document. You can extract them into a single new PDF, or export each selected page as a completely separate PDF file (downloaded in a ZIP).'
      },
      {
        question: 'Can I extract specific pages?',
        answer: 'Yes. You can enter specific pages (e.g. "5"), ranges (e.g. "1-3"), or a combination (e.g. "1, 3, 5-7") to extract exactly what you need.'
      },
      {
        question: 'What happens if I leave the page range empty?',
        answer: 'If the input is empty or says "all", all pages of the document will be selected for extraction.'
      },
      {
        question: 'Can I extract each page separately?',
        answer: 'Yes! Simply select "Extract each selected page as a separate PDF (ZIP)" in the Output Mode dropdown. The selected pages will be saved individually and packaged into a ZIP archive for easy download.'
      },
      {
        question: 'Are my PDF files uploaded to a server?',
        answer: 'No. The entire process happens securely and privately within your web browser. Your PDF files are never uploaded to our servers.'
      },
      {
        question: 'Can I use Split PDF for large files?',
        answer: 'Yes, but performance depends on your device\'s memory (RAM) and web browser. Splitting very large PDFs with thousands of pages may cause your browser to slow down.'
      }
    ],
    howToUse: [
      'Upload a PDF document from your device.',
      'Enter the pages or page ranges you want to extract, for example: 1-3, 5, 8-10.',
      'Choose whether to create one combined PDF or separate PDFs in a ZIP.',
      'Click the Split PDF button.',
      'Download the resulting PDF or ZIP archive.'
    ],
    relatedToolIds: ['pdf-merge']
  },
  {
    id: 'pdf-rotate',
    name: 'Rotate PDF',
    slug: 'rotate',
    category: 'pdf',
    path: '/pdf/rotate',
    description: 'Rotate PDF pages securely in your browser without uploading to any server.',
    shortDescription: 'Rotate PDF pages',
    icon: 'pdf-rotate',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 1,
    status: 'active',
    options: [
      {
        id: 'rotation',
        label: 'Rotation Angle',
        type: 'select',
        defaultValue: '90',
        options: [
          { label: '90° Clockwise', value: '90' },
          { label: '180°', value: '180' },
          { label: '270° Clockwise', value: '270' }
        ]
      },
      {
        id: 'applyTo',
        label: 'Apply to',
        type: 'select',
        defaultValue: 'all',
        options: [
          { label: 'All pages', value: 'all' },
          { label: 'Specific pages', value: 'specific' }
        ]
      },
      {
        id: 'ranges',
        label: 'Pages to rotate',
        type: 'text',
        defaultValue: '',
        placeholder: 'e.g., 1-3, 5, 8-10',
        description: 'Leave blank to rotate all pages. Example: 1-3 (pages 1 through 3), 5 (page 5).'
      }
    ],
    seo: {
      title: 'Rotate PDF Pages Online | Tools',
      description: 'Rotate individual pages or entire PDF documents easily. Completely free and secure, processed entirely in your web browser.',
      keywords: ['rotate pdf', 'turn pdf pages', 'change pdf orientation', 'rotate pdf online free']
    },
    faq: [
      {
        question: 'Are my PDF files uploaded to a server?',
        answer: 'No. The entire rotation process happens securely and privately within your web browser. Your PDF files are never uploaded to our servers.'
      },
      {
        question: 'Can I rotate only specific pages?',
        answer: 'Yes! Select "Specific pages" in the "Apply to" dropdown, and then enter the page numbers or ranges (e.g., "1-3, 5") you wish to rotate.'
      },
      {
        question: 'Will this change the quality of my PDF?',
        answer: 'No, this tool only modifies the rotation metadata of the pages. The original quality, text, and images are perfectly preserved.'
      }
    ],
    howToUse: [
      'Upload a PDF document from your device.',
      'Select the rotation angle: 90° Clockwise, 180°, or 270° Clockwise.',
      'Choose whether to apply the rotation to all pages or specific pages.',
      'If specific, enter the page numbers to rotate.',
      'Click the Rotate PDF button.',
      'Download your rotated PDF file.'
    ],
    relatedToolIds: ['pdf-split', 'pdf-merge']
  },
  {
    id: 'pdf-compress',
    name: 'Compress PDF',
    slug: 'compress',
    category: 'pdf',
    path: '/pdf/compress',
    description: 'Reduce the file size of your PDF documents securely in your browser.',
    shortDescription: 'Reduce PDF file size',
    icon: 'pdf-compress',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 1,
    status: 'active',
    options: [
      {
        id: 'compressionLevel',
        label: 'Compression Level',
        type: 'select',
        defaultValue: '50',
        options: [
          { label: 'Low — 10%', value: '10' },
          { label: 'Light — 30%', value: '30' },
          { label: 'Balanced — 50%', value: '50' },
          { label: 'Strong — 70%', value: '70' },
          { label: 'Maximum — 90%', value: '90' }
        ],
        description: 'Higher compression reduces file size more but may reduce quality.'
      }
    ],
    seo: {
      title: 'Compress PDF Files Online Free | No Server Upload',
      description: 'Reduce the size of your PDF files securely directly in your browser. Completely private, no data is uploaded to our servers.',
      keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf compressor free']
    },
    faq: [
      {
        question: 'Is my data secure?',
        answer: 'Yes! All processing happens completely locally in your browser. Your PDF files are never uploaded to our servers, ensuring total privacy.'
      },
      {
        question: 'Will this make my text unselectable?',
        answer: 'It depends on the compression level. Lower levels (10% - 30%) preserve text, fonts, and vector graphics perfectly. Higher levels (50% - 90%) may rasterize pages into images to achieve smaller file sizes, which can make text non-selectable.'
      },
      {
        question: 'Why didn\'t my file size shrink?',
        answer: 'If your PDF is already highly optimized or consists entirely of compressed images, it may not be possible to reduce its size further without ruining the quality. We never fake a compression — if we can\'t reduce the size, we preserve the original file.'
      }
    ],
    howToUse: [
      'Click or drag and drop a PDF file into the upload area.',
      'Leave the compression level on "Recommended — Lossless".',
      'Click "Compress PDF".',
      'If the file can be optimized, download your new smaller PDF.'
    ],
    relatedToolIds: ['pdf-merge', 'pdf-split']
  },
  {
    id: 'pdf-remove-pages',
    name: 'Remove PDF Pages',
    slug: 'remove-pages',
    category: 'pdf',
    path: '/pdf/remove-pages',
    description: 'Delete unwanted pages from a PDF document.',
    shortDescription: 'Delete pages from PDF',
    icon: 'pdf-remove-pages',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 1,
    status: 'active',
    seo: {
      title: 'Remove Pages from PDF Online Free | No Server Upload',
      description: 'Quickly remove unwanted pages from your PDF files directly in your browser. Completely private, no data is uploaded to our servers.',
      keywords: ['remove pdf pages', 'delete pdf pages', 'extract pdf pages']
    },
    faq: [
      {
        question: 'Is my data secure?',
        answer: 'Yes! All processing happens completely locally in your browser. Your PDF files are never uploaded to our servers, ensuring total privacy.'
      },
      {
        question: 'Will this affect the quality of my PDF?',
        answer: 'No. This tool only removes the pages you select and leaves the rest of the document completely untouched. Text remains selectable and image quality is perfectly preserved.'
      },
      {
        question: 'Can I remove all pages?',
        answer: 'You must keep at least one page in your document. You cannot remove every page.'
      }
    ],
    howToUse: [
      'Click or drag and drop a PDF file into the upload area.',
      'Visually select the pages you want to remove by clicking their thumbnails.',
      'Click "Remove Pages".',
      'Download your new PDF document.'
    ],
    relatedToolIds: ['pdf-split', 'pdf-merge', 'pdf-rotate']
  },
  {
    id: 'pdf-page-numbering',
    name: 'PDF Page Numbering',
    slug: 'page-numbering',
    category: 'pdf',
    path: '/pdf/page-numbering',
    description: 'Add page numbers to your PDF documents.',
    shortDescription: 'Add numbers to PDF pages',
    icon: 'pdf-page-numbering',
    acceptedTypes: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 1,
    status: 'active',
    seo: {
      title: 'Add Page Numbers to PDF Online | Tools',
      description: 'Insert page numbers into your PDF document easily. Fast, local processing with customizable position and format.',
      keywords: ['pdf page numbers', 'add numbers to pdf', 'paginate pdf', 'pdf numbering tool']
    },
    faq: [
      {
        question: 'Are my PDF files safe?',
        answer: 'Yes! Your files are processed entirely in your browser using local resources. They are never uploaded to any server.'
      },
      {
        question: 'Can I number only specific pages?',
        answer: 'Yes, you can enter a specific page range (e.g., 1, 3, 5-10) to only add numbers to those pages.'
      },
      {
        question: 'Does this ruin my selectable text?',
        answer: 'No. The numbers are embedded natively as vector text, so your original PDF remains completely intact, searchable, and selectable.'
      }
    ],
    howToUse: [
      'Upload the PDF you want to number.',
      'Configure the page range, position, format, and starting number.',
      'Use the visual preview to verify your settings.',
      'Click "Add Page Numbers" to process.',
      'Download your updated PDF.'
    ],
    relatedToolIds: ['pdf-merge', 'pdf-remove-pages']
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
    icon: 'heic-converter',
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
    icon: 'passport-photo',
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
    icon: 'signature-maker',
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
