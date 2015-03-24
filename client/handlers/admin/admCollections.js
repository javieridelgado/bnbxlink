var psQueriesVar;

if (Meteor.isClient) {
    Template.admCollectionsAll.helpers({
        collections: function () {
            return BNBLink.Collections.find({});
        }
    });

    Template.collSearch.events({
        'click #addcollection': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.go('collInsert');
        }
    });

    Template.admCollectionSrch.events({
        'click #delCollection': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.Collections.remove(this._id);
        },

        'click #updCollection': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.go("collUpdate", {
                _id: this._id
            });
        }
    });

    Template.collectionCRUDbody.rendered = function () {
        var sourceType;
        // Enable autosize for all text areas
        this.$("textarea").autosize();

        // Hide source specific fields
        this.$(".bnbsource").hide();

        // Retrieve source
        sourceType = this.$('select[name="sourceType"]').val().replace(/\s+/g, '');
        this.$('fieldset.bnbsource[id="source' + sourceType + '"]').show();
    };

    Template.collUpdate.helpers({
        psQueries: function () {
            var result;

            result = [{
                label: "no queries loaded",
                value: "null"
            }];

            if (!psQueriesVar)
                psQueriesVar = new ReactiveVar(result);

            result = psQueriesVar.get();

            return result;
        }
    });

    Template.collectionCRUDbody.helpers({
        envID: function () {
            return Session.get("currentEnvironment");
        }
    });

    Template.collectionCRUDbody.events({

        'change textarea[name="dataInput"]': function (event) {
            /*var parseOutput = CSVParser.parse(event.target.value, true, 'tab', true, false);

            var dataGrid = parseOutput.dataGrid;
            var headerNames = parseOutput.headerNames;
            var headerTypes = parseOutput.headerTypes;
            var errors = parseOutput.errors;

            var outputText = toJSON(dataGrid, headerNames, headerTypes, '  ', '\n');*/

            event.preventDefault();
            /*$('#outputJSONExcel').val(outputText);

            Meteor.call("populateCollection", "test", JSON.parse(outputText), true, function (error, results) {
                BNBLink.log(results); //results.data should be a JSON object
            });*/

        },

        'change select[name="sourceType"]': function (event, template) {
            template.$(".bnbsource").hide();
            template.$('fieldset.bnbsource[id="source' + event.target.value.replace(/\s+/g, '') + '"]').show();
        },

        'click #psGetQueries': function (event) {
            var url, params, user, password;

            url = $("#psURLQuery").val();
            user = $("#psUserQuery").val();
            password = $("#psPasswordQuery").val();

            Meteor.call("psGetQueries", url, user, password, function (error, results) {
                $('#outputJSONPeopleSoftQuery').val(JSON.stringify(results));

                if (!psQueriesVar)
                    psQueriesVar = new ReactiveVar(results);
                else
                    psQueriesVar.set(results);
            });
        },

        'change #psQuery': function (event) {
            var url, params, user, password, query, collection;

            collection = $("#collName").val();
            url = $("#psURLQuery").val();
            user = $("#psUserQuery").val();
            password = $("#psPasswordQuery").val();
            query = $("#psQuery").val();

            Meteor.call("psSaveQuery", url, user, password, query, collection, function (error, results) {
                $('#outputJSONPeopleSoftQuery').val(results);
            });
        },

        'click #psTest': function (event) {
            var url, params, user, password;

            url = $("input[name='psURL']").val();
            params = $("input[name='psParameters']").val();
            user = $("input[name='psUser']").val();
            password = $("input[name='psPassword']").val();

            Meteor.call("testCall", url, params, user, password, function (error, results) {
                $('#outputJSONPeopleSoft').val(results);
            });
        }
    });
}