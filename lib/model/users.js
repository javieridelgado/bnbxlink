BNBLink.Users = Meteor.users;
BNBLink.Users.emailExists = function (email) {
    console.log("check if user exists");
    if (Meteor.users.find({
            emails: {
                $elemMatch: {
                    address: email
                }
            }
        }).
            count() > 0
    ) {
        return true;
    }

    return false;
}

Meteor.methods({
    // check if a given email address exists or not
    userEmailExists: function (email) {
        return BNBLink.Users.emailExists(email);
    }
});


//Revisar esto!

Meteor.users.allow({
      'insert': function () {
          return true; 
      },
      'update': function () {
          return true; 
      },
      'remove': function(){
          return true;
      }
    });