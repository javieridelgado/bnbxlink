if (Meteor.isServer) {
    Meteor.publish("panels", function () {
        return BNBLink.Panels.find({});
    });

    Meteor.publish('collections', function () {
        return BNBLink.Collections.find({});
    });

    Meteor.publish('comments', function () {
        return BNBLink.Comments.find({});
    });

    Meteor.publish('notifications', function () {
        return BNBLink.Notifications.find({userId: this.userId});
    });


    Meteor.publish("environments", function () {
        console.log("publish environments:" + BNBLink.currentOrgID);
        if (this.userId) {
            return BNBLink.Environments.find({orgID: BNBLink.currentOrgID});
        } else {
            this.ready();
        }
    });

    Meteor.publish('userPreferences', function () {
        return Meteor.users.find(this.userId, {
            fields: {
                panels: 1
            }
        });
    });

    Meteor.publish(null, function (){ 
        return Meteor.roles.find({})
    });
}