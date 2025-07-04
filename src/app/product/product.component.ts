import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from '../shared/models/product';
import { CurrencyPipe, AsyncPipe, CommonModule } from '@angular/common';
import { ProductService } from '../core/services/product.service';
import { CartService } from '../core/services/cart.service'; // ✅ Make sure path is correct
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CartProduct } from '../shared/models/cart-product';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, AsyncPipe],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  id = input<string>('');
  productService = inject(ProductService);
  cartService = inject(CartService); // ✅ THIS is the fix

  product$!: Observable<Product | undefined>;
  message: string = '';

    product!: Product;
  private route = inject(ActivatedRoute);
  private router = inject(Router);


  ngOnInit(): void {
    this.product$ = this.productService.getById(this.id());
  }

  addToCart(product: Product): void {
    const cartProduct: CartProduct = {
  id: product.id,
  product: product,
  price: product.price,
  quantity: 1,
  total: product.price
};

this.cartService.addToCart(cartProduct);
    //this.message = '✅ Your selected item is added to your cart.';
    this.message = `✅ ${product.name} has been added to your cart.`;
    this.router.navigate(['/cart']);
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}
