import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { CardBase } from "./CardBase";

export class CardBasket extends CardBase<IProduct> {
  private indexItem: HTMLElement;
  private deleteButton: HTMLButtonElement;
  private _onClick?: () => void;

  get element(): HTMLElement {
    return this.container;
  }


  constructor(container: HTMLElement, onClick?: () => void) {
    super(container);
    
    this.indexItem = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    this._onClick = onClick;
    
    if (this._onClick) {
      this.deleteButton.addEventListener('click', () => this._onClick!());
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