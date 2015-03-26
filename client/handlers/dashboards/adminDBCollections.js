if (Meteor.isClient) {
    Template.adminDBCollections.helpers({
        collectionCount: function () {
            return BNBLink.Collections.find().count();
        },

        importCount: function () {
            return BNBLink.Imports.find().count();
        }

    });
}
