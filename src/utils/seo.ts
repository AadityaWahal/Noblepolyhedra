import { NobleModelSummary } from '../types';
import { getDiscoveryInfo } from './nobleDiscovery';

/**
 * Generates SEO metadata for any noble polyhedron model.
 * Produces search-engine optimized titles (30-60 chars) and meta-descriptions (120-160 chars).
 */
export function getPolyhedronSeoMeta(model: NobleModelSummary, baseUrl?: string) {
  const discovery = getDiscoveryInfo(model);
  const faceName =
    model.faceSides === 3
      ? 'triangles'
      : model.faceSides === 4
        ? 'quadrilaterals'
        : model.faceSides === 5
          ? 'pentagons'
          : model.faceSides === 6
            ? 'hexagons'
            : `${model.faceSides}-gons`;

  const origin =
    baseUrl ||
    (typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://noblepolyhedra.vercel.app');

  const canonicalUrl = `${origin}/shape/${encodeURIComponent(model.id)}`;

  // Keyword-rich title: "noble polyhedron", "3D solid shape", "3D figure", "Webtigo Group"
  const title = `${model.id} Noble Polyhedron — 3D Solid Shape & Figure | Webtigo Group`;

  // Concise, information-dense 120-160 character meta description
  const description = `Explore Noble Polyhedron ${model.id} in 3D: ${model.numFaces} ${faceName}, ${model.numEdges} edges, ${model.numVertices} vertices. Interactive 3D solid shape and polyhedral figure by Webtigo Group.`.slice(0, 160);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['WebApplication', 'VisualArtwork'],
    name: `Noble Polyhedron ${model.id}`,
    alternateName: [`Noble Polyhedra ${model.id}`, `3D Solid Shape ${model.id}`, `3D Figure ${model.id}`],
    description,
    url: canonicalUrl,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    artform: 'Mathematical 3D Geometry',
    artMedium: 'WebGL Three.js Interactive Model',
    genre: 'Polyhedral Geometry',
    creator: {
      '@type': 'Person',
      name: 'Aaditya Wahal',
      alternateName: 'Member of Multiverse',
    },
    author: {
      '@type': 'Person',
      name: 'Aaditya Wahal',
      alternateName: 'Member of Multiverse',
    },
    copyrightHolder: {
      '@type': 'Organization',
      name: 'Webtigo',
      url: origin,
    },
    copyrightYear: 2026,
    publisher: {
      '@type': 'Organization',
      name: 'Webtigo Group',
      url: origin,
    },
    provider: {
      '@type': 'Organization',
      name: 'Webtigo Group',
      url: origin,
    },
    keywords: [
      'noble polyhedra',
      'noble polyhedron',
      `shape ${model.id}`,
      '3D figure',
      '3D solid shape',
      '3D geometric shapes',
      `${model.faceSides}-sided faces`,
      `${model.dof} degrees of freedom`,
      `${model.orbit} orbit`,
      'isogonal',
      'isohedral',
      'Webtigo',
      'Webtigo Group',
      'interactive 3D shapes'
    ].join(', '),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return {
    title,
    description,
    canonicalUrl,
    jsonLd,
  };
}

/**
 * Dynamically updates document head tags:
 * - document.title
 * - <meta name="description">
 * - <link rel="canonical">
 * - OpenGraph (og:title, og:description, og:url)
 * - Twitter Cards (twitter:title, twitter:description)
 * - Schema.org JSON-LD structured data script
 */
export function updateDocumentHeadSEO(model: NobleModelSummary) {
  if (typeof document === 'undefined') return;

  const { title, description, canonicalUrl, jsonLd } = getPolyhedronSeoMeta(model);

  // 1. Update Document Title
  document.title = title;

  // 2. Helper to set or create meta tag
  const setMetaTag = (attribute: string, key: string, content: string) => {
    let element = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 3. Meta Description
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'copyright', '© 2026 Webtigo. All rights reserved. Powered by Webtigo Group');
  setMetaTag('name', 'author', 'Member of Multiverse (Aaditya Wahal), Webtigo Group');

  // 4. Canonical URL Link Tag
  let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 5. OpenGraph Tags
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:type', 'website');

  // 6. Twitter Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);

  // 7. Schema.org JSON-LD Structured Data
  let scriptTag = document.getElementById('seo-polyhedron-jsonld') as HTMLScriptElement | null;
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.id = 'seo-polyhedron-jsonld';
    scriptTag.type = 'application/ld+json';
    document.head.appendChild(scriptTag);
  }
  scriptTag.textContent = JSON.stringify(jsonLd, null, 2);
}
