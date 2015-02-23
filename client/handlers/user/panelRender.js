// This only runs on the client
if (Meteor.isClient) {

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

        displayHTML: function () {
            var instance, transform;
            var coll, filter;

            // TODO: make this helper reactive when the collection changes
            coll = this.collectionBase;
            transform = this.jsonTransformSum;
            filter = this.collectionFilter;

            // If the collection is not set, then the transformation is a plain HTML
            if (!coll)
                return transform;

            instance = Template.instance();

            // Create reactive var if it doesn't exist
            if (!instance.displayHTML) {
                instance.displayHTML = new ReactiveVar("");
                instance.displayHTML.set("");
            }

            BNBLink.enableCollection(coll, function () {
                var template, cursor, ctrl, fltr;
                var p, n;

                BNBLink.log("callback called");
                template = _.template(transform);
                console.log("filter: " + filter);

                if (filter) {
                    /* Retrieve filter parameters */
                    if (Router) {
                        ctrl = Router.current();

                        /* Replace filter parameters */
                        for (p in ctrl.params.query) {
                            // Retrieve parameter number
                            n = p.substring(1);

                            console.log("retrieve parameter " + n);
                            filter = filter.replace("%" + n + "%", ctrl.params.query[p]);
                        }
                    }

                    console.log("filter: " + filter);
                    /* Convert to filter object */
                    fltr = JSON.parse(filter);
                }
                else fltr = {};

                cursor = {};
                cursor.values = BNBLink.collections[coll].find(fltr).fetch();
                instance.displayHTML.set(template(cursor));
            });

            return instance.displayHTML.get();
        },

        chartData: function () {
            var myChart = {};
            var coll, instance;

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

            // Populate data
            // TODO: make this helper reactive when the collection changes
            coll = this.collectionBase;

            // If the collection is not set, then the transformation is a plain HTML
            if (coll) {
                instance = Template.instance();

                // Create reactive var if it doesn't exist
                if (!instance.chartData) {
                    instance.chartData = new ReactiveVar("");
                    instance.chartData.set("");
                }
                console.log("chart data set");

                BNBLink.enableCollection(coll, function () {
                    var template, data, otherSum;

                    otherSum = 0;

                    data = BNBLink.collections[coll].find().fetch()
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

                    instance.chartData.set(data);
                    console.log("final chart data set");
                });

                myChart.series[0].data = instance.chartData.get();
                console.log("chart data get");
            }

            console.log("return chart");

            // Refresh chart
            $("#test").highcharts(myChart);

            return myChart;
        }
    });
}