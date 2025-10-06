import { MedusaRegion } from '@edu-platform/shared';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  'pk_61e3d0913524b9e2bfc75dc794e3e0f2f00456cf5d556d18563c40673f463980';

export const cartApi = {
  createCart: async (email: string, variant_id: string) => {
    // First, get the USD region
    const regionsRes = await fetch(`${MEDUSA_URL}/store/regions`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
    });
    const regionsData = await regionsRes.json();

    // Find USD region
    const usdRegion = regionsData.regions.find((r: MedusaRegion) => r.currency_code === 'usd');

    if (!usdRegion) {
      throw new Error('USD region not found');
    }

    // Step 1: Create empty cart with region
    const createRes = await fetch(`${MEDUSA_URL}/store/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        region_id: usdRegion.id,
        email,
      }),
    });
    const { cart } = await createRes.json();

    // Step 2: Add item to cart
    const addItemRes = await fetch(`${MEDUSA_URL}/store/carts/${cart.id}/line-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        variant_id,
        quantity: 1,
      }),
    });

    return addItemRes.json();
  },
  completeCart: async (cart_id: string) => {
    const res = await fetch(`${MEDUSA_URL}/custom/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        cart_id,
      }),
    });
    return res.json();
  },
};
