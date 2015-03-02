// This only runs on the client
if (Meteor.isClient) {
    Template.panelRenderForm.events({
        "submit form": function (event, template) {
            var data;

            data = JSON.stringify($("form").serializeArray());

            console.log("submit form= " + data);
            BNBLink.debug = template;
            event.preventDefault();

            data = {description: "new one"};
            console.log("submit form");
            Meteor.call("saveForm", this.panel.collectionBase, template.parentInstance.panelData[0]._id, data, function (error, results) {
                console.log(results); //results.data should be a JSON object
            });
        }
    });


}