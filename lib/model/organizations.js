// Declare collections
BNBLink.Organizations = new Ground.Collection('organizations');

// Initialize search parameters
BNBLink.Organizations.initEasySearch('name');

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
BNBLink.Organizations.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    logo: {
        type: String,
        label: "Logo",
        optional: true
    },
    // subdomain to be used by the application. The production environment will be at subdomain.bnblink.com, while
    // other environments will include the environment prefix: stg.subdomain.bnblink.com.
    subdomain: {
        type: String,
        label: "Subdomain"
    },
    // Administrators linked to this organization
    administrators: {
        type: [String],
        minCount: 1
    }
    // TODO: payment information

}));

// Initialize permissions
BNBLink.Organizations.allow({
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
Organizations = BNBLink.Organizations;