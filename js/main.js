
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

var targetUsername = document.getElementById("targetUsername");
var username = document.getElementById("username");



setRandomID(username);

function setRandomID(textbox)
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
function connect()
{
  handleNegotiation();
    listenDB();
}

//Declaring iceServers
const config= {iceServers: [{urls:'stun:stun.l.google.com:19302'}]};
let pc = new RTCPeerConnection(config);

//Getting the media from the browser asynchronously
async function getMedia(pc) {
  let stream = null;
  const constraints = { audio: true, video: true };
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
        console.log("Sent new ICE candidate")
        sendToServer({
            username: username.value,
            targetUsername: targetUsername.value,
            type: "ice-candidate",
            sdp: ice.candidate
        });
    }
}
function receiveIce(ice)
{
    var candidate = new RTCIceCandidate(ice.candidate);
    pc.addIceCandidate(candidate).catch();
}


function listenDB()
{
    //Setting up a listener for changes in targetUsername values in the database
    db.collection("SDP").doc(targetUsername.value)
        .onSnapshot(function(doc) {
            console.log("Current data: ", doc.data());
        });
}

pc.onnegotiationneeded = handleNegotiation;
pc.onicecandidate = sendIce;




getMedia(pc);