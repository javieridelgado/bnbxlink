Meteor.loginCallerAdmin = function (org, user, password, callback) {
    var user;

    // TODO: the organization admin users will always be user & password validated

    // first check if the user is actually an administrator

    //create a login request with admin: true, so our loginHandler can handle this request
    var loginRequest = {
        isAdmin: true,
        user: {
            username: user
        },
        password: password,
        organization: org
    };

    //send the login request
    Accounts.callLoginMethod({
        methodArguments: [loginRequest],
        userCallback: callback
    });
};