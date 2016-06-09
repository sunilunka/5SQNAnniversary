app.directive("eventModification", function(EventFactory, $rootScope){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/event-modification/event-modification.html",
    scope: {
      evt: "=",
      categories: "="
    },

    link: function(scope, element, attrs){

      console.log("EVENT: ", scope.evt);
      scope.modifiedEntry = {};
      /* Boolean to show or hide edit mode form for specific announcement */
      scope.editMode = false;

      scope.editOption = "Edit";

      scope.guestLimits = {
        displayMenu: false,
        buttonText: "Add"
      }

      scope.toggleGuestLimits = () => {
        scope.guestLimits.displayMenu = !scope.guestLimits.displayMenu;
        if(scope.guestLimits.displayMenu){
          scope.guestLimits.buttonText = "Cancel";
        } else {
          scope.guestLimits.buttonText = "Add";
        }
      }


      /* Method to remove event from Firebase DB */
      scope.removeEvent = EventFactory.removeEvent;

      scope.toggleEditMode = () => {
        scope.editMode = !scope.editMode;
        scope.editOption = (scope.editOption === "Edit" ? "Cancel Edit" : "Edit")
        /* scope.editMode will be toggled to false if the use has cancelled the edit. So revert the scope.announcement object to the original version. */
        return;
      }
    }
  }
})
