# Noble Polyhedra — 3D Figure & Solid Shape Studio | Webtigo Group

An interactive 3D geometry exploration studio and atlas for exploring, visualizing, and mathematically inspecting all 146 noble polyhedra (isohedral and isogonal geometries). Part of the **Webtigo Group**.

**Production Host:** `https://noblepolyhedra.vercel.app`

## SEO & Google Search Console Ready

- **Target Search Keywords**: Optimized to rank for *noble polyhedra*, *noble polyhedron*, *3D figure*, *3D solid shape*, and *Webtigo* / *Webtigo Group*.
- **Google Search Console**: Head meta tag `<meta name="google-site-verification" content="..." />` ready for property verification.
- **XML Sitemap**: `public/sitemap.xml` generated with all 146 canonical shape URLs (`/shape/:id`) and homepage.
- **Robots.txt**: `public/robots.txt` pointing search engine crawlers to `https://noblepolyhedra.vercel.app/sitemap.xml`.
- **Dynamic Meta Descriptions & Canonical URLs**: Every polyhedral page updates the `<link rel="canonical">`, `<meta name="description">`, OpenGraph, Twitter, and Schema.org JSON-LD tags with exact geometric metrics in real-time.

## Features

- **Interactive 3D Three.js Engine**: Real-time rendering with custom lighting, orbital controls, facet explosion sliders, wireframe edge/vertex toggles, and responsive canvas viewports.
- **Floating 3-Shape Carousel**: Smoothly animated Previous, Current, and Next shape preview dock with auto-rotation, live mini 3D rendering, and fast switching.
- **Single & Multi-View Modes**: Compare side-by-side or inspect individual polyhedra in full resolution.
- **Mathematical Inspection Drawer**: Deep metrics for vertices, edges, faces, Euler characteristic, vertex figure types, and symmetry groups.
- **Continuous Auto-Tour Mode**: Hands-free stepping through polyhedra with customizable speed presets.
- **Comprehensive Search & Catalog Filters**: Filter by Degrees of Freedom (0-DoF, 1-DoF, 2-DoF), face polygon count, and discovery era.
- **Vercel Serverless Ready**: Native `vercel.json` configuration and `/api` serverless functions for deployment on Vercel's edge network.
- **Dynamic SEO & Canonical URLs**: Automated head meta-descriptions, `<link rel="canonical">` resolution, OpenGraph/Twitter social cards, and Schema.org JSON-LD structured data for every individual polyhedral shape URL (`/shape/:id`).

## Project Structure

```
├── api/                  # Vercel Serverless Functions (/api/health, /api/models)
├── public/               # Static assets and nobleModels dataset
├── src/
│   ├── components/       # 3D Viewers, UI Overlays, Controls, Modals
│   ├── data/             # Models catalog index and geometries
│   ├── utils/            # 3D math, polygon triangulation, discovery metadata
│   ├── App.tsx           # Main application shell
│   └── main.tsx          # Application entry point
├── index.html            # HTML shell with typography and SEO tags
├── vercel.json           # Vercel deployment configuration
└── vite.config.ts        # Vite configuration
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Vercel Deployment

Deploying to Vercel is seamless:

1. Import this repository into Vercel or deploy using the Vercel CLI:
   ```bash
   vercel
   ```
2. Vercel automatically detects the Vite framework and applies the provided `vercel.json` configuration:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Serverless API**: Handled via `/api/*` endpoints
   - **SPA Routing**: Automatic rewrite to `/index.html`

## Copyright & Ownership

© 2026 **Webtigo**. All rights reserved. All copyrights belong to Webtigo.
- **Creator**: Member of Multiverse (Aaditya Wahal)
- **Powered by**: Webtigo Group

## Acknowledgements

Credit and sincere appreciation to **Plasmath** for discovering and solving the modern 2-degree-of-freedom noble polyhedral parameter systems, advancing classical geometric foundations established by Branko Grünbaum, Peter McMullen, and historical polyhedral geometers.
