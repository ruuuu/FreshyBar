
import getData from "./getData";  // так импортируем, если в getData.js 'export default getData'
import renderGoods from "./renderGoods";
import { funcFilter } from "./filters";  // // так импортируем, если в filters.js у функции указали export
import { debounce } from "./helpers";



const search = () => {

      const inputSearch = document.querySelector('.search-wrapper_input');
      const minInput = document.getElementById('min');
      const maxInput = document.getElementById('max');
      const checkInput = document.getElementById('discount-checkbox');                   // чекбокс Акция
      const checkMark = document.querySelector('.filter-check_checkmark');


      const debounceSearch = debounce((evt) => {
            getData().then((data) => {
                  renderGoods(searchFilter(data, evt.target.value));
            });
      }, 2000);  // только чрез 2 секунды вызовется переданная функция



      const debounceFunc = debounce((min='', max='', checkValue=false, searchString='') => {  // если min/max не передадим, то  значения пустые. check - чекбокс  Акция, по умолчанию(если галочку не постаивли) галочка не стоит
            getData().then((data) => {
                  renderGoods(funcFilter(data, min, max, checkValue, searchString));
            });
      }, 2000);  // только чрез 2 секунды вызовется переданная функция



      // inputSearch.addEventListener('input', (evt) => {            // ввод текста в поле поиска, input-событие ввода. При каждом вводе символа в поле, сработает это событие
      //      //console.log('evt.target ', evt.target)  // <input class="">
      //       const value = evt.target.value;                       // то что ввдеем в поле поиска
            
      //       getData().then((data) => {
      //             renderGoods(searchFilter(data, value));
      //       });
           
      // })


      inputSearch.addEventListener('input', () => {                     // обрботчик вешаем на поле поиска
            debounceFunc(minInput.value, maxInput.value, checkInput.value, inputSearch.value);
      });


      minInput.addEventListener('input', (evt) => {
            // evt.target.value - значение введнное в поле
            debounceFunc(minInput.value, maxInput.value, checkInput.value, inputSearch.value);
      });


      maxInput.addEventListener('input', () => {
            debounceFunc(minInput.value, maxInput.value, checkInput.value, inputSearch.value);
      });

      
//                                'input'  
      checkInput.addEventListener('change', () => {         // обработчик на чекбокс Акция
            // console.log(checkInput.checked);               // true/false
            if(checkInput.checked){                         // если нажат чекбокс Акция
                  checkMark.classList.add('checked');
            }
            else{
                  checkMark.classList.remove('checked');
            }

            debounceFunc(minInput.value, maxInput.value, checkInput.checked, inputSearch.value);
      });
};




export default search;