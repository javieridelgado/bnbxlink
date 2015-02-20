// Declare collection
BNBLink.Panels = new Ground.Collection('panels');

// Initialize search parameters
BNBLink.Panels.initEasySearch('name');

// Initialize schema to be used for auto forms
BNBLink.Panels.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    description: {
        type: String,
        label: "Description",
        max: 1000
    },
    panelType: {
        type: String,
        label: "Panel Type",
        allowedValues: ["HTML", "Form", "Chart"]
    },
    collectionBase: {
        type: String,
        label: "Collection",
        optional: true
    },
    collectionFilter: {
        type: String,
        label: "Filter",
        optional: true
    },
    jsonTransformSum: {
        type: String,
        label: "JSON Transform Summary",
        optional: true
    },
    jsonTransformDtl: {
        type: String,
        label: "JSON Transform Detail",
        optional: true
    },
    cachedHTML: {
        type: String,
        label: "Summary HTML",
        optional: true
    },
    detailHTML: {
        type: String,
        label: "Detail HTML",
        optional: true
    }
}));

// Collection permissions
BNBLink.Panels.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});

// Create global variables for autoform
Panels = BNBLink.Panels;

