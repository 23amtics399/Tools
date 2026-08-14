import { ToolDefinition, FAQItem } from '../types/tool';

export function generateToolJsonLd(tool: ToolDefinition): object | null {
  if (tool.status !== 'active') return null;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.name,
    "url": `https://tools.sji.one${tool.path}`,
    "description": tool.description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
}

export function generateFaqJsonLd(faqs: FAQItem[]): object {
  if (!faqs || faqs.length === 0) return {};
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateBreadcrumbJsonLd(tool: ToolDefinition): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tools.sji.one/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": tool.category.charAt(0).toUpperCase() + tool.category.slice(1),
        "item": `https://tools.sji.one/${tool.category}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.name,
        "item": `https://tools.sji.one${tool.path}`
      }
    ]
  };
}
