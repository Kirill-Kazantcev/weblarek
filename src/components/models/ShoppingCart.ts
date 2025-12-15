import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';

export class ShoppingCart {
  private cartItems: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  getCartItems(): IProduct[] {
    return this.cartItems;
  }

  addToCart(product: IProduct): void {
    if (!this.checkItemInCart(product.id)) {
      this.cartItems.push(product);
      this.events.emit('cart:changed');
    }
  }

  removeItemFromCart(product: IProduct): void {
    this.cartItems = this.cartItems.filter(item => item.id !== product.id);
    this.events.emit('cart:changed');
  }

  removeItemFromCartById(id: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.events.emit('cart:changed');
  }

  removeAllItemsFromCart(): void {
    this.cartItems = [];
    this.events.emit('cart:changed');
  }

  getCartTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  getCartTotalQuantity(): number {
    return this.cartItems.length;
  }

  checkItemInCart(id: string): boolean {
    return this.cartItems.some(item => item.id === id);
  }
}