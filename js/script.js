const API_URL = "https://salty-heliotrope-end.glitch.me/";              // выгрузила на Glitch

const price = {
      Клубника: 60, 
      Киви: 55, 
      Банан: 70, 
      Маракуйя: 55, 
      Манго: 90,  
      Яблоко: 30, 
      Мята: 20, 
      Лед: 10, 
      Биоразлагаемый: 5, 
      Пластиковый: 2
};


// корзину храним в  localStorage:
const cartDataControl = {
      get(){
            return JSON.parse(localStorage.getItem('freshyBarCart') || '[]');  // из localStorage приходит данные в формает json, поэтому  их парсим для получения  удобочитаемого вида
      },
      add(item){                                      // то что выбарли в форме Коструткор:  item={ ingredients: ['Клубника', 'Банан', 'Маракуйя'],   topping: ['Лед', 'Мята'],   cup: ['Пластиковый'],  price: "undefined" }
            const cartData = this.get();              // cartData = [ {}, {}, {} ]
            item.id =  Math.random().toString(36).substring(2, 8);    // придумываем и добавляем коктейлю id, выбирае из 36 символов, берем тлоько со 2 по 8 символ(то есть 6-ти значный id)
            cartData.push(item);                      // добавляем item  в  cartData
            localStorage.setItem('freshyBarCart', JSON.stringify(cartData));      // обновили localStorage, превращаем из строки в JSON
      },
      remove(id){                                                 // id удаляемого коктейля
            const cartData = this.get(); 
            
            const index = cartData.findIndex((item) => item.id === id);   // нашли индекс удаляемого коктейля, если такогтэлемента нет, то вернет -1
            if(index !== -1){                                              // если удаляемый элемент есть  
                  cartData.splice(index, 1);                                  // удаляет из массива часть массива, начиная с элемента с индексом index, число удаляемых элементов равно 1
            }
            localStorage.setItem('freshyBarCart', JSON.stringify(cartData));    

      },
      clear(){                                              // после отправки, очищаем localStorage
            localStorage.removeItem('freshyBarCart');
      }
      
};



const getData = async () => {    // тк внутри фукнции есть await, то  пишем async(асинхронная)

      const response = await fetch(`${API_URL}api/goods`);  // запрос на сервер, fetch асинхронный метод, он вернет промис, поэтому ставим await чтобы получить понятные данные
      
      // console.log(reponse.text);
      // данные с сервера возвращаются в ввиде строки, но в формате json 
      const data = await response.json();  // метод json()тоже асинхронный, поэтму ставим  await
    
      return data;            // [ {}, {}, {} ]
};


// отрисовка ккрточки коктейля:
const createCard = (cocktailItem) => {

      const cocktail = document.createElement('article');
      cocktail.classList.add('goods__card', 'cocktail');          // добавили два класса

      cocktail.innerHTML = `
            <img class="cocktail__img" src="${API_URL}${cocktailItem.image}" alt="${cocktailItem.title}">
            <div class="cocktail__content">
                  <div class="cocktail__text">
                        <h3 class="cocktail__title">${cocktailItem.title}</h3>
                        <p class="cocktail__price text-red"> ${cocktailItem.price} Р</p>
                        <p class="cocktail__size">${cocktailItem.size} </p>
                  </div>
                  <button class="btn cocktail__btn cocktail__btn--add"  data-id="${cocktailItem.id}">Добавить</button>
            </div>
      `;

      return cocktail;  // <article class="goods__card cocktail"> ... </article>
};




const scrollService =  {                              // при открытой модалке, задний фон скроллится не будет
      
      scrollPosition: 0,                              // нач позиция скролла
      disableScroll(){
            this.scrollPosition = window.scrollY;                             // window - объект бразуера, текущая позиция скролла
            document.documentElement.style.scrollBehavior = 'auto';             //   убираем вертикальный скролл
            document.body.style.cssText = `
                  overflow: hidden;
                  position: fixed;                                 /* задний фон не скроллится */
                  top: -${this.scrollPosition}px;                  /* задний фон не будет вверх */
                  left: 0;                                         /* чтобы станица не уезжаа влево */ 
                  height: 100vh;
                  width: 100vw;
                  padding-right: ${window.innerWidth - document.body.offsetWidth}px;   /* ширина окна браузера(страница со скроллом) - ширина страницы */
            `;
      },
      enabledScroll(){
            document.body.style.cssText = '';                           //  уберем все что задали в  disableScroll()

            window.scroll({ top: this.scrollPosition });                // скроллим к верху, чтобы станица не прыгала вверх после закрытия модалки
            document.documentElement.style.scrollBehavior = "";         // document.documentElement - html 
      }
};



