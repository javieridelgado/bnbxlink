// On Client and Server
if (Meteor.isClient) {
    //Meteor.subscribe("panels");
    function enableCollection(coll, f) {
        Meteor.call("declareAndPublishColl", coll, function (error, results) {
            if (error)
                BNBLink.log("error detected: " + error);

            if (!BNBLink[coll])
                BNBLink[coll] = new Meteor.Collection(coll);

            Meteor.subscribe("coll" + coll, function () {
                BNBLink.log("subscribed collection: " + coll);
                BNBLink.log(BNBLink[coll].find().count());

                // Call callback function
                if (f) f();
            });
        });
    }

    Template.admPanelAll.helpers({
        panels: function () {
            return BNBLink.Panels.find({});
        }
    });

    Template.panelSearch.events({
        'click #addpanel': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            Router.go('panelInsert');
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
            Router.go("panelUpdate", {
                _id: this._id
            });
        }
    });

    Template.panelUpdate.rendered = function () {
        $('textarea').autosize();
    };

    Template.panelUpdate.events({
        'change input[name="collectionBase"]': function (event) {
            var coll;

            coll = event.target.value;

            BNBLink.log("enter coll" + event.target.value);
            event.preventDefault();

            enableCollection(coll);
        },

        'change textarea[name="jsonTransformDtl"]': function (event) {
            var coll;
            var transform;

            event.preventDefault();

            coll = AutoForm.getFieldValue('admPanelUpd', 'collectionBase');
            transform = event.target.value;

            enableCollection(coll, function () {
                var renderedHTML, template, cursor;

                template = _.template(transform);
                BNBLink.log("callback called");

                cursor = {};
                cursor.values = BNBLink[coll].find().fetch();
                $("textarea[name='detailHTML']").val(template(cursor));
                /*this.detailHTML = template(cursor);*/
                /*$("textarea[name='detailHTML']").text(json2html.transform(BNBLink[coll].find().fetch(), transform));*/
            });
        }
    });
}