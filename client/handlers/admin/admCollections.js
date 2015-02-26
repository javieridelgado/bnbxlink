// On Client and Server
//
//  CSVParser.js
//  Mr-Data-Converter
//
//  Input CSV or Tab-delimited data and this will parse it into a Data Grid Javascript object
//
//  CSV Parsing Function from Ben Nadel, http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm


var isDecimal_re = /^\s*(\+|-)?((\d+([,\.]\d+)?)|([,\.]\d+))\s*$/;

function toJSON(dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "[";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loop
    for (var i = 0; i < numRows; i++) {
        var row = dataGrid[i];
        outputText += "{";
        for (var j = 0; j < numColumns; j++) {
            if ((headerTypes[j] == "int") || (headerTypes[j] == "float")) {
                var rowOutput = row[j] || "null";
            } else {
                var rowOutput = '"' + (row[j] || "") + '"';
            }
            outputText += ('"' + headerNames[j] + '"' + ":" + rowOutput);

            if (j < (numColumns - 1)) {
                outputText += ","
            }
        }
        outputText += "}";
        if (i < (numRows - 1)) {
            outputText += "," + newLine
        }
    }
    outputText += "]";

    return outputText;
}

var CSVParser = {

    //---------------------------------------
    // UTILS
    //---------------------------------------

    isNumber: function (string) {
        if ((string == null) || isNaN(Number(string))) {
            return false;
        }
        return true;
    },


    //---------------------------------------
    // PARSE
    //---------------------------------------
    //var parseOutput = CSVParser.parse(this.inputText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders);

    parse: function (input, headersIncluded, delimiterType, downcaseHeaders, upcaseHeaders, decimalSign) {

        var dataArray = [];

        var errors = [];

        //test for delimiter
        //count the number of commas
        var RE = new RegExp("[^,]", "gi");
        var numCommas = input.replace(RE, "").length;

        //count the number of tabs
        RE = new RegExp("[^\t]", "gi");
        var numTabs = input.replace(RE, "").length;

        var rowDelimiter = "\n";
        //set delimiter
        var columnDelimiter = ",";
        if (numTabs > numCommas) {
            columnDelimiter = "\t"
        }
        if (delimiterType === "comma") {
            columnDelimiter = ","
        } else if (delimiterType === "tab") {
            columnDelimiter = "\t"
        }


        // kill extra empty lines
        RE = new RegExp("^" + rowDelimiter + "+", "gi");
        input = input.replace(RE, "");
        RE = new RegExp(rowDelimiter + "+$", "gi");
        input = input.replace(RE, "");

        // var arr = input.split(rowDelimiter);
        //
        // for (var i=0; i < arr.length; i++) {
        //   dataArray.push(arr[i].split(columnDelimiter));
        // };


        // dataArray = jQuery.csv(columnDelimiter)(input);
        dataArray = this.CSVToArray(input, columnDelimiter);

        //escape out any tabs or returns or new lines
        for (var i = dataArray.length - 1; i >= 0; i--) {
            for (var j = dataArray[i].length - 1; j >= 0; j--) {
                dataArray[i][j] = dataArray[i][j].replace("\t", "\\t");
                dataArray[i][j] = dataArray[i][j].replace("\n", "\\n");
                dataArray[i][j] = dataArray[i][j].replace("\r", "\\r");
            }
        }
        var headerNames = [];
        var headerTypes = [];
        var numColumns = dataArray[0].length;
        var numRows = dataArray.length;
        if (headersIncluded) {

            //remove header row
            headerNames = dataArray.splice(0, 1)[0];
            numRows = dataArray.length;

        } else { //if no headerNames provided

            //create generic property names
            for (var i = 0; i < numColumns; i++) {
                headerNames.push("val" + String(i));
                headerTypes.push("");
            }
        }


        if (upcaseHeaders) {
            for (var i = headerNames.length - 1; i >= 0; i--) {
                headerNames[i] = headerNames[i].toUpperCase();
            }
        }
        if (downcaseHeaders) {
            for (var i = headerNames.length - 1; i >= 0; i--) {
                headerNames[i] = headerNames[i].toLowerCase();
            }
        }
        //test all the rows for proper number of columns.
        for (var i = 0; i < dataArray.length; i++) {
            var numValues = dataArray[i].length;
            if (numValues != numColumns) {
                this.log("Error parsing row " + String(i) + ". Wrong number of columns.")
            }
        }
        //test columns for number data type
        var numRowsToTest = dataArray.length;
        var threshold = 0.9;
        for (var i = 0; i < headerNames.length; i++) {
            var numFloats = 0;
            var numInts = 0;
            for (var r = 0; r < numRowsToTest; r++) {
                if (dataArray[r]) {
                    //replace comma with dot if comma is decimal separator
                    if (decimalSign = 'comma' && isDecimal_re.test(dataArray[r][i])) {
                        dataArray[r][i] = dataArray[r][i].replace(",", ".");
                    }
                    if (CSVParser.isNumber(dataArray[r][i])) {
                        numInts++;
                        if (String(dataArray[r][i]).indexOf(".") > 0) {
                            numFloats++
                        }
                    }
                }
            }
            if ((numInts / numRowsToTest) > threshold) {
                if (numFloats > 0) {
                    headerTypes[i] = "float"
                } else {
                    headerTypes[i] = "int"
                }
            } else {
                headerTypes[i] = "string"
            }
        }





        return {
            'dataGrid': dataArray,
            'headerNames': headerNames,
            'headerTypes': headerTypes,
            'errors': this.getLog()
        }

    },


    //---------------------------------------
    // ERROR LOGGING
    //---------------------------------------
    errorLog: [],

    resetLog: function () {
        this.errorLog = [];
    },

    log: function (l) {
        this.errorLog.push(l);
    },

    getLog: function () {
        var out = "";
        if (this.errorLog.length > 0) {
            for (var i = 0; i < this.errorLog.length; i++) {
                out += ("!!" + this.errorLog[i] + "!!\n");
            }
            out += "\n"
        }
        return out;
    },



    //---------------------------------------
    // UTIL
    //---------------------------------------

    // This Function from Ben Nadel, http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    CSVToArray: function (strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
            ) {

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);

            }


            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );

            } else {

                // We found a non-quoted value.
                var strMatchedValue = arrMatches[3];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }

        // Return the parsed data.
        return (arrData);
    }



};

