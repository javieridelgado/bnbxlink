Meteor.loginCallerAdmin = function (org, user, password, callback) {
    // check if the user belongs to the organization and is an administrator
    console.log("calling isUserOrgAdmin");
    Meteor.call("isUserOrgAdmin", user, org, function (error, results) {
        console.log("return isUserOrgAdmin" + error + results);
        if (error) {
            callback(error);
            return;
        }

        if (results) {
            // check login credentials
            Meteor.call("setCurrentOrganization", org, function (error, results) {
                Meteor.loginWithPassword(user, password, callback);
            });
        } else {
            callback("User is not an administrator for this organization.")
        }
    });
};