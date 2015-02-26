// PeopleTools 8.54 PS/Query connector
var connector;

if (!BNBLink.connectors)
    BNBLink.connectors = {};

// Create connector object
BNBLink.connectors.peoplesoftQuery854 = {};

// Define alias for easier definition
connector = BNBLink.connectors.peoplesoftQuery854;

// Define methods
connector.getQueries = function (prefix) {
    var svcResult, svcObject, params, result;
    var parseStringSync;

    if (!this.url)
        throw new Meteor.Error("PSQ854:001", "No URL defined for the connector.");

    // Build REST service parameters
    params = "ListQuery.v1/public/listquery?maxrows=1000&isconnectedquery=N";

    if (prefix)
        params = params + "&search=" + prefix;

    try {
        // Call PeopleSoft REST web service
        if (this.user && this.password) {
            svcResult = HTTP.call("GET", this.url + params, {
                auth: this.user + ":" + this.password
            });
        } else {
            svcResult = HTTP.call("GET", this.url + params);
        }

        // Convert PeopleSoft's XML response to JSON
        svcObject = BNBLink.parseStringSync(svcResult.content, {
            attrkey: "a",
            explicitArray: false
        });

        // Retrieve queries array
        result = svcObject.QAS_LISTQUERY_RESP_MSG.QAS_LISTQUERY_RESP.map(function (item) {
            return {
                label: item.PTQASWRK.QueryName + "-" + item.PTQASWRK.Description,
                value: item.PTQASWRK.QueryName
            }
        });

        return result;
    } catch (e) {
        throw new Meteor.Error("PSQ854:002", "Error detected while invoking listquery service.");
        return "error";
    }

    return "";
};

connector.run = function (query, prompts) {
    var svcResult, svcObject, params, result;
    var parseStringSync, columns, root;

    if (!this.url)
        throw new Meteor.Error("PSQ854:001", "No URL defined for the connector.");

    if (!query)
        throw new Meteor.Error("PSQ854:003", "Query name has not been provided.");

    params = "ExecuteQuery.v1/public/" + query + "/WEBROWSET/NONFILE?isconnectedquery=N&maxrows=100";

    try {
        // Call PeopleSoft REST web service
        if (this.user && this.password) {
            svcResult = HTTP.call("GET", this.url + params, {
                auth: this.user + ":" + this.password
            });
        } else {
            svcResult = HTTP.call("GET", this.url + params);
        }

        // Convert PeopleSoft's XML response to JSON
        svcObject = BNBLink.parseStringSync(svcResult.content, {
            attrkey: "a",
            explicitArray: false
        });
        
        // Retrieve query information
        root = svcObject.QAS_GETQUERYRESULTS_RESP_MSG.webRowSet;
        columns = root.metadata["column-definition"];
        
        // standardize column names
        columns.forEach(function (c) {
            c["column-name"] = c["column-name"].replace(".", "_");
        });
        
        result = root.data.currentRow.map(function (item) {
            var rowData = {};
            var i;

            for (i = 0; i < item.columnValue.length; i++) {
                rowData[columns[i]["column-name"]] = item.columnValue[i];
            }
            return rowData;
        });

        return result;
    } catch (e) {
        throw new Meteor.Error("PSQ854:004", "Error detected while invoking ExecuteQuery service.");
        return "error";
    }

    return "";
};