// Register utility helpers
if (Meteor.isClient) {
    Template.registerHelper("formatTime", function (context, options) {
        if (context)
            return moment(context).format("DD/MM/YYYY, hh:mm");
    });

    Template.registerHelper("currentDashboard", function (dashboard, options) {
        var d;

        d = Session.get("currentDashboard");
        if (dashboard == d)
            return true;

        return false;
    });
}