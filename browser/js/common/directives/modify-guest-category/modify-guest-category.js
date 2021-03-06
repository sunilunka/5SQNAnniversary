app.directive("modifyGuestCategory", function(GuestCategoryFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/modify-guest-category/modify-guest-category.html",
    scope: {
      cat: "="
    },
    link: function(scope, element, attrs){

      scope.isEditing = false;

      scope.modifiableCatObj = {};

      angular.copy(scope.cat, scope.modifiableCatObj)

      scope.toggleEdit = () => {
        scope.isEditing = !scope.isEditing;
        if(!scope.isEditing){
          /* If user cancels editing, revert object to original. */
          angular.copy(scope.cat, scope.modifiableCatObj)
        }
      }

      scope.updateCatName = () => {
        /* Come out of editing mode prior to promise resolving to stop further button pushes. */
        scope.isEditing = !scope.isEditing;
        GuestCategoryFactory.updateGuestCategory(scope.cat.$id, scope.modifiableCatObj.$value)
        .then(function(data){
          /* No data is returned from Firebase update. */
        })
      }

      scope.removeCat = () => {
        scope.isEditing = !scope.isEditing;
        GuestCategoryFactory.removeGuestCategory(scope.cat)
        .then(function(ref){
          console.log("CATEGORY REMOVED: ", ref);
        })
        .catch(function(error){
          console.log("SORRY AND ERROR OCCURED: ", error);
        })
      }
    }
  }
})
