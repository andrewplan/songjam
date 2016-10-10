import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';

import './components/landing-page-view/landing-page.scss';

import landingPageHtml from './components/landing-page-view/landingPageTmpl.html'
import landingPageCtrl from './components/landing-page-view/landingPageCtrl'

// Custom directives
import topNavBar from './components/top-nav-bar/topNavBarDirective';

angular.module( 'songJamApp', [ uiRouter, 'ngMaterial' ] )
    .directive( 'topNavBar', topNavBar )
    .config( function( $stateProvider, $urlRouterProvider, $mdThemingProvider ) {
        $mdThemingProvider.theme( 'default' )
            .primaryPalette( 'deep-orange' )
            .accentPalette( 'yellow' )

        $urlRouterProvider.otherwise( '/' );

        $stateProvider
            .state( 'landing-page', {
                controller: landingPageCtrl
                , url: '/'
                , template: landingPageHtml
            } )
    } );
