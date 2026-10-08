// Vercel Serverless Function: /api/health
export default function handler(
  _req: { method?: string },
  res: { status: (code: number) => { json: (data: unknown) => void } }
) {
  res.status(200).json({
    status: 'healthy',
    app: 'Noble Polyhedra',
    organization: 'Webtigo Group',
    host: 'noblepolyhedra.vercel.app',
    runtime: 'Vercel Serverless Function',
    timestamp: new Date().toISOString(),
    polyhedraCount: 146,
    features: [
      'Interactive 3D Three.js Studio',
      'Dual & Multi View Comparison',
      'Real-time Geometry Analysis',
      'Floating Trio Navigation Dock',
      'Continuous Auto-Tour Mode'
    ]
  });
}
