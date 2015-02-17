// This file contains the login handlers
Accounts.registerLoginHandler("PeopleSoft", function (loginRequest) {
    var username, password;
    var url, svcResult;

    //there are multiple login handlers in meteor. 
    //a login request go through all these handlers to find it's login hander
    //so in our login handler, we only consider login requests which has admin field
    if (!loginRequest.psLogin) {
        return undefined;
    }

    username = loginRequest.userId;
    password = loginRequest.password;

    // first check the credentials against PeopleSoft
    url = "http://192.168.59.103:8000/PSIGW/RESTListeningConnector/PSFT_HR/ListQuery.v1/public/listquery?search=&maxrows=1000&isconnectedquery=N";

    try {
        svcResult = HTTP.call("GET", url, {
            auth: username + ":" + password
        });
    } catch (e) {
        BNBLink.debug = e;
        throw new Meteor.Error("LOGIN:001", "Invalid user id or password.");
        return {
            userId: username,
            error: new Meteor.Error(403, "Incorrect password")
        };
    }

    //we create a admin user if not exists, and get the userId
    var userId = null;
    var user = Meteor.users.findOne({
        username: username
    });

    if (!user) {
        userId = Meteor.users.insert({
            username: username,
            password: password
        });
    } else {
        userId = user._id;
    }

    //send loggedin user's user id
    return {
        userId: userId
    }
});