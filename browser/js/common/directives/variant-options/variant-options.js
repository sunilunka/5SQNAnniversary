app.directive("variantOptions", function(){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/variant-options/variant-options.html",
    scope: {
      variant: "=",
      options: "="
    },
    link: function(scope, element, attrs){
      console.log("SCOPE VARIANT: ", scope.variant);

      scope.label = "Edit"

      scope.editInProgress = false;

      scope.toggleEdit = function(event){
        event.preventDefault();
        event.stopPropagation();
        if(!scope.editInProgress){
          scope.editInProgress = true;
          scope.label = "Save";
        } else {
          scope.editInProgress = false;
          scope.label = "Edit";
        }
      }

      scope.removeVariant = function(event){
        event.preventDefault();
        _.pull(scope.$parent.newProduct.variants, scope.variant);
      }
    }
  }
})