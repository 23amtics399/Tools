import React from 'react';
import { getToolById } from '../../../config/tools';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('pdf-page-numbering')!;

export default function PageNumberingPage() {
  return <ToolPageLayout tool={tool} />;
}
