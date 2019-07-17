import("/cinema-gazer-processor.js")


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
    let audioContext = new AudioContext();
    debugger;
    audioContext.audioWorklet.addModule('cinema-gazer-processor.js')
    const cinemaGazerNode = new AudioWorkletNode(audioContext, 'cinema-gazer-processor')
    const videoElement = document.getElementById("video-1");
    let audioSource = audioContext.createMediaElementSource(videoElement);
    // let audioFilter = audioContext.create
    cinemaGazerNode.connect(audioContext.destination);

}