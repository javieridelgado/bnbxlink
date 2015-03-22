// initialize global schema variable to be used both at client and server
Schema = {};

SimpleSchema.messages({
    // signup
    "passwordMismatch": "Passwords do not match",
    "existingOrgID": "Organization ID already exists",
    "existingEmail": "Email address already exists",

    // login
    "notExistingEmail": "Email address does not exist",
    "notExistingOrgID": "Organization ID does not exist",
    "wrongPassword": "Wrong password",

    // regular expressions
    regEx: [
        {msg: "[label] failed regular expression validation"},

        // signup
        {exp: /^[a-z][a-z0-9_.]*$/, msg: "[label] must only contain numbers and lowercase letters, always starting with a letter"},
    ]
});