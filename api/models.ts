// Vercel Serverless Function: /api/models
export default function handler(
  req: { query?: Record<string, string | string[]> },
  res: { status: (code: number) => { json: (data: unknown) => void } }
) {
  const query = req.query || {};
  const filter = typeof query.filter === 'string' ? query.filter : 'all';

  res.status(200).json({
    app: 'Noble Polyhedra',
    organization: 'Webtigo Group',
    host: 'noblepolyhedra.vercel.app',
    totalModels: 146,
    filterApplied: filter,
    breakdown: {
      newlyDiscovered2DoF: 81,
      classical0And1DoF: 65,
      orbits: ['gC', 'gD', 'sC', 'sD', 'rC', 'rD', 'tC', 'tD', 'tI', 'tO', 'Platonic']
    },
    documentation: 'Browse all 146 noble polyhedra via the interactive 3D web application.'
  });
}
