// THIS FILE IS NOT USED //
// this is demo code to select a webcam, in case //
// a user has more than one webcam //

/*

<video id="video" width="640" height="360" autoplay></video>
    <button id="button">
      video
    </button>
    <select id="select">
    </select>
*/

/*
const video = document.getElementById('video');
const button = document.getElementById('button');
const select = document.getElementById('select');

function gotDevices(mediaDevices) {

  select.innerHTML = '';
  select.appendChild(document.createElement('option'));
  let count = 1;
  mediaDevices.forEach(mediaDevice => {
    console.log(mediaDevice)
    if (mediaDevice.kind === 'videoinput') {
      const option = document.createElement('option');
      option.value = mediaDevice.deviceId;
      const label = mediaDevice.label || `Camera ${count++}`;
      const textNode = document.createTextNode(label);
      option.appendChild(textNode);
      select.appendChild(option);
    }
  });
}


navigator.mediaDevices.enumerateDevices().then(gotDevices);
*/