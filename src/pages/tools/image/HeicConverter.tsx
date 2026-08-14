import React from 'react';
import { getToolById } from '../../../config/tools';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('heic-converter')!;

export default function HeicConverterPage() {
  return <ToolPageLayout tool={tool} />;
}
