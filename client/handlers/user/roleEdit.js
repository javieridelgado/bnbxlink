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
      console.log(this._id);
      var userName = document.getElementById('username');
      if(event.target.value !== ""){
        var actualRoles = Meteor.users.findOne({_id:userName.value}).roles;
        if(actualRoles.indexOf(this._id) < 0){
          actualRoles.push(this._id);
          Meteor.users.update({_id: userName.value}, {$set:{roles: actualRoles}});
        }
        userName.value = "";
      }
    },
    'click .del-btn': function (event) {
      event.preventDefault();
      Meteor.users.update({_id: this._id},
        {$pull: {roles: event.target.value} });
    }
  });

}
