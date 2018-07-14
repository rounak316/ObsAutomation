const wsserver = require('./wsserver')
const eventEmitter = wsserver.eventEmitter
const streamToRTMP = require('./ffmpeg').streamToRTMP
const RtmpServer = require('rtmp-server');
const rtmpServer = new RtmpServer();
const obscontroller = require('./obscontroller')
let publisherDisconnected = obscontroller.publisherDisconnected
let publisherConnected = obscontroller.publisherConnected

let StreamURLS = []


obscontroller.eventListener.on("updates", (update)=>{
    console.log('Updates', update)
    wsserver.broadcast(update)
})


eventEmitter.on('sceneChangeRequest', sceneName=>{
    obscontroller.setScene(sceneName)
})

eventEmitter.on('url', (url)=>{
    console.log('URL RECIEVED', url)
    StreamURLS.push(url)
})

eventEmitter.on('conected', ()=>{
    obscontroller.getSceneList()
})

function checkForStreamUpdatesAndPlay(){


    const streamURL  = StreamURLS.pop();
    if(streamURL)
    streamToRTMP(streamURL).then( ()=>{
            console.log('success')
            checkForStreamUpdatesAndPlay()
        } ).catch(err=>{
            console.log('error')
            setTimeout( checkForStreamUpdatesAndPlay, 1000 )
        })

    else
        setTimeout( checkForStreamUpdatesAndPlay, 1000 )


}


checkForStreamUpdatesAndPlay()

let clientCounter = 0

rtmpServer.on('error', err => {
  throw err;
});
 
rtmpServer.on('client', client => {
    let publisher = false

//   client.on('command', command => {
//    console.log(command.cmd, command);
//   });
//  console.log(client)
  client.on('connect', () => {
     console.log('connect');
  });
  
  client.on('play', ({ streamName }) => {
    console.log('PLAY' , streamName);
  });
  
  client.on('publish', ({ streamName }) => {
    publisher = true
    if(publisher){
        publisherConnected()
        
    }
    
  });
  
  client.on('stop', () => {
      if(publisher)
          publisherDisconnected()
          
       else
        console.log('client disconnected');
  });

});
 
rtmpServer.listen(1935);

