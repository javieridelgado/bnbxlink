if (Meteor.isClient) {
    Template.login.helpers({
        loginSchema: function () {
            return Schema.login;
        },

        email: function() {
            if (localStorage.email) {
                return localStorage.email;
            }

            return "";
        },

        orgID: function() {
            if (localStorage.orgID) {
                return localStorage.orgID;
            }

            return "";
        }
    });

    Template.login.events({
        // Process Signin button
        "submit form": function (event) {
            var org, server;
            var doc;
            var $btn;

            // set signin in message in the button
            $btn = $("button.btn-primary").button('loading');

            // validate form
            doc = AutoForm.getFormValues("loginForm").insertDoc;
            check(doc, Schema.login);

            event.preventDefault();

            // login
            Meteor.loginCallerAdmin(doc.orgID, doc.email, doc.password, function (error) {
                $btn.button('reset');
                if (error) {
                    Session.set("login.error", error.reason);
                } else {
                    Session.set("login.error", null);

                    // record the input in the local storage
                    localStorage.email = doc.email;
                    localStorage.orgID = doc.orgID;

                    Session.set("organizationID", doc.orgID);
                }
            });
        }
    });

    Template.loginMessages.helpers({
        errorMessage: function () {
            return Session.get("login.error");
        }
    });
}