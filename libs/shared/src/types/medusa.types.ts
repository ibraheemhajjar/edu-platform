export interface MedusaProduct {
  id: string;
  title: string;
  description: string;
  status: string;
  metadata?: {
    course_id?: string;
    author?: string;
  };
  variants?: Array<{
    id: string;
    title: string;
    prices?: Array<{
      amount: number;
      currency_code: string;
    }>;
  }>;
}

export interface MedusaRegion {
  id: string;
  name: string;
  currency_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  metadata: Record<string, unknown> | null;
}

export interface MedusaCart {
  id: string;
  currency_code: string;
  total: {
    numeric_: number;
  };
}

export interface ProductWithMetadata {
  id: string;
  metadata?: {
    course_id?: string;
  };
}

export interface OrderItem {
  id: string;
  product_id: string;
  variant_id: string;
}

export interface Order {
  id: string;
  email: string;
  items: OrderItem[];
}
