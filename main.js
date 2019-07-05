// Initialize Cloud Firestore through firebase
const firebaseConfig = {
    apiKey: "AIzaSyA51GCqxDw7AuvfNmCcWjbGLtClJNFaUxE",
    authDomain: "webmotia.firebaseapp.com",
    databaseURL: "https://webmotia.firebaseio.com",
    projectId: "webmotia",
    storageBucket: "webmotia.appspot.com",
    messagingSenderId: "606747164317",
    appId: "1:606747164317:web:952c390708ccb09d"
};
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();




// Gives you access to root of database
// let db = firebase.database();

let queryDB = document.querySelector("#dbQuery")

let startConference = document.querySelector("#start");
let receiveConference = document.querySelector("#receiver");

// INPUT BUTTONS
let loginBtn = document.querySelector("#loginBtn");
let loginInput = document.querySelector("#loginInput");
let otherUsernameInput = document.querySelector('#otherUsernameInput');
let connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn');
let name ="";
let connectedUser, myConnection;
let peerObj;
let stream;

const showStudentVideo = document.querySelector("#student-video");
const showClassroomVideo = document.querySelector("#classroom-video");

const studentID = Math.floor(Math.random()*10000);

// We are using both STUN and TURN servers (GOOGLE/Firefox and Viagenie) if first server doesn't work it will try the next server
const signallingServers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'ImdcUser1','username': 'motiweb453@mail.com'}]};


// *****onicecandidate***** EventHandler delivers message to other peer through signaling server (signallingServers)
// Called on peerObj (RTCPeerConnection) instance **ONLY AFTER ICE candidate created on classroom computer *****

loginBtn.addEventListener("click", event =>{
  name = loginInput.value;

  // primitive error checking
  if(name.length>0){
    send({
        type: "login",
        name: "name"
    });
  }
});

db.onopen = function(){
  console.log("Connected");
};

db.onerror = function(err){
  console.log("Got error", err);
};

// Sends message in JSON format
function send(message){
  if(connectedUser){message.name = connectedUser;}
  db.collection("sdp").doc("test1").set({
    sender: studentID,
    name: name,
  })
    .then(function() {
      console.log("Sent by user: ", studentID + " by: "+name);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
}


db.onmessage = function(message){
  console.log("Got Message: " + message.data);
  let data = JSON.parse(message.data);

  switch(data.type) {
    case "login":
      onLogin(data.success);
      break;
    case "offer":
      onOffer(data.offer, data.name);
      break;
    case "answer":
      onAnswer(data.answer);
      break;
    case "candidate":
      onCandidate(data.candidate);
      break;
    default:
      break;
  }
};

// When the user logs in successfully
function onLogin(success){
  if(!success){
    alert("You have made an Oooooooopssssy");
  }else{
    // Creates RTCPeerConnection object on classroom side and another on student side when they load in.
    peerObj = new RTCPeerConnection(signallingServers);
    console.log("RTCPeerConnection object was created");
    console.log(peerObj);

    //Setup ice handling
    peerObj.onicecandidate = function (event) {
      if(event.candidate){
        send({
          type: "candidate",
          candidate: event.candidate
        });
      }
    };
  }
};


  //
  // db.collection("sdp").doc("test1").set({
  //   sender: studentID,
  //   name: "John",
  // })
  //   .then(function() {
  //     console.log("Sent by user: ", studentID + " by: "+name);
  //   })
  //   .catch(function(error) {
  //     console.error("Error adding document: ", error);
  //   });



// sends string to designated user
function sendToOneUser(target, msgString){
  let isUnique = true;
  let i;

  for(i=0;i<connectionArray.length;i++){
    if(connectionArray[i].username === target){
      connectionArray[i].send(msgString);
      break;
    }
  }
}


// function readMessage(data) {
//     // Convert string back to ICE Candidate obj.
//     const message = JSON.stringify(data.val().message);
//     const sender = data.val().sender;
//
//     /* We are sending data (Offer, Answer, and ICE candidate obj) from the Classroom to the Student
//     *  Firebase sends this data to both student/classroom, we don't need it in the classroom so
//     *  we enclose most of program in in an if(sender != studentID)
//     */
//     if(sender != studentID) {
//
//
//       // check if there's a msg
//       if (message.ice) {
//         // addIceCandidate() adds remote peer to RT
//         // addIceCandidate() adds remote peer to RTCPeerConnections remote description
//         peerObj.addIceCandidate(new RTCIceCandidate(message.ice))
//           .catch(e => {
//             console.log("Failure during addIceCandidate(): " + e.name);
//           });
//
//       } else if (message.sdp.type == "offer") {
//         peerObj.setRemoteDescription(new RTCSessionDescription(message.sdp))
//           .then(() => peerObj.createAnswer())
//           .then(answer => peerObj.setLocalDescription(answer))
//           .then(() => sendMessage(studentID, JSON.stringify({'sdp': peerObj.localDescription})));
//       } else if (message.sdp.type == "answer") {
//         peerObj.setRemoteDescription(new RTCSessionDescription(message.sdp));
//       }
//     }
// }

    // db.on('child_added', readMessage);
db.collection("sdp").doc("test1")
      .onSnapshot(function(doc){
          console.log("Current data: ", doc.data());
        });



// startConference.addEventListener('click', async function(peerObj){
//   try{
//     const gumStream = await navigator.mediaDevices.getUserMedia(constraints);
//   } catch (e){
//     console.log("ERROR LOG: " +e);
//   }
//     console.log("HELLO THERE BUDDY ");
//     for (const track of gumStream.getTracks()){
//         peerObj.addTrack(track);
//     }
// });

// queryDB.addEventListener('click', function(){
//   console.log("Running the db.collection function")
//   db.collection("waggg").doc("myUser").set({
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815
//   })
//     .then(function() {
//       console.log("Document written with ID: ", docRef.id);
//     })
//     .catch(function(error) {
//       console.error("Error adding document: ", error);
//     });
//
//
// });


startConference.addEventListener('click',function() {

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => showStudentVideo.srcObject = stream)
    // .then(stream => peerObj.addStream(stream))
})
// https://websitebeaver.com/insanely-simple-webrtc-video-chat-using-firebase-with-codepen-demo#what-are-peerconnection-mediastream-offer-answer-and-ice-candidates-examples-of-each
//https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
/*
* In order to connect with the student we need to create an offer
*
* Set local description to this offer
* Then Send offer object to student by calling sendMessage and set its (session description protocol to the same one)
*/
function showStudent() {
    // Initiate an SDP offer
    peerObj.createOffer()
        .then((offer) => peerObj.setLocalDescription(offer) )
        .then(() => sendMessage(studentID, JSON.stringify({'sdp': peerObj.localDescription})) );
};




/*  Tells us the current connection status */
//
// peerObj.onconnectionstatechange = (() => {
//     switch(peerObj.connectionState){
//         case "connected":
//             console.log("connected");
//             break;
//         case "disconnected":
//             console.log("disconnected");
//             break;
//         case "failed":
//             console.log("Failed, unexpected termination or error");
//             break;
//         case "closed":
//             console.log("Connection Closed");
//             break;
//     }
// });


// Camera resolution and Vid/Aud settings
const constraints = {
  audio: true,
  video:true
};

// Check if browser supports webrtc Mediastream

//Getting the media from the browser asynchronously
async function getMedia(peerObj) {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    /* use the stream */
  } catch(err) {
    /* handle the error */
  }
}
getMedia(peerObj);
