// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA51GCqxDw7AuvfNmCcWjbGLtClJNFaUxE",
  authDomain: "webmotia.firebaseapp.com",
  databaseURL: "https://webmotia.firebaseio.com",
  projectId: "webmotia",
  storageBucket: "webmotia.appspot.com",
  messagingSenderId: "606747164317",
  appId: "1:606747164317:web:952c390708ccb09d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

//Initializing the variables
const constraints = { audio: true, video: true };
var targetUsername = document.getElementById("targetUsername");
var username = document.getElementById("username");
var studentRadio = document.getElementById("studentRadio");
var classroomRadio = document.getElementById("classroomRadio");
var pc=null;
var isCaller = true;
var isStudent = true;
var randomValue = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
var mediaDetails;


// Zoom functionality
// BEGIN ZOOM
let zoomIn = document.getElementById("zoomin");
let zoomOut = document.getElementById("zoomout");
// For the Video ZOOM
let capabilities;
let settings;
// END OF ZOOM


// Datastream sending the text from one peer to the other peer
var sendChannel=null;
var receiveChannel=null;
var sendButton = document.getElementById("sendButton");
var messageInputBox = document.getElementById("message");
var receiveBox = document.getElementById("receivebox");

sendButton.addEventListener('click', sendMessage, false);

setRandomUser(username);
function setRandomUser(textbox)
{
  textbox.value = randomValue;
}

studentRadio.addEventListener("click", roleSet);
classroomRadio.addEventListener("click", roleSet);
function roleSet()
{
  if(studentRadio.checked) {
    console.log("Switched role to Student");
    isStudent = true;
  }
  if(classroomRadio.checked) {
    console.log("Switched role to Classroom");
    isStudent = false;
  }

}




targetUsername.addEventListener("click", clearBox);
function clearBox()
{
  targetUsername.value = '';
}

//Adding an event listener to send our SDP info to the server
document.getElementById("connect").addEventListener("click", connect);
document.getElementById("call").addEventListener("click", call);
function connect()
{
  checkCaller();
  if(isCaller)
  {
  identifyAsCaller();
  }
  listenEvent();


}
function call()
{
  if(isCaller)
  {

    createPeerConnection();
    mediaDetails = getMedia(pc);
  }


}

function checkCaller()
{
  if (targetUsername.value != "")
  {
    isCaller = true;
  }
  else
  {
    isCaller = false;
  }
}
function createPeerConnection(){
//Declaring iceServers and creating a new PeerConnection
const config= {iceServers: [{urls:'stun:stun.l.google.com:19302'}]};
pc = new RTCPeerConnection(config);
pc.onnegotiationneeded = offer;
pc.onicecandidate = sendIce;
pc.ontrack = handleTrackEvent;

pc.ondatachannel = receiveChannelCallback;
// pc.onconnectionstatechange = compConnection;

receiveChannel = pc.createDataChannel("receiveChannel");


sendChannel = pc.createDataChannel("sendChannel");
sendChannel.onopen= handleSendChannelStatusChange;
sendChannel.onclose= handleSendChannelStatusChange;
}


//Getting the media from the browser asynchronously
async function getMedia(pc) {
  let stream = null;

  try {

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById('localVideo').srcObject = stream;


    // for (const track of stream.getVideoTracks()[0]) {
    //   const capabilities = track.getCapabilities();
    //   console.log("Da CAPABILITIES ARE:::: MAAYEEE*******:"+capabilities);
    //   pc.addTrack(track);
    // }

    /* use the stream */
  } catch(err) {
    /* handle the error */
    console.log("failed to add Webcam" + err);
  }
  console.log("Got the Webcam/Media from the browser");
}




