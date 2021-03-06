app.config(function($stateProvider){
  $stateProvider.state("shopFront", {
    url: "/shop",
    templateUrl: "js/shop/shop.html",
    controller: "ShopCtrl",
    resolve: {
      Products: function(ShopManagementFactory){
        return ShopManagementFactory.getAllProducts();
      }
    }
  })
})
