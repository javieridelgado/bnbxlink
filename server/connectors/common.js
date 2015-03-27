Meteor.methods({
    // TODO: security needs to be reviewed... we don't want to update connectors from other organizations/environments
    updateConnectorConfig: function (importId, config) {
        Meteor.http.put("http://localhost:3000/api/int/importCfg/" + importId, {data: config}, function (error, result) {
            if (error)
                return;

            if (result) {
            }
        });
    }
});