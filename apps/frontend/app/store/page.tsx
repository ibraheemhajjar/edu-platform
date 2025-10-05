'use client';

import { useQuery } from '@tanstack/react-query';
import { medusaApi } from '@/lib/api/medusa';
import type { MedusaProduct } from '@edu-platform/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function StorePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: medusaApi.getProducts,
  });

  const products = data?.products || [];

  if (isLoading) return <div className="container mx-auto p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Course Store</h1>

      {products.length === 0 ? (
        <p className="text-gray-600">
          No courses available yet. Import courses from the backend first.
        </p>
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

              <Button className="w-full">Purchase Course</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
