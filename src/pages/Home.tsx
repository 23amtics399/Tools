import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { TOOLS as allTools, CATEGORIES } from '../config/tools';
import { ToolDefinition } from '../types/tool';
import Hero from '../components/home/Hero';
import AllToolsGrid from '../components/home/AllToolsGrid';
import PrivacyBanner from '../components/home/PrivacyBanner';
import HomeFAQ from '../components/home/HomeFAQ';
import styles from './Home.module.css';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const popularTools = allTools.filter((tool: ToolDefinition) => tool.popular);
  
  const canonicalUrl = "https://tools.sji.one/";
  const title = "Free Online Image & PDF Tools - Tools by sji.one";
  const description = "A comprehensive collection of free online tools for image optimization, format conversion, and PDF manipulation. Process files locally in your browser.";

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Tools by sji.one",
    "url": canonicalUrl,
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Tools by sji.one",
    "url": canonicalUrl,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Tools by sji.one" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(webSiteJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppJsonLd)}</script>
      </Helmet>

      <div className={styles.container}>
        <Hero onSearch={setSearchQuery} />


        {!searchQuery && (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Popular Tools</h2>
              <AllToolsGrid tools={popularTools} />
            </section>
            
            {CATEGORIES.map(cat => {
              const categoryTools = allTools.filter(t => t.category === cat.id);
              if (categoryTools.length === 0) return null;
              
              return (
                <section key={cat.id} className={styles.section} id={`${cat.id}-tools`}>
                  <h2 className={styles.sectionTitle}>{cat.name}</h2>
                  <AllToolsGrid tools={categoryTools} />
                </section>
              );
            })}
          </>
        )}

        {searchQuery && (
          <section className={styles.section} id="search-results">
            <h2 className={styles.sectionTitleLeft}>Search Results</h2>
            <AllToolsGrid tools={allTools} searchQuery={searchQuery} />
          </section>
        )}

        {!searchQuery && (
          <>
            <PrivacyBanner />
            <HomeFAQ />
          </>
        )}
      </div>
    </>
  );
}
