import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { FormBase } from "./FormBase";
import { IFormErrors, TPayment } from "../../../types";

export class FormOrder extends FormBase {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;
  private _onSubmit?: () => void;
  private _onInputChange?: (field: string, value: string) => void;

  protected formErrorsFields: (keyof IFormErrors)[] = ['payment', 'address'];

  get element(): HTMLElement {
    return this.container;
  }

  constructor(
    container: HTMLElement, 
    onSubmit?: () => void,
    onInputChange?: (field: string, value: string) => void
  ) {
    super(container);
    
    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);
    this._onSubmit = onSubmit;
    this._onInputChange = onInputChange;
    
    this.paymentButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this._onInputChange) {
          this._onInputChange('payment', btn.name as TPayment);
        }
      });
    });

    this.addressInput.addEventListener('input', () => {
      if (this._onInputChange) {
        this._onInputChange('address', this.addressInput.value);
      }
    });

    this.container.addEventListener('submit', (evt) => {
      evt.preventDefault();
      if (this._onSubmit) {
        this._onSubmit();
      }
    });
  }

  setPaymentButtonActive(payment: TPayment): void {
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.name === payment);
    });
  }

  setAddress(value: string): void {
    this.addressInput.value = value;
  }
}