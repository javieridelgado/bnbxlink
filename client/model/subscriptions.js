var orgID;

if (Meteor.isClient) {

    Meteor.subscribe("userPreferences", function () {
        BNBLink.log("entered subscribe userPreferences");
        //Ground.Collection(Meteor.users);
    });

    Meteor.subscribe("notifications", {
        onReady: function () {
            if (!Ground.lookup("notifications")) {
                Ground.Collection(BNBLink.Notifications, "notifications");
            }
        },
        onError: function () {
            BNBLink.log("subscription error");
        }
    });

    Tracker.autorun(function () {
        var envID;

        envID = Session.get("currentEnvironment");

        Meteor.subscribe("collections", envID, {
            onReady: function () {
                if (!Ground.lookup("collections")) {
                    Ground.Collection(BNBLink.Collections, "collections");
                }
            },
            onError: function () {
                BNBLink.log("subscription error");
            }
        });

        Meteor.subscribe("panels", envID, {
            onReady: function () {
                if (!Ground.lookup("panels")) {
                    console.log("grounding panels");
                    Ground.Collection(BNBLink.Panels, "panels");
                }
            },
            onError: function () {
                BNBLink.log("subscription error");
            }
        });
    });

    Meteor.subscribe("comments", function () {
        BNBLink.log("entered subscribe collections");
        //Ground.Collection(Meteor.users);
    });

    Meteor.subscribe("environments", function () {
        BNBLink.log("entered subscribe environments");
        //Ground.Collection(Meteor.users);
    });

    BNBLink.enableCollection = function (coll, f) {
        console.log("enableCollection start: " + coll);

        // If the collection name is invalid, then we exit
        if (!coll)
            return;
        /* TODO ERROR */

        // If the collection has already been created, we don't need to call it again
        if (BNBLink.collections[coll]) {
            if (f) f();
            return;
        }

        if (Meteor.status().connected) {
            // we first need to declare the collection at the server side
            Meteor.call("declareAndPublishColl", coll, function (error, results) {
                BNBLink.log("callback enablecollection:" + coll);
                if (error)
                    BNBLink.log("error detected: " + error);

                // declare the collection on the client side
                if (!BNBLink.collections[coll]) {
                    if (BNBLink.isOfflineCollection(coll)) {
                        BNBLink.collections[coll] = new Ground.Collection(coll);
                        console.log("declared as offline (connected):" + coll + " with this number of records: " + BNBLink.collections[coll].find().count());
                    } else {
                        BNBLink.collections[coll] = new Mongo.Collection(coll);
                        console.log("declared as online (connected):" + coll + " with this number of records: " + BNBLink.collections[coll].find().count());
                    }
                }

                // Add subscription if it doesn't exist
                if (BNBLink.subscriptions.indexOf(coll) == -1) {
                    BNBLink.log("subscribe collection: " + coll);
                    Meteor.subscribe(coll, {
                        onReady: function () {
                            BNBLink.subscriptions.push(coll);

                            // make the collection available offline
                            if (BNBLink.isOfflineCollection(coll)) {
                                console.log(coll + " is an offline collection");
                                if (!Ground.lookup(coll)) {
                                    console.log("grounding " + coll + " after subscription");
                                    Ground.Collection(BNBLink.collections[coll], coll);
                                } else {
                                    // TODO -  check - in some cases, this flag is not set, causing the information not be available offline
                                    //BNBLink.collections[coll].gronddb._databaseLoaded = true;
                                    console.log("after subscription of " + coll + ", the loaded status is: " + BNBLink.collections[coll].grounddb._databaseLoaded);
                                }
                            }

                            // Call callback function
                            if (f) f();
                        },
                        onError: function () {
                            BNBLink.log("subscription error");
                        }
                    });
                } else {
                    // Call callback function
                    if (f) f();
                }
            });
        } else {
            // declare the collection on the client side
            if (!BNBLink.collections[coll]) {
                if (BNBLink.isOfflineCollection(coll)) {
                    BNBLink.collections[coll] = new Ground.Collection(coll);
                    console.log("declared as offline:" + coll + " with this number of records: " + BNBLink.collections[coll].find().count());
                } else {
                    BNBLink.collections[coll] = new Mongo.Collection(coll);
                    console.log("declared as online:" + coll + " with this number of records: " + BNBLink.collections[coll].find().count());
                }
            }
        }
    }
}