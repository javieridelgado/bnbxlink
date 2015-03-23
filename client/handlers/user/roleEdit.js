if (Meteor.isClient) {
  Template.roleEdit.helpers({
    settings: function() {
      return {
        position: "bottom",
        limit: 5,
        rules: [
          {
            token: '',
            collection: Meteor.users,
            field: "_id",
            template: Template.usernameTemplate
          }
        ]
      };
    },
    allUsers: function(){
      //console.log(this._id);
      //var users = {};
      var users = Meteor.users.find({roles: {$in: [this._id]}});
      return users;
    }

  });

  Template.roleEdit.events({
    'click .add-btn': function (event) {
      event.preventDefault();
      var userName = document.getElementById('username');
      //var actualRoles = Meteor.users.findOne({_id:userName.value}).roles;
      //role = roles
      Roles.setUserRoles(userName.value, this._id);
      userName.value = "";
    },
    'click .del-btn': function (event) {
      event.preventDefault();
    }
  });

}