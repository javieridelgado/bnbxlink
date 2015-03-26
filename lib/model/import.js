// Declare collections
BNBLink.Imports = new Mongo.Collection("imports");

// Initialize search parameters
BNBLink.Imports.initEasySearch("name");

// Initialize schema to be used for auto forms
BNBLink.Imports.attachSchema(new SimpleSchema({
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
    // connector
    description: {
        type: String,
        label: "Description",
        max: 1000,
        optional: true
    },
    targetCollection: {
        type: String,
        label: "Collection",
        max: 200
    },
    connectorID: {
        type: String,
        label: "Connector",
        max: 200
    },
    configuration: {
        type: Object,
        label: "Configuration",
        optional: true
    },
    fullRefresh: {
        type: Boolean,
        label: "Full Refresh"
    }
}));

// Initialize permissions
BNBLink.Imports.allow({
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
Imports = BNBLink.Imports;