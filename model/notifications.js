Meteor.methods({
    sendNotification: function (u, msg, pnlid, pnlkey) {
        var users;

        // If a single user is provided, convert it into an array
        users = (typeof u == "string") ? [u] : u;

        users.forEach(function (usr) {
            var n;

            // Check if there is an existing notification for this user
            n = BNBLink.Notifications.findOne({userId: usr, message: msg, panelId: pnlid, panelKey: pnlkey, readFlag: false});
            if (n) {
                BNBLink.Notifications.update({_id: n._id}, {$inc: {quantity: 1}});
            } else {
                BNBLink.Notifications.insert({
                    userId: usr,
                    message: msg,
                    panelId: pnlid,
                    panelKey: pnlkey,
                    readFlag: false,
                    quantity: 1
                });
            }
        });

        return "something";
    }
});
