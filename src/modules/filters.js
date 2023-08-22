
// поиск:
export const searchFilter = (goods, value) => {                                     // value= значение введенное в поле поиска
      const filterGoods = goods.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()));             // вернет массив элементов котрые подходят под условие
      return filterGoods;  // [{},{},{}] отфильтрованные товары
};


// фильтр по категориям:
export const categoryFilter = (goods, value) => {                                     // value= значение введенное в поле поиска
      const filterGoods = goods.filter((item) => item.category === value);             // вернет массив элементов котрые подходят под условие
      //console.log('filterGoods ', filterGoods);
      return filterGoods;  
};



// фильтр по цене и Акция(чекбокс):
export const funcFilter = (goods,  minValue,  maxValue, checkValue, searchString='') => {     //     searchString - то, что ввели в поле поиска                           
      
      
      const priceFilterGoods = goods.filter((item) => {                                         // filter вернет массив элементов котрые подходят под условие
            const isMin = minValue.trim() ? item.price >= parseInt(minValue.trim()) : true;     // str.trim()  убирает пробелы  в строке. Пуста строка это false
            const isMax = maxValue.trim() ? item.price <= parseInt(maxValue.trim()) : true;
            const check = checkValue ? item.sale : 1;
            return isMax && isMin && check && item.title.toLowerCase().includes(searchString.toLowerCase());
      });     

      console.log('priceFilterGoods ', priceFilterGoods);
      return priceFilterGoods; 
};
