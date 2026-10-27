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

/**
 * Updates document head for the Home Page / Index catalog.
 */
export function updateHomePageSEO(baseUrl?: string) {
  if (typeof document === 'undefined') return;

  const origin =
    baseUrl ||
    (typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://noblepolyhedra.vercel.app');

  const title = 'Noble Polyhedra — 3D Figure & Solid Shape Studio | Webtigo Group';
  const description =
    'Explore all 146 noble polyhedra by group in interactive 3D. The premier 3D solid shape and polyhedral figure index by Webtigo Group, created by Member of Multiverse (Aaditya Wahal).';
  const canonicalUrl = `${origin}/`;

  document.title = title;

  const setMetaTag = (attribute: string, key: string, content: string) => {
    let element = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  setMetaTag('name', 'description', description);
  setMetaTag('name', 'copyright', '© 2026 Webtigo. All rights reserved. Powered by Webtigo Group');
  setMetaTag('name', 'author', 'Member of Multiverse (Aaditya Wahal), Webtigo Group');
  setMetaTag(
    'name',
    'keywords',
    'noble polyhedra, noble polyhedron, 3D figure, 3D solid shape, 3D geometric shapes, polyhedra, polyhedral geometry, isohedral, isogonal, 3D math models, Webtigo, Webtigo Group, interactive 3D solid figures'
  );

  let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:type', 'website');

  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: `${origin}/`,
        name: 'Noble Polyhedra',
        alternateName: ['Noble Polyhedron 3D Atlas', '3D Solid Shape Studio', 'Webtigo Noble Polyhedra'],
        description,
        publisher: {
          '@type': 'Organization',
          '@id': `${origin}/#organization`,
          name: 'Webtigo Group',
          url: origin,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${origin}/?shape={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebApplication',
        '@id': `${origin}/#webapp`,
        url: `${origin}/`,
        name: 'Noble Polyhedra 3D Studio',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        author: {
          '@type': 'Person',
          name: 'Aaditya Wahal',
          alternateName: 'Member of Multiverse',
        },
        creator: {
          '@type': 'Person',
          name: 'Aaditya Wahal',
          alternateName: 'Member of Multiverse',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Webtigo Group',
        },
        copyrightHolder: {
          '@type': 'Organization',
          name: 'Webtigo',
          url: origin,
        },
        copyrightYear: 2026,
        contributor: {
          '@type': 'Person',
          name: 'Akshat Wahal',
          description:
            'Conceived the original idea and provided the vital information that new polyhedrons are discovered; the initiative was his, inspiring the creation by Member of Multiverse (Aaditya Wahal).',
        },
        keywords:
          'noble polyhedra, noble polyhedron, 3D figure, 3D solid shape, geometry studio, Webtigo, Aaditya Wahal, Member of Multiverse, Akshat Wahal',
      },
      {
        '@type': 'FAQPage',
        '@id': `${origin}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is a Noble Polyhedron in geometry?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A noble polyhedron is a 3D geometric solid that possesses dual transitivity: it is simultaneously isogonal (all vertices are symmetrically equivalent) and isohedral (all faces are congruent and symmetrically equivalent).',
            },
          },
          {
            '@type': 'Question',
            name: 'How do noble polyhedra differ from Archimedean and Catalan solids?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Archimedean solids are isogonal but not isohedral. Catalan solids are isohedral but not isogonal. Noble polyhedra uniquely bridge this duality by fulfilling both criteria simultaneously.',
            },
          },
          {
            '@type': 'Question',
            name: 'What does Degree of Freedom (0-DoF, 1-DoF, 2-DoF) signify?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Degree of Freedom measures how many independent continuous variables can deform a polyhedron without breaking its nobility. 0-DoF polyhedra are rigid; 1-DoF polyhedra form continuous curves; 2-DoF polyhedra form continuous 2D families.',
            },
          },
          {
            '@type': 'Question',
            name: 'Who discovered the newly documented continuous 2-DoF polyhedra?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The continuous 2-DoF polyhedra families were proven in academic literature by Mirko Stevanovic in 2020. The initiative to turn this discovery into an interactive public 3D catalog was championed by Akshat Wahal, and created by Member of Multiverse (Aaditya Wahal) under Webtigo Group.',
            },
          },
        ],
      },
    ],
  };

  let scriptTag = document.getElementById('seo-polyhedron-jsonld') as HTMLScriptElement | null;
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.id = 'seo-polyhedron-jsonld';
    scriptTag.type = 'application/ld+json';
    document.head.appendChild(scriptTag);
  }
  scriptTag.textContent = JSON.stringify(homeJsonLd, null, 2);
}

