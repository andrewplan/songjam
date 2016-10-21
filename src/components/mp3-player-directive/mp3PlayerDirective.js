import './mp3-player-directive.scss'

import mp3PlayerDirectiveLibraryViewHtml from './mp3-player-directive-library-view-tmpl.html';
import mp3PlayerDirectivePlaybackViewHtml from './mp3-player-directive-playback-view-tmpl.html';
import mp3PlayerDirectiveRecorderViewHtml from './mp3-player-directive-recorder-view-tmpl.html';
import recorderService from '../../services/recorderService.js';

function mp3PlayerDir() {
    return {
        restrict: 'EA'
        , replace: true
        , scope: {
            audioPreviewUrl: '='
            , bookmarks: '='
            , markers: '='
            , recording: '='
        }
        , controller: ( $scope, $state, $stateParams, recorderService ) => {
              if ( $stateParams.recording ) {
                $scope.recording = $stateParams.recording;
              }

              $scope.duration;
              $scope.waveformWidth;

              $scope.deleteRecording = ( recording ) => {
                recorderService.deleteRecording( recording );
                $state.reload();
              };

              $scope.updateRecording = ( recording ) => {
                recorderService.updateRecording( recording );
              };
        }
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
        , link: function( scope, elem, attr, recorderService ) {
            scope.isPlaying = false;
            
            scope.wavesurfer = WaveSurfer.create( {
                container: elem[ 0 ].querySelector( '.waveform' )
                , scrollParent: false
                , barWidth: 4
                , waveColor: '#fc5830'
            } );

            scope.wavesurfer.on( 'ready', () => {
                // Enable creating regions by dragging
                scope.wavesurfer.enableDragSelection( { loop: true } );
                scope.duration = scope.wavesurfer.getDuration();
                scope.waveformWidth = elem[ 0 ].querySelector( '.waveform' ).clientWidth / 16;
                scope.$apply( scope.duration );
            } );

            scope.wavesurfer.on( 'region-dblclick', ( region, event ) => {
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

            scope.wavesurfer.on( 'play', () => {
                scope.isPlaying = true;
            } );

            scope.wavesurfer.on( 'pause', () => {
                scope.isPlaying = false;
            } );

            scope.wavesurferUrl = scope.audioPreviewUrl || scope.recording.s3Location;
            scope.wavesurfer.load( scope.wavesurferUrl );
        }

    }
}

export default mp3PlayerDir;
