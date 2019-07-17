// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBHOzn-tGLUbM4KJ5KUi45onbwC-3vifcM",
  authDomain: "moti-e6d85.firebaseapp.com",
  databaseURL: "https://moti-e6d85.firebaseio.com",
  projectId: "moti-e6d85",
  storageBucket: "moti-e6d85.appspot.com",
  messagingSenderId: "432165062813",
  appId: "1:432165062813:web:0be4916547dbac0f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

//Initializing the variables
const constraints = { audio: false, video: true };
var targetUsername = document.getElementById("targetUsername");
var username = document.getElementById("username");
var roleRadio = document.getElementById("roleRadio");
var pc=null;
var isCaller = true;
var isStudent = true;
var randomValue = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
var mediaDetails;


setRandomUser(username);
function setRandomUser(textbox)
{
  textbox.value = randomValue;
}

function roleSet()
{
  if(roleRadio.checked) {
    console.log("Switched role to Classroom");
    isStudent = false;
  }
  else
    {
    console.log("Switched role to Student");
    isStudent = true;
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
}
//Getting the media from the browser asynchronously
async function getMedia(pc) {
  let stream = null;

  try {

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById('localVideo').srcObject = stream;
    for (const track of stream.getTracks()) {
      pc.addTrack(track);
    }


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





