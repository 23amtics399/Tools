import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ToolCategory } from "../types/tool";
import { TOOLS as allTools, CATEGORIES } from "../config/tools";
import AllToolsGrid from "../components/home/AllToolsGrid";
import styles from "./CategoryPage.module.css";

export default function CategoryPage({ category }: { category?: 'image' | 'pdf' | 'other' }) {
  // If no category is provided via props, check url params or default to all
  const categoryParam = useParams().category as 'image' | 'pdf' | 'other' | undefined;
  const activeCategory = category || categoryParam;

  const title = activeCategory 
    ? CATEGORIES.find(c => c.id === activeCategory)?.name || 'Tools'
    : 'All Tools';
  
  const description = activeCategory
    ? CATEGORIES.find(c => c.id === activeCategory)?.description || 'Online tools'
    : 'A comprehensive collection of free online tools for image optimization, format conversion, and PDF manipulation.';

  const filteredTools = activeCategory 
    ? allTools.filter(t => t.category === activeCategory)
    : allTools;

  const canonicalUrl = `https://tools.sji.one${activeCategory ? `/${activeCategory}` : '/tools'}`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": canonicalUrl,
  };

  const breadcrumbJsonLd = {
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
        "name": title,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{title} - Tools by sji.one</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${title} - Tools by sji.one`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Tools by sji.one" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${title} - Tools by sji.one`} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(collectionJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className={styles.container}>
        <section className={styles.section}>
          <div className={styles.header}>
            <div className={styles.breadcrumbs}>
              <Link to="/">Home</Link> / <span>{title}</span>
            </div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.desc}>{description}</p>
          </div>
          
          <AllToolsGrid tools={filteredTools} />
        </section>
      </div>
    </>
  );
}
