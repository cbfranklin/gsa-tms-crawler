var fs = require('fs-extra');
var request = require('request');
var moment = require('moment');

var urlRoot = 'http://hvemuseum2.gallerysystems.com/emuseum/api/id/objects/',
    queue = [],
    fail = [];



for (i = 0; i < 100000; i++) {
    queue[i] = setTimeout(getJSON, i * 1000, i);
}

function getJSON(index) {
    index = index.toString();
    request({
        url: urlRoot + index,
        json: true
    }, function(error, response, json) {
        if (!error && response.statusCode === 200) {
            if (json.total_results !== 0) {
                fs.writeFile(__dirname + '/data/objects/' + index + '.json', JSON.stringify(json), 'utf8', function() {
                    console.log(moment().format('hh:mm:ss'), '|', 'Saved Object ID as JSON: ' + index);
                });
            } else {
                console.log(moment().format('hh:mm:ss'), '|', 'Object ID: ' + index + ' has no data.');
            }
        } else {
            fail.push(parseFloat(index));
            console.log(moment().format('hh:mm:ss'), '|', 'JSON Request Failed on ID: ' + index);
            fs.writeFile(__dirname + '/data/objects/fail.json', fail, 'utf8', function() {
                console.log(moment().format('hh:mm:ss'), '|', 'Saved to Log.');
            });
        }
    });
}