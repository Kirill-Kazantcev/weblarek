import './scss/styles.scss';
import { Products } from './components/models/Products';
import { ShoppingCart } from './components/models/Shopping_cart';
import { Buyer } from './components/models/Buyer';
import { WebLarekApi } from './components/api/Web-Larek_Api';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { IApiProducts, IProduct } from './types';
import { apiProducts } from './utils/data';

// Создание экземпляров всех созданных классов
const productsModel = new Products();
const shoppingCartModel = new ShoppingCart();
const buyerModel = new Buyer();
const api = new WebLarekApi(new Api(API_URL));

// Тестирование методов моделей данных

// 1. Тестирование Products
console.log('=== Тестирование класса Products ===');
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());

// 2. Тестирование ShoppingCart
console.log('\n=== Тестирование класса ShoppingCart ===');
const testProduct1: IProduct = {
  id: '1',
  title: 'Тестовый товар 1',
  price: 1000,
  category: 'софт-скил',
  description: 'Описание товара 1',
  image: 'test1.jpg'
};

const testProduct2: IProduct = {
  id: '2',
  title: 'Тестовый товар 2',
  price: 2000,
  category: 'хард-скил',
  description: 'Описание товара 2',
  image: 'test2.jpg'
};

shoppingCartModel.addToCart(testProduct1);
shoppingCartModel.addToCart(testProduct2);
console.log('Товары в корзине:', shoppingCartModel.getCartItems());
console.log('Общая стоимость корзины:', shoppingCartModel.getCartTotalPrice());
console.log('Количество товаров в корзине:', shoppingCartModel.getCartTotalQuantity());

shoppingCartModel.removeItemFromCart(testProduct1);
console.log('После удаления товара 1:', shoppingCartModel.getCartItems());

// 3. Тестирование Buyer
console.log('\n=== Тестирование класса Buyer ===');
buyerModel.update({
  payment: 'card',
  email: 'test@example.com',
  phone: '+79991234567',
  address: 'ул. Тестовая, д. 1'
});

console.log('Данные покупателя после обновления:');
console.log('Способ оплаты:', buyerModel.getPayment());
console.log('Email:', buyerModel.getEmail());
console.log('Телефон:', buyerModel.getPhone());
console.log('Адрес:', buyerModel.getAddress());

console.log('Валидация данных:', buyerModel.validate());

// Запрос к серверу за массивом товаров в каталоге
console.log('\n=== Запрос к серверу ===');
try {
  const response: IApiProducts = await api.getProducts();
  console.log('Данные полученные с сервера:', response);
  
  // Сохранение массива в модели данных
  productsModel.setItems(response.items);
  console.log('Товары сохранены в модели, проверка:', productsModel.getItems());
} catch (error) {
  console.error('Ошибка при загрузке товаров:', error);
}