import React from 'react';
import { getToolById } from '../../../config/tools';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('pdf-split')!;

export default function SplitPage() {
  return <ToolPageLayout tool={tool} />;
}
