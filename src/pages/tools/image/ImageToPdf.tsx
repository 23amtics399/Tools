import React from 'react';
import { getToolById } from '../../../config/tools';
import { convertImageToPdf } from '../../../processors/image/imageToPdf';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('image-to-pdf')!;

export default function ImageToPdfPage() {
  return <ToolPageLayout tool={tool} processorFn={convertImageToPdf} />;
}
