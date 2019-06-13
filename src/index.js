const lodash = require('lodash');
var quickconnect = require('rtc-quickconnect');
var crel = require('crel');
var capture = require('rtc-capture');
var attach = require('rtc-attach');
var qsa = require('fdom/qsa');
var plugins = [
  require('rtc-plugin-temasys')
];

window.onload = function() {


  var video = document.getElementById("video_id");
  // Buttons functionality
  var playButton = document.getElementById("play-pause");
  var muteButton = document.getElementById("mute");
  const fullscreen = document.getElementById("full-screen");
  const midScreen = document.getElementById("Mid-Screen");
  const smallScreen = document.getElementById("Small-Screen");

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





    document.getElementById("video_id").controls = false;

  // create containers for our local and remote video
  var local = crel('div', { class: 'local' });
  var remote = crel('div', { class: 'remote' });
  var peerMedia = {};

// once media is captured, connect
  capture({ audio: true, video: true }, { plugins: plugins }, function(err, localStream) {
    if (err) {
      return console.error('could not capture media: ', err);
    }

    // render the local media
    attach(localStream, { plugins: plugins }, function(err, el) {
      local.appendChild(el);
    });

    // initiate connection
    quickconnect('https://switchboard.rtc.io/', { room: 'webmoti', plugins: plugins, debug: true})
    // broadcast our captured media to other participants in the room
        .addStream(localStream)
        // when a peer is connected (and active) pass it to us for use
        .on('call:started', function(id, pc, data) {
          alert("hello");
          attach(pc.getRemoteStreams()[0], { plugins: plugins }, function(err, el) {
            if (err) return;

            el.dataset.peer = id;
            remote.appendChild(el);
          });
        })
        // when a peer leaves, remove teh media
        .on('call:ended', function(id) {
          qsa('*[data-peer="' + id + '"]', remote).forEach(function(el) {
            el.parentNode.removeChild(el);
          });
        });
  });

  /* extra code to handle dynamic html and css creation */

// add some basic styling
  document.head.appendChild(crel('style', [
    '.local { position: absolute;  right: 10px; }',
    '.local video { max-width: 200px; }'
  ].join('\n')));

// add the local and remote elements
  document.body.appendChild(local);
  document.body.appendChild(remote);





}


function midFunction(){
  document.getElementById("video-container").style.width = "100%";
}

function smallFunction(){
  document.getElementById("video-container").style.width="50%";
}





