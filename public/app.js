const visuals = [
    "d20/index.html", //10
    "stream/index.html",  // 7
    "audible/lines.html", // 8
    "audible/sphere.html", //8
    "audible/spiral.html", // 8
    "audible/waveform.html", //7
    "earth/index.html", //5
    "fireworks/index.html", //10
    "multiple/index.html#/terrain",  // 10
    "multiple/index.html#/angels", // 10
    "multiple/index.html#/hedgehog", // 10
    "multiple/index.html#/lotus" // 10
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