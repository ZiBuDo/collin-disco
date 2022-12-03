const visuals = [
    "d20/index.html",
    "stream/index.html",
    "audible/lines.html",
    "audible/sphere.html",
    "audible/spiral.html",
    "audible/waveform.html",
    "bars/index.html",
    "earth/index.html",
    "fireworks/index.html",
    "multiple/index.html#/terrain",
    "multiple/index.html#/angels",
    "multiple/index.html#/hedgehog",
    "multiple/index.html#/lotus",
    "multiple/index.html#/terrain"
]

const baseUrl = "http://localhost:3000/play/visualizations/";
const tune = "http://localhost:3000/tune.mp3";

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const request = new XMLHttpRequest()
request.open('GET', tune, true)
request.responseType = 'arraybuffer'
request.onload = function() {
    audioContext.decodeAudioData(request.response,
        function(buffer) {
            let duration = buffer.duration
            console.log("DURATION", duration)
            setTimeout(() => {
                window.location.reload();
            }, (duration + 2) * 1000)
        }
    )
}
request.send()


var rand = visuals[Math.floor(Math.random() * visuals.length)];

console.log("RAND", rand);

const el = document.getElementById("container");

const iframe = document.createElement("iframe");

iframe.src = `${baseUrl}${rand}`;
iframe.allow = "autoplay";
iframe.height = "100%";
iframe.width = "100%";

el.appendChild(iframe);