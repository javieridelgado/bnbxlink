// Declare collections
BNBLink.Collections = new Ground.Collection('collections');

// Initialize search parameters
BNBLink.Collections.initEasySearch('name');

// Initialize schema to be used for auto forms
BNBLink.Collections.attachSchema(new SimpleSchema({
    // key fields
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    orgID: {
        type: String,
        label: "Organization",
        optional: true          // TODO: we use optional temporarily because the field is not visible by the administrator user. The field should always be populated.
    },
    envID: {
        type: String,
        label: "Environment"
    },
    // attributes
    description: {
        type: String,
        label: "Description",
        max: 1000
    },
    availableOffline: {
        type: Boolean,
        label: "Available Offline"
    },
    readOnly: {
        type: Boolean,
        label: "Read Only",
        optional: true
    },
    socialEnabled: {
        type: Boolean,
        label: "Social Enabled",
        optional: true
    },
    lastUpdateDttm: {
        type: Date,
        label: "Last Update",
        optional: true
    }
    // Schema
    /*
    fields: {
        type: [Object],
        minCount: 1,
        optional: true
    },
    "fields.$.name": {
        type: String,
        label: "Name"
    },
    "fields.$.label": {
        type: String,
        label: "Label"
    },
    "fields.$.type": {
        type: String,
        label: "Type",
        allowedValues: ["String", "Number", "Date", "Object", "Array"]
    }
    */
    // these functionalities are for imports
    /*expirationTime: {
     type: Number,
     label: "Expiration Time (secs)",
     optional: true
     },
     lastRefreshDttm: {
     type: Date,
     label: "Last Refresh Datetime",
     optional: true
     },
     // TODO: this list should be configurable
     sourceType: {
     type: String,
     allowedValues: ["CSV", "Excel", "PeopleSoft Query", "Google Sheet"]
     },
     // CSV / Excel fields
     dataInput: {
     type: String,
     label: "Data Input",
     optional: true
     },
     // PeopleSoft Fields
     psURL: {
     type: String,
     label: "PeopleSoft URL",
     optional: true
     },
     psParameters: {
     type: String,
     label: "Parameters",
     optional: true
     },
     psUser: {
     type: String,
     label: "PS User",
     optional: true
     },
     psPassword: {
     type: String,
     label: "PS Password",
     optional: true
     },
     psQuery: {
     type: String,
     label: "PS Query",
     optional: true
     },
     // Google Sheets
     gsServiceEmail: {
     type: String,
     label: "Service Email",
     optional: true
     },
     gsSheetName: {
     type: String,
     label: "Sheet Name",
     optional: true
     },
     gsRange: {
     type: String,
     label: "Range",
     optional: true
     },*/
    // Schema
    /*,
     fields: {
     type: [Object],
     minCount: 1
     },
     "fields.$.name": {
     type: String
     },
     "fields.$.type": {
     type: String
     }*/

}));

// Initialize permissions
BNBLink.Collections.allow({
    insert: function (userId, doc) {
        var user = BNBLink.utils.getUserAttributes(userId);
        console.log("insert collection");

        if (user) {
            doc.orgID = user.orgID;
            if (user.envID == doc.envID || user.envID == "admin") {
                return true;
            }
        }

        return false;
    },

    update: function (userId, doc) {
        var user = BNBLink.utils.getUserAttributes(userId);
        console.log("update collection");
        if (user) {
            if (doc.orgID != user.orgID)
                return false;

            if (user.envID == doc.envID || user.envID == "admin") {
                return true;
            }
        }

        return false;
    },

    remove: function (usedId, doc) {
        var user = BNBLink.utils.getUserAttributes(userId);

        if (user) {
            if (doc.orgID != user.orgID)
                return false;

            if (user.envID == doc.envID || user.envID == "admin") {
                return true;
            }
        }

        return false;
    }
});


// Create global variables for autoform
Collections = BNBLink.Collections;