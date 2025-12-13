import "./scss/styles.scss";
import { Products } from "./components/models/Products";
import { ShoppingCart } from "./components/models/ShoppingСart";
import { Buyer } from "./components/models/Buyer";
import { WebLarekApi } from "./components/api/WebLarekApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { IApiProducts, IProduct } from "./types";
import { apiProducts } from "./utils/data";

// Создание экземпляров всех созданных классов
const productsModel = new Products();
const shoppingCartModel = new ShoppingCart();
const buyerModel = new Buyer();
const api = new WebLarekApi(new Api(API_URL));

// Тестирование методов моделей данных

// 1. Тестирование Products
console.log("=== Тестирование класса Products ===");
productsModel.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", productsModel.getItems());

// 2. Тестирование ShoppingCart
console.log("\n=== Тестирование класса ShoppingCart ===");
const testProduct1: IProduct = {
  id: "1",
  title: "Тестовый товар 1",
  price: 1000,
  category: "софт-скил",
  description: "Описание товара 1",
  image: "test1.jpg",
};

const testProduct2: IProduct = {
  id: "2",
  title: "Тестовый товар 2",
  price: 2000,
  category: "хард-скил",
  description: "Описание товара 2",
  image: "test2.jpg",
};

shoppingCartModel.addToCart(testProduct1);
shoppingCartModel.addToCart(testProduct2);
console.log("Товары в корзине:", shoppingCartModel.getCartItems());
console.log("Общая стоимость корзины:", shoppingCartModel.getCartTotalPrice());
console.log(
  "Количество товаров в корзине:",
  shoppingCartModel.getCartTotalQuantity()
);

shoppingCartModel.removeItemFromCart(testProduct1);
console.log("После удаления товара 1:", shoppingCartModel.getCartItems());

// 3. Тестирование Buyer
console.log("\n=== Тестирование класса Buyer ===");

// Тест 3.1: Полностью пустые данные
console.log("\n--- Тест 1: Изначально пустые данные ---");
buyerModel.clear();
console.log("Данные покупателя:", buyerModel.getData());
console.log("Валидация пустых данных:", buyerModel.validate());

// Тест 3.2: Частичное заполнение (только email)
console.log("\n--- Тест 2: Только email ---");
buyerModel.update({ email: "test@example.com" });
console.log("Данные покупателя:", buyerModel.getData());
console.log("Валидация частичных данных:", buyerModel.validate());

// Тест 3.3: Частичное заполнение (email и телефон)
console.log("\n--- Тест 3: Email и телефон ---");
buyerModel.update({ phone: "+79991234567" });
console.log("Данные покупателя:", buyerModel.getData());
console.log("Валидация частичных данных:", buyerModel.validate());

// Тест 3.4: Частичное заполнение (email, телефон и адрес)
console.log("\n--- Тест 4: Email, телефон и адрес ---");
buyerModel.update({ address: "ул. Тестовая, д. 1" });
console.log("Данные покупателя:", buyerModel.getData());
console.log("Валидация частичных данных:", buyerModel.validate());

// Тест 3.5: Полное заполнение
console.log("\n--- Тест 5: Полное заполнение ---");
buyerModel.update({ payment: "card" });
console.log("Данные покупателя:", buyerModel.getData());
console.log("Валидация полных данных:", buyerModel.validate());

// Тест 3.6: Обновление отдельных полей без удаления остальных
console.log("\n--- Тест 6: Обновление отдельных полей ---");
buyerModel.update({ payment: "cash" }); // Меняем только способ оплаты
console.log("Данные покупателя после обновления:", buyerModel.getData());

// Проверка, что остальные поля сохранились
console.log("Email:", buyerModel.getEmail());
console.log("Телефон:", buyerModel.getPhone());
console.log("Адрес:", buyerModel.getAddress());

// Тест 3.7: Пустые строки (только пробелы)
console.log("\n--- Тест 7: Пустые строки с пробелами ---");
buyerModel.clear();
buyerModel.update({
  payment: "card",
  email: "   ",
  phone: "   ",
  address: "   ",
});
console.log("Данные покупателя:", buyerModel.getData());
console.log("Валидация строк с пробелами:", buyerModel.validate());

// Тест 3.8: Частично валидные данные (правильная оплата, но пустые поля)
console.log("\n--- Тест 8: Только способ оплаты ---");
buyerModel.clear();
buyerModel.update({ payment: "card" });
console.log("Данные покупателя:", buyerModel.getData());
console.log("Валидация только с оплатой:", buyerModel.validate());

// Запрос к серверу за массивом товаров в каталоге
console.log("\n=== Запрос к серверу ===");
try {
  const response: IApiProducts = await api.getProducts();
  console.log("Данные полученные с сервера:", response);

  // Сохранение массива в модели данных
  productsModel.setItems(response.items);
  console.log("Товары сохранены в модели, проверка:", productsModel.getItems());
} catch (error) {
  console.error("Ошибка при загрузке товаров:", error);
}
