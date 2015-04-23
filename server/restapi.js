if (Meteor.isServer) {
    // API must be configured and built after startup!
    Meteor.startup(function () {

        // Global configuration
        Restivus.configure({
            useAuth: false     // TODO let's disable authentication for testing purposes
        });

        // Internal connectors
        // Maps to: /api/connector/config/psQuery854
        Restivus.addRoute("connector/config/psQuery854", {authRequired: false}, {
            post: function () {
                var configData, urlData;
                var rootURL = process.env.ROOT_URL;

                if (rootURL.charAt(rootURL.length - 1) == "/")
                    rootURL = rootURL.substring(0, rootURL.length - 1);

                configData = this.bodyParams;
                urlData = "";
                if (configData) {
                    urlData = "?" + BNBXLink.utils.objectToHash(configData);
                }

                return {
                    status: "success",
                    urlView: rootURL + "/connector/view/psQuery854" + urlData,
                    modalHeight: 330
                };
            }
        });

        // Maps to: /api/connector/config/googleSheets
        Restivus.addRoute("connector/config/googleSheets", {authRequired: false}, {
            post: function () {
                var configData, urlData;
                var rootURL = process.env.ROOT_URL;

                if (rootURL.charAt(rootURL.length - 1) == "/")
                    rootURL = rootURL.substring(0, rootURL.length - 1);

                configData = this.bodyParams;
                urlData = "";
                if (configData) {
                    urlData = "?" + BNBXLink.utils.objectToHash(configData);
                }

                return {
                    status: "success",
                    urlView: rootURL + "/connector/view/googleSheets" + urlData,
                    modalHeight: 513
                };
            }
        });

        // Maps to: /api/connector/config/googleSheets
        Restivus.addRoute("connector/import/googleSheets", {authRequired: false}, {
            post: function () {
                var data = [];
                var rows;
                var columns = {};
                var configData, spreadsheet;
                var options;
                var firstRow;

                // obtain configuration
                configData = this.bodyParams;

                // load spreadsheet
                spreadsheet = GoogleSheet.loadSync({
                    spreadsheetName: configData.spreadsheetName,
                    worksheetName: configData.worksheetName,
                    username: configData.userEmail,
                    password: configData.userPassword
                });

                // read spreadsheet
                if (spreadsheet) {
                    options = {};
                    firstRow = 1;
                    if (configData.range) {
                        options.params = GoogleSheet.convertRangeToParams(configData.range);
                        firstRow = options.params["min-row"];
                    }

                    // convert firstRow to char
                    firstRow = firstRow.toString();

                    rows = spreadsheet.receiveSync(options);

                    // retrieve headers
                    console.log("configData: " + JSON.stringify(configData));
                    console.log("par1: " + configData.containsHeader);
                    console.log("par2: " + rows[firstRow]);
                    if (configData.containsHeader && rows[firstRow]) {
                        columns = rows[firstRow];
                    }

                    _.each(rows, function (value, key) {
                        var item = {};

                        if (configData.containsHeader && key == firstRow)
                            return;

                        _.each(value, function (v, k) {
                            var ck;

                            ck = k;
                            if (columns[k]) {
                                ck = columns[k];
                            }
                            item[ck] = v;
                        });

                        data.push(item);
                    });
                }

                return {status: "success", importData: data};
            }
        });

    });
}