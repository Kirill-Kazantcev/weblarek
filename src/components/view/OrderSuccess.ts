import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

// Сообщение об успешном оформлении заказа
export class Success extends Component<{ total: number }> {
  private orderSuccessDescription: HTMLElement;
  private orderSuccessClose: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    
    this.orderSuccessDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.orderSuccessClose = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.orderSuccessClose.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set orderSuccessMessage(value: number) {
    const formattedValue = new Intl.NumberFormat('ru-RU').format(value);
    this.orderSuccessDescription.textContent = `Списано ${formattedValue} синапсов`;
  }

  render(data?: { total: number }): HTMLElement {
    if (data?.total !== undefined) {
      this.orderSuccessMessage = data.total;
    }
    return this.container;
  }
}