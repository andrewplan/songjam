import './audio-directive.scss'

import audioDirectiveLibraryViewHtml from './audio-directive-library-view-tmpl.html';
import audioDirectivePlaybackViewHtml from './audio-directive-playback-view-tmpl.html';

function recordingDir() {
    return {
        restrict: 'EA'
        , replace: true
        , template: ( elem, attr ) => {
              if ( attr.type === "library-view" ) {
                  return audioDirectiveLibraryViewHtml;
              }
              else if ( attr.type === "playback-view" ) {
                  return audioDirectivePlaybackViewHtml;
              }

        }

    }
}

export default recordingDir;
