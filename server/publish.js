// On Client and Server
// name is the field to search over
if (Meteor.isServer) {
    Meteor.publish('panels', function () {
        return BNBLink.Panels.find({});
    });

    Meteor.publish('collections', function () {
        return BNBLink.Collections.find({});
    });

    Meteor.publish('comments', function () {
        return BNBLink.Comments.find({});
    });

    Meteor.publish('userPreferences', function () {
        return Meteor.users.find(this.userId, {
            fields: {
                panels: 1
            }
        });
    });
}