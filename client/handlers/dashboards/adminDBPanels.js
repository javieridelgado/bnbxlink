if (Meteor.isClient) {
    Template.adminDBPanels.helpers({
        panelCount: function () {
            return BNBLink.Panels.find().count();
        }
    });
}
