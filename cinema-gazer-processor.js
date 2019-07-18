// Useful example pages:
//  https://github.com/GoogleChromeLabs/web-audio-samples/blob/master/audio-worklet/basic/noise-generator/noise-generator.js
//  


// https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode
// https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor
class CinemaGazerProcessor extends AudioWorkletProcessor {
    
    
    // // https://developers.google.com/web/updates/2017/12/audio-worklet
    // constructor(context) {
    //     super(context, 'cinema-gazer-processor');
    // }



    process (inputs, outputs, parameters) {
        // inputs and outputs are both array[1];
        const input = inputs[0];
        const output = outputs[0];
        // input and output are both Float32Array
        // output is a Float32Array of 128 elements. 
        if (input.length > 1) {
            // console.log(input[0]);

        }
        for (let channelNumber = 0; channelNumber < output.length; channelNumber++) {
            const outputChannel = output[channelNumber];
            // In here is where we fill the channel.
            for (let i = 0; i < (outputChannel.length); i++) {
                outputChannel[i] = input[0][i]
            }
        }
        
        return true;
    }
}

registerProcessor('cinema-gazer-processor', CinemaGazerProcessor);