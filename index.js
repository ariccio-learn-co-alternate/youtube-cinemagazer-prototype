// import { resolve } from "path";

// import("/cinema-gazer-processor.js")


window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    const startButton = document.querySelector("#start-button-form");
    startButton.addEventListener('submit', setupAudioFiltering);
    // setupAudioFiltering();
});


const shhh = document.querySelector("#shut-up");
let halt = false;
shhh.addEventListener('submit', (e)=> {
    halt = true;
    e.preventDefault();
  })


let analyser = null;

function setupAudioFiltering(event) {
    event.preventDefault();
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();

    console.log(audioContext.audioWorklet);

    const environ = audioContext.audioWorklet.addModule('cinema-gazer-processor.js').then(function() {
        // debugger;
        const cinemaGazerNode = new AudioWorkletNode(audioContext, 'cinema-gazer-processor')
        const videoElement = document.getElementById("video-1");
        let audioSource = audioContext.createMediaElementSource(videoElement);
        audioSource.connect(cinemaGazerNode);
        audioSource.connect(analyser);
        
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
            environ.videoElement.playbackRate = 2;
            setPlaybackDisplay(2, " not talking");
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
    visualize();
}


// from https://github.com/mdn/voice-change-o-matic-float-data/blob/gh-pages/scripts/app.js
const visualSelect = document.getElementById("visual");
const canvas = document.querySelector('.visualizer');
const canvasCtx = canvas.getContext("2d");
let drawVisual = null;
let intendedWidth = document.querySelector('.wrapper').clientWidth;

canvas.setAttribute('width',intendedWidth);

function visualize() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
  
  
    var visualSetting = visualSelect.value;
    console.log(visualSetting);
  
    if(visualSetting == "sinewave") {
      analyser.fftSize = 1024;
      var bufferLength = analyser.fftSize;
      console.log(bufferLength);
      var dataArray = new Float32Array(bufferLength);
  
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  
      function draw() {
  
        drawVisual = requestAnimationFrame(draw);
  
        analyser.getFloatTimeDomainData(dataArray);
  
        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
  
        canvasCtx.beginPath();
  
        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;
  
        for(var i = 0; i < bufferLength; i++) {
     
          var v = dataArray[i] * 200.0;
          var y = HEIGHT/2 + v;
  
          if(i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
  
          x += sliceWidth;
        }
  
        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
      };
  
      draw();
  
    } else if(visualSetting == "frequencybars") {
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      console.log(bufferLength);
      var dataArray = new Float32Array(bufferLength);
  
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  
      function draw() {
        drawVisual = requestAnimationFrame(draw);
        // if (halt) {
        //     return;
        // }
        // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData
        // Each item in the array represents the decibel value for a specific frequency.
        // The array ranges over the frequencies 0 hertz to 22,050 hertz.
        analyser.getFloatFrequencyData(dataArray);
        const frequencyInterval = (22050/bufferLength);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  
        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;
  
        for(var i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] + 140)*2;
          
          canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight+100) + ',50,50)';
          canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
          const hz = (frequencyInterval*i);
          const frequencyString = `${Math.trunc(hz)}`
          canvasCtx.fillText(frequencyString, (x), (10), barWidth)
          x += barWidth + 1;
        }
      };
  
      draw();
  
    } else if(visualSetting == "off") {
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.fillStyle = "red";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    }
  
  }


visualSelect.onchange = function() {
    window.cancelAnimationFrame(drawVisual);
    visualize();
  }