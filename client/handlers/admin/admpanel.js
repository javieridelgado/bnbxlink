// On Client and Server
if (Meteor.isClient) {
    //Meteor.subscribe("panels");
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

            BNBLink.enableCollection(coll);
        },
        
        'change textarea[name="jsonTransformSum"]': function (event) {
            var coll;
            var transform;

            event.preventDefault();

            coll = AutoForm.getFieldValue('admPanelUpd', 'collectionBase');
            transform = event.target.value;

            BNBLink.enableCollection(coll, function () {
                var renderedHTML, template, cursor;

                template = _.template(transform);
                BNBLink.log("callback called");

                cursor = {};
                cursor.values = BNBLink.collections[coll].find().fetch();
                $("textarea[name='cachedHTML']").val(template(cursor));
                /*this.detailHTML = template(cursor);*/
            });
        },

        'change textarea[name="jsonTransformDtl"]': function (event) {
            var coll;
            var transform;

            event.preventDefault();

            coll = AutoForm.getFieldValue('admPanelUpd', 'collectionBase');
            transform = event.target.value;

            BNBLink.enableCollection(coll, function () {
                var renderedHTML, template, cursor;

                template = _.template(transform);
                BNBLink.log("callback called");

                cursor = {};
                cursor.values = BNBLink.collections[coll].find().fetch();
                $("textarea[name='detailHTML']").val(template(cursor));
                /*this.detailHTML = template(cursor);*/
            });
        }
    });
}