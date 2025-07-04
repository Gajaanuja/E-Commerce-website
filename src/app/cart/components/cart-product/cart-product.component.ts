import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartProduct } from '../../../shared/models/cart-product';
import { CartService } from '../../../core/services/cart.service';      
import { Product } from '../../../shared/models/product'; // Import Product model if needed
import { FormsModule } from '@angular/forms'; // Import FormsModule for two-way data binding if needed
import { RouterModule } from '@angular/router'; // Import RouterModule for navigation if needed
//import { MatButtonModule } from '@angular/material/button'; // Import Material button module for buttons
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.  
// This component represents a single product in the cart

@Component({
  selector: 'app-cart-product',
  standalone: true,
  imports: [], 
  templateUrl: './cart-product.component.html',
 // styleUrls: ['./cart-product.component.css']
})
export class CartProductComponent {
  @Input() cartProduct!: CartProduct;
  @Output() updateCartEvent = new EventEmitter<void>();

  // Example method to update quantity or remove item and emit event
  removeItem() {
    // remove logic here
    this.updateCartEvent.emit();
  }
}

//constructor(private cartService: CartService) {}

