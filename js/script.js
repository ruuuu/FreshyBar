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



const getData = async () => {    // ттк внутри фукнции есть await, то  пишем async(асинхронная )

      const response = await fetch(`${API_URL}api/goods`);  // запрос на сервер, полуичм промис без await, fetch асинхронный метод, поэтому ставим await
      
      // console.log(reponse.text);
      // данные с сервера возвращаются в  ввиде строки, но в формате json 
      const data = await response.json();  // метод json()тоже асинхронный, поэтму ставим  await
    

      return data;   // [{},{},{}]
};



const createCard = (cocktailItem) => {

      const cocktail = document.createElement('article');
      cocktail.classList.add('goods__card', 'cocktail');  // добавили два класса

      cocktail.innerHTML = `
            <img class="cocktail__img" src="${API_URL}${cocktailItem.image}" alt="${cocktailItem.title}">
            <div class="cocktail__content">
                  <div class="cocktail__text">
                        <h3 class="cocktail__title">${cocktailItem.title}</h3>
                        <p class="cocktail__price text-red"> ${cocktailItem.price} Р</p>
                  </div>
                  <p class="cocktail__size">${cocktailItem.size} мл</p>
                  <button class="btn cocktail__btn cocktail__btn--add"  data-id="${cocktailItem.id}">Добавить</button>
            </div>
      `;

      return cocktail;  // <article> ... </article>
};




const scrollService =  {  // при открытой модалке, задний фон скроллится не будет
      
      scrollPosition: 0,            // нач позиция скролла
      disableScroll(){
            this.scrollPosition = window.scrollY;                             // window - объект бразуера, текущая позиция скролла
            document.documentElement.style.scrollBehavior = 'auto';             //   убираем вертикальный скролл
            document.body.style.cssText = `
                  overflow: hidden;
                  position: fixed;  /* задний фон не скроллится */
                  top: -${this.scrollPosition}px;   /* задний фон не еудет вверх */
                  left: 0; /*чтобы станица не уезжаа влево*/ 
                  height: 100vh;
                  width: 100vw;
                  padding-right: ${window.innerWidth - document.body.offsetWidth}px;   /* ширина окна браузера(страница со скроллом) - ширина страницы */
            `;
      },
      enabledScroll(){
            document.body.style.cssText = '';  //  уберем все что задали в  disableScroll()

            window.scroll({ top: this.scrollPosition });                // скроллим к верху, чтобы станица не прыгала вверх после закрытия модалки
            document.documentElement.style.scrollBehavior = "";         // document.documentElement - html 
      }
};



// СКРИПТ РАБОТАЮЩИЙ С ЛЮБЫМ МОЛ ОКНОМ:
const modalControler = ( { modal, btnOpen, time = 300 } ) => {  // modal - класс  модалки,  btnOpen - класс кнпоки открытия модалки,   time - время плавности
      
      const buttonElems = document.querySelectorAll(btnOpen);
      const modalElem =  document.querySelector(modal);

       // задемм стили модалке:
      modalElem.style.cssText =  `   
            display: flex;
            visibility: hidden;
            opacity: 0; 
            transition: opacity ${time}ms ease-in-out; /* opacity поменяется втечение time мс */
      `;


    
      const closeModal = (evt) => {

            const code = evt.code;                    // код клавиши на котрую нажали
            if(evt.target === modalElem || code === 'Escape'){             // если нажали на модалку
                  modalElem.style.opacity = 0;
                 

                  setTimeout(() => {                                    // переданная фукнуия вызовется через вреям time
                        modalElem.style.visibility = 'hidden';           // модала исчезнет
                        scrollService.enabledScroll();
                  }, time);
            }

            window.removeEventListener('keydown', closeModal);  // снимаем слушатель, чтоб при нажатии любой клавиши, не вызываелся closeModal      
      };


      const openModal = () => {
            modalElem.style.visibility = 'visible';
            modalElem.style.opacity = 1;

            window.addEventListener('keydown', closeModal);  // прианжаати  на клавишу keydown
            scrollService.disableScroll();
      };


      buttonElems.forEach((btn) => {
            btn.addEventListener('click',  openModal);
      });
      
     
      modalElem.addEventListener('click', closeModal);

      return { openModal, closeModal };             // возвзращаем две функции
};




