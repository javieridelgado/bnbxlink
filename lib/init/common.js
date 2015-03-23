BNBLink = {};
BNBLink.collections = {};

// Client specific attributes
if (Meteor.isClient) {
    BNBLink.subscriptions = [];
}

// Server specific attributes
if (Meteor.isServer) {
    BNBLink.publications = [];
    Meteor.roles.allow({
      'insert': function () {
          return true; 
      }
    });
}

// Debug information
BNBLink.debug = true;

// Log function
BNBLink.log = function (t) {
    if (BNBLink.debug) {
        console.log(t);
    }
};

