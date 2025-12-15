import { IBuyer, TFormErrors, TPayment } from "../../types";
import { EventEmitter } from "../base/Events";

// Модель покупателя для хранения данных заказа
export class Buyer {
  protected payment?: TPayment = '';
  protected email?: string = '';
  protected phone?: string = '';
  protected address?: string = '';

  constructor(private events: EventEmitter) {}

  // Обновление данных покупателя
  update(data: Partial<IBuyer>): void {
    Object.assign(this, data);
    this.events.emit('buyer:changed', this.getData());
  }

  // Получение всех данных покупателя
  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  // Валидация данных покупателя
  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    if (!this.address?.trim()) {
      errors.address = 'Необходимо указать адрес доставки';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email?.trim()) {
      errors.email = 'Необходимо указать email';
    } else if (!emailRegex.test(this.email)) {
      errors.email = 'Введите корректный email (например: user@example.com)';
    }

    if (!this.phone?.trim()) {
      errors.phone = 'Необходимо указать телефон';
    } else if (this.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Телефон слишком короткий (минимум 10 цифр)';
    }

    return errors;
  }

  // Очистка данных покупателя
  clear(): void {
    this.payment = undefined;
    this.email = undefined;
    this.phone = undefined;
    this.address = undefined;
    this.events.emit('buyer:changed', this.getData());
  }

  getPayment(): TPayment | undefined { return this.payment; }
  getAddress(): string | undefined { return this.address; }
  getEmail(): string | undefined { return this.email; }
  getPhone(): string | undefined { return this.phone; }
}