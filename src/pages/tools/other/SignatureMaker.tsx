import React from 'react';
import { getToolById } from '../../../config/tools';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('signature-maker')!;

export default function SignatureMakerPage() {
  return <ToolPageLayout tool={tool} />;
}
