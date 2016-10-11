import './top-nav-bar.scss';

import landingPageHtml from './top-nav-bar-landing-page-tmpl.html'
import mainHtml from './top-nav-bar-main-tmpl.html'

function topNavBar() {
    return {
        restrict: 'EA'
        , replace: true
        , template: ( elem, attr ) => {
              if ( attr.type === 'landing-page' ) {
                  return landingPageHtml;
              }
              else if ( attr.type === 'main' ) {
                  return mainHtml;
              }
        }
    }
}

export default topNavBar;
