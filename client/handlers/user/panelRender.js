// This only runs on the client
if (Meteor.isClient) {

    var onCreate = function () {
        var parent;

        // we will try to store the attributes in the parent.
        parent = this.closestInstance("panelView");
        if (!parent) {
            parent = this.closestInstance("panelViewDetail");
            this.panelType = "detail";
        } else {
            this.panelType = "dashboard";
        }

        // if it does not exist, we will take this instance as the parent
        if (!parent) {
            parent = this;
        }
        this.parentInstance = parent;
    }

    // fetches data and associates it to the instance and the parent instance (if any)
    var fetchData = function (data, instance, force) {
        var coll, filter;
        var ctxHash;
        var parent;

        // populate the context variables
        coll = data.collectionBase;
        filter = data.collectionFilter;
        parent = instance.parentInstance;

        console.log("reading data for collection " + coll + " with filter " + filter + " on panel " + data._id);

        // Retrieve context parameters
        ctxHash = "";
        if (Router) {
            ctxHash = JSON.stringify(Router.current().params.query);
        }
        ctxHash = ctxHash + "|" + data._id;

        // we should do nothing the information was already loaded
        if (!force && parent.dataProcessedHash && parent.dataProcessedHash == ctxHash)
            return;

        // mark the information as generated, so we don't process again unless forced
        parent.dataProcessedHash = ctxHash;

        // initialize reactive variable
        parent.panelData = new ReactiveVar("");

        // If there is no collection, then no data can be retrieved
        if (!coll) {
            parent.panelData.set(null);
            return null;
        }

        BNBLink.enableCollection(coll, function () {
            var ctrl, fltr;
            var p, n;

            console.log("fetching data for collection " + coll + " with filter " + filter);

            if (filter) {
                /* Retrieve filter parameters */
                if (Router) {
                    ctrl = Router.current();

                    /* Replace filter parameters */
                    for (p in ctrl.params.query) {
                        // Retrieve parameter number
                        n = p.substring(1);
                        filter = filter.replace("%" + n + "%", ctrl.params.query[p]);
                    }
                }

                console.log("filter: " + filter);
                /* Convert to filter object */
                fltr = JSON.parse(filter);
            }
            else fltr = {};

            parent.panelData.set(BNBLink.collections[coll].find(fltr).fetch());
        });
    }

    // Set creation handlers
    Template.panelRender.created = onCreate;
    Template.panelRenderHeader.created = onCreate;
    Template.panelRenderFooter.created = onCreate;
    Template.panelRenderDetail.created = onCreate;
    Template.panelRenderHTML.created = onCreate;

    // Helpers
    Template.panelRenderHTML.helpers({
        /* Dashboard display helpers */
        displayHTML: function () {
            var cursor, instance, transform, template;

            instance = Template.instance();

            console.log("rendering HTML part: " + this.part);
            switch (this.part) {
                case "header":
                    transform = this.doc.jsonTransformSumHeader;
                    break;
                case "footer":
                    transform = this.doc.jsonTransformSumFooter;
                    break;
                case "detail":
                    transform = this.doc.jsonTransformDtl;
                    break;
                default:
                    transform = this.doc.jsonTransformSum;
                    break;
            }

            template = _.template(transform);

            // Retrieve data
            fetchData(this.doc, instance);

            // Transform data
            cursor = {};
            cursor.values = instance.parentInstance.panelData.get();
            return template(cursor);
        }
    });

    Template.panelRender.helpers({
        /* Dashboard display helpers */
        isHTML: function () {
            return this.panelType == "HTML";
        },

        isForm: function () {
            return this.panelType == "Form";
        },

        isChart: function () {
            return this.panelType == "Chart";
        },

        chartData: function () {
            var data, instance, otherSum;
            var myChart = {};
            var coll;

            myChart.chart = {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                margin: [0, 0, 0, 0],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0
            };

            myChart.credits = {enabled: false};

            myChart.legend = {
                enabled: false,
                layout: 'vertical',
                align: 'center',
                useHTML: true,
                verticalAlign: 'bottom',
                labelFormatter: function () {
                    return '<div style="width:200px"><span style="float:left">' + this.name + '</span><span style="float:right">' + this.y + '%</span></div>';
                }
            };

            myChart.title = {
                text: ""
            };

            myChart.tooltip = {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            };

            myChart.plotOptions = {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    showInLegend: true,
                    dataLabels: {
                        enabled: true
                    }
                }
            };

            myChart.series =
                [{
                    type: 'pie',
                    name: 'genre',
                    data: []
                }];

            instance = Template.instance();

            // Retrieve data
            console.log("fetch chart data...");
            fetchData(this, instance);

            // Transform data
            data = instance.parentInstance.panelData.get();

            if (data) {
                console.log("we have chart data!");
                otherSum = 0;

                data = data
                    .filter(function (item) {
                        var count;

                        count = Number(item.A_BIRTHSTATE);
                        if (count < 50) {
                            otherSum += count;
                            return false;
                        }

                        return true;
                    })
                    .map(function (item) {
                        return [item.B_DESCR, Number(item.A_BIRTHSTATE)];
                    });

                data.push(["Others", otherSum]);
                myChart.series[0].data = data;
                $("#test").highcharts(myChart);
            }

            return myChart;
        }
    });
}