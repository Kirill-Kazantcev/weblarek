import "./scss/styles.scss";

import { Products } from "./components/models/Products";
import { ShoppingCart } from "./components/models/ShoppingCart";
import { Buyer } from "./components/models/Buyer";
import { WebLarekApi } from "./components/api/WebLarёkApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { IApiProducts, IBuyer, TOrder, IFormErrors, TPayment } from "./types";
import { EventEmitter } from "./components/base/Events";
import { Modal } from "./components/view/Modal";
import { Gallery } from "./components/view/Gallery";
import { Header } from "./components/view/Header";
import { Basket } from "./components/view/Basket";
import { CardCatalog } from "./components/view/cards/CardCatalog";
import { CardPreview } from "./components/view/cards/CardPreview";
import { CardBasket } from "./components/view/cards/CardBasket";
import { FormOrder } from "./components/view/forms/FormOrder";
import { FormContacts } from "./components/view/forms/FormContacts";
import { OrderSuccess } from "./components/view/OrderSuccess";
import { ensureElement, cloneTemplate } from "./utils/utils";

// Инициализация событийного брокера
const events = new EventEmitter();

// Инициализация моделей данных
const productsModel = new Products(events);
const shoppingCartModel = new ShoppingCart(events);
const buyerModel = new Buyer(events);

// Инициализация API
const api = new WebLarekApi(new Api(API_URL));

// Поиск контейнеров в DOM
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const headerContainer = ensureElement<HTMLElement>('.header');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// Поиск шаблонов
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация компонентов представления
const modal = new Modal(modalContainer);
const gallery = new Gallery(galleryContainer);
const header = new Header(headerContainer, () => events.emit('shoppingCart:open'));
const basket = new Basket(cloneTemplate(basketTemplate), () => events.emit('order:open'));

const orderForm = new FormOrder(
  cloneTemplate(orderTemplate),
  () => events.emit('order:submit'),
  (field, value) => events.emit('order:input', { field, value })
);

const contactsForm = new FormContacts(
  cloneTemplate(contactsTemplate),
  () => events.emit('contacts:submit'),
  (field, value) => events.emit('contacts:input', { field, value })
);

const orderSuccess = new OrderSuccess(
  cloneTemplate(successTemplate),
  () => events.emit('success:close')
);

// ============================================================
// Вспомогательные функции для работы с изображениями
// ============================================================

/**
 * Исправляет путь к изображению, полученный с сервера
 * Файлы находятся в папке images/card
 * @param imageUrl Путь к изображению с сервера (например: "/5_Dots.svg")
 * @returns Исправленный путь для использования в приложении
 */
function fixImagePath(imageUrl: string): string {
  console.log('Исходный путь изображения с сервера:', imageUrl);
  
  // Если путь уже полный URL, оставляем как есть
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Получаем имя файла (например: "5_Dots.svg")
  const fileName = imageUrl.split('/').pop() || imageUrl;
  
  // Возвращаем путь к папке images/card
  return `/images/card/${fileName}`;
}

/**
 * Добавляет обработчик ошибок загрузки изображения
 * @param imgElement HTMLImageElement для обработки ошибок
 */
function addImageErrorHandler(imgElement: HTMLImageElement): void {
  imgElement.addEventListener('error', (e) => {
    const target = e.target as HTMLImageElement;
    console.warn(`Не удалось загрузить изображение: ${target.src}`);
    
    // Пробуем альтернативные пути
    const originalSrc = target.src;
    const fileName = originalSrc.split('/').pop();
    
    if (fileName) {
      // Пробуем загрузить с других возможных путей
      const alternativePaths = [
        `/src/images/card/${fileName}`,
        `/images/${fileName}`,
        `/card/${fileName}`,
        `/public/images/card/${fileName}`
      ];
      
      // Пробуем первый доступный путь
      const testImage = new Image();
      testImage.onload = () => {
        target.src = testImage.src;
        console.log(`Загружено с альтернативного пути: ${testImage.src}`);
      };
      
      testImage.onerror = () => {
        // Если ни один путь не работает, используем заглушку
        target.src = '/images/card/placeholder.svg';
        target.alt = 'Изображение недоступно';
      };
      
      // Начинаем тестировать альтернативные пути
      testImage.src = alternativePaths[0];
    } else {
      // Используем заглушку
      target.src = '/images/card/placeholder.svg';
      target.alt = 'Изображение недоступно';
    }
  });
}

