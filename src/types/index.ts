export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'cash' | 'card' | '';

export type THeaderBasketCounter = {
  counter: number;
}

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

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment?: TPayment;
  email?: string;
  phone?: string;
  address?: string;
}

export interface IApiProducts {
  total: number;
  items: IProduct[];
}

export interface IFormErrors {
  payment?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface ISuccessData {
  total: number;
}


// Интерфейс для API
export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс клика по кнопке
export interface ICardAction {
  onClick: () => void;
}