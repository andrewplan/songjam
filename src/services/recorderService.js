import { BinaryClient } from 'binaryjs-client';

function recorderService ($scope, $window){
  var client = new BinaryClient('ws://localhost:9001');

  client.on('open', function() {
    $window.Stream = client.createStream();
    console.log( $window.Stream );

    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio:true}, success, function(e) {
        alert('Error capturing audio.');
      });
    } else alert('getUserMedia not supported in this browser.');

    var recording = false;

    recorderService.startRecording = function() {
      recording = true;
    }

    recorderService.stopRecording = function() {
      recording = false;
      $window.Stream.end();
    }

    function success(e) {
      var audioContext = $window.AudioContext || $window.webkitAudioContext;
      var context = new audioContext();

      // the sample rate is in context.sampleRate
      var audioInput = context.createMediaStreamSource(e);

      var bufferSize = 2048;
      var recorder = context.createScriptProcessor(bufferSize, 1, 1);

      recorder.onaudioprocess = function(e){
        if(!recording) return;
        console.log ('recording');
        var left = e.inputBuffer.getChannelData(0);
        $window.Stream.write(convertFloat32ToInt16(left));
      }

      audioInput.connect(recorder)
      recorder.connect(context.destination);
    }

    function convertFloat32ToInt16(buffer) {
      var l = buffer.length;
      var buf = new Int16Array(l)

      while (l--) {
        buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
      }
      return buf.buffer
    }
  });
}

export default recorderService;
