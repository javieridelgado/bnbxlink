Meteor.methods({
    // TODO: security needs to be reviewed... we don't want to update connectors from other organizations/environments
    updateImportConfig: function (importId, config) {
        console.log("calling config update for " + importId);
        Meteor.http.put("http://localhost:3000/api/int/importCfg/" + importId, {data: config}, function (error, result) {
            if (error)
                return;

            if (result) {
            }
        });
    }
});