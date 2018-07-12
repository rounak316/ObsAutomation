var fs = require('fs');
var youtubedl = require('youtube-dl');
var video = youtubedl('https://www.facebook.com/IndiaToday/videos/10157265642317119/',
  // Optional arguments passed to youtube-dl.
//   ['--format=18'],
[],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname });
 
// Will be called when the download starts.
video.on('info', function(info) {
  console.log('Download started');
  console.log('filename: ' + info._filename);
  console.log('size: ' + info.url);
});
 
video.on('error', function(){
    console.log('Coudn\'t load video')
})

// video.pipe(fs.createWriteStream('myvideo.mp4'));