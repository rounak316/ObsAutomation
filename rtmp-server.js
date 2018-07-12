const RtmpServer = require('rtmp-server');
const rtmpServer = new RtmpServer();
const obscontroller = require('./obscontroller')


let publisherDisconnected = obscontroller.publisherDisconnected
let publisherConnected = obscontroller.publisherConnected




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

