const API_URL = "https://salty-heliotrope-end.glitch.me/";              // выгрузила на Glitch



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
                  <button class="btn cocktail__btn"  data-id="${cocktailItem.id}">Добавить</button>
            </div>
      `;

      return cocktail;  // <article> ... </article>
};




// СКРИПТ РАБОТАЮЩИЙ С ЛЮБЫМ МОЛ ОКНОМ:
const modalControler = ( { modal, btnOpen, time = 300 } ) => {  // modal - класс  модалки,  btnOpen - класс кнпоки открытия модалки,   time - время плавности
      
      const buttonElem = document.querySelector(btnOpen);
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

                  setTimeout(() => {            // переданная фукнуия вызовется через вреям time
                        modalElem.style.visibility = 'hidden';
                  }, time);
            }

            window.removeEventListener('keydown', closeModal);  // снимаем слушатель, чтоб при нажатии любой клавиши, не вызываелся closeModal
              
      };


      const openModal = () => {
            modalElem.style.visibility = 'visible';
            modalElem.style.opacity = 1;

            window.addEventListener('keydown', closeModal);  // прианжаати  на клавишу keydown
      };


      
      buttonElem.addEventListener('click',  openModal);
      modalElem.addEventListener('click', closeModal);

      return { openModal, closeModal };             // возвзращаем две функции
};




const init = async() => {

      modalControler( { modal: '.modal__order' , btnOpen: '.header__btn' } );

      const goodsListElem = document.querySelector('.goods__list');     // ul

      
      
      const data = await getData();  // [{},{},{}].  Тк getData асинхроная фукния, пэтому она вернет промис. Чтобы увидеть данные, ставим await

      const cartsCocktail = data.map((coctailElem) => {           // coctailElem = { id, title, description, img, price, size }, map вернет массив [li, li, li]
                      
            const li = document.createElement('li');
            li.classList.add('goods__item');

            const article = createCard(coctailElem);
            li.append(article);

            return li;  // <li> ... </li>
      });
      
      
      console.log('cartsCocktail  ', cartsCocktail);  // [ li, li, li ]

      goodsListElem.append(...cartsCocktail); // ... спред оператор
     
};




init();  // отсюда все начинается