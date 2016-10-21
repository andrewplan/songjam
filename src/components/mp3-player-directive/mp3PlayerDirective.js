import './mp3-player-directive.scss'

import mp3PlayerDirectiveHtml from './mp3-player-directive-tmpl.html';
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
        , template: mp3PlayerDirectiveHtml
        , link: function( scope, elem, attr, recorderService ) {
            scope.isPlaying = false;

            // if ( attr.type === 'recorder-view' ) {
            //     elem.css( { 'margin-top': '12vh' } );
            // }

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
