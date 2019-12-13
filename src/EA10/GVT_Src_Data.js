var Data = (function () {

    function init() {
        var elem = document.createElement("INPUT");
        elem.setAttribute("type", "file");
        elem.setAttribute("id", "localfile");
        elem.style.display = "none";
        elem.addEventListener('change', readSingleFile, false);
        document.body.appendChild(elem);
    }

    function readFileFromClient() {
        var elem = document.getElementById("localfile");
        elem.click();
    }

    function readSingleFile(evt) {
        var f = evt.target.files[0];
        if (f) {
            //console.log("Reading File " + f.name);
            var r = new FileReader();
            r.onload = function (e) {
                parse(e.target.result);
            };
            r.readAsText(f);
        } else {
            alert("Could not read file.");
        }
    }

    function parse(textCSV) {
        //console.log(textCSV);
        var results = Papa.parse(textCSV, {delimiter:',', dynamicTyping: true, skipEmptyLines: true});
        //console.log(results.data);
        //console.log(results);

        textJSON =  JSON.stringify(results.data);
        console.log(textJSON);
        var dataFromJSON = JSON.parse(textJSON);

        var stats = calcStats(results.data);
        app.dataLoadedCallback(results.data, stats);
    }

    function readFileFromServer(filename) {
        var request = new XMLHttpRequest();
        if (!request) {
            console.log('Error: No XMLHttpRequest instance.');
            return false;
        }

        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    parse(request.responseText);
                } else {
                    console.log('There was a problem with the request.');
                }
            }
        };

        request.open('GET', filename);
        request.send();
    }

    /*
         Get the minimum and maximum values for the first 3 ™data columns.
         @return: object with field array of objects {min, max, range, mean} for each field
         and separate arrays with {min, max, range, mean} with field as index
         and value for maxRange
    */
    function calcStats(data) {
        if (!data) {
            console.log("Data no valid.");
            return undefined;
        }
        stats = {};
        stats.field = [];
        stats.min = [];
        stats.max = [];
        stats.range = [];
        stats.mean = [];

        var min, max, mean, i;
        // Assumes constant number of fields in data.
        var nbFields = data[0].length;
        for (i = 0; i < nbFields; i++) {
            min = max = undefined;
            mean = 0;
            for (var d = 0; d < data.length; d++) {
                mean += data[d][i];
                if (max === undefined || (data[d][i] > max)) {
                    max = data[d][i];
                }
                if (min === undefined || (data[d][i] < min)) {
                    min = data[d][i];
                }
            }
            mean /= data.length;
            stats.field[i] = {min: min, max: max, range: max - min, mean: mean};
            stats.min[i] = min;
            stats.max[i] = max;
            stats.range[i] = max - min;
            stats.mean[i] = mean;
        }

        // Calculate maximum data range of all fields,
        // restricted to the first 3 fields for 3D data plus extra fields.
        stats.maxRange = 0;
        //for (i = 0; i < nbFields; i++) {
        for (i = 0; i < 3; i++) {
            var range = Math.abs(stats.field[i].range);
            if (range > stats.maxRange) {
                stats.maxRange = range;
            }
        }

        return stats;
    }

    return {
        init: init,
        readFileFromClient: readFileFromClient,
        readFileFromServer: readFileFromServer
    };
}());
