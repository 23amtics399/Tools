export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolOption {
  id: string;
  label: string;
  type: 'slider' | 'select' | 'toggle' | 'number' | 'text';
  defaultValue: unknown;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  description?: string;
}

export type ToolCategory = 'image' | 'pdf' | 'other';

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  path: string;
  description: string;
  shortDescription: string;
  icon: string; // emoji
  acceptedTypes: string[]; // MIME types
  maxFileSizeMB: number;
  maxFiles: number;
  options?: ToolOption[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  faq: FAQItem[];
  howToUse: string[];
  relatedToolIds: string[];
  status: 'active' | 'coming-soon';
  popular?: boolean;
  supportsMultipleFiles?: boolean;
  outputFormat?: string;
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}
