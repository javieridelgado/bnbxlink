// On Client and Server
if (Meteor.isClient) {

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
        },

        topGenresChart: function () {
            return {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    layout: 'vertical',
                    align: 'center',
                    useHTML: true,
                    verticalAlign: 'bottom',
                    labelFormatter: function () {
                        return '<div style="width:200px"><span style="float:left">' + this.name + '</span><span style="float:right">' + this.y + '%</span></div>';
                    }
                },
                title: {
                    text: ""
                },
                tooltip: {
                    pointFormat: '<b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        showInLegend: true,
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'genre',
                    data: [
                ['New York', 45.0],
                ['Buenos Aires', 26.8],
                ['Madrid', 12.8],
                ['Milano', 8.5],
                ['Other', 6.2]
            ]
        }]
            };
        }
    });

    Template.dashboard.events({
        'click li.list-group-item': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.log('click panel ' + this._id);
            Router.go("panelDetail", {
                _id: this._id
            });
        }
    });

}