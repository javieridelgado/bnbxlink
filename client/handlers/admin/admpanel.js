// Utility functions
var renderPanel = function(coll, transform, f) {
    BNBLink.enableCollection(coll, function () {
        var renderedHTML, template, cursor;

        // create transform engine instance
        template = _.template(transform);

        // create data
        cursor = {};
        cursor.values = BNBLink.collections[coll].find().fetch();

        // callback function
        if (f) f(template(cursor));
    });
}

if (Meteor.isClient) {

    Template.admPanelAll.helpers({
        panels: function () {
            return BNBLink.Panels.find({});
        }
    });

    Template.panelSearch.events({
        "click #addpanel": function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.go("panelInsert");
        }
    });

    Template.admPanelSrch.events({
        'click #delpanel': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.Panels.remove(this._id);
        },

        'click #updpanel': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.log('click panel ' + this._id);
            BNBLink.go("panelUpdate", {
                _id: this._id
            });
        }
    });

    // panelCRUDbody template


    Template.panelCRUDbody.rendered = function () {
        // set all text areas to autosize
        $("textarea").autosize();

        // set preview area
        $("div#htmlSum").hide();
        //$("div#previewSum").hide();
    };

    Template.panelCRUDbody.helpers({
        envID: function () {
            return Session.get("currentEnvironment");
        }
    });

    Template.panelCRUDbody.helpers({
        renderedHTML: function () {
            var coll, transform;
            var template;

            // TODO this should be only applicable to HTML panels
            // retrieve collection and transform values. These are reactive methods, so this helper will
            // be automatically refreshed each time one of the two values changes.
            coll = AutoForm.getFieldValue("collectionBase");
            if (!coll)
                return "";

            transform = AutoForm.getFieldValue("jsonTransformSum");
            if (!transform)
                return "";

            // enable collection
            BNBLink.enableCollection(coll);

            // create template instance
            template = _.template(transform);

            cursor = {};
            cursor.values = BNBLink.collections[coll].find().fetch();

                return template(cursor);
        }
    });

    Template.panelCRUDbody.events({
        'change input[name="collectionBase"]': function (event) {
            var coll;

            coll = event.target.value;

            BNBLink.log("enter coll" + event.target.value);
            event.preventDefault();

            BNBLink.enableCollection(coll);
        },

        "click button#refreshHTML": function(event) {
            $("div#htmlSum").show();
            $("div#previewSum").hide();
        },

        "click button#refreshPreview": function(event) {
            $("div#htmlSum").hide();
            $("div#previewSum").show();
        } /*,

        'change textarea[name="jsonTransformSum"]': function (event) {
            var coll;
            var transform;

            event.preventDefault();

            coll = AutoForm.getFieldValue('admPanelForm', 'collectionBase');
            transform = event.target.value;

            BNBLink.enableCollection(coll, function () {
                var renderedHTML, template, cursor;

                template = _.template(transform);
                BNBLink.log("callback called");

                cursor = {};
                cursor.values = BNBLink.collections[coll].find().fetch();
                $("textarea[name='cachedHTML']").val(template(cursor));
            });
        }*/
    });
}