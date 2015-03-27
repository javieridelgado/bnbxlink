if (Meteor.isClient) {

    Template.cPeopleSoftQuery854.helpers({
        c_peoplesoftQuery854Schema: function () {
            return new SimpleSchema({
                urlRESTListeningConnector: {
                    type: String,
                    label: "REST Listening Connector URL",
                    max: 50
                },
                user: {
                    type: String,
                    label: "User"
                },
                password: {
                    type: String,
                    label: "Password"
                },
                query: {
                    type: String,
                    label: "Query",
                    max: 50 /*,
                     custom: function () {
                     if (this.value !== this.field("password").value) {
                     return "passwordMismatch";
                     }
                     }*/
                }
            });
        }
    });

    Template.cPeopleSoftQuery854.events({
        "submit form": function (event, template) {
            var a, o;

            // prevent default submit behaviour
            event.preventDefault();

            // initialize variables
            o = {};
            a = template.$("form").serializeArray();

            // convert to JSON object
            _.forEach(a, function(item) {
                if (o[item.name] !== undefined) {
                    if (!o[item.name].push) {
                        o[item.name] = [o[item.name]];
                    }
                    o[item.name].push(item.value || '');
                } else {
                    o[item.name] = item.value || '';
                }
            });

            // We call a method because the REST service needs to be invoked in the server if later we want
            // to separate the connectors from the rest of the application. This is due to cross domain validations.
            Meteor.call("updateConnectorConfig", "3Qf3bajPFv4Xv63T8", o);
        }
    });

}