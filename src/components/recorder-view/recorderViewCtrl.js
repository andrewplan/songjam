import { BinaryClient } from 'binaryjs-client';

function recorderViewCtrl ($scope, $state, $stateParams, $window, recorderService, userService ){

    $scope.user = userService.getCurrentUser();
    $scope.bookmarks = recorderService.getBookmarks();

    $scope.isReadyToRecord = true;
    $scope.isRecording = false;
    $scope.isGoogleSpeechActive = false;
    $scope.isLyricEditorActive = false;
    $scope.lyricsErrorMessage = 'No lyrics detected, sorry about that!'

    $scope.lyrics = {
        lyrics: ''
    };

    let client = new BinaryClient('ws://localhost:9001');

    $window = $window || {};
    let audioContext = $window.AudioContext || $window.webkitAudioContext;

    $scope.wavesurferMicInput = WaveSurfer.create( {
      container: '#waveform-recorder-view'
      , barWidth: 4
      , waveColor: '#fc5830'
      , height: 256
      , cursorColor: 'rgba( 255, 255, 255, 0.0 )'
    } );
    $scope.microphone = Object.create(WaveSurfer.Microphone);
    $scope.microphone.init({
        wavesurfer: $scope.wavesurferMicInput
    });
    $scope.microphone.on('deviceReady', function(stream) {
        console.log('Device ready!', stream);
    });
    $scope.microphone.on('deviceError', function(code) {
        console.warn('Device error: ' + code);
    });
    $scope.microphone.start();

    $scope.openLyricsEditor = () => {
        $scope.isLyricEditorActive = !$scope.isLyricEditorActive;
        if ( $scope.lyrics.lyrics === $scope.lyricsErrorMessage ) {
            $scope.lyrics.lyrics = 'Type lyrics here';
        }
    }

    $scope.uploadToS3 = () => {
        client.send( {}, { user_id: $scope.user._id, email: $scope.user.email, type: 'upload-to-S3' } );
    };

    client.on( 'stream', ( stream, meta ) => {
        if ( meta.type !== 'audio' ) {
            stream.on( 'data', data => {
                $scope.$apply( () => {
                    if ( meta.type === 'transcription' ) {
                        if ( data ) {
                            $scope.lyrics.lyrics = data;
                        }
                        else {
                            $scope.lyrics.lyrics = $scope.lyricsErrorMessage;
                        }
                        $scope.isGoogleSpeechActive = false;
                    }
                    else if ( meta.type === 'mp3PreviewUrl' ) {
                        $scope.audioPreviewUrl = data.url;
                    }
                    else if ( meta.type === 's3Data' ) {
                        $scope.s3Data = data;
                        $scope.recordingData = {
                            userId: $scope.user._id
                            , s3ETag: $scope.s3Data.ETag
                            , s3Location: $scope.s3Data.Location
                            , s3Bucket: $scope.s3Data.Bucket
                            , s3Key: $scope.s3Data.Key
                            , markers: $scope.bookmarks
                            , notes: $scope.lyrics.lyrics
                        };
                        recorderService.addRecording( $scope.recordingData );
                        $state.go( 'library-view' );
                    }
                } );
            } );
        }
    } );

    client.on('open', () => {
        // $scope.isRecording = false;

        if ( !navigator.getUserMedia )
          navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

        if ( navigator.getUserMedia ) {
          navigator.getUserMedia( { audio: true }, enableRecording, function( e ) {
            alert('Error capturing audio.');
          } );
        } else alert('getUserMedia not supported in this browser.');

        function enableRecording( e ) {
            let context,
                audioInput,
                bufferSize,
                recorder;

            let paused = false;

            $scope.startRecording = () => {
                $scope.isRecording = true;
                $scope.isReadyToRecord = false;

                $window.audioStream = client.createStream( { user_id: $scope.user._id, type: 'audio' } );

                context = new audioContext();
                // the sample rate is in context.sampleRate
                audioInput = context.createMediaStreamSource(e);
                bufferSize = 2048;

                // script processor node -- generates, processes or analyzes audio directly with JS
                // arguments:  buffer size, number of input channels, number of output channels
                recorder = context.createScriptProcessor(bufferSize, 1, 1);

                // e = audio processing event
                // onaudioprocess = processes audio from input by accessing inputBuffer on audio processing event
                recorder.onaudioprocess = ( e ) => {
                    if( !$scope.isRecording ) return;
                    console.log ('recording');

                    //returns audio data on inputBuffer as Float32Array
                    var left = e.inputBuffer.getChannelData(0);
                    // converts the incoming Float32Array audio data to Int16
                    $window.audioStream.write(convertFloat32ToInt16(left));
                };

                audioInput.connect(recorder);
                recorder.connect(context.destination);

                $scope.addBookmark = () => {
                    recorderService.addBookmark( context.currentTime );
                    client.send( { bookmark: context.currentTime }, { type: 'bookmarks' } );
                };

                $scope.stopRecording = () => {
                    $scope.isGoogleSpeechActive = true;
                    $scope.isReadyToRecord = false;
                    $scope.isRecording = false;

                    $window.audioStream.end();
                    $window.audioStream = null;

                    context = null;
                    audioInput = null;
                    bufferSize = null;
                    recorder = null;
                };

                $scope.restartRecording = () => {
                    $scope.isRecording = false;
                    $state.go( $state.current.name, $state.params, { reload: true } );
                };
            };
        }

        function convertFloat32ToInt16(buffer) {
            var l = buffer.length;
            var buf = new Int16Array(l)

            while (l--) {
              buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
            }
            return buf.buffer;
        }
    } );
    /********** END client.on( 'open' ) ************/
}

export default recorderViewCtrl;
