if (Meteor.isServer) {
    // API must be configured and built after startup!
    Meteor.startup(function () {

        // Global configuration
        Restivus.configure({
            useAuth: false,      // TODO let's disable authentication for testing purposes
            prettyJson: true
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

    });
}