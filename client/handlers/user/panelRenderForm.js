// This only runs on the client
if (Meteor.isClient) {
    Template.panelRenderForm.rendered = function () {
        var instance = this;

        // Force the execution of this code whenever the panel is refreshed
        this.autorun(function() {
            var doc, field, done;
            var f_AssignName;
            var panelData;
            var data;

            // We use Template.currentData instead of instance.data because it sets a reactive dependency with the
            // panel data. Every time a different panel is loaded, this code is executed again.
            panelData = Template.currentData();

            // Retrieve the document data
            data = instance.parentInstance.panelData.get();
            if (data && data.length) {
                doc = data[0];
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

            // TODO: when submitting, the ratings are duplicated
            // Set rating inputs
            $("input.bnbrating").rating({size: "xs", step: 1, showCaption: false});
        });
    }

    Template.panelRenderForm.events({
        "submit form.bnbform": function (event, template) {
            var data, oldData, formArray;

            // retrieve the current form data
            data = {};
            formArray = template.$("form.bnbform").serializeArray();
            formArray.forEach(function(item) {
                data[item.name] = item.value;
            });

            // retrieve previous data
            oldData = template.parentInstance.panelData.get();

            // call method to save the form information
            Meteor.call("saveForm", this.collectionBase, oldData[0]._id, data, function (error, results) {
                BNBLink.log(results); //results.data should be a JSON object
            });

            // we don't want to process further actions
            return false;
        }
    });


}