import React from 'react';
import { Button } from '../ui/Button';
export const BatchDownload: React.FC<{ results: any[]; zipName: string }> = ({ results, zipName }) => (
  <Button variant="secondary" onClick={() => alert('Download Zip not implemented fully yet')}>Download All as ZIP</Button>
);

export default BatchDownload;
