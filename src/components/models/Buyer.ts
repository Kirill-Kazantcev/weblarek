import { EventEmitter } from "../base/Events";
import { IBuyer, IFormErrors, TPayment } from "../../types";

export class Buyer {
  private payment?: TPayment;
  private email?: string;
  private phone?: string;
  private address?: string;

  constructor(private events: EventEmitter) {}

  update(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    
    this.events.emit('buyer:changed', this.getData());
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  validate(): IFormErrors {
    const errors: IFormErrors = {};

    // Валидация способа оплаты
    if (!this.payment || this.payment.trim() === '') {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    // Валидация адреса
    if (!this.address || this.address.trim() === '') {
      errors.address = 'Необходимо указать адрес доставки';
    } else if (this.address.trim().length < 10) {
      errors.address = 'Адрес слишком короткий (минимум 10 символов)';
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || this.email.trim() === '') {
      errors.email = 'Необходимо указать email';
    } else if (!emailRegex.test(this.email)) {
      errors.email = 'Введите корректный email (например: user@example.com)';
    }

    // Валидация телефона
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    if (!this.phone || this.phone.trim() === '') {
      errors.phone = 'Необходимо указать телефон';
    } else if (!phoneRegex.test(this.phone.replace(/\s/g, ''))) {
      errors.phone = 'Введите корректный телефон (например: +7 999 123-45-67)';
    } else if (this.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Телефон слишком короткий (минимум 10 цифр)';
    }

    return errors;
  }

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