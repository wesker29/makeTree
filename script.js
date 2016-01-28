$(document).on("change", "#myFiles", function(e) {
    var input = $(e.target);
    var file = input.prop("files")[0];

    var filereader = new FileReader();

    filereader.onload = (function(f) {
        return function(e) {
            var text = e.target.result;
            var array = makeGrid(text, "\t");

            var xml = "<root>";

            var i;
            var pos = [];
            $.each(array, function(n, row) {
                var num = _.findIndex(row, function(col) {
                    return col != "" && col != null;
                });

                var c = _.findIndex(pos, function(i) {
                    return i == num;
                });

                if (c<0) {
                    pos.push(num);
                }
                else {
                    for(var a = 0; a < pos.length - num; a++) {
                        xml+= "</row>";
                    };
                    pos = _.take(pos, c + 1);
                }

                xml += "<row";

                $.each(row, function(z, col) {
                 if (z >= num) {
                 xml += " col" + z + "=\"" + col + "\"";
                 }
                 });
                xml += ">"
            });

            for(var a = 0; a < pos.length; a++) {
                xml+= "</row>";
            };

            xml += "</root>";

            console.log(xml);
        };
    })(file);

    filereader.readAsText(file);

    input.val("");
});

/*
 http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
 */
function makeGrid(strData, strDelimiter){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = strDelimiter || ",";

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
    var arrMatches = objPattern.exec(strData);

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        var strMatchedValue;
        if (arrMatches[2]){
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(/""/g, "\"");
        } else {
            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];
        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);

        arrMatches = objPattern.exec(strData);
    }

    // Return the parsed data.
    return arrData;
}

/*
(function(root) {
    var makeTree = function() {

    };

    root.makeTree = makeTree;
}).call(this);
*/


