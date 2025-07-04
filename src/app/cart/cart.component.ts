import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { CartProduct } from '../shared/models/cart-product';
import { CartService } from '../core/services/cart.service';
import { OnInit } from '@angular/core';



@Component({
  selector: 'app-cart',
  standalone: true, // ✅ This makes it valid to use `imports`
  imports: [CommonModule, CartProductComponent, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})


export class CartComponent implements OnInit {
  cart: CartProduct[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