// СКРИПТ РАБОТАЮЩИЙ С ЛЮБЫМ МОД ОКНОМ:
const modalControler = ( { modal, btnOpen, time = 300, open, close } ) => {  // modal - класс  модалки,  btnOpen - класс кнпоки открытия модалки, open и  close-функции,  time - время плавности
      
      const buttonElems = document.querySelectorAll(btnOpen);     // кнопка открытия модаоки
      const modalElem =  document.querySelector(modal);           // модалка

      
      modalElem.style.cssText =  `   
            display: flex;
            visibility: hidden;
            opacity: 0; 
            transition: opacity ${time}ms ease-in-out; /* opacity поменяется втечение time мс */
      `;


    
      const closeModal = (evt) => {

            const code = evt.code;                                         // код клавиши на котрую нажали
            if(evt === "close" ||  evt.target === modalElem || code === 'Escape'){             // если нажали на модалку или клавишу Escape. evt.target- элемент на котрый нажали, evt.target === 'close' (можно любую строку передать), позволит закрыть окно
                  modalElem.style.opacity = 0;
                 
                  setTimeout(() => {                                     // переданная фукнуия вызовется через вреям time
                        modalElem.style.visibility = 'hidden';           // модала исчезнет
                        scrollService.enabledScroll();
                        if(close){                                       // если есть фукнуия close
                              close();                                   // вызов фукнции close()
                        }
                  }, time);
            }

            window.removeEventListener('keydown', closeModal);                // снимаем слушатель, чтоб при нажатии любой клавиши, не вызываелся closeModal()  
      };



      const openModal = (evt) => {
            if(open){
                  open({ btn: evt.target });                                  // evt.target - вернет элемент(кнопка  "Добавить" у коктеля), на котрый нажали
            }
            
            modalElem.style.visibility = 'visible';
            modalElem.style.opacity = 1;

            window.addEventListener('keydown', closeModal);                   // при нажати  на клавишу keydown
            scrollService.disableScroll();
      };



      buttonElems.forEach((btn) => {
            btn.addEventListener('click',  openModal);
      });
      
     
      modalElem.addEventListener('click', closeModal);

      modalElem.closeModal = closeModal;  // любой элемент на станице это объект, знаичт можно ему добавить свойстов
      modalElem.openModal = openModal;

      return { openModal, closeModal };                     // возвзращаем объект(две функции) 
};



// получение объекта(его будем отправлять на сервер) с заполненными полями формы:
const getFormData = (form) => {
      const formData = new FormData(form);                  // конструктор  формы
      
      const data = {};                                      // в цикле будем его заполнять. Будет то что выбрали: { ingredients: ['Клубника', 'Банан', 'Маракуйя'],  topping: ['Лед', 'Мята'],  price: "undefined" }

      for (const [name, value]  of  formData.entries()){                // элементами formData.entries() являются пара  [name, value], напрмиер [ ingredients: 'Клубника' ], [ ingredients: 'Банан' ],  [ ingredients: 'Маракуйя' ],  [ topping: 'Лед' ],   [ cup: 'Пластиковый' ],  [ price: "undefined" ]  
          
            if(data[name]){                                             // если это массив
                  if(!Array.isArray(data[name])){                       // если data[name] это не массив
                        data[name] = [data[name]];                      // делаем data[name] массивом
                  }  

                  data[name].push(value);                   // если свойтсво name  уже есть, то добавлем значение value у чекбокса в []                
            }
            else{
                  data[name] = value;                       // добавлем свойство ingredients/topping/cup/price в объект data
            }
      }
      
      console.log('data getFormData ', data);       // выбранные чекбоксы { ingredients: ['Клубника', 'Банан', 'Маракуйя'],   topping: ['Лед', 'Мята'],   cup: ['Пластиковый'],  price: "undefined" }
      
      return data;                                 
};




