// Define BNBLink server-side object attributes and methods
BNBXLink.parseStringSync = Meteor.wrapAsync(xml2js.parseString, xml2js);
