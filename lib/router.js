BNBLink.navStack = [];

// Go Back method, which goes back to the previous page
BNBLink.goBack = function () {
    var prevPath;

    if (BNBLink.navStack.length > 1) {
        // get rid of the last path
        BNBLink.navStack.pop();

        // retrieve the previous path
        //prevPath = BNBLink.navStack[BNBLink.navStack.length - 1];
        prevPath = BNBLink.navStack.pop();
        console.log("prev path: " + prevPath)
        Router.go(prevPath);
    } else {
        // If there is only one page in the stack, then we need to go back to the home page.
        Router.go("/");
    }
};

Router.configure({
    layoutTemplate: "layout",
    loadingTemplate: "loading",
    waitOn: function () {
        return Meteor.subscribe('panels');
    }
});

Router.route('/', function () {
    // Reset the navigation stack.
    BNBLink.navStack = [];

    if (Meteor.user()) {
        this.render('main');
    } else {
        // TODO: First of all, we should try the last login, if it doesn't work, then we should request credentials
        this.render('login');
    }
});

Router.route('/coll/search', {
    name: 'collSearch',
    onBeforeAction: function () {
        BNBLink.navStack.push("collSearch");
        Session.set("nav.detailPage", "Maintain Collections");
        this.next();
    }
});

Router.route('/coll/insert', {
    name: 'collInsert',
    onBeforeAction: function () {
        BNBLink.navStack.push("collInsert");
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
        BNBLink.navStack.push("collUpdate");
        Session.set("nav.detailPage", "Update Collection");
        this.next();
    }
});

Router.route('/panel/subscribe', {
    name: 'panelSubscribe',
    onBeforeAction: function () {
        BNBLink.navStack.push("panelSubscribe");
        Session.set("nav.detailPage", "Add Panel");
        this.next();
    }
});

Router.route('/panel/search', {
    name: 'panelSearch',
    onBeforeAction: function () {
        BNBLink.navStack.push("panelSearch");
        Session.set("nav.detailPage", "Maintain Panels");
        this.next();
    }
});

Router.route('/panel/insert', {
    name: 'panelInsert',
    onBeforeAction: function () {
        BNBLink.navStack.push("panelInsert");
        Session.set("nav.detailPage", "Add Panel");
        this.next();
    }
});

Router.route('/panel/update/:_id', {
    name: 'panelUpdate',
    data: function () {
        //var myPanel = BNBLink.Panels.findOne(new Meteor.Collection.ObjectID(this.params._id));
        var myPanel;

        myPanel = BNBLink.Panels.findOne(this.params._id);
        return myPanel;
    },

    onBeforeAction: function () {
        BNBLink.navStack.push("panelUpdate");
        Session.set("nav.detailPage", "Update Panel");
        this.next();
    }
});


Router.route('/panel/detail/:_id', {
    name: 'panelDetail',
    data: function () {
        var myPanel = BNBLink.Panels.findOne(this.params._id);

        BNBLink.navStack.push("panelDetail");
        Session.set("nav.detailPage", myPanel.name);
        return myPanel;
    }
});

