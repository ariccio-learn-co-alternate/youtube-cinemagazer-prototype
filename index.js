// import { resolve } from "path";

// import("/cinema-gazer-processor.js")


window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    const startButton = document.querySelector("#start-button-form");
    startButton.addEventListener('submit', setupAudioFiltering);
    // setupAudioFiltering();
});

function setupAudioFiltering(event) {
    event.preventDefault();
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioContext = new AudioContext();
    console.log(audioContext.audioWorklet);

    const environ = audioContext.audioWorklet.addModule('cinema-gazer-processor.js').then(function() {
        // debugger;
        const cinemaGazerNode = new AudioWorkletNode(audioContext, 'cinema-gazer-processor')
        const videoElement = document.getElementById("video-1");
        let audioSource = audioContext.createMediaElementSource(videoElement);
        audioSource.connect(cinemaGazerNode);
        // let audioFilter = audioContext.create
        cinemaGazerNode.connect(audioContext.destination);
        console.log("setupAudioFiltering complete!");
    
        const environ = {
            cinemaGazerNode: cinemaGazerNode,
            videoElement: videoElement,
            audioSource: audioSource
        }
        return environ;
        }).then((environ) => {setupLibVad(environ);});

}

function setPlaybackDisplay(rate, talking) {
    document.querySelector("#playback").innerText = rate + talking;
}

function setupLibVad(environ) {
    const libVadOptions = {
        source: environ["cinemaGazerNode"],
        voice_stop: () => {
            console.log("stop")
            // environ.videoElement.playbackRate = 2;
            setPlaybackDisplay(1, " not talking");
        },
        voice_start: () => {
            console.log("start")
            environ.videoElement.playbackRate = 1;
            setPlaybackDisplay(1, " talking");
        },
        // energy_threshold_ratio_neg: 0.1,
        // energy_threshold_ratio_pos: 1.5
        // smoothingTimeConstant: 0.995
        // iterationPeriod
        logging: true
    }

    // import("/vad/lib/vad.js");
    const vad = new VAD(libVadOptions);
    environ[vad] = vad;
}