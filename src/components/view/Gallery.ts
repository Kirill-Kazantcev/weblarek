import { Component } from "../base/Component";

// Галерея для отображения карточек товаров
export class Gallery extends Component<{ cards: HTMLElement[] }> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set renderedCards(cards: HTMLElement[]) {
    this.clearContainer();
    
    if (cards.length > 0) {
      this.container.append(...cards);
    }
  }

  render(data?: { cards: HTMLElement[] }): HTMLElement {
    if (data?.cards) {
      this.renderedCards = data.cards;
    }
    return this.container;
  }

  private clearContainer(): void {
    this.container.innerHTML = '';
  }
}