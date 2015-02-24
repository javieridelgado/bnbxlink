Meteor.methods({
    sendNotification: function (u, msg, pnlid) {
        var users;

        // If a single user is provided, convert it into an array
        users = (typeof u == "string") ? [u] : u;

        users.forEach(function (item) {
            BNBLink.Notifications.insert({userId: item, message: msg, panelId: pnlid, readFlag: false});
        });

        return "something";
    }
});
