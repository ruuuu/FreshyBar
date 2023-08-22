const getData = () => {
                  // http://localhost/goods
                  // если б данные получали чеез json-server, то:  `https://ozon-290ae-default-rtdb.firebaseio.com/goods.json?${ str ? `search=${str}` : '' }`
      return fetch('https://ozon-290ae-default-rtdb.firebaseio.com/goods.json')  // fetch  асинхроная операция, знаичт результат выполнения  займет некоторое время
            .then((response) => {
                  return response.json();             // then - асинхроннымй метод, вернет промис,  работает с данными полученными  от сервера(response-объект ответа сервера). Как только данные получим от сервера, так запутится then(). json() приводит данные в json струтктуру 
            })
            // .then((data) => {                         // data- то что вернул прелдыдущий then
            //       console.log('data ', data)
            // })
      
};



export default getData;