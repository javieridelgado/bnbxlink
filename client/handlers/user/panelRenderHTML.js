if (Meteor.isClient) {

    // Helpers
    Template.panelRenderHTML.helpers({
        /* Dashboard display helpers */
        displayHTML: function () {
            var cursor, instance, transform, template, done;
            var parent;

            instance = Template.instance();

            switch (this.part) {
                case "header":
                    transform = this.panel.jsonTransformSumHeader;
                    break;
                case "footer":
                    transform = this.panel.jsonTransformSumFooter;
                    break;
                default:
                    transform = this.panel.jsonTransformSum;
                    break;
            }

            // if transform is blank, we should return a blank html
            if (!transform) {
                console.log("error: transform is blank in displayHTML");
                return "";
            }

            // create transform template
            template = _.template(transform);

            // Transform data when ready
            cursor = {};
            cursor.values = instance.parentInstance.panelData.get();
            return template(cursor);
        }
    });
}