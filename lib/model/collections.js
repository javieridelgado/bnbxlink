// Declare collections
BNBLink.Collections = new Ground.Collection('collections');

// Initialize search parameters
BNBLink.Collections.initEasySearch('name');

// Initialize schema to be used for auto forms
BNBLink.Collections.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    description: {
        type: String,
        label: "Description",
        max: 1000
    },
    expirationTime: {
        type: Number,
        label: "Expiration Time (secs)",
        optional: true
    },
    lastRefreshDttm: {
        type: Date,
        label: "Last Refresh Datetime",
        optional: true
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
    sourceType: {
        type: String,
        allowedValues: ["CSV", "Excel", "PeopleSoft Ad Hoc", "PeopleSoft Query", "SAP"]
    },
    dataInput: {
        type: String,
        label: "Data Input"
    },
    /* PeopleSoft Fields */
    psURL: {
        type: String,
        label: "PeopleSoft URL"
    },
    psParameters: {
        type: String,
        label: "Parameters"
    },
    psUser: {
        type: String,
        label: "PS User"
    },
    psPassword: {
        type: String,
        label: "PS Password"
    },
    psQuery: {
        type: String,
        label: "PS Query"
    }
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
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});

// Create global variables for autoform
Collections = BNBLink.Collections;