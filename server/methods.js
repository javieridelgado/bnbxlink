// This module contains the server only methods
Meteor.methods({
    customLogin: function (userId, userPswd) {
        Meteor.loginWithPassword(
            userId,
            userPswd,
            function (error) {
                if (error) {
                    Session.set("login.error", "Wrong user name and/or password.");
                } else  {
                    // TODO record last login date
                    Session.set("login.error", null);
                }
            }
        );
        
        return "";
    },

    declareAndPublishColl: function (coll) {
        // First check if the collection is already declared. If not, create it.
        BNBLink.log("entered declareAndPublish:" + coll)
        if (!BNBLink[coll])
            BNBLink[coll] = new Meteor.Collection(coll);

        // Once the collection is created, make sure it is published.
        if (!BNBLink['pub' + coll]) {
            BNBLink.log('marking collection as published: ' + coll);
            BNBLink['pub' + coll] = true; // mark the collection as published
            Meteor.publish('coll' + coll, function () {
                return BNBLink[coll].find({});
            });
        };

        return "";
    },

    populateCollection: function (coll, data, flush) {
        // First check if the collection is already declared. If not, create it.
        var myCollection;

        BNBLink.log("entered populateCollection:" + coll)
        if (!BNBLink[coll]) {
            myCollection = new Meteor.Collection(coll);
            BNBLink[coll] = myCollection;
        }

        // If flush, then delete the information
        if (flush)
            myCollection.remove({});

        // Once the collection is created, fill in the date.
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
            BNBLink.debug = svcResult;
            return JSON.stringify(result);
            //return svcResult.content;
        } catch (e) {
            BNBLink.debug = e;
            return "error";
        }

        return "";
    },

    psGetQueries: function (url, user, password, prefix) {
        var svcResult, svcObject, params, result;
        var parseStringSync;

        try {
            if (prefix)
                params = "ListQuery.v1/public/listquery?search=" + prefix + "&maxrows=1000&isconnectedquery=N";
            else
                params = "ListQuery.v1/public/listquery?search=&maxrows=1000&isconnectedquery=N";

            // Call PeopleSoft REST web service
            svcResult = HTTP.call("GET", url + params, {
                auth: user + ":" + password
            });

            // Convert PeopleSoft's XML response to JSON
            parseStringSync = Meteor.wrapAsync(xml2js.parseString, xml2js);

            // We use our own wrapped parseStringSync because the xml2js.parseStringSync
            // function does not seem to work when called twice
            svcObject = parseStringSync(svcResult.content, {
                attrkey: "a",
                explicitArray: false
            });
            BNBLink.debug = svcObject;

            // Retrieve queries array
            result = svcObject.QAS_LISTQUERY_RESP_MSG.QAS_LISTQUERY_RESP.map(function (item) {
                console.log(JSON.stringify(item.PTQASWRK));
                return {
                    label: item.PTQASWRK.QueryName + "-" + item.PTQASWRK.Description,
                    value: item.PTQASWRK.QueryName
                }
            });

            //BNBLink.debug = result;
            //return JSON.stringify(result);
            return result;
        } catch (e) {
            BNBLink.debug = e;
            return "error";
        }

        return "";
    },

    psRunQuery: function (url, user, password, query) {
        var svcResult, svcObject, params, result;
        var parseStringSync, columns, root;

        try {
            // http://192.168.59.103:8000/PSIGW/RESTListeningConnector/PSFT_HR/ExecuteQuery.v1/public/QAS_TST_MSGSETS/WEBROWSET/NONFILE?isconnectedquery=N&maxrows=100
            params = "ExecuteQuery.v1/public/" + query + "/WEBROWSET/NONFILE?isconnectedquery=N&maxrows=100";
            console.log(url + params);
            // Call PeopleSoft REST web service
            svcResult = HTTP.call("GET", url + params, {
                auth: user + ":" + password
            });

            // Convert PeopleSoft's XML response to JSON
            parseStringSync = Meteor.wrapAsync(xml2js.parseString, xml2js);
            // We use our own wrapped parseStringSync because the xml2js.parseStringSync
            // function does not seem to work when called twice
            svcObject = parseStringSync(svcResult.content, {
                attrkey: "a",
                explicitArray: false
            });
            root = svcObject.QAS_GETQUERYRESULTS_RESP_MSG.webRowSet;
            columns = root.metadata["column-definition"];
            result = root.data.currentRow.map(function (item) {
                var rowData = {};
                var i;

                for (i = 0; i < item.columnValue.length; i++) {
                    rowData[columns[i]["column-name"]] = item.columnValue[i];
                };

                return rowData;
            });

            BNBLink.debug2 = result;
            BNBLink.debug = svcObject.QAS_GETQUERYRESULTS_RESP_MSG.webRowSet;

            // Retrieve queries array
            /*result = svcObject.QAS_LISTQUERY_RESP_MSG.QAS_LISTQUERY_RESP.map(function (item) {
                console.log(JSON.stringify(item.PTQASWRK));
                return {
                    label: item.PTQASWRK.QueryName + "-" + item.PTQASWRK.Description,
                    value: item.PTQASWRK.QueryName
                }
            });*/

            //BNBLink.debug = result;
            return JSON.stringify(result);
            //return result;
        } catch (e) {
            BNBLink.debug = e;
            return "error";
        }

        return "";
    },

    checkTwitter: function () {
        var dbColl;
        var listInfo, listInfoJSON, detailInfo, detailInfoJSON;
        var collName;
        var result, result2;

        //this.unblock();

        // Initialise collection 
        collName = "ifadCustomers";
        dbColl = new Meteor.Collection(collName);
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