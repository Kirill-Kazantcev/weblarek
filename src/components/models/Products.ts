//Класс модели данных для хранения каталога товаров
import { IProduct } from '../../types';

export class Products {
  private items: IProduct[] = [];
  private checkItem: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setCheckItemById(id: string): boolean {
    const item = this.getItemById(id);
    if (item) {
      this.checkItem = item;
      return true;
    }
    return false;
  }

  deleteCheckItemById(): boolean {
    this.checkItem = null;
    return true;
  }

  getCheckItem(): IProduct | null {
    return this.checkItem;
  }
}