// This only runs on the client
if (Meteor.isClient) {
    Template.panelView.helpers({
        // feed the panel style
        panelStyle: function () {
            return this.sumPanelStyle || "default";
        },

        // should we show a custom header or not?
        customPanelHeader: function () {
            if (this.jsonTransformSumHeader)
                return true;

            return false;
        },

        // should we show a the panel body or not
        hasPanelBody: function () {
            if (this.jsonTransformSum || this.panelType != "HTML")
                return true;

            return false;
        },

        // should we show a the panel footer or not
        hasPanelFooter: function () {
            if (this.jsonTransformSumFooter)
                return true;

            return false;
        }
    });

    // Common functions
    var onCreate = function () {
        // initialize the panel data attribute
        this.panelDataRetrieved = new ReactiveVar("");
    }

    var onRender = function () {
        var instance = this;

        // This part of the code should be run every time the panel data is refreshed
        this.autorun(function() {
            var data;

            // We use Template.currentData instead of instance.data because it sets a reactive dependency with the
            // panel data. Every time a different panel is loaded, this code is executed again.
            data = Template.currentData();

            // Create handlers
            instance.handlers = {};
            if (data.actions) {
                data.actions.forEach(function (item) {
                    var parameters;

                    // If there is a parameter, we need to split them into an array
                    if (item.params) {
                        parameters = item.params.split(",")
                            .map(function (item) {
                                return item.trim();
                            });
                    } else {
                        parameters = [];
                    }
                    item.parameters = parameters;

                    if (!instance.handlers[item.event]) {
                        instance.handlers[item.event] = [item];
                    } else {
                        instance.handlers[item.event].push(item);
                    }
                });
            }
        });
    }

    var handlePanelEvent = function (eventName, event, template) {
        var handlers;
        var matching = [];
        var i, param, querystr;

        // Check if the target matches any of the selectors
        if (template.handlers[eventName]) {
            template.handlers[eventName].forEach(function (item) {
                if (event.currentTarget.matches(item.name)) {
                    BNBLink.log("matching element: " + event.currentTarget.nodeName);
                    matching.push(item);
                }
            });

            // If the event has been handled, the stop propagation
            // TODO: if there is more than one, we should show a context menu
            if (matching.length) {
                event.stopPropagation();

                // retrieve parameters
                querystr = "";
                matching[0].parameters.forEach(function(paramName, paramNbr) {
                    var pnbr;

                    pnbr = paramNbr + 1;

                    if (querystr)
                        querystr = querystr + "&";

                    querystr = querystr + "p" + pnbr + "=" + event.currentTarget.getAttribute(paramName);
                });

                // route to the new direction
                BNBLink.go("panelDetail", {
                    _id: matching[0].panel
                }, {
                    query: querystr
                });
            }
        }

        // Check if we are at the top level
        if (event.currentTarget.matches("div.panel")) {
            // if there is a detail panel
            if (this.jsonTransformDtl) {
                // go to the detail panel
                BNBLink.go("panelDetail", {
                    _id: this._id
                });
            }
        }
    }

    Template.panelView.created = onCreate;
    Template.panelViewDetail.created = onCreate;

    Template.panelView.rendered = onRender;
    Template.panelViewDetail.rendered = onRender;

    Template.panelView.events({
        "click *": function (event, template) {
            // Check if we are at the top level
            if (event.currentTarget.matches("div.bnbsummarypanel")) {
                // if there is a detail panel
                if (this.detailPanel) {
                    // go to the detail panel
                    BNBLink.go("panelDetail", {
                        _id: this.detailPanel
                    });
                    return false;
                }
            }

            handlePanelEvent("click", event, template);
        },

        // Avoid dragging based on panel body
        "mousedown div.panel-body": function (event, t) {
            event.preventDefault();
        }
    });

    Template.panelViewDetail.events({
        "click *": function (event, template) {
            handlePanelEvent("click", event, template);
        }
    });

}