// ============================================================
// Загрузка товаров с сервера и обработка изображений
// ============================================================

// Загрузка товаров с сервера
api.getProducts()
  .then((response: IApiProducts) => {
    console.log('Получены товары с сервера:', response);
    
    // Исправляем пути к изображениям
    const itemsWithFixedImages = response.items.map(item => {
      // Проверяем, что image существует
      if (!item.image) {
        console.warn(`У товара ${item.id} нет изображения`);
        return {
          ...item,
          image: '/images/card/placeholder.svg'
        };
      }
      
      const fixedImagePath = fixImagePath(item.image);
      console.log(`Исправлен путь для ${item.id}: ${item.image} → ${fixedImagePath}`);
      
      return {
        ...item,
        image: fixedImagePath
      };
    });
    
    productsModel.setItems(itemsWithFixedImages);
  })
  .catch((error: Error) => {
    console.error("Ошибка при загрузке товаров:", error);
  });

// ============================================================
// Обработчики событий для работы приложения
// ============================================================

// 1. Обработчик: Изменение каталога товаров
events.on('products:changed', () => {
  const products = productsModel.getItems();
  const cards = products.map((product) => {
    const card = new CardCatalog(cloneTemplate(cardTemplate), () => {
      events.emit('card:select', { id: product.id });
    });
    
    // Добавляем обработчик ошибок изображения после рендеринга
    const renderedCard = card.render(product);
    const imgElement = renderedCard.querySelector('.card__image') as HTMLImageElement;
    if (imgElement) {
      addImageErrorHandler(imgElement);
    }
    
    return renderedCard;
  });
  gallery.renderedCards = cards;
});

// 2. Обработчик: Выбор карточки для просмотра
events.on('card:select', (data: { id: string }) => {
  productsModel.setCheckItemById(data.id);
});

// 3. Обработчик: Изменение выбранного товара
events.on('product:selected', () => {
  const product = productsModel.getCheckItem();
  if (product) {
    const inCart = shoppingCartModel.checkItemInCart(product.id);
    
    // Создаем новую карточку предпросмотра для каждого открытия
    const cardPreview = new CardPreview(
      cloneTemplate(cardPreviewTemplate),
      () => events.emit('product:toggle-cart', { id: product.id })
    );
    
    if (product.price === null) {
      cardPreview.buttonText = 'Недоступно';
      cardPreview.buttonDisabled = true;
    } else if (inCart) {
      cardPreview.buttonText = 'Удалить из корзины';
      cardPreview.buttonDisabled = false;
    } else {
      cardPreview.buttonText = 'Купить';
      cardPreview.buttonDisabled = false;
    }
    
    const renderedPreview = cardPreview.render(product);
    
    // Добавляем обработчик ошибок изображения для превью
    const imgElement = renderedPreview.querySelector('.card__image') as HTMLImageElement;
    if (imgElement) {
      addImageErrorHandler(imgElement);
    }
    
    modal.open(renderedPreview);
  }
});

// 4. Обработчик: Добавление/удаление товара из корзины
events.on('product:toggle-cart', (data: { id: string }) => {
  const product = productsModel.getItemById(data.id);
  if (product && product.price !== null) {
    const inCart = shoppingCartModel.checkItemInCart(data.id);
    if (inCart) {
      shoppingCartModel.removeItemFromCart(product);
    } else {
      shoppingCartModel.addToCart(product);
    }
    modal.close();
  }
});

// 5. Обработчик: Изменение содержимого корзины
events.on('cart:changed', () => {
  // Обновляем счетчик в хедере
  header.counter = shoppingCartModel.getCartTotalQuantity();
  
  // Если корзина открыта - обновляем ее содержимое
  if (modal.isOpen() && basket.element === modal.getContent()) {
    updateBasketView();
  }
});

// 6. Обработчик: Открытие корзины
events.on('shoppingCart:open', () => {
  updateBasketView();
  modal.open(basket.render());
});

