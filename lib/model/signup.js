Schema.signup = new SimpleSchema({
    organization: {
        type: String,
        label: "Organization name",
        max: 50
    },
    orgID: {
        type: String,
        label: "Organization ID",
        regEx: /^[a-z][a-z0-9_.]*$/,
        max: 50,
        custom: function () {
            Meteor.call("checkOrgID", this.value, function (error, result) {
                if (!result) {
                    Schema.signup.namedContext("signupForm").addInvalidKeys([{name: "orgID", type: "existingOrgID"}]);
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
                console.log("email exists: " + result);
                if (result) {
                    Schema.signup.namedContext("signupForm").addInvalidKeys([{name: "email", type: "existingEmail"}]);
                }
            });
        }
    },
    password: {
        type: String,
        label: "Password",
        min: 6
    },
    confirm: {
        type: String,
        label: "Confirmation",
        min: 6,
        custom: function () {
            if (this.value !== this.field("password").value) {
                return "passwordMismatch";
            }
        }
    }
});
