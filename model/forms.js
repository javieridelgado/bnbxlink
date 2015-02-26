Meteor.methods({
    saveForm: function (coll, data) {
        var myColl, id, isUpdate;

        console.log("data to be processed: " + JSON.stringify(data));
        console.log("collection: " + coll);
        myColl = BNBLink.collections[coll];
        id = data._id;
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
