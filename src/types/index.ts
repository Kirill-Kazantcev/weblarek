export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'cash' | 'card' | '';

export type TFormErrors = Partial<Record<keyof IBuyer, string>>;

// тип для объекта, отправляемого на сервер при оформлении заказа
export type TOrder = {
  payment: 'cash' | 'card';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export type TOrderResponse = {
  id: string;
  total: number;
}

// Интерфейсы данных
export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс для товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс для данных покупателя
export interface IBuyer {
  payment?: TPayment;
  email?: string;
  phone?: string;
  address?: string;
}

// Интерфейс ответа API
export interface IApiProducts {
  total: number;
  items: IProduct[];
}