const getFormData = (form) => {
      const formData = new FormData(form);
      
      const data = {};  // в цикле будем его заполнять. Будет то чnо выбрали: { ingredients: ['Клубника', 'Банан', 'Маракуйя'],  topping: ['Лед', 'Мята'],  price: "undefined" }

      for (const [name, value]  of  formData.entries()){
          
            if(data[name]){                                 // если это массив
                  if(!Array.isArray(data[name])){           // если data[name] это не массив
                        data[name] = [data[name]];          // делаем его массивом
                  }  

                  data[name].push(value);   // есил свойтсов уже есть, то добавлем значение value у чекбокса в []                
            }
            else{
                  data[name] = value;  // добавлем свойство ingredients/topping/cup
            }
      }
      
      console.log('data getFormData ', data);       // выбраные чекбоксы { ingredients: ['Клубника', 'Банан', 'Маракуйя'],  topping: ['Лед', 'Мята'],  cup: ['Пластиковый'],  price: "undefined" }
      
      return data;                                 
};




const calculateTotalPrice = (form, startPrice) => {
      let totalPice = startPrice;
      const data = getFormData(form);           // то, что выбрали: data = { ingredients: ['Клубника', 'Банан', 'Маракуйя'],  topping: ['Лед', 'Мята'],  cup: 'Пластиковый'/'Биоразлагаемый',  price: "undefined" }
      // console.log('data from calculateTotalPrice ', data);

      if(Array.isArray(data.ingredients)){      // если это массив
            data.ingredients.forEach((item) => {
                  totalPice += price[item] || 0;
            });
      }
      else{
            totalPice += price[data.ingredients] || 0;
      }


      if(Array.isArray(data.topping)){      // если это массив
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



const calculateMakeYourOwn = () => {
       
      const formMakeOwn = document.querySelector('.make__form--make-your-own'); // form
      const makeInputPrice = formMakeOwn.querySelector('.make__input--price');  // input
      const makeTotalPrice = formMakeOwn.querySelector('.make__total-price');


      const handlerChange = () => {
            const totalPrice = calculateTotalPrice(formMakeOwn, 150);   // 150-стартовая цена
            makeInputPrice.value =  totalPrice;                         // запсиываем значение в поле makeInputPrice
            makeTotalPrice.textContent = `${totalPrice} Р`;
      };


      formMakeOwn.addEventListener('change',  handlerChange);
      handlerChange();

};




const init = async() => {

      modalControler( { modal: '.modal__order',  btnOpen: '.header__btn-order' } );
     
      calculateMakeYourOwn();
      const goodsListElem = document.querySelector('.goods__list');     // ul

      
      
      const data = await getData();  // [{},{},{}].  Тк getData асинхроная фукния, пэтому она вернет промис. Чтобы плучить понятные  данные, ставим await

      const cartsCocktail = data.map((coctailElem) => {           // coctailElem = { id, title, description, img, price, size }, map вернет массив [li, li, li]
                      
            const li = document.createElement('li');
            li.classList.add('goods__item');

            const article = createCard(coctailElem);
            li.append(article);

            return li;  // <li> ... </li>
      });
      
      
      console.log('cartsCocktail  ', cartsCocktail);  // [ li, li, li ]

      goodsListElem.append(...cartsCocktail); // ... спред оператор

      modalControler( { modal: '.modal__make-your-own',  btnOpen: '.cocktail__btn--make' } );  // при нажатии на Добавить откроется модалка 
      modalControler( { modal: '.modal--add',  btnOpen: '.cocktail__btn--add' } );  
     
};




init();  // отсюда все начинается