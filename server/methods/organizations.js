BNBLink.Organizations.checkOrgID = function (orgID) {
    if (BNBLink.Organizations.find({orgID: orgID}).count() > 0) {
        return false;
    }

    return true;
}

Meteor.methods({
    // check if a given organization ID exists or not
    checkOrgID: function (orgID) {
        return BNBLink.Organizations.checkOrgID(orgID);
    },

    // check if a user is an organization administrator
    isUserOrgAdmin: function(user, orgID) {
        console.log("in isUserOrgAdmin " + orgID + " user " + user);
        var org = BNBLink.Organizations.findOne({orgID: orgID});
        if(typeof org !== "undefined")
            if (org.administrators && org.administrators.indexOf(user) != -1)
                return true;

        return false;
    }
});
