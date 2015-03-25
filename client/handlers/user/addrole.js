if (Meteor.isClient) {
  Template.roles.helpers({
    allRoles: function(){
      var rolesObj = Roles.getAllRoles().fetch();
      rolesObj.forEach(function(role){
        role.nUsers = Meteor.users.find({roles: {$in: [role._id]}}).count();
      });
      return rolesObj;
    }
  });

  Template.roles.events({
    'click .add-btn': function (event) {
      event.preventDefault();
      var roleName = document.getElementById('addRole');
      Roles.createRole(roleName.value);
      roleName.value = "";
    },

    'click .del-btn': function(event) {
      event.preventDefault();
      Meteor.roles.remove({_id: event.target.value});
    }
  });
}