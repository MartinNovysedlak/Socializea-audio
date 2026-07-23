"use client";

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absoluteAsset, absoluteUrl } from '@/lib/site';
import { breadcrumbJsonLd, getSeoPage, siteGraphJsonLd } from '@/lib/seo';

type SeoHeadProps = {
  path: string;
  /** Voliteľné prepísanie (detail produktov / blogu). */
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  noindex?: boolean;
  breadcrumbs?: { name: string; path: string }[];
  /** Extra JSON-LD objekty (Product, BlogPosting, …). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  includeSiteGraph?: boolean;
};

const SeoHead = ({
  path,
  title,
  description,
  image,
  keywords,
  noindex = false,
  breadcrumbs,
  jsonLd,
  includeSiteGraph = false,
}: SeoHeadProps) => {
  const page = getSeoPage(path);
  const finalTitle = title ?? page.title;
  const finalDescription = description ?? page.description;
  const finalKeywords = keywords ?? page.keywords;
  const finalImage = image ?? absoluteAsset('/logo.png');
  const canonical = absoluteUrl(path === '/' ? '/' : path);

  const scripts: Record<string, unknown>[] = [];
  if (includeSiteGraph) scripts.push(siteGraphJsonLd());
  if (breadcrumbs?.length) scripts.push(breadcrumbJsonLd(breadcrumbs));
  if (jsonLd) {
    if (Array.isArray(jsonLd)) scripts.push(...jsonLd);
    else scripts.push(jsonLd);
  }

  return (
    <Helmet>
      <html lang="sk" />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {finalKeywords ? <meta name="keywords" content={finalKeywords} /> : null}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Socializea Audio" />
      <meta property="og:locale" content="sk_SK" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={finalImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {scripts.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SeoHead;
