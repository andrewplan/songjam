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
              $scope.onLibraryView = true;

              if ( $state.current.name !== 'library' ) {
                  $scope.onLibraryView = false;
              }
          }
        , link: ( scope, elem, attrs ) => {
              // if ( $scope.currentState !== 'library-view' ) {
              //     $scope.onLibraryView = false;
              // }
        }
    };
}

export default topNavBar;
