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

    // Set creation handlers
    Template.panelRender.created = onCreate;
    Template.panelRenderHeader.created = onCreate;
    Template.panelRenderFooter.created = onCreate;
    Template.panelRenderForm.created = onCreate;
    Template.panelRenderHTML.created = onCreate;

    // Helpers
    Template.panelRenderHTML.helpers({
        /* Dashboard display helpers */
        displayHTML: function () {
            var cursor, instance, transform, template, done;

            instance = Template.instance();

            switch (this.part) {
                case "header":
                    transform = this.panel.jsonTransformSumHeader;
                    break;
                case "footer":
                    transform = this.panel.jsonTransformSumFooter;
                    break;
                default:
                    transform = this.panel.jsonTransformSum;
                    break;
            }
            template = _.template(transform);

            // Retrieve data
            BNBLink.fetchData(this.panel, instance);

            // Transform data
            cursor = {};
            done = instance.parentInstance.panelDataRetrieved.get();
            if (done) {
                cursor.values = instance.parentInstance.panelData;
                return template(cursor);
            }

            return "";
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
            var data, instance, otherSum, done;
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
            BNBLink.log("fetch chart data...");
            fetchData(this, instance);

            // Transform data
            done = instance.parentInstance.panelDataRetrieved.get();
            data = instance.parentInstance.panelData;

            if (data) {
                BNBLink.log("we have chart data!");
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