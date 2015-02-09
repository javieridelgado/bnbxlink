// On Client and Server
if (Meteor.isClient) {
    //Meteor.subscribe("panels");

    Template.admCollectionsAll.helpers({
        collections: function () {
            return BNBLink.Collections.find({});
        }
    });

    Template.collSearch.events({
        'click #addcollection': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            Router.go('collInsert');
        }
    });

    Template.admCollectionSrch.events({
        'click #delCollection': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.Collections.remove(this._id);
        },

        'click #updCollection': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.log('click panel ' + this._id);
            Router.go("collUpdate", {
                _id: this._id
            });
        }
    });

}