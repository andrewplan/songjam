import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';

// Landing page view]
import './components/landing-page-view/landing-page.scss';
import landingPageHtml from './components/landing-page-view/landingPageTmpl.html'
import landingPageCtrl from './components/landing-page-view/landingPageCtrl'

// Main view
import mainViewHtml from './components/main-view/mainViewTmpl.html'

// Library view
import './components/library-view/library-view.scss';
import libraryViewHtml from './components/library-view/libraryViewTmpl.html'
import libraryViewCtrl from './components/library-view/libraryViewCtrl'

// Nav bar directive
import topNavBar from './components/top-nav-bar-directive/topNavBarDirective';

// Audio directive
import audioDir from './components/audio-directive/audioDirective'

// Player directive
import playerDir from './components/player-directive/playerDirective'

angular.module( 'songJamApp', [ uiRouter, 'ngMaterial' ] )
    .directive( 'topNavBar', topNavBar )
    .directive( 'audioDir', audioDir )
    .directive( 'playerDir', playerDir )
    .config( function( $stateProvider, $urlRouterProvider, $mdThemingProvider ) {
        $mdThemingProvider.theme( 'default' )
            .primaryPalette( 'deep-orange' )
            .accentPalette( 'yellow' )

        $urlRouterProvider.otherwise( '/' );

        $stateProvider
            .state( 'landing-page', {
                url: '/'
                , template: landingPageHtml
                , controller: landingPageCtrl
            } )
            .state( 'main-view', {
                url: '/main'
                , template: mainViewHtml
            } )
            .state( 'library-view', {
                url: '/library'
                , parent: 'main-view'
                , template: libraryViewHtml
                , controller: libraryViewCtrl
            } )
    } );
