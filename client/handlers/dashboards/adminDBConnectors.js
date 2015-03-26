if (Meteor.isClient) {
    Template.adminDBIntegration.helpers({
        connectorCount: function () {
            return BNBLink.Connectors.find().count();
        }
    });
}
