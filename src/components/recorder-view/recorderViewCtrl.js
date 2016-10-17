import { BinaryClient } from 'binaryjs-client';

function recorderViewCtrl ($scope, $stateParams, $interval, $window, recorderService, userService ){

    $scope.user = userService.getCurrentUser();
    $scope.bookmarks = recorderService.getBookmarks();

    let client = new BinaryClient('ws://localhost:9001');

    $window = $window || {};

    let audioContext = $window.AudioContext || $window.webkitAudioContext;

    $scope.uploadToS3 = () => {
        client.send( {}, { user_id: $scope.user._id, email: $scope.user.email, type: 'upload-to-S3' } );
    };

    client.on( 'stream', ( stream, meta ) => {
        if ( meta.type !== 'audio' ) {
            stream.on( 'data', data => {
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
                            , s3ETag: $scope.s3Data.ETag
                            , s3Location: $scope.s3Data.Location
                            , s3Bucket: $scope.s3Data.Bucket
                            , s3Key: $scope.s3Data.Key
                            , markers: $scope.bookmarks
                            , notes: $scope.lyrics
                        };
                        recorderService.addRecording( $scope.recordingData );
                        userService.getCurrentUser();
                    }
                } );
            } );
        }
    } );

    client.on('open', () => {
        let recording = false;

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
                recording = true;

                $window.audioStream = client.createStream( { user_id: $scope.user._id, type: 'audio' } );

                context = new audioContext();
                // the sample rate is in context.sampleRate
                audioInput = context.createMediaStreamSource(e);
                bufferSize = 2048;
                recorder = context.createScriptProcessor(bufferSize, 1, 1);

                recorder.onaudioprocess = ( e ) => {
                    if( !recording ) return;
                    console.log ('recording');

                    var left = e.inputBuffer.getChannelData(0);
                    $window.audioStream.write(convertFloat32ToInt16(left));
                };

                audioInput.connect(recorder);
                recorder.connect(context.destination);

                $scope.addBookmark = () => {
                    recorderService.addBookmark( context.currentTime );
                    client.send( { bookmark: context.currentTime }, { type: 'bookmarks' } );
                };

                $scope.stopRecording = () => {
                    recording = false;
                    $window.audioStream.end();
                    $window.audioStream = '';

                    context = '';
                    audioInput = '';
                    bufferSize = '';
                    recorder = '';
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
