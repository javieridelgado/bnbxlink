if (Meteor.isClient) {
    Template.admImportsAll.helpers({
        imports: function () {
            return BNBLink.Imports.find({});
        }
    });

    Template.importSearch.events({
        "click #addImport": function (event) {
            event.preventDefault();
            BNBLink.go("importInsert");
        }
    });

    Template.admImportSrch.events({
        "click #delImport": function (event) {
            event.preventDefault();
            BNBLink.Imports.remove(this._id);
        },

        "click #updImport": function (event) {
            event.preventDefault();
            BNBLink.go("importUpdate", {
                _id: this._id
            });
        }
    });

    Template.importCRUDbody.rendered = function () {
        // Enable autosize for all text areas
        this.$("textarea").autosize();
    };

    Template.importCRUDbody.helpers({
        envID: function () {
            return Session.get("currentEnvironment");
        },

        collectionOptions: function () {
            return BNBLink.Collections.find().map(function (c) {
                return {label: c.name, value: c._id};
            });
        },

        connectorOptions: function () {
            return BNBLink.Connectors.find().map(function (c) {
                return {label: c.name, value: c._id};
            });
        },

        isConnectorConfigurable: function () {
            var connObj, connID;

            connID = AutoForm.getFieldValue("connectorID");
            connObj = BNBLink.Connectors.findOne(connID);

            if (connObj && connObj.urlConfig) {
                return true;
            }

            return false;
        },

        iframeNotLoaded: function () {
            var instance = Template.instance();

            // if the reactivevar has not been defined yet, we should assign the false value
            if (!instance.iFrameLoaded) {
                instance.iFrameLoaded = new ReactiveVar(false);
                instance.iFrameLoaded.set(false);
            }

            return !instance.iFrameLoaded.get();
        }
    });


    Template.importCRUDbody.events({
        "show.bs.modal #configModal": function (event, template) {
            var connObj, connID;
            var configData;
            var loaded;

            // retrieve connector information
            connID = AutoForm.getFieldValue("connectorID");
            connObj = BNBLink.Connectors.findOne(connID);

            // initialize configuration
            configData = this.configuration || {};

            // invoke config web service passing the existing config data and the callback url
            Meteor.http.get(connObj.urlConfig, {data: configData}, function (error, result) {
                if (error)
                    return;

                if (result) {
                    template.$("iframe").attr("src", "http://localhost:3000/connector/view/psQuery854/dd").load(function() {
                        $(this).removeClass("iframe-hide");
                        template.iFrameLoaded.set(true);
                        });
                }
            });
        }
    });


}