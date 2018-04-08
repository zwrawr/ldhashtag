'use strict';

var conf = require('nconf');
var HashtagCount = require('hashtag-count');


conf.file({ file: 'config.json' });
var hc = new HashtagCount(conf.get());

var hashtags = [
	'gamedev',
	'ludumdare',
	'LDJAM',
	'LD41',
	'gamejam',
	'indiedev',
	'LD48',
	'programming',
	'LDDEV'
];
var interval = '1 minuets';
var history = '2 minuets';

var last_min = null;

var express = require('express');
var app = express();

app.set('port', process.env.PORT || 4000);

app.get('/api/track/twitter',function(req,res){
    res.setHeader('Cache-Control', 'public, max-age=50');
    res.json(last_min);
});

app.listen(app.get('port'), function(){
  console.log("Express started in http://localhost:" + app.get('port'));
});

var intervalCb = function (err, results) {
  if (err) {
    console.error(err);
  } else {
    console.log("");//process.stdout.write('\x1Bc');
  
    let length = Object.keys(results).length;
    let timestamp = Object.keys(results)[length-1];
    let values = results[Object.keys(results)[length-1]];
    values["timestamp"] = timestamp;

    last_min = values;
	
    console.log(timestamp);
    Object.keys(values).forEach(key => {
      let b = "#"+key;

      for(let i = 0; i < (12-key.length); i++){
        b+=" ";
      }

      b+=" : ";

      for(let i = 0; i < results[Object.keys(results)[0]][key]; i++){
        b+="#"
      }
      console.log(b);
    });
  }
};


var connectingCb = function () {
  var dateString = new Date().toISOString();
  console.log(dateString + ' Connecting to Twitter Streaming API...');
};

var reconnectingCb = function () {
  var dateString = new Date().toISOString();
  console.log(dateString + ' Twitter Streaming API connection failed. Reconnecting...');
};

var connectedCb = function () {
  var dateString = new Date().toISOString();
  console.log(dateString + ' Connected.');
};


// Open a connection to Twitter's Streaming API and start capturing tweets!
hc.start({
  hashtags: hashtags,               // required
  interval: interval,               // required
  history: history,                 // optional
  intervalCb: intervalCb,           // optional
  connectingCb: connectingCb,       // optional
  reconnectingCb: reconnectingCb,   // optional
  connectedCb: connectedCb,         // optional
});
