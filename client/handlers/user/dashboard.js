// On Client and Server
if (Meteor.isClient) {
    BNBLink.clicks = 0;

    Template.dashboard.helpers({
        panels: function () {
            var myUser;

            // We should only show the panels to which the user has subscribed
            BNBLink.log('dasboard.h.panels: entered');
            var myPanels = Meteor.users.find(Meteor.userId(), {
                fields: {
                    "panels.panelID": 1
                }
            })
                .map(function (u) {
                    var idarray = [];

                    if (u.panels) {
                        for (var i = 0; i < u.panels.length; i++)
                            idarray.push(u.panels[i].panelID);
                    }

                    return idarray;
                });

            for (var i = 0; i < myPanels[0].length; i++)
                BNBLink.log('dashboard panel: ' + myPanels[0][i]);

            return BNBLink.Panels.find({
                _id: {
                    $in: myPanels[0]
                }
            });
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

        displayHTML: function () {
            var instance, transform;
            var coll;

            // TODO: make this helper reactive when the collection changes
            coll = this.collectionBase;
            transform = this.jsonTransformSum;

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
                var template, cursor;

                BNBLink.log("callback called");
                template = _.template(transform);

                cursor = {};
                cursor.values = BNBLink.collections[coll].find().fetch();
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
                    /*data: [
                     ['New York', 45.0],
                     ['Buenos Aires', 26.8],
                     ['Madrid', 12.8],
                     ['Milano', 8.5],
                     ['Other', 6.2]
                     ]*/
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

                BNBLink.enableCollection(coll, function () {
                    var template, data, otherSum;

                    BNBLink.log("callback called");
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

                    BNBLink.debug = data;
                    instance.chartData.set(data);
                });

                myChart.series[0].data = instance.chartData.get();
            }

            return myChart;
        }
    })
    ;

    Template.dashboard.events({
        //'click li.list-group-item': function (event) {
        'click div.panel': function (event) {
            //event.preventDefault();
            // This functionality should search within the current data of the added panels
            if (!BNBLink.clicks) {
                Template.dashboard.events({
                    "click div.panel-body": function (event) {
                        alert(BNBLink.clicks);
                    }
                });
            }

            BNBLink.clicks++;
            console.log(BNBLink.clicks);

            if (false) {
                BNBLink.log('click panel ' + this._id);

                Router.go("panelDetail", {
                    _id: this._id
                });
            }
        }/*,

        "click div.panel-body": function (event) {
            alert(BNBLink.clicks);
        }*/
    });

    var mySchema = new SimpleSchema({
        name: {
            type: String,
            label: "Your name",
            max: 50
        },
        email: {
            type: String,
            regEx: SimpleSchema.RegEx.Email,
            label: "E-mail address"
        },
        message: {
            type: String,
            label: "Message",
            max: 1000
        }
    });

    var fieldArray = [{fieldName: "name"}, {fieldName: "email"}, {fieldName: "message"}];


    Template.panelInput.helpers({
        fields: function () {
            return fieldArray;
        },

        /*fieldName: function () {
         return "name";
         },*/

        contactFormSchema: function () {
            return new SimpleSchema({
                name: {
                    type: String,
                    label: "Your name",
                    max: 50
                },
                email: {
                    type: String,
                    regEx: SimpleSchema.RegEx.Email,
                    label: "E-mail address"
                },
                message: {
                    type: String,
                    label: "Message",
                    max: 1000
                }
            });
        }
    });
}