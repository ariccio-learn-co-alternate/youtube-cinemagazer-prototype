// https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode
// https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor
class CinemaGazerProcessor extends AudioWorkletProcessor {
    
    
    // // https://developers.google.com/web/updates/2017/12/audio-worklet
    // constructor(context) {
    //     super(context, 'cinema-gazer-processor');
    // }



    process (inputs, outputs, parameters) {
        console.log(inputs)
        console.log(outputs)
        console.log(parameters);
        
        return true;
    }
}

registerProcessor('cinema-gazer-processor', CinemaGazerProcessor);