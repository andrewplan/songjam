import './mp3-player-directive.scss'

import mp3PlayerDirectiveLibraryViewHtml from './mp3-player-directive-library-view-tmpl.html';
import mp3PlayerDirectivePlaybackViewHtml from './mp3-player-directive-playback-view-tmpl.html';
import mp3PlayerDirectiveRecorderViewHtml from './mp3-player-directive-recorder-view-tmpl.html';
// import libraryViewCtrl from '../library-view/libraryViewCtrl';

function mp3PlayerDir() {
    return {
        restrict: 'EA'
        , replace: true
        , scope: {
            microphoneActions: '='
            , recording: '='
            , audioPreviewUrl: '='
        }
        // , controller: libraryViewCtrl
        , template: ( elem, attr ) => {
              if ( attr.type === "library-view" ) {
                  return mp3PlayerDirectiveLibraryViewHtml;
              }
              else if ( attr.type === "playback-view" ) {
                  return mp3PlayerDirectivePlaybackViewHtml;
              }

        }
        , link: function( scope, elem, attr ) {
            // console.log( elem[ 0 ].querySelector( '.waveform' ) );
            scope.wavesurfer = WaveSurfer.create( {
                container: elem[ 0 ].querySelector( '.waveform' )
                , scrollParent: true
                , barWidth: 4
                , waveColor: '#fc5830'
            } );

            scope.microphone = Object.create(WaveSurfer.Microphone);

            scope.microphoneActions = () => {
              return scope.microphone.start();
            }

            scope.microphone.init( {
                wavesurfer: scope.wavesurfer
            } );

            scope.microphone.on('deviceReady', function(stream) {
                console.log('Device ready!', stream);
            } );
            scope.microphone.on('deviceError', function(code) {
                console.warn('Device error: ' + code);
            } );

            // pause rendering
            //microphone.pause();

            // resume rendering
            //microphone.play();

            // stop visualization and disconnect microphone
            //microphone.stopDevice();

            // same as stopDevice() but also clears the wavesurfer canvas
            //microphone.stop();

            // destroy the plugin
            //microphone.destroy();
            scope.wavesurferUrl = scope.audioPreviewUrl || scope.recording.s3Location;
            scope.wavesurfer.load( scope.wavesurferUrl );
            scope.wavesurfer.play();
        }

    }
}

export default mp3PlayerDir;
