import React from 'react';
import { getToolById } from '../../../config/tools';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('pdf-rotate')!;

export default function RotatePage() {
  return <ToolPageLayout tool={tool} />;
}
