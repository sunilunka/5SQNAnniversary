app.config(function($stateProvider){
  $stateProvider.state("newAttendee", {
    url: "/attendees/register",
    controller: "NewAttendeeCtrl",
    templateUrl: "js/new-attendee/new-attendee.html",
    resolve: {
      Events: function(EventFactory){
        return EventFactory.getEvents();
      },
      categories: function(GuestCategoryFactory){
        return GuestCategoryFactory.getGuestCategories();
      },

      platforms: function(PlatformsFactory){
        return PlatformsFactory.getPlatforms();
      }
    }
  })
  .state("newAttendee.email", {
    url: "/email",
    controller: "NewAttendeeEmailCtrl",
    templateUrl: "js/new-attendee/new-attendee-email.html"
  })
  .state("newAttendee.externalProvider", {
    url: "/:provider",
    controller: "NewAttendeeExternalCtrl",
    templateUrl: "js/new-attendee/new-attendee-external.html"
  })
})
