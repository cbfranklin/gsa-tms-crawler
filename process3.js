var fs = require('fs-extra');
var request = require('request');
var moment = require('moment');

var queue = [];
var array = [];

for (i = 0; i < 30000; i++) {
    queue[i] = setTimeout(getKeyCounts, i * 10, i);
    if (i % 100 === 0) {
        queue[i] = setTimeout(saveStats, i * 10);
    }
}

function getKeyCounts(i) {
    var index = i.toString();
    fs.exists('./data/objects/' + index + '.json', function(exists) {
        if (exists) {
            //get it
            fs.readFile('./data/objects/' + index + '.json', function read(err, data) {
                if (err) {
                    throw err;
                }
                data = JSON.parse(data);
                console.log(moment().format('hh:mm:ss'), '|', 'Processing Object: ' + i);
                if (data.results['ObjTextEntries']) {
                    for (i = 0; i < data.results['ObjTextEntries'].length; i++) {
                        var type = data.results['ObjTextEntries'][i].textType;
                        if (array.indexOf(type) < 0) {
                            array.push(type);
                        }
                    }
                }
            });
        } else {
            console.log(moment().format('hh:mm:ss'), '|', 'Object ID: ', index, 'does not exist.');
        }
    });
}

function saveStats() {
    var dump = JSON.stringify(array);
    fs.writeFile(__dirname + '/data/objects/textType.json', dump, 'utf8', function() {
        console.log(moment().format('hh:mm:ss'), '|', 'SAVED as /data/objects/textType.json');
    });
}