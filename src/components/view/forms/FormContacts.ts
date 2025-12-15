import { ensureElement } from "../../../utils/utils";
import { FormBase } from "./FormBase";
import { IFormErrors } from "../../../types";

export class FormContacts extends FormBase {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private _onSubmit?: () => void;
  private _onInputChange?: (field: string, value: string) => void;

  protected formErrorsFields: (keyof IFormErrors)[] = ['email', 'phone'];

  // Добавьте публичный геттер
  get element(): HTMLElement {
    return this.container;
  }

  constructor(
    container: HTMLElement,
    onSubmit?: () => void,
    onInputChange?: (field: string, value: string) => void
  ) {
    super(container);
    
    this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container);
    this._onSubmit = onSubmit;
    this._onInputChange = onInputChange;

    this.emailInput.addEventListener('input', () => {
      if (this._onInputChange) {
        this._onInputChange('email', this.emailInput.value);
      }
    });

    this.phoneInput.addEventListener('input', () => {
      if (this._onInputChange) {
        this._onInputChange('phone', this.phoneInput.value);
      }
    });

    this.container.addEventListener('submit', (evt) => {
      evt.preventDefault();
      if (this._onSubmit) {
        this._onSubmit();
      }
    });
  }

  setEmail(value: string): void {
    this.emailInput.value = value;
  }

  setPhone(value: string): void {
    this.phoneInput.value = value;
  }
}