if (Meteor.isClient) {
    BNBLink.log("enter subscriptions");

    Meteor.subscribe("userPreferences", function () {
        BNBLink.log("entered subscribe userPreferences");
        //Ground.Collection(Meteor.users);
    });

    Meteor.subscribe("panels", {
        onReady: function () {
            if (!Ground.lookup("panels")) {
                Ground.Collection(BNBLink.Panels, "panels");
            }
        },
        onError: function () {
            BNBLink.log("subscription error");
        }
    });

    Meteor.subscribe("collections", function () {
        BNBLink.log("entered subscribe collections");
        //Ground.Collection(Meteor.users);
    });

    Meteor.subscribe("comments", function () {
        BNBLink.log("entered subscribe collections");
        //Ground.Collection(Meteor.users);
    });

}