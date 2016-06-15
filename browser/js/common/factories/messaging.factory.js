app.factory("MessagingFactory", function(DatabaseFactory, $firebaseArray, NotificationService){

  var sessionMessageStoreRef = DatabaseFactory.dbConnection("sessionMessageStore");
  var userSessionsRef = DatabaseFactory.dbConnection("userSessions");
  var sessionUsersRef = DatabaseFactory.dbConnection("sessionUsers");
  var userToUserRef = DatabaseFactory.dbConnection("userToUserMessaging")

  var MessagingFactory = {};

  MessagingFactory.createNewChat = function(participantIds){

    if(!Array.isArray(participantIds)){
      participantIds = [];
      console.log("SORRY, PARTICIPANT ID'S MUST BE IN AN ARRAY!");
      for(var i = 0; i < arguments.length; i++) {
        participantsIds.push(arguments[i]);
      }
    }

    var messageSessionRef = messageStoreRef.push()

    console.log("MESSAGE SESSION REF: ", messageSessionRef.key);
    var mapUsersAndSessions = participantIds.map(function(id){
      var userSessionObj = {};
      /* User session object holds number of unseen messages for user based on their online status */
      userSessionObj[messageSessionRef.key] = 0;
      return userSessionsRef.child(id).update(userSessionObj);
    })

    var mapSessionAndUsers = participantIds.map(function(id){
      return sessionUsersRef.child(messageSessionRef.key).update({
          [id]: true
      })
    })

    var mapUserToUserToSession = participantIds.map(function(id){
      let userMap = {};
      participantIds.forEach(function(peerId){
        if(peerId !== id){
          userMap[peerId] = messageSessionRef.key
        }
      })
      return userToUserRef.update({
        [id]: userMap
      })
    })


    return firebase.Promise.all([
        firebase.Promise.all(mapUsersAndSessions),
        firebase.Promise.all(mapSessionAndUsers),
        firebase.Promise.all(mapUserToUserToSession)
      ])

  }

  MessagingFactory.getSessionMessages = function(sessionId){
    var messages = $firebaseArray(sessionMessageStoreRef.child(sessionId).orderByKey().limitToLast(30));
    return messages.$loaded()
    .then(function(data){
      return data;
    })
  }

  MessagingFactory.checkMessageSessionExists = function(currentUserId, candidateId, callback){
    return userToUserRef.child(currentUserId).orderByKey().equalTo(candidateId)
    .on("value", function(snapshot){
      callback(snapshot);
    })
  },

  MessagingFactory.addNewMessage = function(sessionId, messageObj){
    return sessionMessageStoreRef.child(sessionId)
    .push(messageObj)
  }

  return MessagingFactory;

})
