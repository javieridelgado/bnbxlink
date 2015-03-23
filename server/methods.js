// This module contains the server only methods
Meteor.methods({
    customLogin: function (userId, userPswd) {
        Meteor.loginWithPassword(
            userId,
            userPswd,
            function (error) {
                if (error) {
                    Session.set("login.error", "Wrong user name and/or password.");
                } else {
                    // TODO record last login date
                    Session.set("login.error", null);
                }
            }
        );

        return "";
    },


    declareAndPublishColl: function (coll) {
        var collName;

        // do not declare collection if organization does not exists
        if (!BNBLink.currentOrgID) {
            // TODO error
            return;
        }

        // First check if the collection is already declared. If not, create it.
        BNBLink.log("entered declareAndPublish:" + coll);
        if (!BNBLink.collections[coll]) {
            if (BNBLink.isOfflineCollection(coll)) {
                BNBLink.collections[coll] = new Ground.Collection(coll);
                console.log("declared as offline:" + coll);
            } else {
                BNBLink.collections[coll] = new Mongo.Collection(coll);
                console.log("declared as online:" + coll);
            }
        }

        // Once the collection is created, make sure it is published.
        if (BNBLink.publications.indexOf(coll) == -1) {
            BNBLink.log('marking collection as published: ' + coll);
            Meteor.publish(coll, function () {
                return BNBLink.collections[coll].find({});
            });
            BNBLink.publications.push(coll); // mark the collection as published
        }

        return "";
    },


    populateCollection: function (coll, data, flush) {
        // First check if the collection is already declared. If not, create it.
        var myCollection;

        BNBLink.log("entered populateCollection:" + coll);
        if (!BNBLink.collections[coll]) {
            myCollection = new Mongo.Collection(coll);
            BNBLink.collections[coll] = myCollection;
        }

        // If flush, then delete the information
        if (flush)
            myCollection.remove({});

        // Once the collection is created, fill in the data.
        data.forEach(function (item) {
            myCollection.insert(item);
        });

        return "";
    },

    testCall: function (url, params, user, password) {
        var svcResult, result;

        try {
            svcResult = HTTP.call("GET", url + params, {
                auth: user + ":" + password
            });
            result = xml2js.parseStringSync(svcResult.content, {
                attrkey: "a",
                explicitArray: false
            });

            result = result.QAS_LISTQUERY_RESP_MSG.QAS_LISTQUERY_RESP;
            return JSON.stringify(result);
            //return svcResult.content;
        } catch (e) {
            return "error";
        }

        return "";
    },

    psGetQueries: function (url, user, password, prefix) {
        /* Set connector parameters */
        BNBLink.connectors.peoplesoftQuery854.url = url;
        BNBLink.connectors.peoplesoftQuery854.user = user;
        BNBLink.connectors.peoplesoftQuery854.password = password;

        /* Call connector method */
        return BNBLink.connectors.peoplesoftQuery854.getQueries(prefix);
    },

    psRunQuery: function (url, user, password, query) {
        /* Set connector parameters */
        BNBLink.connectors.peoplesoftQuery854.url = url;
        BNBLink.connectors.peoplesoftQuery854.user = user;
        BNBLink.connectors.peoplesoftQuery854.password = password;

        /* Call connector method */
        return JSON.stringify(BNBLink.connectors.peoplesoftQuery854.run(query));
    },

    psSaveQuery: function (url, user, password, query, collection) {
        var info, collName, dbColl;

        /* Set connector parameters */
        BNBLink.connectors.peoplesoftQuery854.url = url;
        BNBLink.connectors.peoplesoftQuery854.user = user;
        BNBLink.connectors.peoplesoftQuery854.password = password;

        /* Call connector method */
        info = BNBLink.connectors.peoplesoftQuery854.run(query);

        /* Initialize collection */
        collName = "z" + collection;
        if (!BNBLink.collections[collName]) {
            BNBLink.collections[collName] = new Mongo.Collection(collName);
        }
        dbColl = BNBLink.collections[collName];
        dbColl.remove({});


        if (!info)
            return "error";

        /* Insert each item array into the collection */
        info.forEach(function (item) {
            dbColl.insert(item);
        });

        return JSON.stringify(info);
    },

    checkTwitter: function () {
        var dbColl;
        var listInfo, listInfoJSON, detailInfo, detailInfoJSON;
        var collName;
        var result, result2;

        //this.unblock();

        // Initialise collection 
        collName = "ifadCustomers";
        dbColl = new Mongo.Collection(collName);
        dbColl.remove({});

        // First retrieve the list of customers
        listInfo = Meteor.http.call("GET", "http://www.thomas-bayer.com/sqlrest/CUSTOMER/");
        BNBLink.log(listInfo);

        // Convert list to JSON
        result = xml2js.parseStringSync(listInfo.content, {
            attrkey: "a",
            explicitArray: false
        });

        BNBLink.log(result);

        result.CUSTOMERList.CUSTOMER.forEach(function (item) {
            detailInfo = Meteor.http.call("GET", item.a["xlink:href"]);
            BNBLink.log(detailInfo);

            result2 = xml2js.parseString(detailInfo.content, {
                attrkey: "a",
                explicitArray: false
            }, function (err, result) {
                BNBLink.log(result);
                dbColl.insert(result.CUSTOMER);
            });
        });
    }
});