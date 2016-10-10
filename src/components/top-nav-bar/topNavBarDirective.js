import './topNavBar.scss';

import landingPageHtml from './top-nav-bar-landing-page-tmpl.html'

function topNavBar() {
    return {
        restrict: 'EA'
        , replace: true
        , template: landingPageHtml
    }
}

export default topNavBar;
