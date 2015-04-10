// Connector routes
Router.route("/connector/view/psQuery854", {
    name: "cPeopleSoftQuery854",
    data: function() {
        return this.params.query;
    }
});

Router.route("/connector/view/googleSheets", {
    name: "cGoogleSheets",
    data: function() {
        return this.params.query;
    }
});
