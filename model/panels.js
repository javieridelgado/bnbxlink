Meteor.methods({
    addPanel: function (panelID, userID) {
        BNBLink.log("in server: " + panelID + ' - ' + userID);

        Meteor.users.update({
            _id: userID
        }, {
            $push: {
                panels: {
                    panelID: panelID,
                    orderNo: 1
                }
            }
        });
        return "something";
    },

    delPanel: function (panelID, userID) {
        BNBLink.log("in server: " + panelID + ' - ' + userID);

        Meteor.users.update({
            _id: userID
        }, {
            $pull: {
                panels: {
                    panelID: panelID,
                    orderNo: 1
                }
            }
        }, {
            multi: true
        });
        return "something";
    },

    addPanelComment: function (panelID, panelKey, userID, comment) {
        var username, users, userList;

        BNBLink.log("in server: " + panelID + ' - ' + userID + ' - ' + comment);

        username = Meteor.users.find(userID).fetch()[0].username;

        BNBLink.Comments.insert({
            objType: "panel",
            objID: panelID,
            objKey: panelKey,
            userID: userID,
            username: username,
            comment: comment,
            timestamp: Date()
        });

        // Retrieve the list of people that has commented, excluding the user
        users = BNBLink.Comments.find({objType: "panel", objID: panelID}).fetch();
        userList = [];
        users.forEach(function (usr) {
            if (usr.userID != userID) {
                userList.push(usr.userID);
            }
        });

        // TODO: Retrieve the list of followers

        // Notify comment
        if (userList.length) {
            Meteor.call("sendNotification", userList, "%n comments were made on panel.", panelID, panelKey);
        }

        return "something";
    }
});