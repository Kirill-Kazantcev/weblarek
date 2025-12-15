import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { CardBase } from "./CardBase";

// Карточка товара в корзине
export class CardBasket extends CardBase<IProduct> {
  private indexItem: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, private onClick?: () => void) {
    super(container);
    
    this.indexItem = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    
    if (this.onClick) {
      this.deleteButton.addEventListener('click', () => this.onClick!());
    }
  }

  set index(value: number) {
    this.indexItem.textContent = String(value);
  }

  render(data?: Partial<IProduct> & { index?: number }): HTMLElement {
    super.render(data);
    if (data?.index !== undefined) {
      this.index = data.index;
    }
    return this.container;
  }
}