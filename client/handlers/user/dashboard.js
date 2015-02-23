// This only runs on the client
if (Meteor.isClient) {
    Template.dashboard.helpers({
        panels: function () {
            var myUser;

            // We should only show the panels to which the user has subscribed
            BNBLink.log('dasboard.h.panels: entered');
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

            for (var i = 0; i < myPanels[0].length; i++)
                BNBLink.log('dashboard panel: ' + myPanels[0][i]);

            return BNBLink.Panels.find({
                _id: {
                    $in: myPanels[0]
                }
            });
        },

        sortableOptions: function () {
            return {
                ghostClass: "ghost"
                /*draggable: "#dashboard"*/
            };
        }
    });

    var mySchema = new SimpleSchema({
        name: {
            type: String,
            label: "Your name",
            max: 50
        },
        email: {
            type: String,
            regEx: SimpleSchema.RegEx.Email,
            label: "E-mail address"
        },
        message: {
            type: String,
            label: "Message",
            max: 1000
        }
    });

    var fieldArray = [{fieldName: "name"}, {fieldName: "email"}, {fieldName: "message"}];


    Template.panelInput.helpers({
        fields: function () {
            return fieldArray;
        },

        /*fieldName: function () {
         return "name";
         },*/

        contactFormSchema: function () {
            return new SimpleSchema({
                name: {
                    type: String,
                    label: "Your name",
                    max: 50
                },
                email: {
                    type: String,
                    regEx: SimpleSchema.RegEx.Email,
                    label: "E-mail address"
                },
                message: {
                    type: String,
                    label: "Message",
                    max: 1000
                }
            });
        }
    });
}