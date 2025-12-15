import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { BaseForm } from "./FormBase";
import { TFormErrors } from "../../../types";

// Форма контактов покупателя
export class ContactsForm extends BaseForm {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  protected formErrorsFields: (keyof TFormErrors)[] = ["email", "phone"];

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>(
      '[name="email"]',
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      '[name="phone"]',
      this.container
    );

    this.container.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this.events.emit("order:submit");
    });

    this.emailInput.addEventListener("input", () => {
      this.events.emit("contacts:update", { email: this.emailInput.value });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:update", { phone: this.phoneInput.value });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  setEmail(value: string): void {
    this.email = value;
  }

  setPhone(value: string): void {
    this.phone = value;
  }
}