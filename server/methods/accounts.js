Meteor.methods({
    // admin login
    adminLogin: function (doc) {
        // Important server-side check for security and data integrity
        check(doc, Schema.login);

        // exit if the organization does not exist
        if (BNBLink.Organizations.checkOrgID(doc.orgID))
            throw new Meteor.Error("invalidOrg", "Organization does not exist.");

        // exit if the email does not exists
        if (!BNBLink.Users.emailExists(doc.email))
            throw new Meteor.Error("duplicateEmail", "Email does not exist.");

        Accounts.callLoginMethod({
            methodName: "password",
            methodArguments: {
                user: {
                    email: doc.email
                },
                password: doc.password,
                resume: false
            },
            userCallback: function (error) {
                if (error) {
                    console.log("error: " + error);
                } else {
                    console.log("success");
                }
            }
        });
    },

    // signup a new user
    signup: function (doc) {
        var userId;

        // Important server-side check for security and data integrity
        check(doc, Schema.signup);

        // exit if the organization already exists
        if (!BNBLink.Organizations.checkOrgID(doc.orgID))
            throw new Meteor.Error("duplicateOrg", "Organization already exists.");

        // exit if the email already exists
        if (BNBLink.Users.emailExists(doc.email))
            throw new Meteor.Error("duplicateEmail", "Email already exists.");

        // create organization
        BNBLink.Organizations.insert({
            name: doc.organization,
            orgID: doc.orgID,
            administrators: [doc.email]
        });

        // create user
        Meteor.call("createUser", {
            email: doc.email,
            password: doc.password
        }, function (error, result) {
            if (error)
                return;

            // add organization and environment to user
            Meteor.users.update({_id: result.id}, {$set: {environments: [{orgID: doc.orgID, env: "admin"}]}});
        });
    }

});
