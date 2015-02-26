// On Client and Server
if (Meteor.isClient) {
    //Meteor.subscribe("panels");

    Template.allpanels.helpers({
        panels: function () {
            var myUser;

            // We should not show the panels to which the user has subscribed
            var myPanels = Meteor.users.find(Meteor.userId(), {
                    fields: {
                        "panels.panelID": 1
                    }
                })
                .map(function (u) {
                    var idarray = [];

                    if (u.panels) {
                        for (var i = 0; i < u.panels.length; i++)
                            idarray.push(u.panels[i].panelID);
                    }

                    return idarray;
                });

            return BNBLink.Panels.find({
                _id: {
                    $nin: myPanels[0]
                },
                availableForDashboard: true
            });
        }
    });

    Template.srchpanelrslt.events({
        'click #addpanel': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            Meteor.call('addPanel', this._id, Meteor.userId(), function (error, result) {
                if (error)
                    return BNBLink.log(error.reason);

                BNBLink.go('/');
            });
        }
    });

}