// 7. Обработчик: Удаление товара из корзины (из представления Basket)
events.on('basket:remove', (data: { id: string }) => {
  const product = productsModel.getItemById(data.id);
  if (product) {
    shoppingCartModel.removeItemFromCart(product);
  }
});

// 8. Обработчик: Открытие формы оформления заказа
events.on('order:open', () => {
  // Сбрасываем форму перед открытием
  orderForm.setAddress('');
  orderForm.setPaymentButtonActive('' as TPayment);
  orderForm.submitButtonEnable(false);
  
  // Предзаполнение полей из модели
  const buyerData = buyerModel.getData();
  if (buyerData.address) orderForm.setAddress(buyerData.address);
  if (buyerData.payment) orderForm.setPaymentButtonActive(buyerData.payment);
  
  validateOrderForm();
  modal.open(orderForm.render());
});

// 9. Обработчик: Ввод данных в форме заказа
events.on('order:input', (data: { field: string; value: string | TPayment }) => {
  buyerModel.update({ [data.field]: data.value });
  validateOrderForm();
});

// 10. Обработчик: Отправка формы заказа
events.on('order:submit', () => {
  if (validateOrderForm()) {
    // Предзаполнение полей из модели
    const buyerData = buyerModel.getData();
    contactsForm.setEmail(buyerData.email || '');
    contactsForm.setPhone(buyerData.phone || '');
    contactsForm.submitButtonEnable(false);
    
    validateContactsForm();
    modal.open(contactsForm.render());
  }
});

// 11. Обработчик: Ввод данных в форме контактов
events.on('contacts:input', (data: { field: string; value: string }) => {
  buyerModel.update({ [data.field]: data.value });
  validateContactsForm();
});

// 12. Обработчик: Отправка формы контактов
events.on('contacts:submit', () => {
  if (validateContactsForm()) {
    submitOrder();
  }
});

// 13. Обработчик: Изменение данных покупателя
events.on('buyer:changed', (_data: IBuyer) => {
  // Параметр _data не используется, но передается событием
  // Обновляем UI если формы открыты
  updateFormsIfOpen();
});

// 14. Обработчик: Закрытие успешного оформления
events.on('success:close', () => {
  modal.close();
});

// ============================================================
// Вспомогательные функции
// ============================================================

// Функция обновления вида корзины
function updateBasketView(): void {
  const cartItems = shoppingCartModel.getCartItems();
  
  if (cartItems.length === 0) {
    basket.renderedCards = [];
    basket.totalPrice = 0;
    basket.buttonOrder = false;
  } else {
    const cards = cartItems.map((item, index) => {
      const card = new CardBasket(cloneTemplate(cardBasketTemplate), () => {
        events.emit('basket:remove', { id: item.id });
      });
      card.index = index + 1;
      return card.render(item);
    });
    
    basket.renderedCards = cards;
    basket.totalPrice = shoppingCartModel.getCartTotalPrice();
    basket.buttonOrder = cartItems.length > 0;
  }
}

// Функция обновления форм если они открыты
function updateFormsIfOpen(): void {
  const buyerData = buyerModel.getData();
  
  // Обновляем форму заказа если она открыта
  if (orderForm.element && orderForm.element.parentElement) {
    if (buyerData.address !== undefined) {
      orderForm.setAddress(buyerData.address);
    }
    if (buyerData.payment !== undefined) {
      orderForm.setPaymentButtonActive(buyerData.payment);
    }
    validateOrderForm();
  }
  
  // Обновляем форму контактов если она открыта
  if (contactsForm.element && contactsForm.element.parentElement) {
    if (buyerData.email !== undefined) {
      contactsForm.setEmail(buyerData.email);
    }
    if (buyerData.phone !== undefined) {
      contactsForm.setPhone(buyerData.phone);
    }
    validateContactsForm();
  }
}

