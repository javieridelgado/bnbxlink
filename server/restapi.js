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

                configData = this.bodyParams;
                urlData = "";
                if (configData) {
                    urlData = "?" + BNBXLink.utils.objectToHash(configData);
                }

                return {
                    status: "success",
                    urlView: process.env.ROOT_URL + "/connector/view/psQuery854" + urlData,
                    modalHeight: 330
                };
            }
        });

        // Maps to: /api/connector/config/googleSheets
        Restivus.addRoute("connector/config/googleSheets", {authRequired: false}, {
            post: function () {
                var configData, urlData;

                configData = this.bodyParams;
                urlData = "";
                if (configData) {
                    urlData = "?" + BNBXLink.utils.objectToHash(configData);
                }

                return {
                    status: "success",
                    urlView: process.env.ROOT_URL + "/connector/view/googleSheets" + urlData,
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
                var err;

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
                    if (configData.range) {
                        options.params = GoogleSheet.convertRangeToParams(configData.range);
                    }

                    rows = spreadsheet.receiveSync(options);

                    // retrieve headers
                    if (configData.containsHeader && rows["1"]) {
                        columns = rows["1"];
                    }

                    _.each(rows, function (value, key) {
                        var item = {};

                        if (configData.containsHeader && key == "1")
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