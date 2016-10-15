import { BinaryClient } from 'binaryjs-client';

function recorderViewCtrl ($scope, $interval, $window, recorderService ){
  var client = new BinaryClient('ws://localhost:9001');

  $window = $window || {};
  $scope.bookmarks = recorderService.getBookmarks();
  $scope.addRecording = () => {
      $scope.recordingData = {
          Etag: $scope.s3Data.Etag
          , location: $scope.s3Data.Location
          , markers: $scope.bookmarks
          , notes: $scope.lyrics
      };

      recorderService.addRecording( $scope.recordingData );
  }

  client.on( 'stream', ( stream, meta ) => {
      const parts = [];
      if ( meta.type === 'transcription' || meta.type === 's3Data' ) {
        stream.on( 'data', data => {
            parts.push( data );
            console.log( parts );
            $scope.$apply( () => {
                if ( meta.type === 'transcription' ) {
                  $scope.lyrics = data;
                }
                else if ( meta.type === 's3Data' ) {
                  $scope.s3Data = data;
                }
            } );
        } );
      }
  } );

  client.on('open', function() {
    $window.audioStream = client.createStream( { user: 'aplan88', type: 'audio' } );
    // console.log( $window.audioStream );

    var recording = false;

    $scope.startRecording = function() {
      recording = true;
      if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia;

      if (navigator.getUserMedia) {
        navigator.getUserMedia({audio:true}, success, function(e) {
          alert('Error capturing audio.');
        });
      } else alert('getUserMedia not supported in this browser.');
    }

    $scope.stopRecording = function() {
      recording = false;
      $window.audioStream.end();
      // $interval.cancel(timing);
    }

    function success(e) {
        $scope.addBookmark = function() {
            recorderService.addBookmark( context.currentTime );
            client.send( { bookmark: context.currentTime }, { type: 'bookmarks' } );
        };

        var audioContext = $window.AudioContext || $window.webkitAudioContext;
        var context = new audioContext();

        // the sample rate is in context.sampleRate
        var audioInput = context.createMediaStreamSource(e);

        var bufferSize = 2048;
        var recorder = context.createScriptProcessor(bufferSize, 1, 1);

        recorder.onaudioprocess = function(e){
          if(!recording) return;
          console.log ('recording');
          $scope.elapsedTime = 0;
          // var timing = $interval(function () {
          //   ++$scope.elapsedTime;
          // }, 1000);
          var left = e.inputBuffer.getChannelData(0);
          $window.audioStream.write(convertFloat32ToInt16(left));
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

export default recorderViewCtrl;
