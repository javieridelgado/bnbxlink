if (Meteor.isClient) {
    Template.menu.helpers({
        pendingNotifications: function () {
            var nbrOfNotifications;

            // It is not needed to filter by user id, as only the current user documents have been
            // published.
            nbrOfNotifications = BNBLink.Notifications.find().count();

            if (!nbrOfNotifications)
                return "";

            return nbrOfNotifications;
        }
    });

    Template.menu.events({
        'submit form': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.log('search');
        },

        'click #addpanel': function (event) {
            event.preventDefault();
            // This should list the panels still not added by the user and available to him/her
            BNBLink.go("panelSubscribe");
        },

        'click #notifications': function (event) {
            event.preventDefault();
            // This should show the list of notifications
            //BNBLink.log("BNBLink.Panels count: " + BNBLink.Panels.find().count() + "-" + "Meteor.users count: " + Meteor.users.find().count());
            alert("BNBLink.Panels count: " + BNBLink.Panels.find().count());
            alert("Meteor.users count: " + Meteor.users.find().count());
            alert("Meteor.users panels: " + Meteor.users.find().fetch()[0].panels);
        },

        'click #preferences': function (event) {
            event.preventDefault();
            // This should show a preferences dialog
            alert("preferences");
        },

        'click #admpanel': function (event) {
            event.preventDefault();
            // This should show a preferences dialog
            BNBLink.go('panelSearch');
        },

        'click #admCollections': function (event) {
            event.preventDefault();
            // This should show a preferences dialog
            BNBLink.go('collSearch');
        },

        'click #testOption': function (event) {
            Meteor.call("pullAllSteps", function (error, results) {
                console.log(results); //results.data should be a JSON object
            });
        },

        'click #signout': function (event) {
            event.preventDefault();
            Meteor.logout(function (error) {
                if (error) {
                    // Display the logout error to the user however you want
                    BNBLink.log("signout error");
                }
            });
        }
    });

    Template.menudetail.helpers({
        detailPage: function () {
            return Session.get("nav.detailPage");
        }
    });

    Template.menudetail.events({
        'click #back': function (event) {
            event.preventDefault();
            // This should list the panels still not added by the user and available to him/her
            //Router.go("/");
            BNBLink.goBack();
        },
    });
}