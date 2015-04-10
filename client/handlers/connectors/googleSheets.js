if (Meteor.isClient) {

    Template.cGoogleSheets.helpers({
        c_googleSheetsSchema: function () {
            return new SimpleSchema({
                authenticationMethod: {
                    type: String,
                    label: "Authentication Method",
                    defaultValue: this.authenticationMethod,
                    autoform: {
                        options: [
                            {label: "User and Password", value: "user"},
                            {label: "Service Email", value: "service"}
                        ]
                    }
                },
                userEmail: {
                    type: String,
                    label: "User Email",
                    optional: true,
                    defaultValue: this.userEmail
                },
                userPassword: {
                    type: String,
                    label: "User Password",
                    optional: true,
                    defaultValue: this.userPassword
                },
                serviceEmail: {
                    type: String,
                    label: "Service Email",
                    optional: true,
                    defaultValue: this.serviceEmail
                },
                pemFile: {
                    type: String,
                    label: "PEM File",
                    optional: true,
                    defaultValue: this.pemFile
                },
                spreadsheetName: {
                    type: String,
                    label: "Spreadsheet Name",
                    max: 200,
                    defaultValue: this.spreadsheetName
                },
                worksheetName: {
                    type: String,
                    label: "Worksheet Name",
                    defaultValue: this.worksheetName
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
            _.forEach(a, function (item) {
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
            Meteor.call("updateImportConfig", template.data.importID, o);
        }
    });

}