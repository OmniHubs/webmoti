var mainUser;
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA51GCqxDw7AuvfNmCcWjbGLtClJNFaUxE",
  authDomain: "webmotia.firebaseapp.com",
  databaseURL: "https://webmotia.firebaseio.com",
  projectId: "webmotia",
  storageBucket: "webmotia.appspot.com",
  messagingSenderId: "606747164317",
  appId: "1:606747164317:web:952c390708ccb09d",
  scopes: [
    "email",
    "profile",
    "https://www.googleapis.com/auth/calendar.events"
  ],
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ],
  clientId: "1053696254964-r66l5j9ll5p8rt5gukocqo5qpseds8q0.apps.googleusercontent.com"
};
// var firebaseConfig = {
//   apiKey: "AIzaSyA8BvFlnJpqxnjoB3zeG355JA_SVkjGZGc",
//   authDomain: "tempwebmoti.firebaseapp.com",
//   databaseURL: "https://tempwebmoti.firebaseio.com",
//   projectId: "tempwebmoti",
//   storageBucket: "tempwebmoti.appspot.com",
//   messagingSenderId: "640467167824",
//   appId: "1:640467167824:web:2aa34c043975558953bf55",
//   measurementId: "G-VWENQE1FSM"
// };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

var loggedInElements = document.getElementById("logged-in-elements");
var uid;
var userStatusDatabaseRef;
var isOfflineForDatabase;
var isOnlineForDatabase;
var userStatusFirestoreRef;
// Check if user is authenticated
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // Fetch the current user's ID from Firebase Authentication.
    uid = firebase.auth().currentUser.uid;
    var isOfflineForDatabase = {
      state: "offline",
      last_changed: firebase.database.ServerValue.TIMESTAMP
    };

    var isOnlineForDatabase = {
      state: "online",
      last_changed: firebase.database.ServerValue.TIMESTAMP
    };
    // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    userStatusDatabaseRef = firebase.database().ref("/status/" + uid);
    console.log("Logged in", user);
    firebase
      .database()
      .ref(".info/connected")
      .on("value", snapshot => {
        if (snapshot.val() == false) {
          return;
        }

        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(() => {
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
      });

    db.collection("Users")
      .doc(user.email)
      .get()
      .then(doc => {
        if (doc.exists) {
          let data = doc.data();
          loggedInElements.style.display = "block";
          loggedIn(data);
        } else {
          // Undefined
          console.log("No Such Document");
          loggedInElements.style.display = "none";
          window.location.replace("login.html");
        }
      })
      .catch(err => {
        console.log("Error getting document: ", err);
      });

    function startApp(user) {
      console.log(user);

      // Make sure to refresh the Auth Token in case it expires!
      firebase.auth().currentUser.getToken()
        .then(function(){
          return gapi.client.calendar.events
            .list({
              calendarId: "primary",
              timeMin: new Date().toISOString(),
              showDeleted: false,
              singleEvents: true,
              maxResults: 10,
              orderBy: "startTime"
            })
        })
        .then(function(response) {
          console.log(response);
        });
    }




  } else {
    // Redirect user to login
    loggedInElements.style.display = "none";
    window.location.replace("login.html");
  }
});
window.addEventListener("beforeunload", function(e) {
  db.collection("Users")
    .doc(mainUser.email)
    .set({
      email: mainUser.email,
      teacherEmail: mainUser.teacherEmail,
      displayName: mainUser.displayName,
      uid: mainUser.uid,
      photoURL: mainUser.photoURL,
      isTeacher: mainUser.isTeacher
    })
    .then(function() {
      console.log("Logged On!!");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
});
function logOut() {
  firebase.auth().signOut();
}

// Runs once logged in
function loggedIn(initialUser) {
  var user = initialUser;
  //Initialize Socket.io
  var socket = io("http://localhost:3000", { reconnectionAttempts: 3 });

  //Initializing the variables
  var teacherUser;
  var email = user.email;
  const constraints = { audio: true, video: true };
  var targetIcon = document.getElementById("targetIcon");
  var targetUsername = document.getElementById("targetUsername");
  var targetUsernameLabel = document.getElementById("targetUsernameLabel");
  var username = document.getElementById("username");
  var usernameLabel = document.getElementById("usernameLabel");
  var roleRadio = document.getElementById("roleRadio");
  var remoteVideo = document.getElementById("remoteVideo");
  var localVideo = document.getElementById("localVideo");
  var hangupButton = document.getElementById("hangup");
  var callButton = document.getElementById("call");
  var drawerLogoutButton = document.getElementById("drawer-logout-button");

  // drawer setup
  var drawer = mdc.drawer.MDCDrawer.attachTo(
    document.querySelector(".mdc-drawer")
  );
  var drawerList = new mdc.list.MDCList(document.getElementById("drawer-list"));
  // header setup
  var drawerHeaderName = document.getElementById("drawer-header-name");
  var drawerHeaderEmail = document.getElementById("drawer-header-email");
  var drawerSettingsButton = document.getElementById("drawer-settings-button");
  var drawerHomeButton = document.getElementById("drawer-home-button");
  const targetUsernameTextInput = new mdc.textField.MDCTextField(
    document.querySelector("#targetUsernameTextInput")
  );
  const usernameTextInput = new mdc.textField.MDCTextField(
    document.querySelector("#usernameTextInput")
  );
  // Allow drawer to open
  var drawerOpenButton = document.getElementById("drawer-open-button");

  // settgings modal
  var settingsModal = document.getElementById("myModal");
  var settingsSpan = document.getElementsByClassName("close")[0];
  const teacherChangeEmailTextInput = new mdc.textField.MDCTextField(
    document.querySelector("#teacher-input-text-field")
  );
  var teacherInputTextField = document.getElementById(
    "teacher-input-text-field"
  );
  var teacherChangeEmailLabel = document.getElementById(
    "teacher-input-label-field"
  );
  var teacherChangeEmailInput = document.getElementById(
    "teacher-change-email-input"
  );
  var saveTeacherEmailButton = document.getElementById(
    "edit-teacher-email-button"
  );
  var editSaveTeacherEmailSpan = new mdc.ripple.MDCRipple(
    document.getElementById("edit-teacher-email-span")
  );
  var teacherEmailChangeNotch = document.getElementById(
    "teacher-change-email-notch"
  );
  var teacherEmailChangeWidth = document.getElementById(
    "teacher-change-email-width"
  );
  const teacherChangeEmailSnackbar = new mdc.snackbar.MDCSnackbar(
    document.getElementById("change-teacher-email-snackback")
  );
  var undoTeacherEmailChangeButton = document.getElementById(
    "undo-change-teacher-email-button"
  );
  const teacherRetypeEmailInput = new mdc.textField.MDCTextField(
    document.querySelector("#teacher-input-retype-text-field")
  );
  var teacherRetypeEmailInputWorkable = document.getElementById(
    "teacher-input-retype-text-field"
  );
  var teacherChangeRetypeInput = document.getElementById(
    "teacher-retype-email-input"
  );
  const teacherChangeEmailDifferentSnackbar = new mdc.snackbar.MDCSnackbar(
    document.getElementById("teacher-email-change-different-snackbar")
  );
  const teacherImproperChangeEmailSnackbar = new mdc.snackbar.MDCSnackbar(
    document.getElementById("improper-teacher-change-email-snackbar")
  );

  var teacherEmailError = document.getElementById("teacher-change-email-error");
  var teacherRetypeEmailError = document.getElementById(
    "teacher-change-retype-email-error"
  );

  // Profile photos
  var userProfilePhoto = document.getElementById("user-photo-div");
  var teacherProfilePhoto = document.getElementById("teacher-photo-div");

  var userProfileState = document.getElementById("user-photo-state");
  var teacherProfileState = document.getElementById("teacher-photo-state");

  var previousTeacherEmail;
  var previousTeacherProfilePicture;
  var previousTeacherUser;
  var teacherState = null;
  var teacherStateLastChanged = null;

  var localStream = null;
  var pc = null;
  var isCaller = true;
  var isStudent = true;
  var mediaDetails;
  var coolDown = false;
  var minuteTimer = 30;
  var minuteTimerAct = false;
  var urgentQuestion = false;
  var Bell = new Audio("../audio/bell.mp3");
  var teacherUserDatabaseRef;
  var onSettingsPage = false;

  setRandomUser(username);
  function setRandomUser(textbox) {
    textbox.value = email;
  }

  initialize();

  targetUsername.addEventListener("click", clearBox);
  function clearBox() {
    targetUsername.value = "";
  }

  function logConnectionStates(event) {
    console.log("Connection state changed to: " + pc.connectionState);
    if (pc.connectionState == "connected") {
      hangupButton.classList.remove("disabled");
      callButton.classList.add("disabled");
    }
    if (
      pc.connectionState == "failed" ||
      pc.connectionState == "disconnected"
    ) {
      hangup();
    }
  }

  function logSignalingStates(event) {
    console.log("Signaling state changed to: " + pc.signalingState);
    if (pc.signalingState == "stable") {
      keyboardListener();
      zoom();
    }
  }

  //Adding an event listener to send our SDP info to the server
  //document.getElementById("connect").addEventListener("click", connect);
  callButton.addEventListener("click", call);
  // function connect()
  // {
  //   checkCaller();
  //   if(isCaller)
  //   {
  //   identifyAsCaller();
  //   }
  //   listenEvent();
  //
  //
  // }
  function call() {
    createPeerConnection();
    mediaDetails = getMedia(pc);
  }

  drawerLogoutButton.addEventListener("click", logOut);

  hangupButton.addEventListener("click", hangup);
  function hangup() {
    console.log("Hanging up");
    if (pc) {
      pc.ontrack = null;
      pc.onremovetrack = null;
      pc.onremovestream = null;
      pc.onicecandidate = null;
      pc.oniceconnectionstatechange = null;
      pc.onsignalingstatechange = null;
      pc.onicegatheringstatechange = null;
      pc.onnegotiationneeded = null;

      if (remoteVideo.srcObject) {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      }

      if (localVideo.srcObject) {
        localVideo.srcObject.getTracks().forEach(track => track.stop());
      }

      pc.close();
      pc = null;
    }

    remoteVideo.removeAttribute("src");
    remoteVideo.removeAttribute("srcObject");
    localVideo.removeAttribute("src");
    remoteVideo.removeAttribute("srcObject");

    hangupButton.classList.add("disabled");
    callButton.classList.remove("disabled");
  }

  function checkCaller() {
    if (targetUsername.value != "") {
      isCaller = true;
    } else {
      isCaller = false;
    }
  }

  function createPeerConnection() {
    //Declaring iceServers and creating a new PeerConnection
    const config = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        },
        {
          urls: ["turn: app.webmoti.org:443"],
          username: "webmoti",
          credential: "webmoti_test"
        }
      ]
    };
    pc = new RTCPeerConnection(config);
    pc.onnegotiationneeded = offer;
    pc.onicecandidate = sendIce;
    pc.ontrack = handleTrackEvent;
    pc.onconnectionstatechange = logConnectionStates;
    pc.onsignalingstatechange = logSignalingStates;
  }
  //Getting the media from the browser
  function getMedia(pc) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(stream) {
        /* use the stream */
        localStream = stream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
        document.getElementById("localVideo").srcObject = localStream;
      })
      .catch(function(err) {
        /* handle the error */
        console.log("failed to add Webcam" + err);
      });

    console.log("Got the Webcam/Media from the browser");
  }

  function offer() {
    //Creating a new offer and then set the local description of the RTCPeerConnection pc

    pc.createOffer()
      .then(function(offer) {
        console.log("Offer created!");
        return pc.setLocalDescription(offer);
      })
      .then(function() {
        console.log(
          "Placing the offer in the database under " +
            targetUsername.value +
            " username"
        );
        sendToServer(
          targetUsername.value,
          username.value,
          "video-offer",
          JSON.stringify(pc.localDescription)
        );
      });
  }
  function sendToServer(username, targetUsername, type, sdp) {
    const data = {
      username: username,
      targetUsername: targetUsername,
      type: type,
      sdp: sdp
    };

    console.log(
      "Sending data from " +
        username +
        " to " +
        targetUsername +
        " with type " +
        type
    );

    db.collection("SDP")
      .doc(username)
      .set(data)
      .then(function() {
        console.log("Document written ");
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }
  function sendToPeer(str) {
    sendToServer(targetUsername.value, username.value, "peer-data", str);
  }

  //The ice sending/receiving functions
  function sendIce(ice) {
    if (ice.candidate) {
      sendToServer(
        targetUsername.value,
        username.value,
        "ice-candidate",
        JSON.stringify(ice.candidate)
      );
      console.log("Sent new ICE candidate " + JSON.stringify(ice.candidate));
    }
  }
  function receiveIce(ice) {
    console.log("Received new ICE Candidate: " + ice);
    var cand = new RTCIceCandidate(JSON.parse(ice));
    pc.addIceCandidate(cand).catch(function(e) {
      console.log(e);
    });
  }
  // Accessibilities keydowns
  document.addEventListener("keydown", event => {
    let keyName = event.key;

    if (keyName == "Enter") {
      if (onSettingsPage) {
        saveTeacherEmailButton.click();
      } else {
        if (document.activeElement == drawerLogoutButton) {
          drawerLogoutButton.click();
        } else if (document.activeElement == drawerSettingsButton) {
          drawerSettingsButton.click();
        } else if (document.activeElement == callButton) {
          callButton.click();
        } else if (document.activeElement == hangupButton) {
          hangupButton.click();
        }
      }
    } else if (keyName == "Escape") {
      if (onSettingsPage) {
        settingsModal.click();
      }
    }
  });
  function keyboardListener() {
    console.log("Adding the keyboard event listener");
    document.addEventListener(
      "keydown",
      event => {
        if (
          document.activeElement == document.getElementsByTagName("BODY")[0]
        ) {
          const keyName = event.key;
          switch (keyName) {
            case "c":
              sendToPeer(keyName);
              sendToPeer("");
              break;
            case "q":
              hangup();
              break;
            case "p":
              call();
              break;
            case "w":
              zoomIn();
              break;
            case "a":
              sendToPeer(keyName);
              sendToPeer("");
              break;
            case "s":
              zoomOut();
              break;
            case "d":
              sendToPeer(keyName);
              sendToPeer("");
              break;
            case "r":
              resetZoom();
              break;
            case "Enter":
              if (coolDown) {
                document.getElementsByClassName(
                  "timer-group"
                )[0].style.display = "block";
                document
                  .getElementsByClassName("hand")[0]
                  .classList.add("spin1");

                if (!minuteTimerAct) {
                  minuteTimerAct = true;
                  onTimer();
                }
              }
              if (!coolDown) {
                if (!urgentQuestion) {
                  sendToPeer(keyName);
                  sendToPeer("");
                }
                if (urgentQuestion) {
                  sendToPeer("urgentQ");
                  sendToPeer("");
                }
                coolDown = true;
              }
              setTimeout(urgentCooldown, 60000);
              urgentQuestion = true;
              break;
            default:
            // code block
          }
        }
      },
      false
    );
  }

  function identifyAsCaller() {
    console.log("Identifying self as Caller: " + username.value);
    sendToServer(
      targetUsername.value,
      username.value,
      "initial-registration",
      ""
    );
  }

  function initialize() {
    let teacherEmail = user.teacherEmail;
    targetUsername.value = teacherEmail;
    usernameLabel.innerHTML = user.displayName;
    userProfilePhoto.style.backgroundImage = "url('" + user.photoURL + "')";
    userProfileState.style.backgroundColor = "#47bf39";

    db.collection("Users")
      .doc(user.teacherEmail)
      .get()
      .then(doc => {
        if (doc.exists) {
          teacherUser = doc.data();
          targetUsernameLabel.innerHTML = teacherUser.displayName;
          // Teacher online/offline
          teacherUserDatabaseRef = firebase
            .database()
            .ref("/status/" + teacherUser.uid)
            .on("value", snapshot => {
              if (snapshot) {
                let tempData = snapshot.val();
                teacherState = tempData.state;
                teacherStateLastChanged = tempData.last_changed;
                // Set teacher profile photo
                teacherProfilePhoto.style.backgroundImage =
                  "url('" + teacherUser.photoURL + "')";

                if (teacherState == "offline") {
                  teacherProfileState.style.backgroundColor = "transparent";
                } else {
                  teacherProfileState.style.backgroundColor = "#47bf39";
                }
              } else {
                teacherProfileState.style.backgroundColor = "transparent";
              }
            });
        } else {
          // Undefined
          console.log("No Such Document");
        }
      })
      .catch(err => {
        console.log("Error getting document: ", err);
      });
    teacherChangeEmailInput.addEventListener("keyup", () => {
      var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regexEmail.test(teacherChangeEmailInput.value.toLowerCase())) {
        if (teacherChangeEmailInput.value == teacherChangeRetypeInput.value) {
          // Same email and proper format
          teacherEmailError.innerHTML = "";
          teacherRetypeEmailError.innerHTML = "";
        } else {
          // Different emails proper format
          teacherEmailError.innerHTML = "Emails not matching";
        }
      } else {
        // Improper email format and not same
        teacherEmailError.innerHTML = "Email not proper format";
      }
    });
    teacherChangeRetypeInput.addEventListener("keyup", () => {
      var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regexEmail.test(teacherChangeRetypeInput.value.toLowerCase())) {
        if (teacherChangeEmailInput.value == teacherChangeRetypeInput.value) {
          // Same email and proper format
          teacherEmailError.innerHTML = "";
          teacherRetypeEmailError.innerHTML = "";
        } else {
          // Different emails proper format
          teacherRetypeEmailError.innerHTML = "Emails not matching";
        }
      } else {
        // Improper email format
        teacherRetypeEmailError.innerHTML = "Email not proper format";
      }
    });
    /* --------------------------------------------- */
    /* ------------MATERIAL DESIGN INIT--------------*/
    /* --------------------------------------------- */

    // open modal to see settins for user
    drawerSettingsButton.addEventListener("click", event => {
      // makes so that settings is not a transitionable drawer button
      // it is in a timeout because of conflict css transitions which solves
      //the problem
      setTimeout(() => {
        onSettingsPage = true;
        saveTeacherEmailButton.style.display = "none";
        teacherRetypeEmailInputWorkable.style.display = "none";
        teacherRetypeEmailError.style.display = "none";
        drawerList.selectedIndex = 0;
        drawerSettingsButton.classList.remove("mdc-list-item--activated");
        drawerHomeButton.classList.add("mdc-list-item--activated");
        settingsModal.style.display = "flex";
        // Initial teacher email change input setup
        teacherChangeEmailInput.value = user.teacherEmail;
        teacherChangeEmailLabel.innerHTML = "Teacher Email";
        teacherEmailChangeNotch.classList.add("mdc-notched-outline--notched");
        teacherChangeEmailLabel.classList.add(
          "mdc-floating-label--float-above"
        );
        teacherEmailChangeWidth.style.width = "85.4px";
        previousTeacherEmail = targetUsername.value;
        // Set tab index's
        drawerOpenButton.tabIndex = "-1";
        targetUsername.tabIndex = "-1";
        callButton.tabIndex = "-1";
        hangupButton.tabIndex = "-1";
      }, 5);
    });

    drawerHeaderName.innerHTML = user.displayName;
    drawerHeaderEmail.innerHTML = user.email;

    mdc.ripple.MDCRipple.attachTo(drawerOpenButton);

    drawerOpenButton.addEventListener("click", function() {
      if (drawer.open) {
        drawer.open = false;
      } else {
        drawer.open = true;
      }
    });

    // Allow drawer to close when item in drawer is selected
    const listEl = document.querySelector(".mdc-drawer .mdc-list");
    listEl.addEventListener("click", event => {
      drawer.open = false;
    });

    settingsSpan.addEventListener("click", () => {
      settingsModal.click();
    });

    window.addEventListener("click", event => {
      if (event.target == settingsModal) {
        // Set tab index's
        drawerOpenButton.tabIndex = "1";
        targetUsername.tabIndex = "2";
        callButton.tabIndex = "3";
        hangupButton.tabIndex = "4";

        onSettingsPage = false;
        settingsModal.style.display = "none";
        // Reset teacher email editing
        teacherChangeEmailInput.value = user.teacherEmail;
        teacherChangeEmailLabel.innerHTML = "";
        // Remove notch, floating property, and reset width
        teacherEmailChangeNotch.classList.remove(
          "mdc-notched-outline--notched"
        );
        teacherChangeEmailLabel.classList.remove(
          "mdc-floating-label--float-above"
        );
        teacherChangeRetypeInput.value = "";
      }
      if (event.target == targetUsername) {
        targetUsernameLabel.innerHTML = "Other Classroom";
      }
      if (event.target != targetUsername) {
        if (targetUsernameTextInput.value == "") {
          targetUsernameTextInput.value = user.teacherEmail;
          targetUsernameLabel.innerHTML = "Home Classroom";
        } else if (targetUsernameTextInput.value == user.teacherEmail) {
          targetUsernameLabel.innerHTML = "Home Classroom";
        }
      }
    });
    // Undo button
    undoTeacherEmailChangeButton.addEventListener("click", () => {
      console.log(previousTeacherEmail);
      db.collection("Users")
        .doc(user.email)
        .set({
          displayName: user.displayName,
          email: user.email,
          teacherEmail: previousTeacherEmail,
          uid: uid,
          photoURL: user.photoURL,
          isTeacher: user.isTeacher
        })
        .then(function() {
          teacherUser = previousTeacherUser;
          teacherProfilePhoto.style.backgroundImage = previousTeacherProfilePicture;
          teacherChangeEmailLabel.innerHTML = "Teacher Email";
          user.teacherEmail = previousTeacherEmail;
          targetUsername.value = previousTeacherEmail;
          teacherChangeEmailSnackbar.close();
          teacherUserDatabaseRef = firebase
            .database()
            .ref("/status/" + teacherUser.uid)
            .on("value", snapshot => {
              let tempData = snapshot.val();
              teacherState = tempData.state;
              teacherStateLastChanged = tempData.last_changed;
              // Set teacher profile photo
              teacherProfilePhoto.style.backgroundImage =
                "url('" + teacherUser.photoURL + "')";

              if (teacherState == "offline") {
                teacherProfileState.style.backgroundColor = "transparent";
              } else {
                teacherProfileState.style.backgroundColor = "#47bf39";
              }
            });
          console.log("Undid Change");
        })
        .catch(function(error) {
          console.error("Error changing email: ", error);
        });
    });

    // Edit/Save button
    var tempEmailInput = "";
    teacherChangeEmailInput.addEventListener("click", () => {
      teacherChangeEmailInputClick();
    });
    teacherChangeEmailInput.addEventListener("focus", () => {
      teacherChangeEmailInputClick();
    });
    function teacherChangeEmailInputClick() {
      if (teacherChangeEmailInput.value == user.teacherEmail) {
        teacherChangeEmailInput.value = "";
      }
      teacherRetypeEmailInputWorkable.style.display = "flex";
      saveTeacherEmailButton.style.display = "block";
      teacherRetypeEmailError.style.display = "block";
      tempEmailInput = teacherChangeEmailInput.value;

      teacherChangeEmailLabel.innerHTML = "Teacher Email";
    }
    saveTeacherEmailButton.addEventListener(
      "click",
      () => {
        // Clicked on save

        if (teacherChangeRetypeInput.value == teacherChangeEmailInput.value) {
          // Same email
          var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (regexEmail.test(teacherChangeRetypeInput.value.toLowerCase())) {
            // valid email format
            console.log("Uploading email:", teacherChangeEmailInput.value);
            db.collection("Users")
              .doc(user.email)
              .set({
                displayName: user.displayName,
                email: user.email,
                teacherEmail: teacherChangeEmailInput.value,
                uid: uid,
                photoURL: user.photoURL,
                isTeacher: user.isTeacher
              })
              .then(function() {
                db.collection("Users")
                  .doc(teacherChangeEmailInput.value)
                  .get()
                  .then(doc => {
                    console.log(teacherChangeEmailInput.value);
                    previousTeacherProfilePicture =
                      teacherProfilePhoto.style.backgroundImage;
                    if (doc.exists) {
                      previousTeacherUser = teacherUser;
                      teacherUser = doc.data();
                      teacherProfilePhoto.style.backgroundImage =
                        "url('" + teacherUser.photoURL + "')";
                      teacherUserDatabaseRef = firebase
                        .database()
                        .ref("/status/" + teacherUser.uid)
                        .on("value", snapshot => {
                          if (snapshot) {
                            let tempData = snapshot.val();
                            teacherState = tempData.state;
                            teacherStateLastChanged = tempData.last_changed;
                            // Set teacher profile photo
                            teacherProfilePhoto.style.backgroundImage =
                              "url('" + teacherUser.photoURL + "')";

                            if (teacherState == "offline") {
                              teacherProfileState.style.backgroundColor =
                                "transparent";
                            } else {
                              teacherProfileState.style.backgroundColor =
                                "#47bf39";
                            }
                          } else {
                            teacherProfileState.style.backgroundColor =
                              "transparent";
                          }
                        });
                    } else {
                      // Undefined
                      console.log("No Such Document");
                      teacherProfilePhoto.style.backgroundImage = `url("https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png")`;
                    }
                  })
                  .catch(err => {
                    console.log("Error getting document: ", err);
                  });
                teacherChangeEmailLabel.innerHTML = "Teacher Email";
                user.teacherEmail = teacherChangeEmailInput.value;
                targetUsername.value = teacherChangeEmailInput.value;
                settingsModal.click();
                teacherChangeEmailSnackbar.open();
                console.log(user);
                console.log("Email Changed!!!");
              })
              .catch(function(error) {
                console.error("Error changing email: ", error);
              });
          } else {
            // Not valid email format
            // teacherImproperChangeEmailSnackbar.open();
          }
        } else {
          // teacherChangeEmailDifferentSnackbar.open();
        }
      }
      // teacherChangeEmailInput.value = "";
    );

    /* --------------------------------------------- */
    /* --------------------------------------------- */
    /* --------------------------------------------- */

    console.log("Identifying self with server: " + username.value);
    sendToServer(
      username.value,
      targetUsername.value,
      "initial-registration",
      ""
    );
    listenSelf();
    keyboardListener();
    socket.on("connect", () => {
      console.log("Found Node Server, setting self as classroom");
      isStudent = false;
    });
  }

  function answer(call) {
    createPeerConnection();

    console.log(
      "Answering a call from: " +
        call.data().targetUsername +
        " with description " +
        call.data().sdp
    );
    console.log(JSON.parse(call.data().sdp));
    var desc = new RTCSessionDescription(JSON.parse(call.data().sdp));
    pc.setRemoteDescription(desc)
      .then(function() {
        return navigator.mediaDevices.getUserMedia(constraints);
      })
      .then(function(stream) {
        localStream = stream;
        document.getElementById("localVideo").srcObject = localStream;
        localStream
          .getTracks()
          .forEach(track => pc.addTrack(track, localStream));
      })
      .then(function() {
        return pc.createAnswer();
      })
      .then(function(answer) {
        return pc.setLocalDescription(answer);
      })
      .then(function() {
        sendToServer(
          targetUsername.value,
          username.value,
          "video-answer",
          JSON.stringify(pc.localDescription)
        );
      })
      .catch();
  }
  function listenTarget() {
    // We are listening for changes within the target user
    const target = targetUsername.value;
    //Setting up a listener for changes in targetUsername values in the database
    console.log("Fetching records matching username: " + target);
    db.collection("SDP")
      .doc(target)
      .onSnapshot(
        function(doc) {
          var user = doc.data().username;
          var targetUser = doc.data().targetUsername;
          var type = doc.data().type;
          var sdp = doc.data().sdp;

          if (type == "initial-registration") {
            console.log("Found caller username " + user);
            targetUsername.value = user;
          }
          // if(type == "video-offer")
          // {
          //   console.log("Received video offer!");
          //    answer(doc);
          // }
        },
        function(error) {
          console.log(error);
        }
      );
  }
  function handlePeerData(peerData) {
    console.log(peerData);

    switch (peerData) {
      case "w":
        zoomIn(1);
        break;
      case "a":
        //add motor left
        socket.emit("left");
        break;
      case "s":
        zoomOut(1);
        break;
      case "d":
        //add motor right
        socket.emit("right");
        break;
      case "c":
        socket.emit("stop");
        break;
      case "Enter":
        waveHand();
        break;
      case "urgentQ":
        urgentHand();
        break;
      default:
      // code block
    }
  }
  // Hand functions
  function waveHand() {
    document.getElementById("hand").style.display = "block";
    document.getElementById("hand").classList.add("handAnimation0");
    setTimeout(function() {
      document.getElementById("hand").style.display = "none";
    }, 5000);
  }
  function urgentHand() {
    document.getElementById("hand").style.display = "block";
    document.getElementById("hand").classList.add("handAnimation1");
    Bell.play();
    setTimeout(function() {
      document.getElementById("hand").style.display = "none";
    }, 5000);
  }
  function finishCooldown() {
    coolDown = false;
    document.getElementsByClassName("timer-group")[0].style.display = "none";
  }
  function urgentCooldown() {
    urgentQuestion = false;
  }
  function onTimer() {
    if (minuteTimerAct) {
      document.getElementById("timerText").innerHTML = minuteTimer.toString();
      minuteTimer--;
      if (minuteTimer < 0) {
        minuteTimer = 30;
        minuteTimerAct = false;
        coolDown = false;
        document.getElementsByClassName("timer-group")[0].style.display =
          "none";
      } else {
        setTimeout(onTimer, 1000);
      }
    }
  }

  function listenSelf() {
    console.log("Listening for changes in the entry matching our username ");
    db.collection("SDP")
      .doc(username.value)
      .onSnapshot(
        function(doc) {
          if (doc.exists) {
            console.log("Received data: ", doc.data());

            var user = doc.data().username;
            var targetUser = doc.data().targetUsername;
            var type = doc.data().type;
            var sdp = doc.data().sdp;

            if (type == "initial-registration") {
              console.log("Found a registration for our user " + user);
            }
            if (type == "video-offer") {
              console.log(
                "Received video offer from remote peer " + targetUser
              );
              console.log("Setting our targetUsername to " + targetUser);
              targetUsername.value = targetUser;
              listenTarget();
              answer(doc);
            } else if (type == "ice-candidate") {
              console.log("Received ICE candidate from user " + targetUser);
              receiveIce(sdp);
            } else if (type == "video-answer") {
              console.log("Received video-answer");
              var desc = new RTCSessionDescription(JSON.parse(sdp));
              pc.setRemoteDescription(desc).catch(function(e) {
                console.log(e);
              });
            } else if (type == "peer-data") {
              console.log("Received communication from peer: " + targetUser);
              handlePeerData(sdp);
            }
          }
        },
        function(error) {
          console.log(error);
        }
      );
  }

  function handleTrackEvent(event) {
    console.log(
      "Attaching remote video in signalling state: " +
        pc.signalingState +
        " and connection state: " +
        pc.connectionState
    );
    console.log(
      "Stream active status is: " +
        event.streams[0].active +
        " track readystate is: " +
        event.track.readyState +
        "track kind is: " +
        event.track.kind +
        " track is remote: " +
        event.track.remote
    );
    document.getElementById("remoteVideo").srcObject = event.streams[0];
  }
}
