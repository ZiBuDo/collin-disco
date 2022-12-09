'use strict';

angular.module('audioVizApp')
  .service('PlaylistService', function ($q, Dancer) {
    var sound, analyser, audioSource, dataArray;

    var load_playlist = function () {
      var deferred = $q.defer();
      deferred.resolve({});
    };
    setTimeout(() => {
      sound = document.getElementById("audio");
      sound.src = "http://localhost:3000/tune.mp3";
      sound.crossOrigin = "anonymous";
      sound.play();
      sound.volume = 1;
      const audioCtx = new window.AudioContext();
      audioSource = audioCtx.createMediaElementSource(sound); // creates an audio node from the audio source
      analyser = audioCtx.createAnalyser(); // creates an audio node for analysing the audio data for time and frequency
      audioSource.connect(analyser); // connects the audio source to the analyser. Now this analyser can explore and analyse the audio data for time and frequency
      analyser.connect(audioCtx.destination); // connects the analyser to the destination. This is the speakers
      const fftSize = 2 ** 11;
      analyser.fftSize = fftSize; // controls the size of the FFT. The FFT is a fast fourier transform. Basically the number of sound samples. Will be used to draw bars in the canvas
      const bufferLength = analyser.frequencyBinCount; // the number of data values that dictate the number of bars in the canvas. Always exactly one half of the fft size
      dataArray = new Uint8Array(bufferLength); // coverting to unsigned 8-bit integer array format because that's the format we need
      analyser.getByteFrequencyData(dataArray);
      function animate() {
        analyser.getByteFrequencyData(dataArray);
        Dancer.update(service.sound());
        requestAnimationFrame(animate); // calls the animate function again. This method is built in
      }
      
      animate();
    });

    var service = {
      load: load_playlist,
      playlist: function () { return {}; },
      tracks: function () { return []; },
      sound: function () {
        return {
          sound, analyser, audioSource, dataArray
        };
      },
      loading: false
    };

    return service;
  });