BNBLink.Users = Meteor.users;
BNBLink.Users.emailExists = function (email) {
    console.log("check if user exists");
    //check if EMAIL exists in any env and org
    var reg = '.+:.+:' + email.replace('.', '\\.').replace('@', '\\|');
    if (Meteor.users.find({
            username: {
                $regex: reg
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