// Валидация формы заказа
function validateOrderForm(): boolean {
  const errors: IFormErrors = {};
  const buyerData = buyerModel.getData();
  
  if (!buyerData.payment || buyerData.payment.trim() === '') {
    errors.payment = 'Необходимо выбрать способ оплаты';
  }
  
  if (!buyerData.address || buyerData.address.trim() === '') {
    errors.address = 'Необходимо указать адрес доставки';
  } else if (buyerData.address.trim().length < 10) {
    errors.address = 'Адрес слишком короткий (минимум 10 символов)';
  }
  
  const isValid = Object.keys(errors).length === 0;
  orderForm.showErrors(errors);
  orderForm.submitButtonEnable(isValid);
  
  return isValid;
}

// Валидация формы контактов
function validateContactsForm(): boolean {
  const errors: IFormErrors = {};
  const buyerData = buyerModel.getData();
  
  // Валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!buyerData.email || buyerData.email.trim() === '') {
    errors.email = 'Необходимо указать email';
  } else if (!emailRegex.test(buyerData.email)) {
    errors.email = 'Введите корректный email (например: user@example.com)';
  }
  
  // Валидация телефона
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
  if (!buyerData.phone || buyerData.phone.trim() === '') {
    errors.phone = 'Необходимо указать телефон';
  } else if (!phoneRegex.test(buyerData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Введите корректный телефон (например: +7 999 123-45-67)';
  } else if (buyerData.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Телефон слишком короткий (минимум 10 цифр)';
  }
  
  const isValid = Object.keys(errors).length === 0;
  contactsForm.showErrors(errors);
  contactsForm.submitButtonEnable(isValid);
  
  return isValid;
}

// Функция отправки заказа
function submitOrder(): void {
  const buyerData = buyerModel.getData();
  const cartItems = shoppingCartModel.getCartItems();
  
  if (buyerData.payment && buyerData.address && buyerData.email && buyerData.phone && cartItems.length > 0) {
    const order: TOrder = {
      payment: buyerData.payment as 'cash' | 'card',
      email: buyerData.email,
      phone: buyerData.phone,
      address: buyerData.address,
      total: shoppingCartModel.getCartTotalPrice(),
      items: cartItems.map(item => item.id)
    };
    
    // Показываем индикатор загрузки
    const submitButton = contactsForm.element?.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Отправка...';
      submitButton.disabled = true;
      
      api.postOrder(order)
        .then((response) => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
          
          orderSuccess.orderSuccessMessage = response.total;
          modal.open(orderSuccess.render({ total: response.total }));
          
          // Очищаем данные после успешного оформления
          shoppingCartModel.removeAllItemsFromCart();
          buyerModel.clear();
        })
        .catch((error: Error) => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
          console.error('Ошибка оформления заказа:', error);
          alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
        });
    } else {
      api.postOrder(order)
        .then((response) => {
          orderSuccess.orderSuccessMessage = response.total;
          modal.open(orderSuccess.render({ total: response.total }));
          
          shoppingCartModel.removeAllItemsFromCart();
          buyerModel.clear();
        })
        .catch((error: Error) => {
          console.error('Ошибка оформления заказа:', error);
          alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
        });
    }
  }
}

// ============================================================
// Дополнительная отладка для изображений
// ============================================================

// Проверка доступности изображений при загрузке страницы
window.addEventListener('load', () => {
  console.log('Проверка доступности изображений в images/card...');
  
  // Тестовые пути для проверки
  const testPaths = [
    '/images/card/5_Dots.svg',
    '/images/card/Subtract.svg',
    '/images/card/Slim.svg',
    '/src/images/card/5_Dots.svg',
    '/public/images/card/5_Dots.svg'
  ];
  
  testPaths.forEach(path => {
    const img = new Image();
    img.onload = () => console.log(`✓ ${path} доступен`);
    img.onerror = () => console.log(`✗ ${path} недоступен`);
    img.src = path;
  });
  
  // Проверка логотипа в header
  const logoImg = document.querySelector('.header__logo-image') as HTMLImageElement;
  if (logoImg) {
    console.log('Проверка логотипа:', logoImg.src);
    const testLogo = new Image();
    testLogo.onload = () => console.log('✓ Логотип загружен');
    testLogo.onerror = () => {
      console.log('✗ Логотип не загружен, исправляем путь...');
      // Исправляем путь к логотипу
      logoImg.src = '/images/logo.svg'; 
    };
    testLogo.src = logoImg.src;
  }
});