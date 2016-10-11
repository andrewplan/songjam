import './player-directive.scss';
import playerDirectiveHtml from './player-directive-tmpl.html'

function playerDir() {
    return {
        restrict: 'EA'
        , replace: true
        , template: playerDirectiveHtml
    }
}

export default playerDir;
