//Класс модели данных для хранения данных покупателя
import { IBuyer, TFormErrors, TPayment } from "../../types";

export class Buyer {
  private payment?: TPayment;
  private email?: string;
  private phone?: string;
  private address?: string;

  // Сохранение данных с частичным обновлением
  update(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
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

  // Валидация данных
  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.payment) errors.payment = 'Необходимо выбрать способ оплаты';
    if (!this.email?.trim()) errors.email = 'Необходимо указать email';
    if (!this.phone?.trim()) errors.phone = 'Необходимо указать телефон';
    if (!this.address?.trim()) errors.address = 'Необходимо указать адрес';

    return errors;
  }

  // Очистка данных
  clear(): void {
    this.payment = undefined;
    this.email = undefined;
    this.phone = undefined;
    this.address = undefined;
  }

  // Геттеры для отдельных полей 
  getPayment(): TPayment | undefined { return this.payment; }
  getAddress(): string | undefined { return this.address; }
  getEmail(): string | undefined { return this.email; }
  getPhone(): string | undefined { return this.phone; }
}