var psQueriesVar;

if (Meteor.isClient) {
    //Meteor.subscribe("panels");

    Template.admCollectionsAll.helpers({
        collections: function () {
            return BNBLink.Collections.find({});
        }
    });

    Template.collSearch.events({
        'click #addcollection': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.go('collInsert');
        }
    });

    Template.admCollectionSrch.events({
        'click #delCollection': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.Collections.remove(this._id);
        },

        'click #updCollection': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.log('click panel ' + this._id);
            BNBLink.go("collUpdate", {
                _id: this._id
            });
        }
    });

    Template.collUpdate.rendered = function () {
        var sourceType;
        // Enable autosize for all text areas
        $('textarea').autosize();

        // Hide source specific fields
        $('fieldset[id^="source"]').hide();

        // Retrieve source
        sourceType = $('select[name="sourceType"]').val().replace(/\s+/g, '');
        $('fieldset[id^="source' + sourceType + '"]').show();
    };

    Template.collUpdate.helpers({
        psQueries: function () {
            var result;

            result = [{
                label: "no queries loaded",
                value: "null"
            }];

            if (!psQueriesVar)
                psQueriesVar = new ReactiveVar(result);

            result = psQueriesVar.get();

            return result;
        }
    });

    Template.collUpdate.events({

        'change textarea[name="dataInput"]': function (event) {
            var parseOutput = CSVParser.parse(event.target.value, true, 'tab', true, false);

            var dataGrid = parseOutput.dataGrid;
            var headerNames = parseOutput.headerNames;
            var headerTypes = parseOutput.headerTypes;
            var errors = parseOutput.errors;

            var outputText = toJSON(dataGrid, headerNames, headerTypes, '  ', '\n');

            event.preventDefault();
            BNBLink.debug = parseOutput;
            $('#outputJSONExcel').val(outputText);

            Meteor.call("populateCollection", "test", JSON.parse(outputText), true, function (error, results) {
                console.log(results); //results.data should be a JSON object
            });

        },

        'change select[name="sourceType"]': function (event) {
            $('fieldset[id^="source"]').hide();
            $('fieldset[id^="source' + event.target.value.replace(/\s+/g, '') + '"]').show();
        },

        'click #psGetQueries': function (event) {
            var url, params, user, password;

            url = $("#psURLQuery").val();
            user = $("#psUserQuery").val();
            password = $("#psPasswordQuery").val();

            Meteor.call("psGetQueries", url, user, password, function (error, results) {
                $('#outputJSONPeopleSoftQuery').val(JSON.stringify(results));

                console.log("create reactive var");

                if (!psQueriesVar)
                    psQueriesVar = new ReactiveVar(results);
                else
                    psQueriesVar.set(results);

                BNBLink.debug = psQueriesVar;
                console.log("processing finished");
            });
        },

        'change #psQuery': function (event) {
            var url, params, user, password, query, collection;

            collection = $("#collName").val();
            url = $("#psURLQuery").val();
            user = $("#psUserQuery").val();
            password = $("#psPasswordQuery").val();
            query = $("#psQuery").val();
            console.log("running query: " + query);

            Meteor.call("psSaveQuery", url, user, password, query, collection, function (error, results) {
                $('#outputJSONPeopleSoftQuery').val(results);
            });
        },

        'click #psTest': function (event) {
            var url, params, user, password;

            url = $("input[name='psURL']").val();
            params = $("input[name='psParameters']").val();
            user = $("input[name='psUser']").val();
            password = $("input[name='psPassword']").val();

            Meteor.call("testCall", url, params, user, password, function (error, results) {
                $('#outputJSONPeopleSoft').val(results);
            });
        }
    });
}