
if (Meteor.isClient) {

    Template.signup.helpers({
        signupSchema: function () {
            return Schema.signup;
        }
    });

    /*Template.signup.events({
        // Process Signin button
        "submit form": function (event, template) {
            var org, server;
            var userID;
            var userPwd, userPwdConfirm;
            var $btn;

            // set signin in message in the button
            $btn = $("button.btn-primary").button('loading');

            // check if passwords match
            userPswd = template.$("#inputPassword").val();
            userPswdConfirm = template.$("#inputPwdConfirmation").val();
            if (userPwd != userPwdConfirm) {
            }

            //


            // retrieve the organization from the url
            server = window.location.hostname;
            org = server.substring(0, server.indexOf("."));

            // initialize variables
            userID = event.target.inputUser.value;
            userPswd = event.target.inputPassword.value;

            event.preventDefault();

            // Check if user is empty
            if (userID == "") {
                Session.set("login.error", "You must provide a User ID.");
            } else if (userPswd == "") { // Check if password is empty
                Session.set("login.error", "You must provide a password.");
            } else {
                Meteor.loginCallerAdmin(org, userID, userPswd, function (error) {
                    $btn.button('reset');
                    if (error) {
                        Session.set("login.error", error.reason);
                    } else {
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
    });*/
}