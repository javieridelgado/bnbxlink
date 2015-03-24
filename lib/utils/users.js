BNBLink.utils.getUserName = function (email, orgID, envID) {
    return orgID + ":" + envID + ":" + email.replace("@", "|");
}


BNBLink.utils.getUserAttributes = function (username) {
    var user = {};
    var tmp, u;
    var pos;

    // check if it is an user name or an user ID
    pos = username.indexOf(":");
    tmp = username;
    if (pos == -1) {
        u = Meteor.users.findOne(username);
        if (u) {
            pos = u.username.indexOf(":");
            tmp = u.username;
        } else {
            // this user cannot be parsed
            return {};
        }
    }

    // retrieve organization ID
    pos = tmp.indexOf(":");
    user.orgID = tmp.substring(0, pos);
    tmp = tmp.substring(pos + 1);

    // retrieve environment ID
    pos = tmp.indexOf(":");
    user.envID = tmp.substring(0, pos);
    tmp = tmp.substring(pos + 1);

    // retrieve email
    user.email = tmp.replace("|", "@");

    return user;
}

