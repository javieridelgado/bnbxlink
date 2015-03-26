// this function is used to check whether user collections are to be kept offline or not
BNBLink.isOfflineCollection = function (coll) {
    var collName = coll.substring(1);  // take the leading z out of the name
    var collData;

    console.log("isOfflineCollection start: " + coll);

    collData = BNBLink.Collections.findOne({name: collName});
    if (collData)
        return collData.availableOffline;

    return false;
}

