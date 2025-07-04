// src/app/core/services/cart.service.ts
import { Injectable } from '@angular/core';
import { CartProduct } from '../../shared/models/cart-product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart'; // ✅ Define cartKey
  private cart: CartProduct[] = []; // ✅ Define cart

  constructor() {
    const storedCart = localStorage.getItem(this.cartKey);
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

  getCart(): CartProduct[] {
    return this.cart;
  }

  addToCart(product: CartProduct): void {
    this.cart.push(product);
    this.saveCart();
  }


  
  updateQuantity(productId: string, quantity: number): void {
    const index = this.cart.findIndex(p => p.product.id === productId); 
  }
  
  
  // ✅ Update item in cart
  updateCartItem(cartProduct: CartProduct): void {
    const index = this.cart.findIndex(p => p.product.id === cartProduct.product.id);

    if (index !== -1) {
      this.cart[index] = cartProduct;
      this.saveCart();
    }
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(p => p.product.id !== productId);
    this.saveCart();
  }

  clearCart(): void {
    this.cart = [];
    this.saveCart();
  }

  private saveCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
  }
  getTotalPrice(): number {
    return this.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  getTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  isEmpty(): boolean {
    return this.cart.length === 0;
  }

  getCartItemCount(): number {
    return this.cart.length;
  }
}
