import React from 'react';
import { getToolById } from '../../../config/tools';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';

const tool = getToolById('passport-photo')!;

export default function PassportPhotoPage() {
  return <ToolPageLayout tool={tool} />;
}
