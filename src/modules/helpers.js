export const debounce = (func, ms = 300) => {               // func- делаем эту функцию отложенной, на столько ms откладываем запуск func

      let timer;

      return (...args) => {                           // ...args - параметры фукнции func
            clearTimeout(timer);                      // очищает таймер timer
            timer = setTimeout(() => {                // создаем новый timer
                  func.apply(this, args);
            }, ms);
      }

};


// вызываем фукнцию func(поиcк), она передается в debounce, запускается timer=300ms. Если в тчеении 300 msвведем символ в поле поиска, то  снова запустится вызов debounсe, очистит предыдущий timeer и запустит новый таймер. То есть в течени 300 ms пока мы будем вводить символы в поле, функция(func) вызыватся не будет