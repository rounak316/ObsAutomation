var ffmpeg = require('fluent-ffmpeg');
let downloadVideo = require('./downloader').downloadVideo
let stream = 'https://video.fdel8-1.fna.fbcdn.net/v/t42.9040-2/10000000_523040111444861_5669691443032096768_n.mp4?_nc_cat=0&efg=eyJ2ZW5jb2RlX3RhZyI6InN2ZV9oZCIsImFkbWlzc2lvbl9jb250cm9sIjoxLCJ1cGxvYWRlcl9pZCI6Ii01MjMwNDAxMTE0NDQ4NjEifQ==&oh=04d93773edfe7264616115b01baebe44&oe=5B47D986'


let _streamFromSocialMediaToRTMP = false



function streamFromSocialMediaToRTMP(url){
console.log('streamFromSocialMediaToRTMP', url)
return  downloadVideo(url).then( (url)=>{
    // console.log('downloading video', url)
        return new Promise( (res,rej)=>{

            ffmpeg({source: url})
            .videoCodec('libx264')
            .audioCodec('copy')
            .toFormat('flv')  
            .on('start', ()=>{
                console.log('Started')
            })
            .on('progress', ()=>{
                _streamFromSocialMediaToRTMP = true
                // console.log('progress')
            })
            .on('error', function(err, stdout, stderr) {
            //   console.log(stderr);
              res(false)
              console.log('error', err)
              _streamFromSocialMediaToRTMP = false
            })
            .on('end', function() {
                res(true)
              console.log('Done')
              _streamFromSocialMediaToRTMP = false
            })
            .save( 'rtmp://localhost:1935/prakhar' )
               
            } )

} )


}



module.exports.streamToRTMP  = streamFromSocialMediaToRTMP
