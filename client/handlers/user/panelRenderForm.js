// This only runs on the client
if (Meteor.isClient) {
    Template.panelRenderForm.events({
        "submit form": function (event, template) {
            var data;

            console.log("submit form");
            BNBLink.debug = template;
            event.preventDefault();

            data = {_id: template.parentInstance.panelData[0]._id, description: "new one"};
            console.log("submit form");
            Meteor.call("saveForm", this.panel.collectionBase, data, function (error, results) {
                console.log(results); //results.data should be a JSON object
            });
        }
    });


}