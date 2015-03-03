Meteor.methods({
    saveForm: function (coll, id, data) {
        var myColl, isUpdate;

        BNBLink.log("data to be processed: " + JSON.stringify(data));
        BNBLink.log("collection: " + coll);
        myColl = BNBLink.collections[coll];
        isUpdate = false;

        // If an id was provided, then look for the existing value to check if it is an update
        if (id) {
            isUpdate = myColl.find({_id: id}).count() > 0;
        }

        if (isUpdate) {
            myColl.update({_id: id}, {$set: data});
        } else {
            myColl.insert(data);
        }

        return "something";
    }
});
