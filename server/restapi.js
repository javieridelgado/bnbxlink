if (Meteor.isServer) {
    // API must be configured and built after startup!
    Meteor.startup(function () {

        // Global configuration
        Restivus.configure({
            useAuth: false     // TODO let's disable authentication for testing purposes
        });

        // Maps to: /api/rest/:org/:env/:coll/:id
        // TODO set authentication
        Restivus.addRoute("rest/:org/:env/:coll/:id", {authRequired: false}, {
            get: function () {
                var orgID, envID, coll, id;
                var collObj;
                var item;

                orgID = this.urlParams.org;
                envID = this.urlParams.env;
                coll = this.urlParams.coll;
                id = this.urlParams.id;

                if (!orgID || !envID || !coll) {
                    return {
                        statusCode: 404,
                        body: {status: "fail", message: "Invalid REST service locator"}
                    };
                }

                // declare collection
                collObj = BNBLink.declareCollection(coll, orgID, envID);
                console.log("api called: " + orgID, envID, coll, id);


                // look for the item
                item = collObj.findOne(id);
                if (item) {
                    return {status: "success", data: item};
                }
                return {
                    statusCode: 404,
                    body: {status: "fail", message: "Item not found"}
                };
            },

            put: function () {
                var orgID, envID, coll, id, data;
                var collObj;
                var item, count;

                data = this.bodyParams;
                orgID = this.urlParams.org;
                envID = this.urlParams.env;
                coll = this.urlParams.coll;
                id = this.urlParams.id;

                // declare collection
                collObj = BNBLink.declareCollection(coll, orgID, envID);

                if (!collObj) {
                    return {
                        statusCode: 404,
                        body: {status: "fail", message: "Invalid REST service locator"}
                    };
                }

                // look for the item
                count = collObj.find(id);
                if (count) {
                    collObj.update(id, data);

                    return {status: "success", data: data};
                }
                return {
                    statusCode: 404,
                    body: {status: "fail", message: "Item not found"}
                };
            },

            delete: function () {
                var orgID, envID, coll, id;
                var collObj;
                var item, count;

                orgID = this.urlParams.org;
                envID = this.urlParams.env;
                coll = this.urlParams.coll;
                id = this.urlParams.id;

                // declare collection
                collObj = BNBLink.declareCollection(coll, orgID, envID);

                if (!collObj) {
                    return {
                        statusCode: 404,
                        body: {status: "fail", message: "Invalid REST service locator"}
                    };
                }

                // delete the item
                count = collObj.remove(id);
                if (count) {
                    return {status: "success", data: {message: "Item removed"}};
                }
                return {
                    statusCode: 404,
                    body: {status: "fail", message: "Item not found"}
                };
            }
        });

        Restivus.addRoute("rest/:org/:env/:coll", {authRequired: false}, {
            get: function () {
                var orgID, envID, coll;
                var collObj, data;

                orgID = this.urlParams.org;
                envID = this.urlParams.env;
                coll = this.urlParams.coll;

                // declare collection
                collObj = BNBLink.declareCollection(coll, orgID, envID);

                if (!collObj) {
                    return {
                        statusCode: 404,
                        body: {status: "fail", message: "Invalid REST service locator"}
                    };
                }

                // insert data
                data = collObj.find({}).fetch();

                return {status: "success", data: data};
            },

            post: function () {
                var orgID, envID, coll;
                var collObj, data;
                var item;

                data = this.bodyParams;
                orgID = this.urlParams.org;
                envID = this.urlParams.env;
                coll = this.urlParams.coll;

                if (!orgID || !envID || !coll) {
                    return {
                        statusCode: 404,
                        body: {status: "fail", message: "Invalid REST service locator"}
                    };
                }

                // declare collection
                collObj = BNBLink.declareCollection(coll, orgID, envID);

                if (!collObj) {
                    return {
                        statusCode: 404,
                        body: {status: "fail", message: "Invalid REST service locator"}
                    };
                }

                // insert data
                data._id = collObj.insert(data);

                return {status: "success", data: data};
            },

            delete: function () {
                var orgID, envID, coll;
                var collObj;
                var count;

                orgID = this.urlParams.org;
                envID = this.urlParams.env;
                coll = this.urlParams.coll;

                // declare collection
                collObj = BNBLink.declareCollection(coll, orgID, envID);

                if (!collObj) {
                    return {
                        statusCode: 404,
                        body: {status: "fail", message: "Invalid REST service locator"}
                    };
                }

                // insert data
                count = collObj.remove({});

                return {status: "success", data: {"message": "Removed " + count + " items"}};
            }
        });

        // Maps to: /api/int/:org/:env/:coll/:id
        // Import configuration update
        Restivus.addRoute("int/importCfg/:id", {authRequired: false}, {
            put: function () {
                var id, data;
                var impObj;
                var count;

                data = this.bodyParams;
                id = this.urlParams.id;

                // update connector
                count = BNBLink.Imports.update({_id: id}, {$set: {configuration: data}});

                if (!count) {
                    return {
                        statusCode: 404,
                        body: {status: "fail", message: "Invalid REST service locator"}
                    };
                }

                return {status: "success", data: data};
            }
        });

        // Internal connectors
        // Maps to: /api/connector/config/psQuery854
        // TODO: separate them into different programs
        Restivus.addRoute("connector/config/psQuery854", {authRequired: false}, {
            post: function () {
                var configData, urlData, id;

                BNBLink.debug1 = this;
                configData = this.bodyParams;
                console.log(JSON.stringify(configData));
                urlData = "";
                if (configData) {
                    urlData = "?" + BNBLink.utils.objectToHash(configData);
                }
                console.log(urlData);

                return {status: "success", urlView: "http://localhost:3000/connector/view/psQuery854" + urlData};
            }
        });

    });
}