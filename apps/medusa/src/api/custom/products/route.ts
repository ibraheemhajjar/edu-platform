// eslint-disable-next-line @nx/enforce-module-boundaries
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const query = req.scope.resolve('query');

    const { data: products } = await query.graph({
      entity: 'product',
      fields: [
        'id',
        'title',
        'description',
        'status',
        'metadata',
        'variants.*',
        'variants.prices.*',
      ],
      filters: {
        status: 'published',
      },
    });

    res.json({ products });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
