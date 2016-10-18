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
            audioPreviewUrl: '='
            , bookmarks: '='
            , microphoneActions: '='
            , recording: '='
        }
        // , controller: libraryViewCtrl
        , template: ( elem, attr ) => {
              if ( attr.type === "library-view" ) {
                  return mp3PlayerDirectiveLibraryViewHtml;
              }
              else if ( attr.type === "playback-view" ) {
                  return mp3PlayerDirectivePlaybackViewHtml;
              }
              else if ( attr.type === "recorder-view" ) {
                  return mp3PlayerDirectiveRecorderViewHtml;
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

            scope.wavesurfer.on('ready', function () {
              // Enable creating regions by dragging
              scope.wavesurfer.enableDragSelection( { loop: true } );
            } );

            scope.wavesurfer.on( 'region-dblclick', ( region, event ) => {
                event.stopPropagation();
                scope.wavesurfer.play( region.start );
                region.once( 'out', () => {
                    scope.wavesurfer.play( region.start );
                });
            } );

            scope.wavesurfer.on( 'region-click', ( region, event ) => {
                event.stopPropagation();
                scope.wavesurfer.play( region.start );

                if ( event.shiftKey ) {
                    region.once( 'out', () => {
                      scope.wavesurfer.play( region.start );
                    });
                }
                else {
                    region.once( 'out', () => {
                      scope.wavesurfer.pause();
                    });
                }
            } );

            scope.wavesurferUrl = scope.audioPreviewUrl || scope.recording.s3Location;
            scope.wavesurfer.load( scope.wavesurferUrl );
            scope.wavesurfer.play();
        }

    }
}

export default mp3PlayerDir;
