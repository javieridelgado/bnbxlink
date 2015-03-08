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

        // should we show the panel body or not
        hasPanelBody: function () {
            if (this.jsonTransformSum || this.panelType != "HTML")
                return true;

            return false;
        },

        // should we show the panel footer or not
        hasPanelFooter: function () {
            if (this.jsonTransformSumFooter)
                return true;

            return false;
        }
    });

    // Common functions
    var onViewCreate = function () {
        // initialize the panel data attribute
        this.panelData = new ReactiveVar([]);
    }

    var onViewRender = function () {
        var instance = this;

        console.log("panelView rendered");

        // This part of the code should be run every time the panel data is refreshed
        this.autorun(function () {
            var panelData, coll, filter;
            var ctrl, fltr, params;
            var p, n;

            // We use Template.currentData instead of instance.data because it sets a reactive dependency with the
            // panel data. Every time a different panel is loaded, this code is executed again.
            panelData = Template.currentData();

            // Every time the panel data is reloaded, we need to reinitialize the variables.
            instance.handlers = {};
            instance.panelData.set([]);

            // load handlers
            if (panelData.actions) {
                panelData.actions.forEach(function (item) {
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

            // retrieve panel metadata
            coll = panelData.collectionBase;
            filter = panelData.collectionFilter;

            // if no collection, then exit
            if (!coll) {
                return;
            }

            // if there is a filter, we need to take it into account
            if (filter) {
                /* Retrieve filter parameters */
                if (Router) {
                    ctrl = Router.current();

                    // this is a reactive call to obtain the panel parameters. if they change, the code will be
                    // re-executed automatically.
                    params = ctrl.getParams();

                    /* Replace filter parameters */
                    for (p in params.query) {
                        // Retrieve parameter number
                        n = p.substring(1);
                        filter = filter.replace("%" + n + "%", ctrl.params.query[p]);
                    }
                }

                BNBLink.log("panel view filter: " + filter);
                /* Convert to filter object */
                fltr = JSON.parse(filter);
            }
            else fltr = {};

            // enable collection
            BNBLink.enableCollection(coll, function () {
                instance.panelData.set(BNBLink.collections[coll].find(fltr).fetch());
            });
        });
    }

    var handlePanelEvent = function (eventName, event, template) {
        var handlers;
        var matching = [];
        var i, param, querystr;

        // Check if the target matches any of the selectors and save the handlers in the matching array.
        if (template.handlers[eventName]) {
            template.handlers[eventName].forEach(function (item) {
                if (event.currentTarget.matches(item.name)) {
                    matching.push(item);
                }
            });

            // If the event has been handled, the stop propagation
            // TODO: if there is more than one, we should show a context menu
            if (matching.length) {
                event.stopPropagation();

                // retrieve parameters
                querystr = "";
                matching[0].parameters.forEach(function (paramName, paramNbr) {
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
    }

    Template.panelView.created = onViewCreate;
    Template.panelViewDetail.created = onViewCreate;

    Template.panelView.rendered = onViewRender;
    Template.panelViewDetail.rendered = onViewRender;

    Template.panelView.events({
        "click *": function (event, template) {
            handlePanelEvent("click", event, template);
        },

        // handle summary menu click
        "click button.bnbsummarymenu": function (event, template) {
            template.$('.dropdown-toggle').dropdown("toggle");
            return false;
        },

        // handle remove event
        "click a.bnbsummaryremove": function (event, template) {
            Meteor.call('delPanel', this._id, Meteor.userId(), function (error, result) {
                if (error)
                    return BNBLink.log(error.reason);
            });
            return false;
        },

        // handle zoom event
        "click a.bnbsummaryzoom": function (event, template) {
            BNBLink.go("panelDetail", {
                _id: this._id
            });
            return false;
        },

        // Avoid dragging based on panel body
        "mousedown div.panel-body": function (event, t) {
            event.preventDefault();
        },

        // handle go to detail panel event
        "click div.bnbsummarypanel": function (event, template) {
            // if there is a detail panel
            if (this.detailPanel) {
                // go to the detail panel
                BNBLink.go("panelDetail", {
                    _id: this.detailPanel
                });
                return false;
            }
        }
    });

    Template.panelViewDetail.events({
        "click *": function (event, template) {
            handlePanelEvent("click", event, template);
        }
    });

}