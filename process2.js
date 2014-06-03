var fs = require('fs-extra');
var request = require('request');
var moment = require('moment');

var stats = {
    "region": {
        "got": 22811,
        "dontgot": 0
    },
    "displayDate": {
        "got": 20851,
        "dontgot": 0
    },
    "objectNumber": {
        "got": 22811,
        "dontgot": 0
    },
    "ObjTextEntries": {
        "got": 15983,
        "dontgot": 0
    },
    "ObjectsPeople": {
        "got": 22810,
        "dontgot": 0
    },
    "medium": {
        "got": 4344,
        "dontgot": 0
    },
    "primaryImage": {
        "got": 1284,
        "dontgot": 0
    },
    "id": {
        "got": 22811,
        "dontgot": 0
    },
    "title": {
        "got": 10418,
        "dontgot": 0
    },
    "classification": {
        "got": 22811,
        "dontgot": 0
    },
    "creditLine": {
        "got": 4213,
        "dontgot": 0
    },
    "ObjMedia": {
        "got": 1339,
        "dontgot": 0
    },
    "dimensions": {
        "got": 17011,
        "dontgot": 0
    },
    "artist": {
        "got": 22807,
        "dontgot": 0
    },
    "ObjComponents": {
        "got": 22811,
        "dontgot": 0
    },
    "Loans": {
        "got": 6603,
        "dontgot": 0
    },
    "Collections": {
        "got": 219,
        "dontgot": 0
    },
    "artistRelatedObjects": {
        "got": 21759,
        "dontgot": 0
    },
    "siteRelatedObjects": {
        "got": 856,
        "dontgot": 0
    },
    "ObjFlags": {
        "got": 21624,
        "dontgot": 0
    },
    "labelCopy": {
        "got": 73,
        "dontgot": 0
    }
}
var queue = [];
var keys = Object.keys(stats);

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
                for (j = 0; j < keys.length; j++) {
                    //if key already exists, value += 1.
                    if (data.results.hasOwnProperty(keys[j])) {
                        //then have a nap
                    } else {
                        stats[keys[j]].dontgot += 1;
                    }
                }
            });
        } else {
            console.log(moment().format('hh:mm:ss'), '|', 'Object ID: ', index, 'does not exist.');
        }
    });
}

function saveStats() {
    fs.writeFile(__dirname + '/data/objects/stats.json', JSON.stringify(stats), 'utf8', function() {
        console.log(moment().format('hh:mm:ss'), '|', 'SAVED as /data/objects/stats2.json');
    });
}