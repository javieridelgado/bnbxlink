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
    var onCreate = function() {
        // initialize the panel data attribute
        this.panelData = new ReactiveVar("");
    }

    var onRender = function () {
        var instance = this;

        // Create handlers
        instance.handlers = {};
        BNBLink.debug = instance;
        if (this.data.actions) {
            this.data.actions.forEach(function (item) {
                if (!instance.handlers[item.event]) {
                    console.log("new item: " + item.command);
                    instance.handlers[item.event] = [item];
                } else {
                    console.log("add item: " + item.command);
                    instance.handlers[item.event].push(item);
                }
            });
        }
    }

    var handlePanelEvent = function(eventName, event, template) {
        var handlers;
        var matching = [];
        var i, param;

        BNBLink.debug = template;

        // Check if the target matches any of the selectors
        if (template.handlers[eventName]) {
            template.handlers[eventName].forEach(function (item) {
                if (event.currentTarget.matches(item.name)) {
                    console.log("matching element: " + event.currentTarget.nodeName);
                    matching.push(item);
                }
            });

            // If the event has been handled, the stop propagation
            if (matching.length) {
                event.stopPropagation();

                // retrieve parameters
                param = event.currentTarget.getAttribute(matching[0].params);

                // route to the new direction
                Router.go("panelDetail", {
                    _id: matching[0].panel
                }, {
                    query: "p1=" + param
                });
            }
        }

        // Check if we are at the top level
        if (event.currentTarget.matches("div.panel")) {
            // if there is a detail panel
            if (this.jsonTransformDtl) {
                // go to the detail panel
                Router.go("panelDetail", {
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
            if (event.currentTarget.matches("div.panel")) {
                // if there is a detail panel
                if (this.jsonTransformDtl) {
                    // go to the detail panel
                    Router.go("panelDetail", {
                        _id: this._id
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