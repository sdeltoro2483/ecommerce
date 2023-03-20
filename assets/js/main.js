  async function getProducts(){
    try {
    const data= await fetch("https://ecommercebackend.fundamentos-29.repl.co/");

     const res=await data.json();
     window.localStorage.getItem("products",JSON.stringify(res));

     return res;
      console.log(res);

    } catch (error) {
        console.log(error);
      }
  }

    function printProducts(db){
    const productsHtml= document.querySelector(".products");
         let  html= "";

        console.log(db)
        
        for (const product of db.products) {
          const buttonAdd =  product.quantity ? `<i class='bx bx-plus' id ="${product.id}"></i>`: "<span class='soldOut '>sold out<span/>"
          
         html += `
        <div class="product">
            <div class="product__img">
             <img src="${product.image}"alt "imagen"/>
           </div>
               <div class="product_info">
                    <h4>${product.name} | <span><b>Stock</b>: ${product.quantity}</span></h4>
                     <h5>
                      $${product.price}
                      ${buttonAdd}
                  </h5>
              
              </div>
          </div>
            `;  
    } 
       productsHtml.innerHTML= html;
   
  }
  function handlesShowCart(){
    const iconCartHML= document.querySelector(".bx-cart");
     const cartHTML = document.querySelector(".cart");

      let count= 0;
     iconCartHML.addEventListener("click", function (){
        cartHTML.classList.toggle("cart_show");
     })

  }
  function addToCartFromProduct(db){
    const productsHtml= document.querySelector(".products");
     
    productsHtml.addEventListener("click", function(e){
     if (e.target.classList.contains("bx-plus")){
        const id=Number(e.target.id);

        const productFind = db.products.find((product)=>product.id===id);
       if(db.cart[productFind.id]){
         if(productFind.quantity=== db.cart[productFind.id].amount) 
         return alert("este producto no se encuentra en existencia");

         db.cart[productFind.id].amount++;
         

       }else{
         db.cart[productFind.id]={...productFind,amount: 1};
        
       }
       window.localStorage.setItem("cart",JSON.stringify(db.cart));
        printProductsInCart(db);
        printTotal(db);
        handlePrintAmountProduct(db);
         
     }
    });

  }
   function printProductsInCart(db){
    const cartProduct = document.querySelector(".cart_products");
    console.log(cartProduct);

    let html= ""

    for (const product in db.cart) {
     const {quantity,price,name,image,id,amount}= db.cart[product];

     html += `
      <div class ="cart_product">
      <div class="cart_product--img">
          <img src="${image}" alt="imagen"/>
      </div>
       <div class="cart_product--body">
        <h4>${name} | $${price} </h4>
         <p> Stock: ${quantity}</p>

         <div class="cart_product--body-op" id="${id}">
         <i class='bx bx-minus'></i>
         <span>${amount} unit</span>
         <i class='bx bx-plus'></i>
         <i class='bx bx-trash'></i>
         </div>
       </div>
      </div>

        `; 
     
    }
      cartProduct.innerHTML=html;
   }

   function handleProductosInCart (db){
    const cartProducts = document.querySelector(".cart_products");
    cartProducts.addEventListener("click", function(e){
     
     if(e.target.classList.contains("bx-plus")){
       const id= Number( e.target.parentElement.id);
       const productFind = db.products.find((product)=>product.id===id);
     
        if(productFind.quantity=== db.cart[productFind.id].amount) 
        return alert("este producto no se encuentra en existencia");

           db.cart[id].amount++;
      }
      
      if(e.target.classList.contains("bx-minus")){
       const id= Number( e.target.parentElement.id);
          if(db.cart[id].amount== 1) {
           const response =confirm("estas seguro de eliminar este producto del carrito?");
           if(!response) return;
           delete db.cart[id];
          }else{
           db.cart[id].amount --;
          }
      }
      
      if(e.target.classList.contains("bx-trash")){
       const id= Number( e.target.parentElement.id);
       const response =confirm("estas seguro de eliminar este producto del carrito?");
           if(!response) return;
           delete db.cart[id];
      }
      window.localStorage.setItem("cart",JSON.stringify(db.cart))
      printProductsInCart(db);
      printTotal(db);
      handlePrintAmountProduct(db);
    })
   }
   function printTotal(db){
    const infoTotal = document.querySelector(".info_total");
    const infoAmount = document.querySelector(".info_amount");

    let totalProducts = 0;
    let amountProducts = 0;

    for (const product in db.cart) {
     const {amount,price} = db.cart[product];
      totalProducts += price * amount
      amountProducts += db.cart[product].amount;
       
     }
     infoAmount.textContent = amountProducts +"units";
     infoTotal.textContent = "$" +totalProducts +".00"

   }

   function handleTotal(db){
    const btnBuy =document.querySelector(".btn_buy");

    btnBuy.addEventListener("click", function(){
     if(!Object.values(db.cart).length) return alert("debes tener un producto en el carrito");

      const response = confirm("estas seguro de esta compra?")
      if(!response) return;

      const currentProducts= []
      for (const product of db.products) {
       const productCart = db.cart[product.id];
       if(product.id === productCart?.id){
         currentProducts.push({
           ...product,
           quantity:product.quantity-productCart.amount,
         });

       } else{
         currentProducts.push(product)
       }
       
      }
      db.products= currentProducts;
      db.cart={};

      window.localStorage.setItem("products",JSON.stringify(db.products));
      window.localStorage.setItem("cart",JSON.stringify(db.cart));

      printTotal(db);
      printProductsInCart(db);
      printProducts(db);
      handlePrintAmountProduct(db);
    })
   }
   function handlePrintAmountProduct(db){
    const amountProducts= document.querySelector(".amountProducts");

     let amount = 0;

   for (const product in db.cart) {
       amount += db.cart[product].amount
    } 
      amountProducts.textContent = amount;
   }

  async function main(){
    const db= {
      products:JSON.parse(window.localStorage.getItem("products")) ||
      (await getProducts()),
      cart:JSON.parse(window.localStorage.getItem("cart")) ||{},
    };
    
     printProducts (db);
     handlesShowCart();
     addToCartFromProduct(db);
     printProductsInCart(db);
     handleProductosInCart (db);
     printTotal(db);
     handleTotal(db);
     handlePrintAmountProduct(db);

     
  }

main();
    
