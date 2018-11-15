var express = require('express');
var ejs = require('ejs');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var fs = require('fs');
var ytdl = require('youtube-dl');

//app.use('/css',express.static(__dirname + '/css'));
//app.use('/js',express.static(__dirname + '/js'));
//app.use('/assets',express.static(__dirname + '/assets'));
app.set('view engine', 'ejs');

console.log(__dirname);
app.use(express.static('views/libs'));
app.use(express.static('views/downloads'));
app.use(express.static('views/images'));

app.get('/',function(req,res){
    res.render('index', {file:""});
});

app.get('/:link', function(req, res) {
 //then you can call this handler  through /about/1/sometext get these params from request object:
  console.log(req.params.link); // 1, 'sometext'
  var file;

  var video = ytdl('https://www.youtube.com/watch?v='+ req.params.link,
      // Optional arguments passed to youtube-dl.
      ['-f', '18']);

  var size = 0;
  video.on('info', function(info) {
      'use strict';
      size = info.size;
      file = req.params.link + ".mp4";
      video.pipe(fs.createWriteStream("views/downloads/" + file));
  });

  var pos = 0;
  video.on('data', function data(chunk) {
      'use strict';
      pos += chunk.length;

      // `size` should not be 0 here.
      if (size) {
          var percent = (pos / size * 100).toFixed(2);
          process.stdout.cursorTo(0);
          process.stdout.clearLine(1);
          process.stdout.write(percent + '%');
      }
  });

  video.on('end', function end() {
      'use strict';
      console.log('\nDone');
      res.render('index', {file:file});
  });

});

server.listen(process.env.PORT || 3000,function(){
    console.log('Listening on '+ server.address().port);
});
