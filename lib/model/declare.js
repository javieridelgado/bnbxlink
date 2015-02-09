BNBLink = {};

// Debug information
BNBLink.debug = true;

// Log function
BNBLink.log = function (t) {
    if (BNBLink.debug) {
        console.log(t);
    }
}

// Declare collections
BNBLink.Panels = new Ground.Collection('panels');
BNBLink.Comments = new Ground.Collection('comments');
BNBLink.Collections = new Meteor.Collection('collections');
Ground.Collection(Meteor.users);

// Initialize search parameters
BNBLink.Panels.initEasySearch('name');
BNBLink.Collections.initEasySearch('name');

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
    collectionBase: {
        type: String,
        label: "Collection"
    },
    collectionFilter: {
        type: String,
        label: "Filter"
    },
    jsonTransformSum: {
        type: String,
        label: "JSON Transform Summary"
    },
    jsonTransformDtl: {
        type: String,
        label: "JSON Transform Detail"
    },
    cachedHTML: {
        type: String,
        label: "Summary HTML"
    },
    detailHTML: {
        type: String,
        label: "Detail HTML",
        optional: true
    }
}));

BNBLink.Collections.allow({
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

BNBLink.Collections.attachSchema(new SimpleSchema({
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
    expirationTime: {
        type: Number,
        label: "Expiration Time (secs)",
        optional: true
    },
    lastRefreshDttm: {
        type: Date,
        label: "Last Refresh Datetime",
        optional: true
    },
    availableOffline: {
        type: Boolean,
        label: "Available Offline"
    },
    readOnly: {
        type: Boolean,
        label: "Read Only",
        optional: true
    },
    socialEnabled: {
        type: Boolean,
        label: "Social Enabled",
        optional: true
    },
    fields: {
        type: [Object],
        minCount: 1
    },
    "fields.$.name": {
        type: String
    },
    "fields.$.type": {
        type: String
    }

}));

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
Collections = BNBLink.Collections;