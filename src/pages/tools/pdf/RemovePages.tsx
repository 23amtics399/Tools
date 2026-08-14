import React from 'react';
import { getToolById } from '../../../config/tools';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('pdf-remove-pages')!;

export default function RemovePagesPage() {
  return <ToolPageLayout tool={tool} />;
}
