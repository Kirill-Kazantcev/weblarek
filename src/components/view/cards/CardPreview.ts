import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { CardBase } from "./CardBase";
import { categoryMap } from "../../../utils/constants";

export class CardPreview extends CardBase<IProduct> {
  private cardCategory: HTMLElement;
  private cardImage: HTMLImageElement;
  private cardText: HTMLElement;
  private button: HTMLButtonElement;

  get element(): HTMLElement {
    return this.container;
  }

  constructor(container: HTMLElement, private onClick?: () => void) {
    super(container);
    
    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardText = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);
    
    if (this.onClick) {
      this.button.addEventListener('click', () => this.onClick!());
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

  set description(value: string) {
    this.cardText.textContent = value;
  }

  set buttonText(value: string) {
    this.button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.button.disabled = value;
  }

  render(data?: Partial<IProduct>): HTMLElement {
    super.render(data);
    if (data) {
      if (data.category !== undefined) this.category = data.category;
      if (data.image !== undefined) this.image = data.image;
      if (data.description !== undefined) this.description = data.description;
    }
    return this.container;
  }
}