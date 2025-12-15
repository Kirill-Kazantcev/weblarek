import { Component } from "../../base/Component";
import { TFormErrors } from "../../../types";

// Базовый класс для форм
export abstract class BaseForm extends Component<null> {
  protected formErrors: HTMLElement;
  protected submitButton: HTMLButtonElement;

  protected abstract formErrorsFields: (keyof TFormErrors)[];

  get element(): HTMLElement {
    return this.container;
  }

  protected constructor(container: HTMLElement) {
    super(container);

    this.formErrors = this.container.querySelector('.form__errors')!;
    this.submitButton = this.container.querySelector('button[type="submit"]')!;
  }

  showErrors(errors: Partial<TFormErrors>): boolean {
    const errorMessages = this.formErrorsFields
      .map(f => errors[f])
      .filter(Boolean);
    this.formErrors.textContent = errorMessages.length > 0
      ? errorMessages[0] || ''
      : '';
    return errorMessages.length === 0;
  }

  submitButtonEnable(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }
}