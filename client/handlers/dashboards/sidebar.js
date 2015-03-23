if (Meteor.isClient) {

    Template.sidebar.events({
        "click #dbCollections": function (event, template) {
            Session.set("currentDashboard", "collections");
            event.preventDefault();
        },

        "click #dbPanels": function (event, template) {
            Session.set("currentDashboard", "panels");
            event.preventDefault();
        },

        "click #dbOrganization": function (event, template) {
            Session.set("currentDashboard", "organization");
            event.preventDefault();
        },

        "click #dbSecurity": function (event, template) {
            Session.set("currentDashboard", "security");
            event.preventDefault();
        },

        "click #dbIntegration": function (event, template) {
            Session.set("currentDashboard", "integration");
            event.preventDefault();
        }
    });
}