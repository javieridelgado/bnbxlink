// Register utility helpers
if (Meteor.isClient) {
    Template.registerHelper("formatTime", function(context, options) {
        if(context)
            return moment(context).format("DD/MM/YYYY, hh:mm");
    });
}