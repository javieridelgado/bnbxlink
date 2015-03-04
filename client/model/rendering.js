if (Meteor.isClient) {

    // fetches data and associates it to the instance and the parent instance (if any)
    BNBLink.fetchData = function (panel, instance, force) {
        var coll, filter;
        var ctxHash;
        var parent;

        // populate the context variables
        coll = panel.collectionBase;
        filter = panel.collectionFilter;
        parent = instance.parentInstance;

        BNBLink.log("reading data for collection " + coll + " with filter " + filter + " on panel " + panel._id);

        // Retrieve context parameters
        ctxHash = "";
        if (Router) {
            ctxHash = JSON.stringify(Router.current().params.query);
        }
        ctxHash = ctxHash + "|" + panel._id;

        // we should do nothing the information was already loaded
        if (!force && parent.dataProcessedHash && parent.dataProcessedHash == ctxHash)
            return;

        // mark the information as generated, so we don't process again unless forced
        parent.dataProcessedHash = ctxHash;

        // initialize reactive variable
        parent.panelDataRetrieved = new ReactiveVar("");
        parent.panelData = null;

        // If there is no collection, then no data can be retrieved
        parent.panelDataRetrieved.set(false);
        if (!coll) {
            return null;
        }

        BNBLink.enableCollection(coll, function () {
            var ctrl, fltr;
            var p, n;

            BNBLink.log("fetching data for collection " + coll + " with filter " + filter);

            if (filter) {
                /* Retrieve filter parameters */
                if (Router) {
                    ctrl = Router.current();

                    /* Replace filter parameters */
                    for (p in ctrl.params.query) {
                        // Retrieve parameter number
                        n = p.substring(1);
                        filter = filter.replace("%" + n + "%", ctrl.params.query[p]);
                    }
                }

                BNBLink.log("filter: " + filter);
                /* Convert to filter object */
                fltr = JSON.parse(filter);
            }
            else fltr = {};

            parent.panelData = BNBLink.collections[coll].find(fltr).fetch();
            parent.panelDataRetrieved.set(true);
        });
    }

}