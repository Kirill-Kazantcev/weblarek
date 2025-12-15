import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { CardBase } from "./CardBase";
import { categoryMap } from "../../../utils/constants";
import { IEvents } from "../../base/Events";

// Карточка товара в каталоге
export class CardCatalog extends CardBase<IProduct> {
  private cardCategory: HTMLElement;
  private cardImage: HTMLImageElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    
    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    
    this.container.addEventListener('click', () => {
      const productData: Partial<IProduct> = {
        id: this.container.dataset.id,
        title: this.cardTitle.textContent || '',
        price: this.parsePrice(this.cardPrice.textContent),
        category: this.cardCategory.textContent || '',
        image: this.cardImage.src
      };
      this.events.emit('card:select', productData);
    });
  }

  private parsePrice(text: string | null): number | null {
    if (!text || text === 'Бесценно') return null;
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    this.cardCategory.className = 'card__category';
    if (value in categoryMap) {
      this.cardCategory.classList.add(categoryMap[value as keyof typeof categoryMap]);
    }
  }

  set image(value: string) {
    this.cardImage.src = value;
    this.cardImage.alt = this.cardTitle.textContent || '';
  }

  render(data?: Partial<IProduct>): HTMLElement {
    super.render(data);
    if (data) {
      if (data.id) this.container.dataset.id = data.id;
      if (data.category !== undefined) this.category = data.category;
      if (data.image !== undefined) this.image = data.image;
    }
    return this.container;
  }
}