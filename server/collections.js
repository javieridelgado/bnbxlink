if (Meteor.isServer) {
    BNBLink.getCollectionName = function (orgID, envID, coll) {
        return orgID + "_" + envID + "_" + coll;
    }

    BNBLink.declareCollection = function (collName, orgID, envID) {
        var coll;

        // build the bundled collection name
        coll = BNBLink.getCollectionName(orgID, envID, collName);

        // First check if the collection is already declared. If not, create it.
        if (!BNBLink.collections[coll]) {
            if (BNBLink.collectionExists(orgID, envID, collName)) {
                if (BNBLink.isOfflineCollection(orgID, envID, collName)) {
                    BNBLink.collections[coll] = new Ground.Collection(coll);
                    console.log("declared as offline:" + coll);
                } else {
                    BNBLink.collections[coll] = new Mongo.Collection(coll);
                    console.log("declared as online:" + coll);
                }
            }
        }

        return BNBLink.collections[coll];
    }

    // this function is used to check whether user collections are to be kept offline or not
    BNBLink.collectionExists = function (org, env, coll) {
        var collData;

        collData = BNBLink.Collections.findOne({name: coll, orgID: org, envID: env});
        if (collData)
            return true;

        return false;
    }

    // this function is used to check whether user collections are to be kept offline or not
    BNBLink.isOfflineCollection = function (org, env, coll) {
        var collData;

        collData = BNBLink.Collections.findOne({name: coll, orgID: org, envID: env});
        if (collData)
            return collData.availableOffline;

        return false;
    }

}