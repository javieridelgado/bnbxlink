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

    addPanelComment: function (panelID, userID, comment) {
        var username;
        
        BNBLink.log("in server: " + panelID + ' - ' + userID + ' - ' + comment);

        username = Meteor.users.find(userID).fetch()[0].username;
        
        BNBLink.Comments.insert({
            objType: "panel",
            objID: panelID,
            userID: userID,
            username: username,
            comment: comment,
            timestamp: Date()
        });

        return "something";
    }
});