import React from 'react';
import { getToolById } from '../../../config/tools';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('pdf-compress')!;

export default function CompressPage() {
  return <ToolPageLayout tool={tool} />;
}
