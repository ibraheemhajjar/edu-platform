'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { medusaApi } from '@/lib/api/medusa';
import { cartApi } from '@/lib/api/cart';
import type { MedusaProduct } from '@edu-platform/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StorePage() {
  const [selectedProduct, setSelectedProduct] = useState<MedusaProduct | null>(null);
  const [email, setEmail] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: medusaApi.getProducts,
  });

  const purchaseMutation = useMutation({
    mutationFn: async ({ email, variant_id }: { email: string; variant_id: string }) => {
      const { cart } = await cartApi.createCart(email, variant_id);
      const result = await cartApi.completeCart(cart.id);

      if (result.type === 'cart') {
        throw new Error(result.error || 'Cart completion failed');
      }

      return result.order;
    },
    onSuccess: () => {
      alert('Purchase successful! Order placed.');
      setSelectedProduct(null);
      setEmail('');
    },
    onError: (error: Error) => {
      alert(`Purchase failed: ${error.message}`);
    },
  });

  const handlePurchase = () => {
    if (!selectedProduct || !email) return;
    const variant_id = selectedProduct.variants?.[0]?.id;
    if (!variant_id) return;

    purchaseMutation.mutate({ email, variant_id });
  };

  const products = data?.products || [];

  if (isLoading) return <div className="container mx-auto p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Course Store</h1>

      {products.length === 0 ? (
        <p className="text-gray-600">No courses available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: MedusaProduct) => (
            <Card key={product.id} className="p-6">
              <h3 className="font-semibold text-xl mb-2">{product.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>

              {product.metadata?.author && (
                <p className="text-sm text-gray-500 mb-2">By {product.metadata.author}</p>
              )}

              {product.variants?.[0]?.prices?.[0] && (
                <p className="text-lg font-bold text-green-600 mb-4">
                  ${(product.variants[0].prices[0].amount / 100).toFixed(2)}
                </p>
              )}

              <Button className="w-full" onClick={() => setSelectedProduct(product)}>
                Purchase Course
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase {selectedProduct?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Student Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
              />
            </div>
            <Button
              onClick={handlePurchase}
              disabled={!email || purchaseMutation.isPending}
              className="w-full"
            >
              {purchaseMutation.isPending ? 'Processing...' : 'Complete Purchase'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
