import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { TFormErrors, TPayment } from "../../../types";
import { BaseForm } from "./FormBase";

// Форма заказа с выбором способа оплаты и адресом
export class OrderForm extends BaseForm {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;

  protected formErrorsFields: (keyof TFormErrors)[] = ["payment", "address"];

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".button_alt",
      this.container
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      ".form__input",
      this.container
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.classList.contains('button_alt-active')) {
          button.classList.remove('button_alt-active');
          this.events.emit("order:update", { payment: '' as TPayment });
        } else {
          this.paymentButtons.forEach((paymentButton) =>
            paymentButton.classList.remove("button_alt-active")
          );
          button.classList.add("button_alt-active");
          this.events.emit("order:update", { payment: button.name as TPayment });
        }
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order:update", { address: this.addressInput.value });
    });

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit("contacts:set");
    });
  }

  setPaymentButtonActive(payment: TPayment) {
    this.paymentButtons.forEach((button) =>
      button.classList.remove("button_alt-active")
    );
    const activeButton = this.paymentButtons.find((button) => button.name === payment);
    if (activeButton) activeButton.classList.add("button_alt-active");
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  setAddress(value: string) {
    this.address = value;
  }
}