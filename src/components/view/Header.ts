import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

// Шапка приложения с корзиной
export class Header extends Component<{ counter: number }> {
  private headerBasket: HTMLButtonElement;
  private headerBasketCounter: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.headerBasket = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );
    this.headerBasketCounter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );

    this.headerBasket.setAttribute("aria-label", "Открыть корзину");
    this.headerBasketCounter.setAttribute("aria-live", "polite");

    this.headerBasket.addEventListener("click", () => {
      this.events.emit("shoppingCart:open");
    });
  }

  set counter(value: number) {
    const normalizedValue = Math.max(0, Math.round(value));
    this.headerBasketCounter.textContent = String(normalizedValue);

    if (normalizedValue > 9) {
      this.headerBasketCounter.dataset.large = "true";
    } else {
      this.headerBasketCounter.removeAttribute("data-large");
    }

    const ariaLabel =
      normalizedValue === 0
        ? "Корзина пуста"
        : `Товаров в корзине: ${normalizedValue}`;

    this.headerBasketCounter.setAttribute("aria-label", ariaLabel);
  }

  render(data?: { counter: number }): HTMLElement {
    if (data?.counter !== undefined) {
      this.counter = data.counter;
    }
    return this.container;
  }
}
