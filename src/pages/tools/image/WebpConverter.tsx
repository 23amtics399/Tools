import React from 'react';
import { getToolById } from '../../../config/tools';
import { convertToWebp } from '../../../processors/image/webpConverter';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('webp-converter')!;

export default function WebpConverterPage() {
  return <ToolPageLayout tool={tool} processorFn={convertToWebp} />;
}