function offer(){

//Creating a new offer and then set the local description of the RTCPeerConnection pc
pc.createOffer().then(function (offer) {
  console.log("Offer created!");
    return pc.setLocalDescription(offer);
}).then(function(){
  sendToServer(targetUsername.value, username.value, "video-offer", JSON.stringify(pc.localDescription));
});

}
function sendToServer(targetUsername, user , type, sdp)
{
  const data = {
    targetUsername: targetUsername,
    username: user,
    type: type,
    sdp: sdp
  };
  console.log("Sending data from "+ user+" to "+ targetUsername);

  db.collection("SDP").doc(targetUsername).set(data)
      .then(function() {
        console.log("Document written ");
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
}


//The ice sending/receiving functions
function sendIce(ice) {
    if (ice.candidate)
    {
        sendToServer(targetUsername.value, username.value , "ice-candidate", JSON.stringify(ice.candidate));
        console.log("Sent new ICE candidate "+JSON.stringify(ice.candidate));
    }
}
function receiveIce(ice)
{
    console.log("Received new ICE Candidate: "+ ice);
    var cand = new RTCIceCandidate(JSON.parse(ice));
    pc.addIceCandidate(cand).catch(function(e){
      console.log(e)
    });
}



function identifyAsCaller()
{
  console.log("Identifying self as Caller: "+username.value);
  sendToServer(targetUsername.value, username.value,"initial-registration","");
}
function register()
{
  console.log("Identifying self with server: "+username.value);
  sendToServer(targetUsername.value, username.value,"initial-registration","");
}

function answer(call)
{
    createPeerConnection();
    var localStream = null;
    console.log("Answering a call from: "+ call.data().username+" with description "+ call.data().sdp);
    pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(call.data().sdp))).then(function(){
       return navigator.mediaDevices.getUserMedia(constraints)
    }).then(function(stream){
       localStream = stream;
       document.getElementById("localVideo").srcObject = localStream;
       localStream.getTracks().forEach((track) => pc.addTrack(track,localStream));
        }).then(function(){
            return pc.createAnswer();
        }).then(function(answer){
        return pc.setLocalDescription(answer)
    }).then(function(){
        sendToServer(targetUsername.value,username.value, "video-answer",JSON.stringify(pc.localDescription));
    }).catch();


}
function listenEvent()
{

  var tempUser = targetUsername.value;
  if(!isCaller)
  {
    tempUser = username.value;
  }
  tempUser = username.value;
    //Setting up a listener for changes in targetUsername values in the database
  console.log("Fetching records matching username: "+ tempUser);
    db.collection("SDP").doc(tempUser)
        .onSnapshot(function(doc) {
            console.log("Received data: ", doc.data());

             var user = doc.data().username;
             var targetUser = doc.data().targetUsername;
             var type = doc.data().type;
             var sdp = doc.data().sdp;

             if(type == "initial-registration")
             {
               console.log("Found caller username "+ user);
               targetUsername.value = user;
             }
             if(type == "video-offer")
             {
               console.log("Received video offer!");
                answer(doc);
             }
             else if(type == "ice-candidate")
             {
               console.log("Received ICE candidate from user "+ user);
               receiveIce(sdp);
             }
             else if(type == "video-answer")
             {
               console.log("Received video-answer");
                var desc = new RTCSessionDescription(JSON.parse(sdp));
                pc.setRemoteDescription(desc).catch(function(e){
                  console.log(e);
                });

             }
        }, function(error){
          console.log(error);
        });
}

function handleTrackEvent(event)
{
    console.log("Attaching remote video");
    document.getElementById("remoteVideo").srcObject = event.streams[0];
}

// Right now I am trying to find out what would replace remoteConnection.ondatachannel = receiveChannelCallback


function handleSendChannelStatusChange(){
  if(sendChannel){
    var state = sendChannel.readyState;

    if(state === "open") {
      console.log("**** THE sendChannel Ready state current status is ****: "+sendChannel.readyState);

      messageInputBox.disable = false;
      messageInputBox.focus();
      sendButton.disabled = false;
    }else{
      messageInputBox.disabled = true;
      sendButton.disabled = true;
    }
  }
}

function receiveChannelCallback(evt){
  receiveChannel = evt.channel;
  receiveChannel.onmessage = handleReceiveMessage;
  receiveChannel.onopen = handleReceiveChannelStatusChange;
  receiveChannel.onclose = handleReceiveChannelStatusChange;

}

// CHECKS IF THE RECEIVE CHANNEL IS CONNECTED
function handleReceiveChannelStatusChange(event){
  if(receiveChannel){
    console.log("*******RECEIVE CHANNEL'S STATUS IS NOW: "+receiveChannel.readyState);
  }
}

function handleReceiveMessage(event) {
  var el = document.createElement("p");
  var txtNode = document.createTextNode(event.data);

  el.appendChild(txtNode);
  receiveBox.appendChild(el);
}


async function zoom(zoomIn, zoomOut){
  // wait for the getMedia function to finish running
  await getMedia();
  // Zooming Capabilities in this section
  console.log("Zoom function is now running ");

if(zoomIn){
  console.log("ZOOOMING IN");
}

if(zoomOut){
  console.log("ZOOOMING Out");
}

}

zoomIn.addEventListener("click", function(){
  zoom(true, false);
  //// Zooming in

});

zoomOut.addEventListener("click", function(){
  zoom(false, true);
  //// Zooming in

});

// Waits for given amount of miliseconds
function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}


// Sends the message when we have established connection
function sendMessage() {
  var message = messageInputBox.value;
  sendChannel.send(message);

  messageInputBox.value = "";
  messageInputBox.focus();
}

// function compConnection(ev) {
//   console.log("********************THIS IS THE COMPCONNECTION*******************8");
//   var channel = pc.createDataChannel("chat", {negotiated: true, id: 0});
//   ev.channel.onopen = () =>{
//     channel.send("HELLO THIS IS A DATA CHANNEL");
//   };
//   channel.onmessage = function(ev){
//     console.log("**************event.data *******:  "+ev.data);
//   }
// }





