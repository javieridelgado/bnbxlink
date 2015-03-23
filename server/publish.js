if (Meteor.isServer) {
    Meteor.publish("panels", function () {
        return BNBLink.Panels.find({});
    });

    Meteor.publish('collections', function (envID) {
        if (this.userId) {
            console.log("republishing collections: " + BNBLink.currentOrgID + " - " + envID);
            return BNBLink.Collections.find({orgID: BNBLink.currentOrgID, envID: envID});
        } else {
            this.ready();
        }
    });

    Meteor.publish('comments', function () {
        return BNBLink.Comments.find({});
    });

    Meteor.publish('notifications', function () {
        return BNBLink.Notifications.find({userId: this.userId});
    });


    Meteor.publish("environments", function () {
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
}