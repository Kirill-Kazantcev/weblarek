//Класс модели данных для хранения Корзины с покупками
import { IProduct } from '../../types';

export class ShoppingCart {
  private cartItems: IProduct[] = [];

  getCartItems(): IProduct[] {
    return this.cartItems;
  }

  addToCart(product: IProduct): void {
    this.cartItems.push(product);
  }

  removeItemFromCart(product: IProduct): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== product.id);
  }

  removeAllItemsFromCart(): void {
    this.cartItems = [];
  }

  getCartTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCartTotalQuantity(): number {
    return this.cartItems.length;
  }

  checkItemInCart(id: string): boolean {
    return this.cartItems.some(item => item.id === id);
  }
}