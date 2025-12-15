import { EventEmitter } from "../base/Events";
import { IProduct } from '../../types';

export class Products {
  private items: IProduct[] = [];
  private checkItem: IProduct | null = null; // Название осталось checkItem

  constructor(private events: EventEmitter) {}

  // Сохранение массива товаров из API
  setItems(apiProducts: IProduct[]): void {
    this.items = apiProducts;
    this.events.emit('products:changed');
  }

  // Получение всех товаров каталога
  getItems(): IProduct[] {
    return this.items;
  }

  // Получение товара по ID
  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  // Установка товара для детального просмотра (старое название)
  setCheckItemById(id: string): boolean {
    const item = this.getItemById(id);
    if (item) {
      this.checkItem = item;
      this.events.emit('product:selected');
      return true;
    }
    return false;
  }

  // Получение товара для детального просмотра (старое название)
  getCheckItem(): IProduct | null {
    return this.checkItem;
  }

  // Очистка выбранного товара
  clearCheckItem(): void {
    this.checkItem = null;
  }
}