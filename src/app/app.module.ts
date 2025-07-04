import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { CartProductComponent } from './cart/components/cart-product/cart-product.component'; // 👈 correct path
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    CartProductComponent  // 👈 declare your component here
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
