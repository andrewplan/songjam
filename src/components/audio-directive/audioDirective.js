import './audio-directive.scss'

import audioDirectiveHtml from './audio-directive-tmpl.html'

function audioDir() {
    return {
        restrict: 'EA'
        , replace: true
        , template: audioDirectiveHtml
    }
}

export default audioDir;
