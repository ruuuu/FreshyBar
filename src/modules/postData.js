const postData = (cartGoods) => {             // [{}, {}, {}]

      // fetch('https://ozon-290ae-default-rtdb.firebaseio.com/goods.json/23', {
      //       method: 'DELETE',
      // })
      // .then((res) => res.json());
           

      return fetch('https://jsonplaceholder.typicode.com/posts', { 
      
            method: 'POST',
            body: JSON.stringify(cartGoods),          //  JSON.stringify преобразует объект в строку, id не указываем, json-sever сам его задаст
            headers: {
                  'Content-type': 'application/json; charset=UTF-8',
            },
      })
      .then((res) => res.json());
           


};

export default  postData;