const calculateTotalPrice = (form, startPrice) => {
      let totalPice = startPrice;
      const data = getFormData(form);           // чекбоксы/радиобаттоны котрые  выбрали в форме: data = { ingredients: ['Клубника', 'Банан', 'Маракуйя'],  topping: ['Лед', 'Мята'],  cup: 'Пластиковый'/'Биоразлагаемый',  price: "undefined" }
      // console.log('data from calculateTotalPrice ', data);

      if(Array.isArray(data.ingredients)){      // если data.ingredients это массив
            data.ingredients.forEach((item) => {
                  totalPice += price[item] || 0;
            });
      }
      else{
            totalPice += price[data.ingredients] || 0;
      }


      if(Array.isArray(data.topping)){      // если data.topping это массив
            data.topping.forEach((item) => {
                  totalPice += price[item] || 0;
            });
      }
      else{
            totalPice += price[data.topping] || 0;
      }


      totalPice += price[data.cup] || 0;

      return totalPice;
};



const formControl = (form, cb) => {                   // передаем  коллбэк cb

      form.addEventListener('submit', (evt) => {
            evt.preventDefault();                     // отмена поведения по умолчанию(перезагрука страницы)
            
            const data = getFormData(form);               // то, что выбрали в форме Конструктор коктейля: { ingredients: ['Клубника', 'Банан', 'Маракуйя'],  topping: ['Лед', 'Мята'],  cup: 'Пластиковый'/'Биоразлагаемый',  price: "230" }
            // console.log('data from calculateTotalPrice ', data);
            cartDataControl.add(data);                // добавляем то, что выбрали в форме Конструктор: { ingredients: ['Клубника', 'Банан', 'Маракуйя'],   topping: ['Лед', 'Мята'],   cup: ['Пластиковый'],  price: "230" }  в Корзину(в лок хранилище)
            
            if(cb){
                  cb();                               // modalMakeOwn.closeModal("close");   
            }

      });   
};



// подсчет стоимости в форме Конструктор коктейля:
const calculateMakeYourOwn = () => {

      const modalMakeOwn = document.querySelector('.modal__make-your-own');  // модалка
      const formMakeOwn =  modalMakeOwn.querySelector('.make__form--make-your-own'); // form Consructor коктейля
      const makeInputPrice = formMakeOwn.querySelector('.make__input--price');  // input
      const makeTotalPrice = formMakeOwn.querySelector('.make__total-price');
      const makeAddBtn = modalMakeOwn.querySelector('.make__add-btn');  //  кнпока Добавить в форме
      const makeInputTitle = modalMakeOwn.querySelector('.make__input-title');



      const handlerChange = () => {
            const totalPrice = calculateTotalPrice(formMakeOwn, 150);   // 150-стартовая цена
            const data = getFormData(formMakeOwn);
            if(data.ingredients){
                  const ingredients = Array.isArray(data.ingredients)  ?  data.ingredients.join(', ') : data.ingredients;               // если data.ingredients является массивом, то разлоим  элементы в виде строки через запятую
                  makeInputTitle.value = `Конструктор:  ${ingredients}`;
                  makeAddBtn.disabled = false;                              // раздизейблили кнпоку
            }else{
                  makeAddBtn.disabled = true;                                 // задизейблили кнпоку
            }
            makeInputPrice.value = totalPrice;                         // запсиываем значение в поле makeInputPrice
            makeTotalPrice.textContent = `${totalPrice} Р`;
      };


      formMakeOwn.addEventListener('change',  handlerChange);           // собыие сработает, когда поставим/уберем чекбокс/радиобаттоны
      
      formControl(formMakeOwn, () => {
            modalMakeOwn.closeModal("close");                            // в форме конструкртора коктлейля, при нажатии на Добавить, окно закроется
      });
      
      handlerChange();  // один раз надо вызвать функицю

      const resetForm = ()=> {
           
            makeTotalPrice.textContent = '';
            makeAddBtn.disabled = true;         // дизебйлим кнопку
            formMakeOwn.reset();                // очищем форму
      };

      return { resetForm };
};




