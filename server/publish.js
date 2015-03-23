if (Meteor.isServer) {
    Meteor.publish("panels", function (envID) {
        if (this.userId) {
            return BNBLink.Panels.find({orgID: BNBLink.currentOrgID, envID: envID});
        } else {
            this.ready();
        }
    });

    Meteor.publish('collections', function (envID) {
        if (this.userId) {
            return BNBLink.Collections.find({orgID: BNBLink.currentOrgID, envID: envID});
        } else {
            this.ready();
        }
    });

    Meteor.publish('comments', function () {
        return BNBLink.Comments.find({});
    });

    Meteor.publish('notifications', function (envID) {
        if (this.userId) {
            return BNBLink.Notifications.find({userId: this.userId, orgID: BNBLink.currentOrgID, envID: envID});
        } else {
            this.ready();
        }
    });

    Meteor.publish("organizations", function () {
        if (this.userId) {
            return BNBLink.Organizations.find({orgID: BNBLink.currentOrgID});
        } else {
            this.ready();
        }
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