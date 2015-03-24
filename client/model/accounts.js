BNBLink.loginCallerAdmin = function (org, email, password, callback) {
    // check if the user belongs to the organization and is an administrator
    Meteor.call("isUserOrgAdmin", email, org, function (error, results) {
        var username;

        // build user name
        username = BNBLink.utils.getUserName(email, org, "admin");

        console.log("return isUserOrgAdmin" + error + results);
        if (error) {
            callback(error);
            return;
        }

        if (results) {
            // check login credentials
            Meteor.call("setCurrentOrganization", org, function (error, results) {
                Meteor.loginWithPassword(username, password, callback);
            });
        } else {
            callback("User is not an administrator for this organization.")
        }
    });
};