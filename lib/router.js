BNBLink.navStack = [];

// Go Back method, which goes back to the previous page
BNBLink.goBack = function () {
    var prevPath;

    if (BNBLink.navStack.length > 1) {
        // get rid of the last path
        BNBLink.navStack.pop();

        // retrieve the previous path
        prevPath = BNBLink.navStack.pop();
        BNBLink.log("prev path: " + prevPath.pathname)
        BNBLink.go(prevPath.pathname, prevPath.parameters, prevPath.query);
    } else {
        // If there is only one page in the stack, then we need to go back to the home page.
        BNBLink.go("/");
    }
};

// Go method, saving the path in the navigation stack
BNBLink.go = function (path, params, query) {
    // Initialize path
    var newPath = {
        pathname: path,
        parameters: params,
        query: query
    };

    // Hide comments by default when switching from one panel to another
    Session.set("commentsEnabled", "N");

    // Redirect to the new path
    Router.go(path, params, query);

    // Insert it into the Navigation Stack
    if (path == "/") {
        BNBLink.navStack = [];
    } else {
        BNBLink.navStack.push(newPath);
    }
};

Router.configure({
    layoutTemplate: "layout",
    loadingTemplate: "loading"/*,
     waitOn: function () {
     var data;

     // We just want to subscribe data when the client is connected
     data = {};
     if (Meteor.status().connected) {
     data = Meteor.subscribe('panels');
     }

     return data;
     return Meteor.subscribe("panels");
     }*/
});

Router.route('/', function () {
    // retrieve the organization from the url
    console.log(window.location.hostname);
    /*server = window.location.hostname;
     org = server.substring(0, server.indexOf("."));*/

    if (Accounts._verifyEmailToken) {
        Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
            if (err != null) {
                if (err.message = "Verify email link expired [403]") {
                    console.log("Sorry this verification link has expired.")
                }
            } else {
                console.log("Thank you! Your email address has been confirmed.")
            }
        });

        // reset token
        Accounts._verifyEmailToken = "";
    }

    if (Meteor.user()) {
        this.render('main');
    } else {
        // TODO: First of all, we should try the last login, if it doesn't work, then we should request credentials
        this.render('login');
    }
});

Router.route("/login", {
    name: "login"
});

Router.route("/signup", {
    name: "signup"
});

Router.route("/coll/search", {
    name: "collSearch",
    onBeforeAction: function () {
        Session.set("nav.detailPage", "Maintain Collections");
        this.next();
    }
});

Router.route('/coll/insert', {
    name: 'collInsert',
    onBeforeAction: function () {
        Session.set("nav.detailPage", "Add Collection");
        this.next();
    }
});

Router.route('/coll/update/:_id', {
    name: 'collUpdate',
    data: function () {
        //var myPanel = BNBLink.Panels.findOne(new Meteor.Collection.ObjectID(this.params._id));
        var myPanel;

        myPanel = BNBLink.Collections.findOne(this.params._id);
        return myPanel;
    },

    onBeforeAction: function () {
        Session.set("nav.detailPage", "Update Collection");
        this.next();
    }
});

Router.route('/panel/subscribe', {
    name: 'panelSubscribe',
    onBeforeAction: function () {
        Session.set("nav.detailPage", "Add Panel");
        this.next();
    }
});

Router.route('/panel/search', {
    name: 'panelSearch',
    onBeforeAction: function () {
        Session.set("nav.detailPage", "Maintain Panels");
        this.next();
    }
});

Router.route("/panel/insert", {
    name: "panelInsert",
    onBeforeAction: function () {
        Session.set("nav.detailPage", "Add Panel");
        this.next();
    }
});

Router.route('/panel/update/:_id', {
    name: 'panelUpdate',
    data: function () {
        return BNBLink.Panels.findOne(this.params._id);
    },

    onBeforeAction: function () {
        Session.set("nav.detailPage", "Update Panel");
        this.next();
    }
});


Router.route('/panel/detail/:_id', {
    name: 'panelDetail',
    data: function () {
        var myPanel = BNBLink.Panels.findOne(this.params._id);

        if (myPanel) {
            Session.set("nav.detailPage", myPanel.name);
        }
        return myPanel;
    },

    onAfterAction: function () {
    }
});

Router.route("/conn/search", {
    name: "connSearch",
    onBeforeAction: function () {
        Session.set("nav.detailPage", "Maintain Connectors");
        this.next();
    }
});

Router.route('/conn/insert', {
    name: 'connInsert',
    onBeforeAction: function () {
        Session.set("nav.detailPage", "Add Connector");
        this.next();
    }
});

Router.route("/conn/update/:_id", {
    name: "connUpdate",
    data: function () {
        var myPanel;

        myPanel = BNBLink.Connectors.findOne(this.params._id);
        return myPanel;
    },

    onBeforeAction: function () {
        Session.set("nav.detailPage", "Update Connector");
        this.next();
    }
});

Router.route("/import/search", {
    name: "importSearch",
    onBeforeAction: function () {
        Session.set("nav.detailPage", "Maintain Imports");
        this.next();
    }
});

Router.route("/import/insert", {
    name: "importInsert",
    onBeforeAction: function () {
        Session.set("nav.detailPage", "Add Import");
        this.next();
    }
});

Router.route("/import/update/:_id", {
    name: "importUpdate",
    data: function () {
        var myPanel;

        myPanel = BNBLink.Imports.findOne(this.params._id);
        return myPanel;
    },

    onBeforeAction: function () {
        Session.set("nav.detailPage", "Update Import");
        this.next();
    }
});

Router.route('/role/insert', {
    name: 'roles',
    onBeforeAction: function () {
        Session.set("nav.detailPage", "Add Roles");
        this.next();
    }
});

Router.route('/role/update/:_id', {
    name: 'roleEdit',
    data: function () {
        var role = Meteor.roles.findOne(this.params._id);
        if (role) {
            Session.set("nav.detailPage", "Editing role: " + role.name);
        }
        return role;
    }
});


// Connector routes
Router.route("/connector/view/psQuery854/:_id", {
    name: "cPeopleSoftQuery854"
});
