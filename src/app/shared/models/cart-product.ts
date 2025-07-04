import { Product } from './product';

export interface CartProduct {
  id: string; // Unique identifier for the cart item
  product: Product;
  quantity: number;
  price: number; // Price at the time of adding to cart
  total: number; // Total price for this product (quantity * price)
}
