import './audio-directive.scss'

import audioDirectiveLibraryViewHtml from './audio-directive-library-view-tmpl.html';
import audioDirectivePlaybackViewHtml from './audio-directive-playback-view-tmpl.html';
import libraryViewCtrl from '../library-view/libraryViewCtrl';

function recordingDir() {
    return {
        restrict: 'EA'
        , replace: true
        , scope: {
            audioUrl: '='
        }
        // , controller: libraryViewCtrl
        , template: ( elem, attr ) => {
              if ( attr.type === "library-view" ) {
                  return audioDirectiveLibraryViewHtml;
              }
              else if ( attr.type === "playback-view" ) {
                  return audioDirectivePlaybackViewHtml;
              }

        }
        , link: function( scope, elem, attr ) {
            scope.wavesurfer = WaveSurfer.create( {
                container: '.waveform'
                , scrollParent: true
            } );
            console.log( attr );
            scope.wavesurfer.load( scope.audioUrl );
            scope.wavesurfer.play();
        }

    }
}

export default recordingDir;
