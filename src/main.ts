import "./scss/styles.scss";

// ========== 1. ИМПОРТЫ ==========

// 1.1. Модели
import { Products } from "./components/models//Products.ts";
import { ShoppingCart } from "./components/models/ShoppingCart.ts";
import { Buyer } from "./components/models//Buyer.ts";

// 1.2. Типы
import { IApiProducts, IProduct, TFormErrors, TPayment } from "./types";

// 1.3. API
import { WebLarekApi } from "./components/api/WebLarekApi.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";

// 1.4. Утилиты
import { CardCatalog } from "./components/view/cards/CardCatalog.ts";
import { cloneTemplate } from "./utils/utils.ts";
import { EventEmitter } from "./components/base/Events.ts";

// 1.5. Компоненты представления
import { Modal } from "./components/view/Modal.ts";
import { CardPreview } from "./components/view/cards/CardPreview.ts";
import { Header } from "./components/view/Header.ts";
import { Gallery } from "./components/view/Gallery.ts";
import { CardBasket } from "./components/view/cards/CardBasket.ts";
import { Basket } from "./components/view/Basket.ts";
import { OrderForm } from "./components/view/forms/FormOrder.ts";
import { ContactsForm } from "./components/view/forms/FormContacts.ts";
import { Success } from "./components/view/OrderSuccess.ts";

// ===== 2. HTML ЭЛЕМЕНТЫ =====
const headerContainer = document.querySelector(".header") as HTMLElement;
const galleryContainer = document.querySelector(".gallery") as HTMLElement;
const modalContainer = document.querySelector(".modal") as HTMLElement;

// ===== 3. ШАБЛОНЫ =====
const cardGalleryTemplate = document.getElementById(
  "card-catalog"
) as HTMLTemplateElement;
const cardPreviewTemplate = document.getElementById(
  "card-preview"
) as HTMLTemplateElement;
const basketTemplate = document.getElementById("basket") as HTMLTemplateElement;
const cardBasketTemplate = document.getElementById(
  "card-basket"
) as HTMLTemplateElement;
const orderTemplate = document.getElementById("order") as HTMLTemplateElement;
const contactsTemplate = document.getElementById(
  "contacts"
) as HTMLTemplateElement;
const successTemplate = document.getElementById(
  "success"
) as HTMLTemplateElement;

// ===== 4. ИНИЦИАЛИЗАЦИЯ МОДЕЛЕЙ =====
const api = new WebLarekApi(new Api(API_URL));
const events = new EventEmitter();
const productsModel = new Products(events);
const shoppingCartModel = new ShoppingCart(events);
const buyerModel = new Buyer(events);

// ===== 5. ИНИЦИАЛИЗАЦИЯ ПРЕДСТАВЛЕНИЙ =====
const headerView = new Header(headerContainer, events);
const galleryView = new Gallery(galleryContainer);
const cardPreviewView = new CardPreview(
  cloneTemplate(cardPreviewTemplate),
  events
);
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const modalView = new Modal(modalContainer);
const orderFormView = new OrderForm(cloneTemplate(orderTemplate), events);
const contactFormView = new ContactsForm(
  cloneTemplate(contactsTemplate),
  events
);
const successView = new Success(cloneTemplate(successTemplate), events);

// ===== 6. ПОДПИСКИ НА СОБЫТИЯ =====

// 6.1. КОРЗИНА
events.on("shoppingCart:open", () => {
  basketView.renderedCards = shoppingCartModel
    .getItems()
    .map((cartItem, index) => {
      const cardBasketEl = new CardBasket(
        cloneTemplate(cardBasketTemplate),
        () => {
          shoppingCartModel.removeItem(cartItem);
        }
      );
      
      cardBasketEl.index = index + 1;
      return cardBasketEl.render({
        ...cartItem,
        index: index + 1
      });
    });
  
  basketView.totalPrice = shoppingCartModel.getTotal();
  basketView.buttonOrder = shoppingCartModel.getCount() > 0;
  
  modalView.open(basketView.render());
});

events.on("cart:changed", () => {
  headerView.counter = shoppingCartModel.getCount();
  headerView.render();

  basketView.renderedCards = shoppingCartModel
    .getItems()
    .map((cartItem, index) => {
      const card = new CardBasket(
        cloneTemplate(cardBasketTemplate),
        () => {
          shoppingCartModel.removeItem(cartItem);
        }
      );
      
      card.index = index + 1;
      return card.render({
        ...cartItem,
        index: index + 1
      });
    });
  
  basketView.totalPrice = shoppingCartModel.getTotal();
  basketView.buttonOrder = shoppingCartModel.getCount() > 0;
});

