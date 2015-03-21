Meteor.methods({
    // check if a given organization ID exists or not
    checkOrgID: function (orgID) {
        if (BNBLink.Organizations.find({orgID: orgID}).count() > 0) {
            return false;
        }

        return true;
    },

    // check if a given organization ID exists or not
    signup: function (doc) {
        // create organization
        BNBLink.Organizations.insert({
            name: doc.organization,
            orgID: doc.orgID,
            administrators: [doc.email]
        });

        // create user
        Accounts.createUser({
            email: doc.email,
            password: doc.password,
            environment: "admin",
            orgID: doc.orgID
        });
    }

});