// подсчет стоиомости коктейля в Cart(там поля Дополнительно и Стакан):
const calculateAdd = () => {
    
      const modalAdd = document.querySelector('.modal--add');                             // модалка стоиомости коктейля (там поля Дополнительно и Стакан)
      const formAdd = modalAdd.querySelector('.make__form--add');                         // form стоиомости коктейля (там поля Дополнительно и Стакан)
      
      const makeTitle = modalAdd.querySelector('.make__title');
      const makeInputTitle = modalAdd.querySelector('.make__input-title');
      const makeInputStartPrice  = modalAdd.querySelector('.make__input-start-price ');
      const makeTotalPrice = modalAdd.querySelector('.make__total-price');   // p
      const makeInputPrice = modalAdd.querySelector('.make__input-price');   // input
      const makeTotalSize = modalAdd.querySelector('.make__total-size');
      const makeInputSize = modalAdd.querySelector('.make__input-size');
      const btnAdd = modalAdd.querySelector('.make__add-btn');



      const handlerChange  = () => {
           const totaPrice =  calculateTotalPrice(formAdd, +makeInputStartPrice.value);   // к полям формы можно обратися как: форма.input.name, +formAdd.price.value переводит из строки в число   
           makeTotalPrice.innerHTML = `${totaPrice}&nbsp;Р`;
           makeInputPrice.value = totaPrice;
      };


      formAdd.addEventListener("change", handlerChange);  // когда ставим/снимаем с чекбоков/радиобаттонов галочку, сработает событие 'change'
      
      formControl(formAdd, () => {
            modalAdd.closeModal("close");
      });

      

      const fillInForm = (data) => {                  // data = {}- выбранный коктейль
            makeTitle.textContent = data.title; 
            makeInputTitle.value = data.title;
            makeInputPrice.innerHTML = `${data.price}&nbsp;Р`;
            makeInputStartPrice.value = data.price;
            makeInputPrice.value = data.price;
            makeTotalSize.textContent = data.size; 
            makeInputSize.value = data.size;

            handlerChange();
      };

      
      const resetForm = () => { 
            makeTitle.textContent = '';
            makeTotalPrice.textContent = '';
            makeTotalSize.textContent = '';
            //btnAdd.disabled = true;         // дизебйлим кнопку
            formAdd.reset();                    // очищем форму
      };


      return { fillInForm, resetForm }   // вернет объект (две фукнии): fillInForm заполнеят форму, resetForm очищает форму
};



// отрисовка заказа в Корзине:
const createCartItem = (itemOrder) => {  // item заказ
     console.log('itemOrder ', itemOrder)

     const li = document.createElement('li');
     li.classList.add('order__item');
     // img/6.jpg
     li.innerHTML = `
            <img class="order__img" src="${API_URL}${itemOrder.image}" alt="${itemOrder.title}">
            <div class="order__info">
                  <h3 class="order__name"> ${itemOrder.title} </h3>
                  <ul class="order__topping-list">
                        <li class="order__topping-item"> ${itemOrder.size}  </li>
                        <li class="order__topping-item"> ${itemOrder.cup ? itemOrder.cup : ""} </li>            <!-- если itemOrder.cup есть, то отобразим иначе пусто -->
                        ${ itemOrder.topping ?  Array.isArray(itemOrder.topping) ? itemOrder.topping.map((toppingItem) => `<li class="order__topping-item"> ${toppingItem} </li>`, )  :  `<li class="order__topping-item"> ${itemOrder.topping} </li>`  :  "" }
                  </ul>
            </div>

            <button class="order__item-delete" aria-label="Удалить заказ из корзины" data-id="${itemOrder.id}"></button>    <!-- data-id добавили  чтобы удалять заказ по его id -->
            <p class="order__item-price"> ${itemOrder.price}&nbsp;Р </p>
     `;

     return li; 
};



