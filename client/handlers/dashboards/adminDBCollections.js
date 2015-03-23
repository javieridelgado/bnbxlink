if (Meteor.isClient) {
    Template.adminDBCollections.helpers({
        collectionCount: function () {
            return BNBLink.Collections.find().count();
        }
    });
}
