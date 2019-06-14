const lodash = require('lodash');
var crel = require('crel');
const webRTC = require('webrtc-adapter');


window.onload = function() {


  var video = document.getElementById("video_id");
  // Buttons functionality
  var playButton = document.getElementById("play-pause");
  var muteButton = document.getElementById("mute");
  const fullscreen = document.getElementById("full-screen");
  const midScreen = document.getElementById("Mid-Screen");
  const smallScreen = document.getElementById("Small-Screen");

  const classroomSelect = document.getElementById("classroomSelect");
  const studentSelect = document.getElementById("studentSelect");

  // Sliders (Volume && seek-bar)
  var seekBar = document.getElementById("seek-bar");
  var volumeBar = document.getElementById("volume-bar");

  // EVENT LISTENER FOR PLAY BUTTON
  playButton.addEventListener("click", function(){
    if(video.paused == true){ video.play();
      playButton.innerHTML = "Pause";
    }else{ video.pause();
      playButton.innerHTML = "Play";
    }});

  // EVENT LISTENER FOR MUTE BUTTON
  muteButton.addEventListener("click", function(){
    if(video.muted == false){ video.mute=true;
      muteButton.innerHTML = "UnMute";
    }else{ video.mute=false;
      muteButton.innerHTML = "Mute";
    }});

  // FULLSCREEN
  fullscreen.addEventListener("click", function() {
    if (video.requestFullscreen) { video.requestFullscreen(); }
    else if (video.mozRequestFullScreen) { video.mozRequestFullScreen(); }
    else if (video.webkitRequestFullscreen) { video.webkitRequestFullscreen();
    }});


    classroomSelect.addEventListener("click",function () {
alert("");
    });


    document.getElementById("video_id").controls = false;










};


function midFunction(){
  document.getElementById("video-container").style.width = "100%";
}

function smallFunction(){
  document.getElementById("video-container").style.width="50%";
}

function rtc_init_student()
{
    var pc = new RTCPeerConnection(options);
    var channel = pc.createDataChannel("chat");
    channel.onopen = function(event) {
        channel.send('Hi you!');
    };
    channel.onmessage = function(event) {
        console.log(event.data);
    }

}

function rtc_init_classroom()
{
    // Answerer side

    var pc = new RTCPeerConnection(options);
    pc.ondatachannel = function(event) {
        var channel = event.channel;
﻿       channel.onopen = function(event) {
            channel.send('Hi back!');
        };
        channel.onmessage = function(event) {
            console.log(event.data);
        }
    }
}



