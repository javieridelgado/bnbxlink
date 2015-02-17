// Define BNBLink server-side object attributes and methods
BNBLink.parseStringSync = Meteor.wrapAsync(xml2js.parseString, xml2js);
