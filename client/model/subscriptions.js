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

    BNBLink.enableCollection = function (coll, f) {
        // If the collection name is invalid, then we exit
        if (!coll)
            return; /* TODO ERROR */

        // If the collection has already been created, we don't need to call it again
        if (BNBLink.collections[coll]) {
            if (f) f();
            return;
        }

        Meteor.call("declareAndPublishColl", coll, function (error, results) {
            BNBLink.log("callback enablecollection:" + coll);
            if (error)
                BNBLink.log("error detected: " + error);

            if (!BNBLink.collections[coll])
                BNBLink.collections[coll] = new Mongo.Collection(coll);

            // Add subscription if it doesn't exist
            if (BNBLink.subscriptions.indexOf(coll) == -1) {
                BNBLink.log("subscribe collection: " + coll);
                Meteor.subscribe(coll, function () {
                    BNBLink.subscriptions.push(coll);
                    BNBLink.log("subscribed collection: " + coll);
                    BNBLink.log(BNBLink.collections[coll].find().count());

                    // Call callback function
                    if (f) f();
                });
            }
            else {
                // Call callback function
                if (f) f();
            }
        });
    }
}