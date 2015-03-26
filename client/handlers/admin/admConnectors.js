if (Meteor.isClient) {
    Template.admConnectorsAll.helpers({
        connectors: function () {
            return BNBLink.Connectors.find({});
        }
    });

    Template.connSearch.events({
        "click #addConnector": function (event) {
            event.preventDefault();
            BNBLink.go("connInsert");
        }
    });

    Template.admConnectorSrch.events({
        "click #delConnector": function (event) {
            event.preventDefault();
            BNBLink.Connectors.remove(this._id);
        },

        "click #updConnector": function (event) {
            event.preventDefault();
            BNBLink.go("connUpdate", {
                _id: this._id
            });
        }
    });

    Template.connectorCRUDbody.rendered = function () {
        // Enable autosize for all text areas
        this.$("textarea").autosize();
    };

    Template.connectorCRUDbody.helpers({
        envID: function () {
            return Session.get("currentEnvironment");
        }
    });

}