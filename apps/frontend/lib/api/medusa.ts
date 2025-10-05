const MEDUSA_URL = 'http://localhost:9000';

export const medusaApi = {
  getProducts: async () => {
    const res = await fetch(`${MEDUSA_URL}/custom/products`);
    return res.json();
  },
};
