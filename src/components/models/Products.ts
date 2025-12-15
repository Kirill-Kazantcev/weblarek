import { IProduct } from '../../types';
import { EventEmitter } from "../base/Events";
import { CDN_URL } from "../../utils/constants";

// Модель для работы с товарами
export class Products {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  constructor(private events: EventEmitter) {}

  // Сохранение товаров из API с обработкой изображений
  setItems(apiProducts: IProduct[]): void {
    this.items = apiProducts.map(product => ({
      ...product,
      image: CDN_URL + product.image.replace('.svg', '.png')
    }));
    this.events.emit('products:loaded');
  }

  // Получение всех товаров
  getItems(): IProduct[] {
    return this.items;
  }

  // Поиск товара по ID
  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  // Установка выбранного товара
  setSelectedItem(id: string): boolean {
    const item = this.getItemById(id);
    if (item) {
      this.selectedItem = item;
      this.events.emit('product:selected', item);
      return true;
    }
    return false;
  }

  // Получение выбранного товара
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }

  // Очистка выбранного товара
  clearSelectedItem(): void {
    this.selectedItem = null;
  }
}