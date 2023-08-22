const renderCart = (cartGoods) => {                                           // [{},{},{}]  из Корзины
     
      const cartWrapper = document.querySelector('.cart-wrapper');
     
      cartWrapper.innerHTML = '';                           // перед заполнением очищаем

      if(cartGoods.length === 0){
            cartWrapper.insertAdjacentHTML('beforeend', `
                  <div id="cart-empty">Ваша корзина пока пуста </div>
            `);
      }
      else{
            cartGoods.forEach((cartItem) => {                     // метод ничего не верет, просто отработает
                  cartWrapper.insertAdjacentHTML('beforeend', `
                        <div class="card" data-key=${cartItem.id}>  <!-- добавили дата-атрибут -->
                              ${cartItem.sale ?  `<div class="card-sale">🔥Hot Sale🔥</div>` : ''} 
                              <div class="card-img-wrapper">
                                    <span class="card-img-top" style="background-image: url('${cartItem.img}')"></span>
                              </div>
                              <div class="card-body justify-content-between">
                                    <div class="card-price">${cartItem.price} ₽</div>
                                    <h5 class="card-title">${cartItem.title}</h5>
                                    <button class="btn btn-primary"> Удалить </button>
                              </div>
                        </div>
                  `);
            });
      }


};



export default renderCart;