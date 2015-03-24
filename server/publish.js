if (Meteor.isServer) {
    Meteor.publish("panels", function (envID) {
        var userId = this.userId;
        var user;

        if (userId) {
            user = BNBLink.utils.getUserAttributes(userId);
            return BNBLink.Panels.find({orgID: user.orgID, envID: envID});
        } else {
            this.ready();
        }
    });

    Meteor.publish('collections', function (envID) {
        var userId = this.userId;
        var user;

        if (userId) {
            user = BNBLink.utils.getUserAttributes(userId);
            return BNBLink.Collections.find({orgID: user.orgID, envID: envID});
        } else {
            this.ready();
        }
    });

    Meteor.publish('comments', function () {
        return BNBLink.Comments.find({});
    });

    Meteor.publish('notifications', function (envID) {
        if (this.userId) {
            return BNBLink.Notifications.find({userId: this.userId});
        } else {
            this.ready();
        }
    });

    Meteor.publish("organizations", function () {
        var userId = this.userId;
        var user;

        if (userId) {
            user = BNBLink.utils.getUserAttributes(userId);
            return BNBLink.Organizations.find({orgID: user.orgID});
        } else {
            this.ready();
        }
    });

    Meteor.publish("environments", function () {
        var userId = this.userId;
        var user;

        if (userId) {
            user = BNBLink.utils.getUserAttributes(userId);
            console.log("publish environments: " + user.orgID);
            console.log(userId);

            return BNBLink.Environments.find({orgID: user.orgID});
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

    Meteor.publish(null, function () {
        return Meteor.roles.find({})
    });
}