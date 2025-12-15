import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { CardBase } from "./CardBase";
import { categoryMap } from "../../../utils/constants";

export class CardCatalog extends CardBase<IProduct> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;
  private _onClick?: () => void;

  get element(): HTMLElement {
    return this.container;
  }


  constructor(container: HTMLElement, onClick?: () => void) {
    super(container);
    
    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this._onClick = onClick;
    
    if (this._onClick) {
      this.container.addEventListener('click', () => this._onClick!());
    }
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    this.cardCategory.className = 'card__category';
    if (value in categoryMap) {
      this.cardCategory.classList.add(categoryMap[value as keyof typeof categoryMap]);
    }
  }

  set image(value: string) {
    this.setImage(this.cardImage, value, this.cardTitle.textContent || '');
  }

  render(data?: Partial<IProduct>): HTMLElement {
    super.render(data);
    if (data) {
      if (data.category !== undefined) this.category = data.category;
      if (data.image !== undefined) this.image = data.image;
    }
    return this.container;
  }
}