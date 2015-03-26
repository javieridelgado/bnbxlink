// Declare collections
BNBLink.Connectors = new Mongo.Collection("connectors");

// Initialize search parameters
BNBLink.Connectors.initEasySearch("name");

// Initialize schema to be used for auto forms
BNBLink.Connectors.attachSchema(new SimpleSchema({
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
    urlConfig: {
        type: String,
        label: "Configuration URL",
        max: 200,
        optional: true
    },
    urlImport: {
        type: String,
        label: "Import URL",
        max: 200
    },
    userID: {
        type: String,
        label: "Auth User",
        max: 200,
        optional: true
    },
    userPassword: {
        type: String,
        label: "Auth Password",
        max: 30,
        optional: true
    }
}));

// Initialize permissions
BNBLink.Connectors.allow({
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
Connectors = BNBLink.Connectors;