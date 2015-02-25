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

    Template.panelView.created = function () {
        // initialize the panel data attribute
        this.panelData = new ReactiveVar("");
    }

    Template.panelView.rendered = function () {
        var instance = this;

        // Create handlers
        instance.handlers = {};

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

        // Initialize touch gestures
        /*var h = new Hammer(this.firstNode, {
         drag_min_distance: 1,
         swipe_velocity: 0.1
         });*/
        /*
         var hammertime = new Hammer(this.firstNode, {
         drag_min_distance: 1,
         swipe_velocity: 0.1
         });

         hammertime.on("swipeleft", function(ev) {
         $("div.panel-heading").append("<p>Swipe Left</p>");
         console.log("swipe");
         });

         hammertime.on("swiperight", function(ev) {
         $("div.panel-heading").append("<p>Swipe Right</p>");
         console.log("swipe");
         });*/

        /*var el = document.getElementById("dashboard");
         var sortable = Sortable.create(el);*/
    }

    Template.panelView.events({
        "click *": function (event, template) {
            var handlers;
            var matching = [];
            var i, param;

            console.log(event.target.nodeName);

            // Check if the target matches any of the selectors
            if (template.handlers["click"]) {
                template.handlers["click"].forEach(function (item) {
                    if (event.currentTarget.matches(item.name)) {
                        console.log("matching element: " + event.currentTarget.nodeName);
                        matching.push(item);
                    }
                });

                // If the event has been handled, the stop propagation
                if (matching.length) {
                    event.stopPropagation();

                    // retrieve parameters
                    console.log(matching[0].params);
                    param = event.currentTarget.getAttribute(matching[0].params);
                    console.log(param);

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

        },

        // Avoid dragging based on panel body
        "mousedown div.panel-body": function (event, t) {
            event.preventDefault();
        }

        /*"dblclick div.panel.panel-default": function (event, t) {
         console.log("hola");
         t.$("div.panel-heading").append("<p>Swipe Left</p>");
         event.preventDefault();
         }*//*,

         "swipeleft div.panel.panel-default": function (event, t) {
         t.$("div.panel-heading").append("<p>Swipe Left</p>");
         event.preventDefault();
         },

         "swiperight div.panel.panel-default": function (event, t) {
         t.$("div.panel-heading").append("<p>Swipe Right</p>");
         event.preventDefault();
         }*/



        //'click li.list-group-item': function (event) {
        /*'click div.panel': function (event) {
         //event.preventDefault();
         // This functionality should search within the current data of the added panels
         BNBLink.clicks++;
         console.log(BNBLink.clicks);

         if (false) {
         BNBLink.log('click panel ' + this._id);

         Router.go("panelDetail", {
         _id: this._id
         });
         }
         }*//*,

         "click div.panel-body": function (event) {
         alert(BNBLink.clicks);
         }*/
    });

}