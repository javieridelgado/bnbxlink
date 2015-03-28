if (Meteor.isClient) {

    Template.cGoogleSheets.helpers({
        c_googleSheetsSchema: function () {
            return new SimpleSchema({
                spreadsheetName: {
                    type: String,
                    label: "Spreadsheet Name",
                    max: 200,
                    defaultValue: this.spreadsheetName
                },
                serviceEmail: {
                    type: String,
                    label: "Service Email",
                    max: 200,
                    defaultValue: this.serviceEmail
                },
                worksheetId: {
                    type: String,
                    label: "Worksheet ID",
                    defaultValue: this.worksheetId
                },
                range: {
                    type: String,
                    label: "Range",
                    max: 50,
                    defaultValue: this.range
                },
                containsHeader: {
                    type: Boolean,
                    label: "Contains Header",
                    defaultValue: this.containsHeader
                }
            });
        }
    });

    Template.cGoogleSheets.events({
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
            // TODO
            Meteor.call("updateConnectorConfig", template.data.connectorID, o);
        }
    });

}