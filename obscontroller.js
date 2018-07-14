const OBSWebSocket = require('obs-websocket-js');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const VideoSources = []
const obs = new OBSWebSocket();


Console = {
    log: function(){

    },
    debug: console.log
}

let promoVisible = false


function transitionToRTMPScene(){
    promoVisible = true
    obs.setCurrentScene({'scene-name':"randd"})
}

function transitionToPromoScene(){
    promoVisible = true
    obs.setCurrentScene({'scene-name':"NewsRoomWithBreakingNewsPromo"})
}

function setScene(sceneName){
    obs.setCurrentScene({'scene-name':sceneName} )
}

function transitionToVideoAddvertisementScene(){
    promoVisible = true
    obs.setCurrentScene({'scene-name':"NewsRoomWithVideoAdd"})
}

function startTransition(){

    if(promoVisible){
            promoVisible = !promoVisible
            let videoSource =VideoSources.pop()
            if(videoSource){
                setAudioVideoSource(videoSource["v"] , videoSource["a"] )
                obs.setCurrentScene({'scene-name':"NewsRoomWithVideoNews"})
                setTimeout( ()=>{
                
                    startTransition()
                    Console.log("Starting Transition")
                } , videoSource["t"] )
            } else{
                Console.log("No where to go!")
            }
    } else{
        transitionToPromoScene()
        setTimeout( ()=>{
            startTransition()
            Console.log("Will comeback Again")
        } , 22000 )
    }
   
}

function addAudioVideoSource(v , a, t){
    VideoSources.push({ "v":v , "a":a, "t":t} )
}

function setAudioVideoSource(v,a){
    obs.SetSourceSettings( {
        "sourceName":"News Audio Source",
        "sourceSettings": { input:a  }
    } )

    obs.SetSourceSettings( {
        "sourceName":"News Video Source",
        "sourceSettings": { input:v  }
    } )

}

function testAddingAudioVideo(){
   
    let v = "https://video.fdel8-1.fna.fbcdn.net/v/t42.1790-2/10000000_1903391589952077_733055474663948288_n.mp4?_nc_cat=0&efg=eyJ2ZW5jb2RlX3RhZyI6ImRhc2hfdjNfMTI4MF9jcmZfMjNfaGlnaF8zLjFfZnJhZ18yX3ZpZGVvIiwiYWRtaXNzaW9uX2NvbnRyb2wiOjEsInVwbG9hZGVyX2lkIjoiLTE5MDMzOTE1ODk5NTIwNzcifQ==&oh=a97e97d72a62e86dd1501c6e7ab806b1&oe=5B4696B6"
    let a = "https://video.fdel8-1.fna.fbcdn.net/v/t42.1790-2/36790797_497098200746236_933400825550602240_n.mp4?_nc_cat=0&efg=eyJ2ZW5jb2RlX3RhZyI6ImRhc2hfdjNfMjU2X2NyZl8yM19tYWluXzMuMF9mcmFnXzJfYXVkaW8iLCJhZG1pc3Npb25fY29udHJvbCI6MSwidXBsb2FkZXJfaWQiOiItNDk3MDk4MjAwNzQ2MjM2In0=&oh=6800910591e2efa4ceee7a5df0a70293&oe=5B4697D5"
      
    let t = 5000;
addAudioVideoSource(v,a,t)
addAudioVideoSource(v,a,t)
addAudioVideoSource(v,a,t)
addAudioVideoSource(v,a,t)
}






function sceneOnEnd(scenename){
    Console.log('Scene ssampta', scenename)
}

function informUpdates( updates ){
    console.log('informUpdates', updates)
    eventEmitter.emit("updates",updates)
}


obs.onSwitchScenes(data => {
    informUpdates( data)
  });


obs.connect({ address: 'localhost:4444', password: '$up3rSecretP@ssw0rd' })
  .then(() => {
    // Console.log(`Success! We're connected & authenticated.`);
    transitionToPromoScene()
    return obs.getSceneList();
  })
  .then(data => {
    informUpdates( data)
    // Console.log(`${data.scenes.length} Available Scenes!`);
    
    data.scenes.forEach(scene => {
      if (scene.name !== data.currentScene) {
        // Console.log(`Found a different scene! Switching to Scene: ${scene.name}`);

        // transitionToPromoScene()
        // obs.setCurrentScene({'scene-name': scene.name});
      }
    });


    obs.getSourcesList().then( Console.log  ).catch( Console.log)
    
   startTransition()


setInterval(  ()=>{
let _date = new Date();
_date = _date.getHours()+ ":"  + _date.getMinutes()+ ":" + _date.getSeconds()
obs.SetSourceSettings(  {
    sourceSettings: {"text":"Debug: "+ _date},
    sourceName: "debugLatency"
} ).then( ()=>{} ).catch()
} , 1000)



// obs.GetSourceSettings( {sourceName:"NewsMain" }).then( Console.log).catch(Console.log)

//    obs.StartStreaming({"stream":{  "settings":
//    {
   
// "server": "rtmp://live-api-s.facebook.com:80/rtmp/",
//  "key": "1927667000865698?ds=1&s_sw=0&s_vt=api-s&a=ATgi96HRDE1U0aiQ"
//    }


//    }
// }).then( Console.log ).catch(Console.log)
    
  })
  .catch(err => { // Promise convention dicates you have a catch on every chain.
    Console.log(err);
  });



function addListener(){
    obs.onSwitchScenes(informUpdates);
    obs.onScenesChanged(informUpdates)
}
addListener()


function GetSceneList(){
    console.log('GetSceneList')-
    obs.getSceneList().then(data=>{
        data["updateType"] = "GetSceneList"
        return data
    }).then(informUpdates).catch(console.log)

}


// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
	Console.error('socket error:', err);
});

function publisherDisconnected(){
    Console.debug('publisher disconnected')
    transitionToPromoScene()
}

function publisherConnected(){
    Console.debug('publisher connected')
    transitionToRTMPScene()
}



module.exports.publisherDisconnected = publisherDisconnected
module.exports.publisherConnected = publisherConnected
module.exports.eventListener = eventEmitter
module.exports.getSceneList = GetSceneList
module.exports.setScene = setScene