import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  schema?: string;
}

export default function SEO({ 
  title = 'SEWA Goatique | Handmade Goat Milk Skincare', 
  description = 'Pure, ethical, and empowering handmade goat milk soaps and skincare crafted by rural women artisans.',
  image = 'https://images.unsplash.com/photo-1600857062241-98e5b4f9c199?auto=format&fit=crop&q=80&w=800',
  url = window.location.href,
  schema
}: SEOProps) {
  const siteTitle = title.includes('SEWA Goatique') ? title : `${title} | SEWA Goatique`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={siteTitle} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={image} />
        
        <link rel="canonical" href={url} />
        
        {schema && <script type="application/ld+json">{schema}</script>}
      </Helmet>
    </HelmetProvider>
  );
}
