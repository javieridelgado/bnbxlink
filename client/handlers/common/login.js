if (Meteor.isClient) {
    Template.login.events({
        // Process Signin button
        'submit .form-signin': function (event) {
            var userID = event.target.inputUser.value;
            var userPswd = event.target.inputPassword.value;

            event.preventDefault();

            // Check if user is empty
            if (event.target.inputUser.value == "") {
                Session.set("login.error", "You must provide a User ID.");
            } else if (event.target.inputPassword.value == "") { // Check if password is empty
                Session.set("login.error", "You must provide a password.");
            } else {
                // TODO: we should invoke our own services
                Meteor.loginCaller(userID, userPswd, function (error) {
                    if (error) {
                        Session.set("login.error", "Wrong user name and/or password.");
                    } else  {
                        // TODO record last login date
                        Session.set("login.error", null);
                    }
                });
            }
        }
    });

    Template.loginMessages.helpers({
        errorMessage: function () {
            return Session.get("login.error");
        }
    });
}