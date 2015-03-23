// Declare collections
BNBLink.Environments = new Ground.Collection("environments");

// Initialize search parameters
BNBLink.Environments.initEasySearch("name");

/*
 organizations
 {
 name
 authorized administrators []
 payment details{}
 projects []
 users []
 preffix
 */

// Initialize schema to be used for auto forms
BNBLink.Environments.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    // prefix to be used before the subdomain: prefix.subdomain.bnblink.com
    envID: {
        type: String,
        label: "Environment ID",
        optional: true
    },
    // Replica is expected to be used as an automatic way to refresh the environment from another
    type: {
        type: String,
        label: "Type",
        allowedValues: ["Production", "Staging", "Sandbox", "Replica"]
    },
    // this is the field that is unique to each organization
    orgID: {
        type: String,
        label: "Organization"
    },
    // this is the field that is unique to each organization... this is an internal field, that should not be
    // published. (TODO: make sure it is not published)
    dbPrefix: {
        type: String,
        label: "Prefix"
    },
    // this field is used to indicate if this is the default environment
    default: {
        type: Boolean,
        label: "Default"
    },
    // Users linked to this environment
    users: {
        type: [Object],
        optional: true
    },
    "users.$.userID": {
        type: String
    },
    "users.$.role": {
        type: String
    }
}));

// Initialize permissions
BNBLink.Environments.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return false;
    }
});

// Create global variables for autoform
Environments = BNBLink.Environments;