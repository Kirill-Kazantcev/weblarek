import { Component } from "../../base/Component";
import { IFormErrors } from "../../../types";

export abstract class FormBase extends Component<null> {
  protected formErrors: HTMLElement;
  protected submitButton: HTMLButtonElement;

  protected abstract formErrorsFields: (keyof IFormErrors)[];

  protected constructor(container: HTMLElement) {
    super(container);

    this.formErrors = this.container.querySelector('.form__errors')!;
    this.submitButton = this.container.querySelector('button[type="submit"]')!;
  }

  showErrors(errors: Partial<IFormErrors>): void {
    const errorMessages = Object.values(errors).filter(Boolean);
    this.formErrors.textContent = errorMessages.length > 0 
      ? errorMessages[0] || '' 
      : '';
  }

  submitButtonEnable(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }
}