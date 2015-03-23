// accounts configuration
Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false});

// By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help
// with their account, be sure to set this to an email address that you can receive email at.
Accounts.emailTemplates.from = "BNB Link <no-reply@bnetbuilders.com>";

// The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
Accounts.emailTemplates.siteName = "BNB Link";

// A Function that takes a user object and returns a String for the subject line of the email.
Accounts.emailTemplates.verifyEmail.subject = function (user) {
    return "Confirm Your Email Address";
};

// A Function that takes a user object and a url, and returns the body text for the email.
// Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
Accounts.emailTemplates.verifyEmail.text = function (user, url) {
    return "Click on the following link to verify your email address: " + url;
};


// (server-side) called whenever a login is attempted
Accounts.validateLoginAttempt(function(attempt){
    if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
        console.log('email not verified');

        return true; // the login is aborted
    }
    return true;
});