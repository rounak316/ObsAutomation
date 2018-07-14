var fs = require('fs');
var youtubedl = require('youtube-dl');

function downloadVideo(url){
//  console.log('downloadVideo',url)
  return new Promise( (res,rej)=>{

  let video =   youtubedl(url,
  // Optional arguments passed to youtube-dl.
  // ['--merge-output-format'],
[],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname });
 
// Will be called when the download starts.
video.on('info', function(info) {
  // console.log('Download started');
  // console.log('filename: ' + info._filename);
  res( info.url);
  
});
 
video.on('error', function(){
    rej('Coudn\'t load video')
})

  } )
}



module.exports.downloadVideo= downloadVideo
// video.pipe(fs.createWriteStream('myvideo.mp4'));