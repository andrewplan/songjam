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
        , scope: {
              songjamSearchQuery: '='
        }
        , controller: ( $scope, $state, authService, userService ) => {
              $scope.authService = authService;
              $scope.user = userService.getCurrentUser();

              if ( $state.current.name !== 'library' ) {
                  $scope.onLibraryView = false;
              }
              else {
                  $scope.onLibraryView = true;
              }
          }
        , link: ( scope, elem, attrs ) => {

        }
    };
}

export default topNavBar;
