var MongoClient = require('mongodb').MongoClient;
var request = require('request');


function CheckErr(error, response) {
    //Check for error
    if(error){
        return console.log('Error:', error);
    }

    //Check for right status code
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }
}

function InsertTrack(doc) {
    MongoClient.connect('mongodb://localhost:27017/spotify', function(err, db) {
        if(err) throw err;

        db.collection('track').insert(doc, function(err, doc) {
            if(err) throw err;

            return db.close();
        });
    });
}

var artistId = '';
artistId = '3yY2gUcIsjMr8hjo51PoJ8'; // The Smiths
artistId = '0yNLKJebCb8Aueb54LYya3'; // New Order
artistId = '1A92IAcd7A6npCA33oGM5i'; // The Proclaimers
artistId = '38unGip4o3KhMfqHdHWB7K'; // Chas n Dave
artistId = '1lYT0A0LV5DUfxr6doRP3d'; // The Stone Roses

var artistReqUrl = 'https://api.spotify.com/v1/artists/' + artistId + '/albums?album_type=album&market=GB';
request(artistReqUrl, function (error, response, body) {
    CheckErr(error, response);

    var albumsDoc = JSON.parse(body);
    var albums = albumsDoc.items;

    for (var i in albums) {
        var albumReqUrl = 'https://api.spotify.com/v1/albums/' + albums[i].id + '/tracks?market=GB';
        request(albumReqUrl, function (error, response, body) {
            CheckErr(error, response);

            var tracksDoc = JSON.parse(body);
            var tracks = tracksDoc.items;
            for (var i in tracks) {
                var trackReqUrl = 'https://api.spotify.com/v1/tracks/' + tracks[i].id;
                request(trackReqUrl, function (error, response, body) {
                    CheckErr(error, response);

                    var trackDoc = JSON.parse(body);
                    InsertTrack(trackDoc);
                });
            }
        });
    }
});