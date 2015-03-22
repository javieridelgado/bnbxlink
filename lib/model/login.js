Schema.login = new SimpleSchema({
    orgID: {
        type: String,
        label: "Organization ID",
        regEx: /^[a-z][a-z0-9_.]*$/,
        max: 50,
        custom: function () {
            Meteor.call("checkOrgID", this.value, function (error, result) {
                if (result) {
                    Schema.login.namedContext("loginForm").addInvalidKeys([{name: "orgID", type: "notExistingOrgID"}]);
                }
            });
        }
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "Email address",
        custom: function () {
            Meteor.call("userEmailExists", this.value, function (error, result) {
                if (!result) {
                    Schema.login.namedContext("loginForm").addInvalidKeys([{name: "email", type: "notExistingEmail"}]);
                }
            });
        }
    },
    password: {
        type: String,
        label: "Password"
    }
});
