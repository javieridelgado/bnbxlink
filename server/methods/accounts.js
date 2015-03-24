Meteor.methods({
    setCurrentOrganization: function(orgID) {
        BNBLink.currentOrgID = orgID;

        /*Meteor.publish("environments", function () {
            console.log("publish environments:" + BNBLink.currentOrgID);
            return BNBLink.Environments.find({orgID: BNBLink.currentOrgID});
        });*/
    },

    // signup a new user
    signup: function (doc) {
        var userId;

        // Important server-side check for security and data integrity
        check(doc, Schema.signup);

        // exit if the organization already exists
        if (!BNBLink.Organizations.checkOrgID(doc.orgID))
            throw new Meteor.Error("duplicateOrg", "Organization already exists.");

        // build unique user ID
        userId = BNBLink.utils.getUserName(doc.email,doc.orgID, "admin");

        // create user
        Meteor.call("createUser", {
            username: userId,
            password: doc.password
        }, function (error, result) {
            if (error)
                return;

            // create organization
            BNBLink.Organizations.insert({
                name: doc.organization,
                orgID: doc.orgID,
                administrators: [doc.email]
            });

            // create environments
            BNBLink.Environments.insert({
                orgID: doc.orgID,
                envID: "stage",
                dbPrefix: doc.orgID + "_stage",
                name: "Staging",
                type: "Staging",
                default: true
            });

            BNBLink.Environments.insert({
                orgID: doc.orgID,
                envID: "prod",
                dbPrefix: doc.orgID + "_prod",
                name: "Production",
                type: "Production",
                default: false
            });

            // add organization and environment to user
            Meteor.users.update({_id: result.id}, {$set: {environments: [{orgID: doc.orgID, env: "admin"}]}});

            // set Organization ID
            BNBLink.currentOrgID = doc.orgID;
        });
    }

});
