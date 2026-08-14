import React from 'react';
import { getToolById } from '../../../config/tools';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('pdf-merge')!;

export default function MergePage() {
  return <ToolPageLayout tool={tool} />;
}
