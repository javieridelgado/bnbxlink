var SHA256 = Package.sha.SHA256;
var NpmModuleBcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;

// Check validators
var NonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length > 0;
});

var userQueryValidator = Match.Where(function (user) {
    check(user, {
        id: Match.Optional(NonEmptyString),
        username: Match.Optional(NonEmptyString),
        email: Match.Optional(NonEmptyString)
    });
    if (_.keys(user).length !== 1)
        throw new Match.Error("User property must have exactly one field");
    return true;
});

var passwordValidator = Match.OneOf(
    String,
    {digest: String, algorithm: String}
);

var booleanValidator = Match.OneOf(Boolean);
var stringValidator = Match.OneOf(String);

// helper functions
var selectorFromUserQuery = function (user) {
    if (user.id)
        return {_id: user.id};
    else if (user.username)
        return {username: user.username};
    else if (user.email)
        return {"emails.address": user.email};
    throw new Error("shouldn't happen (validation missed something)");
};

var findUserFromUserQuery = function (user) {
    var selector = selectorFromUserQuery(user);

    var user = Meteor.users.findOne(selector);
    if (!user)
        throw new Meteor.Error(403, "User not found");

    return user;
};

// Given a 'password' from the client, extract the string that we should
// bcrypt. 'password' can be one of:
//  - String (the plaintext password)
//  - Object with 'digest' and 'algorithm' keys. 'algorithm' must be "sha-256".
//
var getPasswordString = function (password) {
    if (typeof password === "string") {
        password = SHA256(password);
    } else { // 'password' is an object
        if (password.algorithm !== "sha-256") {
            throw new Error("Invalid password hash algorithm. " +
            "Only 'sha-256' is allowed.");
        }
        password = password.digest;
    }
    return password;
};

var bcrypt = NpmModuleBcrypt;
var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);

var checkPassword = function (user, password) {
    var result = {
        userId: user._id
    };

    password = getPasswordString(password);

    if (!bcryptCompare(password, user.services.password.bcrypt)) {
        result.error = new Meteor.Error(403, "Incorrect password");
    }

    return result;
};


// register handler for administrators
Accounts.registerLoginHandler("admin", function (loginRequest) {
    var username, password, orgStr;
    var orgObj;
    var url, svcResult;

    if (!loginRequest.password || loginRequest.srp)
        return undefined; // don't handle

    check(loginRequest, {
        user: userQueryValidator,
        password: passwordValidator,
        isAdmin: booleanValidator,
        organization: stringValidator
    });

    //there are multiple login handlers in meteor.
    //a login request go through all these handlers to find it's login hander
    //so in our login handler, we only consider login requests which has isAdmin field
    if (!loginRequest.isAdmin) {
        return undefined;
    }

    var user = findUserFromUserQuery(loginRequest.user);

    if (!user.services || !user.services.password || !(user.services.password.bcrypt || user.services.password.srp))
        throw new Meteor.Error(403, "User has no password set");

    username = loginRequest.user._id;
    password = loginRequest.password;
    org = loginRequest.organization;

    // TODO: uncomment when we have the signup
    // first we check that the password matches the stored one
    /*if (Meteor.users.find({username: username, organization: org, password: password}).count()) {
     throw new Meteor.Error("LOGIN:001", "Invalid user id or password.");
     return {
     userId: username,
     error: new Meteor.Error(403, "Incorrect password")
     };
     }*/

    // then we check that the user is indeed an administrator
    /*orgObj = BNBLink.Organizations.findOne({subdomain: org});
     if (!orgObj || !orgObj.administrators.find(username)) {
     throw new Meteor.Error("LOGIN:002", "This user is not an administrator for the organization.");
     return {
     userId: username,
     error: new Meteor.Error(403, "This user is not an administrator for the organization.")
     };
     }*/

    //send loggedin user's user id
    return checkPassword(
        user,
        loginRequest.password
    );
});

// Shared createUser function called from the createUser method, both
// if originates in client or server code. Calls user provided hooks,
// does the actual user insertion.
//
// returns the user id
var createUser = function (options) {
    // Unknown keys allowed, because a onCreateUserHook can take arbitrary
    // options.
    check(options, Match.ObjectIncluding({
        username: Match.Optional(String),
        email: Match.Optional(String),
        password: Match.Optional(passwordValidator)
    }));

    var username = options.username;
    var email = options.email;
    if (!username && !email)
        throw new Meteor.Error(400, "Need to set a username or email");

    var user = {services: {}};
    if (options.password) {
        var hashed = hashPassword(options.password);
        user.services.password = { bcrypt: hashed };
    }

    if (username)
        user.username = username;
    if (email)
        user.emails = [{address: email, verified: false}];

    return Accounts.insertUserDoc(options, user);
};

// method for create user. Requests come from the client.
Meteor.methods({
    createUser: function (options) {
        var self = this;
        return Accounts._loginMethod(
            self,
            "createUser",
            arguments,
            "password",
            function () {
                // createUser() above does more checking.
                check(options, Object);
                if (Accounts._options.forbidClientAccountCreation)
                    return {
                        error: new Meteor.Error(403, "Signups forbidden")
                    };

                // Create user. result contains id and token.
                var userId = createUser(options);
                // safety belt. createUser is supposed to throw on error. send 500 error
                // instead of sending a verification email with empty userid.
                if (!userId)
                    throw new Error("createUser failed to insert new user");

                // If `Accounts._options.sendVerificationEmail` is set, register
                // a token to verify the user's primary email, and send it to
                // that address.
                if (options.email && Accounts._options.sendVerificationEmail)
                    Accounts.sendVerificationEmail(userId, options.email);

                // client gets logged in as the new user afterwards.
                return {userId: userId};
            }
        );
    }
});

// Create user directly on the server.
//
// Unlike the client version, this does not log you in as this user
// after creation.
//
// returns userId or throws an error if it can't create
//
// XXX add another argument ("server options") that gets sent to onCreateUser,
// which is always empty when called from the createUser method? eg, "admin:
// true", which we want to prevent the client from setting, but which a custom
// method calling Accounts.createUser could set?
//
Accounts.createUser = function (options, callback) {
    options = _.clone(options);

    // XXX allow an optional callback?
    if (callback) {
        throw new Error("Accounts.createUser with callback not supported on the server yet.");
    }

    return createUser(options);
};
