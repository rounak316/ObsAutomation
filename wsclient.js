const WebSocket = require('ws');
 

const ws = new WebSocket('ws://localhost:3000', {

});
 
ws.on('open', function open() {
  console.log('connected');
//   ws.send(Date.now());
});
 
ws.on('close', function close() {
  console.log('disconnected');
});
 
ws.on('message', function incoming(data) {
//   console.log(`Roundtrip time: ${Date.now() - data} ms`);
 
  setTimeout(function timeout() {

  }, 500);
});

function sendData(data){
    try{
        ws.send(data);
    } catch(err){

    }
}

setTimeout( ()=>{

    sendData( JSON.stringify(  {
        a: "s",
        s: "sm",
        d: "https://www.youtube.com/watch?v=sgz5dutPF8M"
    } ) )

} , 300 )