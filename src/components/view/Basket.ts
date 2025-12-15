import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Basket extends Component<null> {
  private basketList: HTMLElement;
  private basketButton: HTMLButtonElement;
  private basketPrice: HTMLElement;

  get element(): HTMLElement {
    return this.container;
  }

  constructor(container: HTMLElement, private onClick?: () => void) {
    super(container);

    this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);

    
    if (this.onClick) {
      this.basketButton.addEventListener('click', () => this.onClick!());
    }
  }

  set totalPrice(value: number) {
    this.basketPrice.textContent = `${value} синапсов`;
  }

  set buttonOrder(enabled: boolean) {
    this.basketButton.disabled = !enabled;
  }

  set renderedCards(cards: HTMLElement[]) {
    this.basketList.innerHTML = '';
    if (cards.length > 0) {
      this.basketList.append(...cards);
    }
  }

  render(): HTMLElement {
    return this.container;
  }
}