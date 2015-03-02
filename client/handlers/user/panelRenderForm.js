// This only runs on the client
if (Meteor.isClient) {
    Template.panelRenderForm.events({
        "submit form.bnbform": function (event, template) {
            var data, formArray;

            data = {};
            formArray = $("form.bnbform").serializeArray();
            formArray.forEach(function(item) {
                data[item.name] = item.value;
            });

            console.log("submit form= " + JSON.stringify(data));
            BNBLink.debug = this;
            event.preventDefault();

            //Meteor.call("saveForm", this.panel.collectionBase, template.parentInstance.panelData[0]._id, data, function (error, results) {
            Meteor.call("saveForm", this.collectionBase, template.parentInstance.panelData[0]._id, data, function (error, results) {
                console.log(results); //results.data should be a JSON object
            });
        }
    });


}