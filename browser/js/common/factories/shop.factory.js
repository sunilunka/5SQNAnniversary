app.factory("ShopFactory", function(DatabaseFactory, ShopManagementFactory, $rootScope){


  var ShopFactory = {};

  var transformProductForDisplay = function(productObj){
    var opts = [];
    if(productObj.hasOwnProperty("options")){
      for(var option in productObj.options){
        opts.push({
          name: option,
          values: productObj.options[option]
        })
      }
    }
    productObj.options = opts;
    return productObj;
  }

  ShopFactory.getProduct = function(productId){
    return ShopManagementFactory.getProduct(productId)
    .then(function(product){
      return transformProductForDisplay(product)
    })
  }

  var shoppingCart = function(){
    this.products = [];
    this.lineItemCount = 0;
    this.totalPrice = "0.00"
  }

  shoppingCart.prototype.calculateLineItemSubtotal = function(product){
    return (parseFloat(product.price) * product.quantity).toFixed(2);
  }

  shoppingCart.prototype.transformToCartItem = function(product, quantity){
    var cartProduct = {};
    angular.copy(product, cartProduct);
    if(cartProduct.hasOwnProperty("product_id")){
      cartProduct.variant_id = cartProduct._id;
    }
    if(cartProduct.hasOwnProperty("variants")){
      /* All products have 'variants' array and options by default.*/
      delete cartProduct.variants
      delete cartProduct.description;
      delete cartProduct.options
      cartProduct.product_id = cartProduct._id;
    }
    /* Mongoose adds the .id field, not required. Duplicate of _id.*/
    delete cartProduct.id;
    delete cartProduct.stock;
    delete cartProduct.imageName;
    cartProduct["quantity"] = quantity;
    cartProduct["subtotal"] = this.calculateLineItemSubtotal(cartProduct);
    return cartProduct;
  }

  shoppingCart.prototype.getLineItemCount = function(){
    if(!this.products.length) {
      this.lineItemCount = 0;
      return;
    }
    if(this.products.length === 1){
      this.lineItemCount =  this.products[0].quantity;
      return;
    } else {
      this.lineItemCount = 0;
      for(var i = 0; i < this.products.length; i++){
        this.lineItemCount += this.products[i].quantity;
      }
    }
  }

  shoppingCart.prototype.cartItemIndex = function(productId){
    return _.findIndex(this.products, function(product){
      return product._id === productId;
    })
  }

  shoppingCart.prototype.calculateTotal = function(){
    var total = 0.00;
    this.products.forEach(function(product){
      total += (product.quantity * (parseFloat(product.price)))
    })
    return total.toFixed(2);
  }

  shoppingCart.prototype.updateCartOnChange = function(){
    this.getLineItemCount();
    this.totalPrice = this.calculateTotal();
  }

  shoppingCart.prototype.addItemToCart = function(productObj, quantity, callback){
    var cartProduct = this.transformToCartItem(productObj, quantity);
    /* First check if product is a variant or not. */
    var cartIndex = this.cartItemIndex(cartProduct._id);

    if(cartIndex > -1){
      this.products[cartIndex].quantity += quantity;
      this.products[cartIndex].subtotal = this.calculateLineItemSubtotal(this.products[cartIndex]);
    } else {
      this.products.push(cartProduct);
    }
    this.updateCartOnChange();
    callback(this);
  }

  shoppingCart.prototype.removeLineItemFromCart = function(productId, callback){
    var productIndex = this.cartItemIndex(productId)
    this.products.splice(productIndex, 1);
    this.updateCartOnChange();
    callback(this);
  }

  shoppingCart.prototype.updateLineItem = function(productId, newQuantity, callback){
    var cartIndex = this.cartItemIndex(productId);
    var productToMod = this.products[cartIndex]

    if(newQuantity <= 0){
      this.removeLineItemFromCart(productToMod._id, function(updatedCart){
        return updatedCart;
      });
    } else {
      productToMod.quantity = newQuantity;
      productToMod.subtotal = this.calculateLineItemSubtotal(productToMod);
    }
    this.updateCartOnChange();
    callback(this)
  }

  ShopFactory.generateCart = function(){
    return new shoppingCart();
  }

  ShopFactory.checkAllDeliverable = function(productArray){
    return productArray.every(function(item){
      return item.deliverable === true;
    })
  }

  ShopFactory.setStockIndicator = function(stock){
    if(stock === 0){
      return "Sorry, this has sold out."
    } else if(stock <= 10){
      return "Very Low"
    } else if((stock > 10) && (stock < 20)){
      return "Low"
    } else {
      return "In Stock"
    }
  }

  return ShopFactory;

})
