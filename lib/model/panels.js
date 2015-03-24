// Declare collection
BNBLink.Panels = new Ground.Collection("panels");
console.log("number of records in panel after initialization: " + BNBLink.Panels.find().count());
// Initialize search parameters
BNBLink.Panels.initEasySearch("name");

// Initialize schema to be used for auto forms
BNBLink.Panels.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    envID: {
        type: String,
        label: "Environment"
    },
    description: {
        type: String,
        label: "Description",
        max: 1000
    },
    panelType: {
        type: String,
        label: "Panel Type",
        allowedValues: ["HTML", "Form", "Chart"]
    },
    availableForDashboard: {
        type: Boolean,
        label: "Available for Dashboard"
    },
    detailPanel: {
        type: String,
        label: "Detail Panel",
        optional: true,
        autoform: {
            options: function () {
                var myOpt;

                myOpt = BNBLink.Panels.find({}).fetch().map(function (item) {
                    return {label: item.name, value: item._id};
                });

                return myOpt;
            }
        }
    },
    collectionBase: {
        type: String,
        label: "Collection",
        optional: true
    },
    collectionFilter: {
        type: String,
        label: "Filter",
        optional: true
    },

    // panel generation - HTML & FORM
    sumPanelStyle: {
        type: String,
        label: "Panel Style",
        allowedValues: ["default", "primary", "info", "warning", "danger"]
    },
    jsonTransformSumHeader: {
        type: String,
        label: "JSON Transform Header (dashboard only)",
        optional: true
    },
    jsonTransformSum: {
        type: String,
        label: "JSON Transform Summary",
        optional: true
    },
    jsonTransformSumFooter: {
        type: String,
        label: "JSON Transform Footer (dashboard only)",
        optional: true
    },

    // panel generation - Chart
    chartKeyAttribute: {
        type: String,
        label: "Key Attribute",
        optional: true
    },
    chartDescriptionAttribute: {
        type: String,
        label: "Description Attribute",
        optional: true
    },
    chartValueAttribute: {
        type: String,
        label: "Value Attribute",
        optional: true
    },
    chartSeriesLimit: {
        type: Number,
        label: "SeriesLimit",
        optional: true
    },

    // cached contents
    cachedHTML: {
        type: String,
        label: "Summary HTML",
        optional: true
    },
    detailHTML: {
        type: String,
        label: "Detail HTML",
        optional: true
    },

    // panel actions
    actions: {
        type: [Object],
        optional: true
    },
    "actions.$.name": {
        type: String,
        label: "Name"
    },
    "actions.$.event": {
        type: String,
        label: "Event"
    },
    "actions.$.command": {
        type: String,
        label: "Command"
    },
    "actions.$.panel": {
        type: String,
        label: "Panel",
        autoform: {
            options: function () {
                var myOpt;

                myOpt = BNBLink.Panels.find({}).fetch().map(function (item) {
                    return {label: item.name, value: item._id};
                });

                return myOpt;
            }
        }
    },
    "actions.$.params": {
        type: String,
        label: "Parameters"
    }
}));

// Collection permissions
BNBLink.Panels.allow({
    insert: function (userId, doc) {
        var user = BNBLink.utils.getUserAttributes(userId);

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
Panels = BNBLink.Panels;

