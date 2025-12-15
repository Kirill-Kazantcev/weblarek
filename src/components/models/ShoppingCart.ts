import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

// Модель корзины покупок
export class ShoppingCart {
  private items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    if (this.contains(product.id)) {
      return;
    }
    
    if (product.price === null) {
      return;
    }
    
    this.items.push(product);
    this.events.emit('cart:changed');
  }

  removeItem(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
    this.events.emit('cart:changed');
  }

  removeItemById(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.events.emit('cart:changed');
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:changed');
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  contains(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}