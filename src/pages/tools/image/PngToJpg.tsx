import React from 'react';
import { getToolById } from '../../../config/tools';
import { convertPngToJpg } from '../../../processors/image/pngToJpg';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('png-to-jpg')!;

export default function PngToJpgPage() {
  return <ToolPageLayout tool={tool} processorFn={convertPngToJpg} />;
}
