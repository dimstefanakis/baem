export interface Product {
  id: string;
  name: string;
  description: string;
  primaryImageUrl: string;
  additionalImageUrls: string[];
  singlePurchasePrice: number | null;
  multiplePurchasePrice: number | null;
  isSinglePurchaseAvailable: boolean;
}

export interface Purchase {
  id: string;
  productId: string;
  userId: string;
  purchaseType: 'single' | 'multiple';
  amountPaid: number;
  stripeSessionId: string;
  expiresAt: string | null;
  createdAt: string;
} 