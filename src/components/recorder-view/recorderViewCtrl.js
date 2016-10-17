import { BinaryClient } from 'binaryjs-client';

function recorderViewCtrl ($scope, $stateParams, $interval, $window, recorderService, userService ){

    $scope.user = userService.getCurrentUser();
    console.log( $scope.user );

    $window = $window || {};

    var audioContext = $window.AudioContext || $window.webkitAudioContext;
    var context = new audioContext();

    $scope.bookmarks = recorderService.getBookmarks();

    var client = new BinaryClient('ws://localhost:9001');

    $scope.uploadToS3 = function() {
        client.send( {}, { user_id: $scope.user._id, email: $scope.user.email, type: 'upload-to-S3' } );
    };

    client.on( 'stream', ( stream, meta ) => {
        const parts = [];
        if ( meta.type !== 'audio' ) {
            stream.on( 'data', data => {
                parts.push( data );
                console.log( parts );
                $scope.$apply( () => {
                    if ( meta.type === 'transcription' ) {
                        $scope.lyrics = data;
                    }
                    else if ( meta.type === 'mp3PreviewUrl' ) {
                        $scope.audioUrl = data.url;
                    }
                    else if ( meta.type === 's3Data' ) {
                        $scope.s3Data = data;
                        $scope.recordingData = {
                            userId: $scope.user._id
                            , Etag: $scope.s3Data.Etag
                            , location: $scope.s3Data.Location
                            , markers: $scope.bookmarks
                            , notes: $scope.lyrics
                        };
                        recorderService.addRecording( $scope.recordingData );
                    }
                } );
            } );
        }
    } );

    client.on('open', function() {
      $window.audioStream = client.createStream( { user_id: $scope.user._id, type: 'audio' } );

      if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia;

      if (navigator.getUserMedia) {
        navigator.getUserMedia({audio:true}, success, function(e) {
          alert('Error capturing audio.');
        });
      } else alert('getUserMedia not supported in this browser.');

      var recording = false;

      $scope.startRecording = function() {
        recording = true;
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