// отрисовка корзины
const renderCart  = () => {
      const modalOrder = document.querySelector('.modal__order');
     
      const orderCount = modalOrder.querySelector('.order__count');
      const orderList = modalOrder.querySelector('.order__list');
      const orderTotalPrice = modalOrder.querySelector('.order__total-price');
      const orderForm = modalOrder.querySelector('.order__form');
      
      const orderListData = cartDataControl.get();                // [{},{},{}]   данные из localStorage -массив заказов
      orderList.textContent = '';                                // перед заполнением контенйер очищаем
      orderCount.textContent = `(${orderListData.length})`;

      orderListData.forEach((item) => {  // item заказ { cup: "Биоразлагаемый", id: "55fc7c",  ingredients: ["Киви", "Банан"],  price: "290",  title: "Конструктор: Киви, Банан",  topping: "Лед" }
            
            orderList.append(createCartItem(item));
      });

      orderTotalPrice.textContent = `${orderListData.reduce((acc, item)=> +item.price + acc, 0)} Р`;  // суммирует по полю item.price

      orderForm.addEventListener('submit', async(evt) => {  // отправляем корзину на сервер
            evt.preventDefault();
            if(!orderListData.length){          // если массив заказво  пусой
                  orderForm.reset(); 
                  modalOrder.closeModal("close");                              // по наатию на Закзать, модалка закроется
            }

            const data = getFormData(orderForm);                                          //  чтобы получить объект заказа(ЕГО БУДЕМ ОТПРАВЛЯТЬ НА СЕРВЕР) с выбранными полями(Имя и Телефон) формы orderForm {name, phone, [{},{},{}]}
            const response = await fetch(`${API_URL}api/order`, {                         //  отправляем POST запросом данные({data, products}) формы на сервер
                  method: 'POST',
                  body: JSON.stringify({                                                  // даннеы отправляем ввдже json, поэтому  JSON.stringify
                        ...data,
                        products: orderListData, 
                        headers: {
                              "Content-Type": 'application/json' 
                        },
                  }),     
           });

           const { message } = await response.json();                                     // json() это асинхронный метод, поэтому await

           cartDataControl.clear();                                                       //  очищаем localstorage
           
      })
};



const init = async() => {

      modalControler( { modal: '.modal__order',  btnOpen: '.header__btn-order', open: renderCart, } );  //  модалка Корзины: пред октрытием корзины, будет выызваться фукнция renderCart
     
      const { resetForm: resetFormMakeYourOwn } = calculateMakeYourOwn();

    
      // открытие модалки Конструтко коктейля:
      modalControler( { modal: '.modal__make-your-own',   btnOpen: '.cocktail__btn--make',  close: resetFormMakeYourOwn, }  );  // при нажатии на Добавить в форме конутрктор коктейля, вызвеотся resetFormcalMakeYourOwn 
      
      const goodsListElem = document.querySelector('.goods__list');     // ul
      const data = await getData();                               // [{},{},{}] коктейли с серевра.  Тк getData асинхроная фукния, пэтому она вернет промис. Чтобы плучить понятные  данные, ставим await

      const cartsCocktail = data.map((coctailElem) => {           // coctailElem = { id, title, description, img, price, size }, map вернет массив cartsCocktail =  [li, li, li]
                      
            const li = document.createElement('li');
            li.classList.add('goods__item');

            const article = createCard(coctailElem);
            li.append(article);

            return li;  // <li> ... </li>
      });

      goodsListElem.append(...cartsCocktail);                     // ... спред оператор
      // console.log('cartsCocktail  ', cartsCocktail);              // [ li, li, li ]


      const { fillInForm: fillInFormAdd, resetForm: resetFormAdd } = calculateAdd();           // вернет объект(две фукнции): заполнения формы и очищение


     
     
      // открыти модалки Корзина:
      modalControler( { modal: '.modal--add',  btnOpen: '.cocktail__btn--add', 
            open({ btn }){
                  const id = btn.dataset.id;                                        // получаем значение дата атрибута data-id у нажатой кнопки Добавить. Из дата-атрибута всегда приходит строка
                  const item = data.find((elem) => elem.id.toString() === id);                // перебираем товары с серевра, item = {} -товар
                  fillInFormAdd(item);                                                 // заполняем форму
            }, 
            close: resetFormAdd                                                        // очищаем форму, скобки не ставим
       } );  
     
};




init();  // отсюда все начинается