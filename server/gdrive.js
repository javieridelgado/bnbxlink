Meteor.methods({
    pullAllSteps: function () {
        var Steps = new Mongo.Collection("gdrivetest")
        var spreadsheetName = "PSoft - Pipeline 2015 - BNBLink";
        var serviceEmail = '339090873438-nmtkgs3lrehnkmht22c4h9vrlah3v53s@developer.gserviceaccount.com';

        var result = Meteor.call("spreadsheet/fetch2", spreadsheetName, 1, {email: serviceEmail});

        // Remove all existing
        Steps.remove({});

        // Gather property names
        var propNames = {};
        _.each(result.rows, function (rowCells, rowNum) {
            var doc = {};
            _.each(rowCells, function (val, colNum) {
                if (+rowNum === 1) {
                    propNames[colNum] = val;
                } else {
                    var propName = propNames[colNum];
                    if (propName) {
                        doc[propName] = val;
                    }
                }
            });
            if (+rowNum > 1) {
                Steps.insert(doc);
            }
        });
    },

    psrDemo: function () {
        var projects = new Mongo.Collection("zProjects");
        var reports = new Mongo.Collection("zReports");
        var spreadsheetName = "IFADMobileProjects";
        var serviceEmail = '339090873438-nmtkgs3lrehnkmht22c4h9vrlah3v53s@developer.gserviceaccount.com';
        var result = Meteor.call("spreadsheet/fetch2", spreadsheetName, 1, {email: serviceEmail});
        var propNames;

        // Remove all existing projects
        projects.remove({});
        reports.remove({});

        // Gather property names
        var propNames = {};
        _.each(result.rows, function (rowCells, rowNum) {
            var doc = {};
            _.each(rowCells, function (val, colNum) {
                if (+rowNum === 1) {
                    propNames[colNum] = val;
                } else {
                    var propName = propNames[colNum];
                    if (propName) {
                        doc[propName] = val;
                    }
                }
            });
            if (+rowNum > 1) {
                Steps.insert(doc);
            }
        });
    }
});