// 6.2. ТОВАРЫ
events.on("products:loaded", () => {
  galleryView.renderedCards = productsModel.getItems().map((product) => {
    const card = new CardCatalog(cloneTemplate(cardGalleryTemplate), events);
    return card.render(product);
  });
});

events.on("card:select", (product: IProduct) => {
  if (product && product.id) {
    productsModel.setSelectedItem(product.id);
  }
});

events.on("product:selected", (product: IProduct) => {
  if (!product) return;
  
  const isInCart = shoppingCartModel.contains(product.id);

  if (product.price === null) {
    cardPreviewView.buttonText = "Недоступно";
    cardPreviewView.buttonDisabled = true;
  } else if (isInCart) {
    cardPreviewView.buttonText = "Удалить из корзины";
    cardPreviewView.buttonDisabled = false;
  } else {
    cardPreviewView.buttonText = "Купить";
    cardPreviewView.buttonDisabled = false;
  }

  modalView.open(cardPreviewView.render(product));
});

events.on("card:button-click", () => {
  const product = productsModel.getSelectedItem();
  if (!product) return;

  const inCart = shoppingCartModel.contains(product.id);

  if (inCart) {
    shoppingCartModel.removeItem(product);
  } else {
    shoppingCartModel.addItem(product);
  }

  cardPreviewView.buttonText = inCart ? "Купить" : "Удалить из корзины";
});

// 6.3. ФОРМЫ ЗАКАЗА
events.on("order:set", () => {
  modalView.open(orderFormView.render());

  const address = buyerModel.getAddress();
  if (address) orderFormView.setAddress(address);

  const payment = buyerModel.getPayment();
  if (payment) orderFormView.setPaymentButtonActive(payment);

  const errors: TFormErrors = buyerModel.validate();
  const isValid = orderFormView.showErrors(errors);
  orderFormView.submitButtonEnable(isValid);
});

events.on("contacts:set", () => {
  modalView.open(contactFormView.render());

  const email = buyerModel.getEmail();
  if (email) contactFormView.setEmail(email);

  const phone = buyerModel.getPhone();
  if (phone) contactFormView.setPhone(phone);

  const errors: TFormErrors = buyerModel.validate();
  const isValid = contactFormView.showErrors(errors);
  contactFormView.submitButtonEnable(isValid);
});

// 6.4. ОБНОВЛЕНИЕ ДАННЫХ ПОКУПАТЕЛЯ
events.on("order:update", (data: { address?: string; payment?: TPayment }) => {
    buyerModel.update(data);
});

events.on("contacts:update", (data: { phone?: string; email?: string }) => {
    buyerModel.update(data);
});

events.on("buyer:changed", () => {
  const orderErrors = buyerModel.validate();
  const orderIsValid = orderFormView.showErrors(orderErrors);
  orderFormView.submitButtonEnable(orderIsValid);

  const contactErrors = buyerModel.validate();
  const contactIsValid = contactFormView.showErrors(contactErrors);
  contactFormView.submitButtonEnable(contactIsValid);
});

// 6.5. ОТПРАВКА ЗАКАЗА
events.on("order:submit", async () => {
  try {
    const orderData = {
      payment: buyerModel.getPayment() as "cash" | "card",
      email: buyerModel.getEmail()!,
      phone: buyerModel.getPhone()!,
      address: buyerModel.getAddress()!,
      total: shoppingCartModel.getTotal(),
      items: shoppingCartModel.getItems().map((item: IProduct) => item.id),
    };

    const response = await api.postOrder(orderData);
    successView.orderSuccessMessage = response.total;
    shoppingCartModel.clear();
    modalView.open(successView.render());
  } catch (error) {
    console.error("Ошибка при отправке заказа:", error);
  }
});

// 6.6. ЗАКРЫТИЕ ОКНА УСПЕХА
events.on("success:close", () => {
  modalView.close();
});

// ===== 7. ПОЛУЧЕНИЕ ДАННЫХ ЧЕРЕЗ API =====
try {
  const response: IApiProducts = await api.getProducts();
  productsModel.setItems(response.items);
} catch (error) {
  console.error("Ошибка при загрузке товаров:", error);
}