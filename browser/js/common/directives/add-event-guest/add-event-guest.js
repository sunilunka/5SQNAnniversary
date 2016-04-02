app.directive("addEventGuest", function(AttendeeEventFactory, $firebaseArray){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/add-event-guest/add-event-guest.html",
    scope: {
      attendee: "=",
      evt: "=",
      guestDetails: "@"
    },
    link: function(scope, element, attrs){
      /* Using firebase array to generate unique key for each guest. */
      let guestArray = AttendeeEventFactory.arrayToModify("attendees/" + scope.attendee.$id + "/events/" + scope.evt.$id)

      scope.addNewGuest = () => {
        if(!scope.guestDetails){
          console.error("NO PLEASE FILL IN THE FORM!")

        } else {
          let guestName = scope.guestDetails.firstName + " " + scope.guestDetails.lastName;
          return guestArray.$add(guestName)
          .then(function(ref){
            AttendeeEventFactory.modifyEventGuestList(scope.evt.$id, scope.attendee.$id).addGuest(ref.key(), guestName);
          })
        }


      }
    }
  }
})
