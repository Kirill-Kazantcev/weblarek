import { Component } from "../../base/Component";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";

// Базовый класс для карточек товаров
export abstract class CardBase<T extends IProduct> extends Component<T> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);
    this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
  }

  render(data?: Partial<T>): HTMLElement {
    if (data) {
      if (data.title !== undefined) this.title = data.title;
      if (data.price !== undefined) this.price = data.price;
    }
    return this.container;
  }

  set title(value: string) {
    this.cardTitle.textContent = value || '';
  }

  set price(value: number | null) {
    this.cardPrice.textContent = value === null 
      ? 'Бесценно' 
      : `${value} синапсов`;
  }
  
  protected setImage(element: HTMLImageElement, src: string, alt: string = ''): void {
    element.src = src;
    element.alt = alt;
  }
}