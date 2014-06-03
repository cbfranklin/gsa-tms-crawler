var fs = require('fs-extra');
var request = require('request');
var moment = require('moment');

var stats = {};
var queue = [];

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
                var keys = Object.keys(data.results);
                for (j = 0; j < keys.length; j++) {
                    //if key already exists, value += 1.
                    if (stats.hasOwnProperty(keys[j])) {
                        stats[keys[j]].got += 1;
                    } else {
                        stats[keys[j]] = {
                            got: 1,
                            dontgot: 0
                        }
                    }
                }
                //ONLY AFTER ONE FULL RUN-THROUGH HAS COMPLETED CAN I GO BACK AND COUNT THE DONTGOTS
                /*
                if(stats.hasOwnProperty(allKeys[i])){
                    //then have a nap
                }
                else{
                    stats[keys[i]].dontgot += 1;
                }
                */
            });
        } else {
            console.log(moment().format('hh:mm:ss'), '|', 'Object ID: ', index, 'does not exist.');
        }
    });
}

function saveStats() {
    fs.writeFile(__dirname + '/data/objects/stats.json', JSON.stringify(stats), 'utf8', function() {
        console.log(moment().format('hh:mm:ss'), '|', 'SAVED as /data/objects/stats.json');
    });
}