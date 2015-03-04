// This only runs on the client
if (Meteor.isClient) {
    Template.panelRenderForm.rendered = function () {
        var doc, field, done;
        var instance = this;

        // Force the execution of this code whenever the panel is refreshed
        this.autorun(function() {
            var f_AssignName;
            var data;

            // We use Template.currentData instead of instance.data because it sets a reactive dependency with the
            // panel data. Every time a different panel is loaded, this code is executed again.
            data = Template.currentData();

            // Retrieve the document data
            BNBLink.fetchData(data, instance);

            BNBLink.log("populating form");
            done = instance.parentInstance.panelDataRetrieved.get();
            if (instance.parentInstance.panelData && instance.parentInstance.panelData.length) {
                doc = instance.parentInstance.panelData[0];
            } else {
                return;
            }

            // Fill the form with the document data
            for (field in doc) {
                if (doc[field]) {
                    $("#" + field).attr("name", field).val(doc[field]);
                }
            }

            f_AssignName = function () {
                $(this).attr("name", $(this).attr("id"));
            }

            $("input[id]").each(f_AssignName);
            $("textarea[id]").each(f_AssignName);

            // Set rating inputs
            $("input.bnbrating").rating({size: "xs", step: 1, showCaption: false});
        });
    }

    Template.panelRenderForm.events({
        "submit form.bnbform": function (event, template) {
            var data, formArray;

            data = {};
            formArray = $("form.bnbform").serializeArray();
            formArray.forEach(function(item) {
                data[item.name] = item.value;
            });

            BNBLink.log("submit form= " + JSON.stringify(data));
            event.preventDefault();

            //Meteor.call("saveForm", this.panel.collectionBase, template.parentInstance.panelData[0]._id, data, function (error, results) {
            Meteor.call("saveForm", this.collectionBase, template.parentInstance.panelData[0]._id, data, function (error, results) {
                BNBLink.log(results); //results.data should be a JSON object
            });
        }
    });


}