if (Meteor.isClient) {
  Template.roles.helpers({
    allRoles: function(){
      return Roles.getAllRoles().fetch();
    }
  });

  Template.roles.events({
    'click .add-btn': function (event) {
      event.preventDefault();
      var roleName = document.getElementById('addRole');
      Roles.createRole(roleName.value);
      roleName.value = "";
    }
  });
}