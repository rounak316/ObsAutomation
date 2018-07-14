var WebSocketServer = require('uws').Server;
var wss = new WebSocketServer({ port: 3000 });

const events = require('events');
const eventEmitter = new events.EventEmitter();

//Create an event handler:
var messageInformer = function () {}
//Assign the event handler to an event:

// Structure
//      a: s (stream)
//      s: sm (social media)
//      d: u (url)


function addUrl(url){
    eventEmitter.emit('url', url)
    console.log('AddUrl', url)
}

function onMessage(message) {
    console.log('received: ' + message);

    try{

            let jsonMessage = JSON.parse(message)
            switch(jsonMessage.a){
                case "ss": //setScene
                    eventEmitter.emit('sceneChangeRequest', jsonMessage.d)

                break;
                case "s":
                        switch(jsonMessage.s){
                            case "sm":
                                addUrl(jsonMessage.d)
                            break;
            
                            default:
                            break
                        }

                break;

                default:
                break
            }

    } catch(err){

    }
}

wss.on('connection', function(ws) {
    eventEmitter.emit('conected')
    ws.on('message', onMessage);
    // ws.send('something');
});

function broadcast(data){
    try{
        
        wss.broadcast(JSON.stringify(data))
    } catch(err){

    }
}

module.exports.eventEmitter = eventEmitter
module.exports.broadcast = broadcast