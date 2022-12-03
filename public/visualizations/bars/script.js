//https://blog.logrocket.com/audio-visualizer-from-scratch-javascript/
const container = document.getElementById("container");

const visualizations = ["bars"];

let audio1 = new Audio();
audio1.src = "http://localhost:3000/tune.mp3";
audio1.crossOrigin = "anonymous";
const audioCtx = new window.AudioContext();

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas').transferControlToOffscreen();
const worker = new Worker("worker.js");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

worker.postMessage({ canvas }, [canvas]);

let audioSource = null;
let analyser = null;

audio1.play();
audio1.volume = 1;
audioSource = audioCtx.createMediaElementSource(audio1); // creates an audio node from the audio source
analyser = audioCtx.createAnalyser(); // creates an audio node for analysing the audio data for time and frequency
audioSource.connect(analyser); // connects the audio source to the analyser. Now this analyser can explore and analyse the audio data for time and frequency
analyser.connect(audioCtx.destination); // connects the analyser to the destination. This is the speakers
const fftSize = 2 ** 11;
analyser.fftSize = fftSize; // controls the size of the FFT. The FFT is a fast fourier transform. Basically the number of sound samples. Will be used to draw bars in the canvas
const bufferLength = analyser.frequencyBinCount; // the number of data values that dictate the number of bars in the canvas. Always exactly one half of the fft size
const dataArray = new Uint8Array(bufferLength); // coverting to unsigned 8-bit integer array format because that's the format we need


function animate() {
  analyser.getByteFrequencyData(dataArray);
  worker.postMessage({ bufferLength, dataArray }, {});
  requestAnimationFrame(animate); // calls the animate function again. This method is built in
}

animate();