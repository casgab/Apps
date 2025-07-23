
export interface LineItem {
  id: string;
  description: string;
  code: string;
  unitPrice: number;
  quantity: number;
  discount: number; // Stored as a percentage, e.g., 10 for 10%
}
