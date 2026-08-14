import React from 'react';
import { getToolById } from '../../../config/tools';
import { convertJpgToPng } from '../../../processors/image/jpgToPng';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('jpg-to-png')!;

export default function JpgToPngPage() {
  return <ToolPageLayout tool={tool} processorFn={convertJpgToPng} />;
}
