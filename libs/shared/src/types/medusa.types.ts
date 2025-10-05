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
