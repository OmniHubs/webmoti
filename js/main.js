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
const constraints = { audio: true, video: true };
var targetUsername = document.getElementById("targetUsername");
var username = document.getElementById("username");
var rpc=null;
var isClassroom = true;




setRandomUser(username);
function setRandomUser(textbox)
{
  textbox.value = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
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
  handleNegotiation();
}
function call()
{
  listenEvent();
}

//Declaring iceServers
const config= {iceServers: [{urls:'stun:stun.l.google.com:19302'}]};
let pc = new RTCPeerConnection(config);
pc.onnegotiationneeded = handleNegotiation;
pc.onicecandidate = sendIce;
pc.ontrack = handleTrackEvent;

//Getting the media from the browser asynchronously
async function getMedia(pc) {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById('localVideo').srcObject = stream;
    pc.addTrack(stream);
    /* use the stream */
  } catch(err) {
    /* handle the error */
  }
}


function handleNegotiation(){
//Creating a new offer and then set the local description of the RTCPeerConnection pc
pc.createOffer().then(function (offer) {
  console.log("Offer created!");
    return pc.setLocalDescription(offer);
}).then(function(){
  sendToServer({
      username: username.value,
      targetUsername: targetUsername.value,
      type: "video-offer",
      sdp: JSON.stringify(pc.localDescription)
  });
});

}
function sendToServer(info)
{
  var user = info["username"];
  db.collection("SDP").doc(user).set(info)
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
}
function sendIce(ice) {
    if (ice.candidate)
    {
        sendToServer({
            username: username.value,
            targetUsername: targetUsername.value,
            type: "ice-candidate",
            sdp: ice.candidate
        });
        console.log("Sent new ICE candidate");
    }
}
function receiveIce(ice)
{
    console.log("Received new ICE Candidate");
    var candidate = new RTCIceCandidate(ice.candidate);
    pc.addIceCandidate(candidate).catch();
}

function createRPC() {
    rpc = new RTCPeerConnection(config);
    rpc.onicecandidate = sendIce;
    rpc.ontrack = handleTrackEvent;
     rpc.onnegotiationneeded = handleNegotiation;
    // rpc.onremovetrack = handleRemoveTrackEvent;
    // rpc.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
    // rpc.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
    // rpc.onsignalingstatechange = handleSignalingStateChangeEvent;
 }



function answerCall(call)
{
    var localStream = null;
    createRPC();
    console.log("Answering a call from: "+ call.data().username);
    //createRPC();
    pc.setRemoteDescription((JSON.parse(call.data().sdp))).then(function(){
       return navigator.mediaDevices.getUserMedia(constraints)
    }).then(function(stream){
       localStream = stream;
       document.getElementById("localVideo").srcObject = localStream;
       localStream.getTracks().forEach(track=> pc.addTrack(track,localStream));
        }).then(function(){
            return pc.createAnswer();
        }).then(function(answer){
        return pc.setLocalDescription(answer)
    }).then(function(){
        sendToServer({
            username: username.value,
            targetUsername: targetUsername.value,
            type: "video-answer",
            sdp: JSON.stringify(pc.localDescription)
        });
    }).catch();


}
function listenEvent()
{
    //Setting up a listener for changes in targetUsername values in the database
    db.collection("SDP").doc(targetUsername.value)
        .onSnapshot(function(doc) {
            console.log("Current data: ", doc.data());
             var user = doc.data().username;
             var targetUser = doc.data().targetUsername;
             var type = doc.data().type;
             var sdp = doc.data().sdp;

             if(type == "video-offer")
             {
               console.log("Received video offer!");
                answerCall(doc);
             }
             else if(type == "ice-candidate")
             {
               console.log("Received ICE candidate");
               receiveIce(sdp);
             }
             else if(type == "video-answer")
             {
               console.log("Received video-answer");
               pc.setRemoteDescription(JSON.parse(doc.data().sdp)).catch();
             }
        });
}

function handleTrackEvent(event)
{
    console.log("Attaching remote video");
    document.getElementById("remoteVideo").srcObject = event.streams[0];
}




getMedia(pc);
