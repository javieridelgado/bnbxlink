if (Meteor.isClient) {
    Template.panelDetail.helpers({
        commentsEnabled: function () {
            var enabled = Session.get("commentsEnabled");

            if (enabled == "Y")
                return true;

            return false;
        }
    });

    Template.panelDetail.events({
        'click #commentPanel': function (event) {
            var enabled;

            event.preventDefault();

            // toggle the commentsEnabled session variable, which is used to control the display of messages.
            enabled = Session.get("commentsEnabled");
            if (enabled == "Y") {
                Session.set("commentsEnabled", "N");
            } else {
                Session.set("commentsEnabled", "Y");
            }
        }
    });
}