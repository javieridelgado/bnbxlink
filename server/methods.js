// This module contains the server only methods
Meteor.methods({
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
        data.forEach(function(item) {
            myCollection.insert(item);
        });
        
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