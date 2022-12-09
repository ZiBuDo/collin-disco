var app = app || {};
var source;
var buffer;
var analyser;

window.onload = function () {
    if(app.audio){
        app.audio.remove();
        window.cancelAnimationFrame(app.animationFrame);
    }
    app.audio = document.createElement('audio'); // creates an html audio element
    app.audio.src = "http://localhost:3000/tune.mp3"
    app.audio.autoplay = true;
    // app.audio.play();
    app.play = true;
    document.body.appendChild(app.audio);
    app.ctx = new (window.AudioContext || window.webkitAudioContext)(); // creates audioNode
    source = app.ctx.createMediaElementSource(app.audio); // creates audio source
    analyser = app.ctx.createAnalyser(); // creates analyserNode
    source.connect(app.ctx.destination); // connects the audioNode to the audioDestinationNode (computer speakers)
    source.connect(analyser); // connects the analyser node to the audioNode and the audioDestinationNode
    app.animate();
};

