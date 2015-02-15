Meteor.loginCaller = function (user, password, callback) {
    //create a login request with admin: true, so our loginHandler can handle this request
    var loginRequest = {
        psLogin: true,
        userId: user,
        password: password
    };

    //send the login request
    Accounts.callLoginMethod({
        methodArguments: [loginRequest],
        userCallback: callback
    });
};